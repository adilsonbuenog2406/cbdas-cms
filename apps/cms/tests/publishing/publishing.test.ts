import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  landingSlug,
  normalizeSftpHost,
  type SftpPublishConfig,
  validateRemotePath,
  validateSftpPort,
} from "../../server/publishing/config";
import { createDeploymentManifest } from "../../server/publishing/create-manifest";
import {
  assertRemotePathInsidePublishRoot,
  resolvePublishRemotePath,
} from "../../server/publishing/sftp-publisher";
import { validateRelease } from "../../server/publishing/validate-release";
import { DeploymentError } from "../../server/publishing/types";

async function withTempDir(run: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "cms-publishing-test-"));

  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("valida caminho remoto permitido", () => {
  assert.equal(
    validateRemotePath(`/public_html/${landingSlug}`),
    `/public_html/${landingSlug}`,
  );
});

test("bloqueia caminho remoto perigoso", () => {
  assert.throws(() => validateRemotePath("/"), DeploymentError);
  assert.throws(() => validateRemotePath("/public_html"), DeploymentError);
  assert.throws(() => validateRemotePath(`/public_html/../${landingSlug}`), DeploymentError);
  assert.throws(() => validateRemotePath(`/public_html/outro-site`), DeploymentError);
});

test("bloqueia host SFTP com protocolo FTP", () => {
  assert.throws(() => normalizeSftpHost("ftp://147.93.38.36"), DeploymentError);
});

test("bloqueia porta FTP para publicacao SFTP", () => {
  assert.throws(() => validateSftpPort(21), DeploymentError);
  assert.equal(validateSftpPort(65002), 65002);
});

test("resolve public_html para layout de dominios da Hostinger", async () => {
  const config = {
    publicLandingPageUrl: `https://idasan.com.br/${landingSlug}/`,
    remotePath: `/public_html/${landingSlug}`,
  } as SftpPublishConfig;
  const client = {
    async exists(remotePath: string) {
      return remotePath === "domains/idasan.com.br/public_html" ? "d" : false;
    },
  };

  assert.equal(
    await resolvePublishRemotePath(client, config),
    `domains/idasan.com.br/public_html/${landingSlug}`,
  );
});

test("bloqueia escrita fora da pasta da landing", () => {
  const root = `domains/idasan.com.br/public_html/${landingSlug}`;

  assert.equal(
    assertRemotePathInsidePublishRoot(root, `${root}/assets/index.css`),
    `${root}/assets/index.css`,
  );
  assert.throws(
    () => assertRemotePathInsidePublishRoot(root, "domains/idasan.com.br/public_html/.cms-backups"),
    DeploymentError,
  );
});

test("cria manifesto com sha256 e tamanhos", async () => {
  await withTempDir(async (dir) => {
    await mkdir(path.join(dir, "assets"), { recursive: true });
    await writeFile(path.join(dir, "index.html"), "<html>ok</html>", "utf8");
    await writeFile(path.join(dir, "assets/style.css"), "body{}", "utf8");

    const { manifest } = await createDeploymentManifest(dir, "deployment-test");
    const indexFile = manifest.files.find((file) => file.relativePath === "index.html");

    assert.equal(manifest.totalFiles, 2);
    assert.equal(indexFile?.sha256, createHash("sha256").update("<html>ok</html>").digest("hex"));
  });
});

test("bloqueia release sem index.html", async () => {
  await withTempDir(async (dir) => {
    await writeFile(path.join(dir, "asset.txt"), "ok", "utf8");
    const { manifest } = await createDeploymentManifest(dir, "deployment-test");

    await assert.rejects(() => validateRelease(dir, manifest), DeploymentError);
  });
});

test("bloqueia path traversal no manifesto", async () => {
  await withTempDir(async (dir) => {
    await writeFile(path.join(dir, "index.html"), "<html>ok</html>", "utf8");
    const { manifest } = await createDeploymentManifest(dir, "deployment-test");
    manifest.files.push({
      mimeType: "text/plain; charset=utf-8",
      relativePath: "../secret.txt",
      sha256: "x",
      size: 1,
    });
    manifest.totalFiles += 1;

    await assert.rejects(() => validateRelease(dir, manifest), DeploymentError);
  });
});

test("bloqueia conteúdo sensível em arquivos textuais", async () => {
  await withTempDir(async (dir) => {
    await writeFile(
      path.join(dir, "index.html"),
      "<html>SFTP_PASSWORD=super-secret</html>",
      "utf8",
    );
    const { manifest } = await createDeploymentManifest(dir, "deployment-test");

    await assert.rejects(() => validateRelease(dir, manifest), DeploymentError);
  });
});
