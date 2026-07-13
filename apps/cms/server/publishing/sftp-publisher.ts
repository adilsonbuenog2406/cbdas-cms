import { stat } from "node:fs/promises";
import path from "node:path";
import pathPosix from "node:path/posix";
import type Client from "ssh2-sftp-client";
import { landingSlug, type SftpPublishConfig } from "./config";
import type { DeploymentManifest, DeploymentManifestFile } from "./types";
import { DeploymentError } from "./types";

type PublishCallbacks = {
  onStage: (stage: string) => Promise<void>;
  onUploadProgress: (filesUploaded: number, bytesUploaded: number) => Promise<void>;
  onMode: (mode: "atomic" | "non_atomic", warning?: string) => Promise<void>;
  onBackupPath: (backupPath: string | null) => Promise<void>;
};

type UploadFile = DeploymentManifestFile & {
  localPath: string;
};

type RemotePathResolverClient = Pick<Client, "exists">;

function remoteJoin(...parts: string[]) {
  return pathPosix.normalize(pathPosix.join(...parts));
}

function getPublicUrlHostname(publicLandingPageUrl: string) {
  try {
    return new URL(publicLandingPageUrl).hostname;
  } catch {
    return "";
  }
}

export async function resolvePublishRemotePath(
  client: RemotePathResolverClient,
  config: SftpPublishConfig,
) {
  const remotePath = pathPosix.normalize(config.remotePath);

  if (!remotePath.startsWith("/public_html/")) {
    return remotePath;
  }

  if (await client.exists("/public_html")) {
    return remotePath;
  }

  const hostname = getPublicUrlHostname(config.publicLandingPageUrl);

  if (!hostname) {
    return remotePath;
  }

  const publicHtmlSuffix = remotePath.slice("/public_html".length);
  const hostingerPublicHtml = remoteJoin("domains", hostname, "public_html");

  if (await client.exists(hostingerPublicHtml)) {
    return remoteJoin(hostingerPublicHtml, publicHtmlSuffix);
  }

  return remotePath;
}

function getRemoteLayout(remotePath: string, deploymentId: string) {
  const parentPath = pathPosix.dirname(remotePath);
  const stagingRoot = remoteJoin(parentPath, ".cms-deploys", landingSlug);
  const stagingPath = remoteJoin(stagingRoot, deploymentId);
  const backupsRoot = remoteJoin(parentPath, ".cms-backups");
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const backupPath = remoteJoin(backupsRoot, `${landingSlug}-${timestamp}`);
  const failedPath = remoteJoin(stagingRoot, `${deploymentId}-failed-${timestamp}`);

  return {
    parentPath,
    stagingRoot,
    stagingPath,
    backupsRoot,
    backupPath,
    failedPath,
  };
}

async function ensureRemoteDirectory(client: Client, remotePath: string) {
  await client.mkdir(remotePath, true);
}

async function remoteExists(client: Client, remotePath: string) {
  return Boolean(await client.exists(remotePath));
}

async function removeRemotePath(client: Client, remotePath: string) {
  const exists = await client.exists(remotePath);

  if (!exists) {
    return;
  }

  if (exists === "d") {
    const entries = await client.list(remotePath);

    for (const entry of entries) {
      await removeRemotePath(client, remoteJoin(remotePath, entry.name));
    }

    await client.rmdir(remotePath);
    return;
  }

  await client.delete(remotePath);
}

async function listRemoteFiles(client: Client, remotePath: string, rootPath = remotePath) {
  const exists = await client.exists(remotePath);

  if (!exists) {
    return [];
  }

  if (exists !== "d") {
    return [pathPosix.relative(rootPath, remotePath)];
  }

  const entries = await client.list(remotePath);
  const files: string[] = [];

  for (const entry of entries) {
    const entryPath = remoteJoin(remotePath, entry.name);

    if (entry.type === "d") {
      files.push(...(await listRemoteFiles(client, entryPath, rootPath)));
    } else if (entry.type === "-") {
      files.push(pathPosix.relative(rootPath, entryPath));
    }
  }

  return files;
}

