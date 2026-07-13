import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import type { DeploymentManifest } from "./types";
import { DeploymentError } from "./types";

const forbiddenPathParts = new Set([
  ".env",
  ".git",
  "node_modules",
  ".next",
  "data",
  "server",
]);

const forbiddenContentPatterns = [
  /SFTP_PRIVATE_KEY/i,
  /SFTP_PASSWORD/i,
  /SFTP_PRIVATE_KEY_PASSPHRASE/i,
  /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/,
];

function isForbiddenPath(relativePath: string) {
  const parts = relativePath.split("/");

  return (
    path.posix.isAbsolute(relativePath) ||
    parts.includes("..") ||
    parts.some((part) => forbiddenPathParts.has(part)) ||
    relativePath.endsWith(".map")
  );
}

export async function validateRelease(rootDir: string, manifest: DeploymentManifest) {
  if (manifest.totalFiles === 0) {
    throw new DeploymentError("RELEASE_VALIDATION_FAILED", "A release está vazia.");
  }

  if (!manifest.files.some((file) => file.relativePath === "index.html")) {
    throw new DeploymentError("RELEASE_VALIDATION_FAILED", "index.html não foi gerado.");
  }

  for (const file of manifest.files) {
    if (isForbiddenPath(file.relativePath)) {
      throw new DeploymentError(
        "RELEASE_VALIDATION_FAILED",
        `Arquivo proibido na release: ${file.relativePath}`,
      );
    }

    const filePath = path.resolve(rootDir, file.relativePath);

    if (!filePath.startsWith(`${rootDir}${path.sep}`)) {
      throw new DeploymentError(
        "RELEASE_VALIDATION_FAILED",
        `Path traversal detectado: ${file.relativePath}`,
      );
    }

    const fileStats = await lstat(filePath);

    if (fileStats.isSymbolicLink()) {
      throw new DeploymentError(
        "RELEASE_VALIDATION_FAILED",
        `Link simbólico proibido: ${file.relativePath}`,
      );
    }

    if (!fileStats.isFile()) {
      throw new DeploymentError(
        "RELEASE_VALIDATION_FAILED",
        `Entrada inválida na release: ${file.relativePath}`,
      );
    }

    if (file.mimeType.startsWith("text/") || file.relativePath.endsWith(".json")) {
      const payload = await readFile(filePath, "utf8");

      if (forbiddenContentPatterns.some((pattern) => pattern.test(payload))) {
        throw new DeploymentError(
          "RELEASE_VALIDATION_FAILED",
          `Conteúdo sensível detectado em ${file.relativePath}`,
        );
      }
    }
  }
}
