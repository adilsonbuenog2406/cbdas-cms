import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { DeploymentManifest, DeploymentManifestFile } from "./types";

const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function toRelativePath(rootDir: string, filePath: string) {
  return path.relative(rootDir, filePath).split(path.sep).join("/");
}

async function collectFiles(rootDir: string, currentDir = rootDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(rootDir, entryPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function createDeploymentManifest(rootDir: string, deploymentId: string) {
  const files = await collectFiles(rootDir);
  const manifestFiles: DeploymentManifestFile[] = [];

  for (const filePath of files) {
    const relativePath = toRelativePath(rootDir, filePath);

    if (relativePath === "deployment-manifest.json") {
      continue;
    }

    const [fileStats, buffer] = await Promise.all([stat(filePath), readFile(filePath)]);

    manifestFiles.push({
      relativePath,
      size: fileStats.size,
      sha256: createHash("sha256").update(buffer).digest("hex"),
      mimeType: mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream",
    });
  }

  const manifest: DeploymentManifest = {
    deploymentId,
    generatedAt: new Date().toISOString(),
    totalFiles: manifestFiles.length,
    totalBytes: manifestFiles.reduce((total, file) => total + file.size, 0),
    files: manifestFiles.sort((first, second) =>
      first.relativePath.localeCompare(second.relativePath),
    ),
  };

  await writeFile(
    path.join(rootDir, "deployment-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  const manifestHash = createHash("sha256")
    .update(JSON.stringify(manifest))
    .digest("hex");

  return { manifest, manifestHash };
}