async function copyRemoteDirectory(client: Client, sourcePath: string, targetPath: string) {
  await ensureRemoteDirectory(client, targetPath);
  const files = await listRemoteFiles(client, sourcePath);

  for (const relativePath of files) {
    const sourceFilePath = remoteJoin(sourcePath, relativePath);
    const targetFilePath = remoteJoin(targetPath, relativePath);
    await ensureRemoteDirectory(client, pathPosix.dirname(targetFilePath));
    const file = await client.get(sourceFilePath);
    await client.put(file, targetFilePath);
  }
}

function createUploadFiles(
  releaseDir: string,
  manifest: DeploymentManifest,
): UploadFile[] {
  const files = manifest.files.map((file) => ({
    ...file,
    localPath: path.join(releaseDir, file.relativePath),
  }));

  return files.sort((first, second) => {
    if (first.relativePath === "index.html") {
      return 1;
    }

    if (second.relativePath === "index.html") {
      return -1;
    }

    return first.relativePath.localeCompare(second.relativePath);
  });
}

async function uploadFiles({
  client,
  files,
  remoteRoot,
  callbacks,
}: {
  client: Client;
  files: UploadFile[];
  remoteRoot: string;
  callbacks: PublishCallbacks;
}) {
  let uploadedFiles = 0;
  let uploadedBytes = 0;
  let nextIndex = 0;
  const concurrency = 3;

  async function worker() {
    while (nextIndex < files.length) {
      const file = files[nextIndex];
      nextIndex += 1;

      const remotePath = remoteJoin(remoteRoot, file.relativePath);
      await ensureRemoteDirectory(client, pathPosix.dirname(remotePath));
      await client.fastPut(file.localPath, remotePath);
      const remoteStats = await client.stat(remotePath);

      if (Number(remoteStats.size) !== file.size) {
        throw new DeploymentError(
          "REMOTE_VERIFICATION_FAILED",
          `Tamanho remoto divergente para ${file.relativePath}.`,
        );
      }

      uploadedFiles += 1;
      uploadedBytes += file.size;
      await callbacks.onUploadProgress(uploadedFiles, uploadedBytes);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function activateAtomic({
  callbacks,
  client,
  config,
  layout,
}: {
  callbacks: PublishCallbacks;
  client: Client;
  config: SftpPublishConfig;
  layout: ReturnType<typeof getRemoteLayout>;
}) {
  await callbacks.onStage("backing_up");
  const hasCurrentSite = await remoteExists(client, config.remotePath);

  if (hasCurrentSite) {
    await removeRemotePath(client, layout.backupPath).catch(() => {});
    await client.rename(config.remotePath, layout.backupPath);
    await callbacks.onBackupPath(layout.backupPath);
  } else {
    await callbacks.onBackupPath(null);
  }

  await callbacks.onStage("activating");
  await client.rename(layout.stagingPath, config.remotePath);

  if (!(await remoteExists(client, remoteJoin(config.remotePath, "index.html")))) {
    throw new DeploymentError(
      "REMOTE_ACTIVATION_FAILED",
      "index.html não existe no destino publicado.",
    );
  }
}

async function activateNonAtomic({
  callbacks,
  client,
  config,
  files,
  layout,
}: {
  callbacks: PublishCallbacks;
  client: Client;
  config: SftpPublishConfig;
  files: UploadFile[];
  layout: ReturnType<typeof getRemoteLayout>;
}) {
  await callbacks.onMode("non_atomic", "non_atomic_deployment");
  await callbacks.onStage("backing_up");

  if (await remoteExists(client, config.remotePath)) {
    await removeRemotePath(client, layout.backupPath).catch(() => {});
    await copyRemoteDirectory(client, config.remotePath, layout.backupPath);
    await callbacks.onBackupPath(layout.backupPath);
  }

  await callbacks.onStage("activating");
  await ensureRemoteDirectory(client, config.remotePath);
  await uploadFiles({ client, files, remoteRoot: config.remotePath, callbacks });

  const nextFiles = new Set(files.map((file) => file.relativePath));
  const existingFiles = await listRemoteFiles(client, config.remotePath);

  for (const existingFile of existingFiles) {
    if (!nextFiles.has(existingFile)) {
      await client.delete(remoteJoin(config.remotePath, existingFile)).catch(() => {});
    }
  }
}

export async function rollbackRemoteDeployment({
  backupPath,
  client,
  config,
  failedPath,
}: {
  backupPath: string | null;
  client: Client;
  config: SftpPublishConfig;
  failedPath: string;
}) {
  if (!backupPath) {
    throw new DeploymentError("ROLLBACK_FAILED", "Não há backup para rollback.");
  }

  if (await remoteExists(client, config.remotePath)) {
    await removeRemotePath(client, failedPath).catch(() => {});
    await client.rename(config.remotePath, failedPath).catch(async () => {
      await removeRemotePath(client, config.remotePath);
    });
  }

  await client.rename(backupPath, config.remotePath);
}

export async function cleanupOldBackups(client: Client, config: SftpPublishConfig) {
  const backupRoot = remoteJoin(pathPosix.dirname(config.remotePath), ".cms-backups");

  if (!(await remoteExists(client, backupRoot))) {
    return;
  }

  const backups = (await client.list(backupRoot))
    .filter((entry) => entry.type === "d" && entry.name.startsWith(`${landingSlug}-`))
    .sort((first, second) => second.name.localeCompare(first.name));

  for (const backup of backups.slice(config.keepBackups)) {
    await removeRemotePath(client, remoteJoin(backupRoot, backup.name)).catch((error) => {
      console.warn(
        JSON.stringify({
          type: "cms_deployment_backup_cleanup_warning",
          backup: backup.name,
          message: error instanceof Error ? error.message : "Falha ao remover backup antigo.",
        }),
      );
    });
  }
}

export async function publishReleaseViaSftp({
  callbacks,
  client,
  config,
  deploymentId,
  manifest,
  releaseDir,
}: {
  callbacks: PublishCallbacks;
  client: Client;
  config: SftpPublishConfig;
  deploymentId: string;
  manifest: DeploymentManifest;
  releaseDir: string;
}) {
  config.remotePath = await resolvePublishRemotePath(client, config);
  const layout = getRemoteLayout(config.remotePath, deploymentId);
  const manifestFilePath = path.join(releaseDir, "deployment-manifest.json");
  const manifestStats = await stat(manifestFilePath);
  const files = createUploadFiles(releaseDir, manifest);
  files.push({
    relativePath: "deployment-manifest.json",
    size: manifestStats.size,
    sha256: "",
    mimeType: "application/json; charset=utf-8",
    localPath: manifestFilePath,
  });

  await callbacks.onStage("uploading");
  await ensureRemoteDirectory(client, layout.stagingRoot);
  await ensureRemoteDirectory(client, layout.backupsRoot);
  await removeRemotePath(client, layout.stagingPath).catch(() => {});
  await ensureRemoteDirectory(client, layout.stagingPath);
  await uploadFiles({ client, files, remoteRoot: layout.stagingPath, callbacks });

  await callbacks.onStage("verifying");

  if (!(await remoteExists(client, remoteJoin(layout.stagingPath, "index.html")))) {
    throw new DeploymentError(
      "REMOTE_VERIFICATION_FAILED",
      "index.html não foi enviado para staging.",
    );
  }

  try {
    await callbacks.onMode("atomic");
    await activateAtomic({ callbacks, client, config, layout });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.toLowerCase().includes("permission")) {
      throw new DeploymentError(
        "SFTP_PERMISSION_DENIED",
        "Permissão negada ao ativar a publicação.",
      );
    }

    await activateNonAtomic({ callbacks, client, config, files, layout });
  }

  return layout;
}
