import path from "node:path";
import { DeploymentError } from "./types";

export const landingSlug =
  "iii-congresso-brasileiro-de-direito-administrativo-sancionador";

export type SftpPublishConfig = {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  privateKeyPassphrase?: string;
  hostFingerprint?: string;
  remotePath: string;
  publicLandingPageUrl: string;
  connectionTimeout: number;
  readyTimeout: number;
  keepBackups: number;
};

function getNumberEnv(name: string, fallback: number) {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export function normalizePrivateKey(value: string | undefined) {
  return value?.replaceAll("\\n", "\n").trim();
}

export function validateRemotePath(remotePath: string) {
  const normalizedPath = path.posix.normalize(remotePath);

  if (
    !remotePath ||
    !remotePath.startsWith("/") ||
    remotePath.includes("\0") ||
    remotePath.includes("..") ||
    normalizedPath === "/" ||
    normalizedPath === "/public_html" ||
    !normalizedPath.endsWith(`/${landingSlug}`)
  ) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "Destino remoto de publicação inválido.",
    );
  }

  return normalizedPath;
}

export function getSftpPublishConfig(): SftpPublishConfig {
  if (process.env.NEXT_PUBLIC_SFTP_PRIVATE_KEY) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "A chave privada SFTP nao pode usar prefixo NEXT_PUBLIC_.",
    );
  }

  const host = process.env.SFTP_HOST?.trim();
  const username = process.env.SFTP_USERNAME?.trim();
  const privateKey = normalizePrivateKey(process.env.SFTP_PRIVATE_KEY);
  const password = process.env.SFTP_PASSWORD;

  if (!host || !username || (!privateKey && !password)) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "Configure SFTP_HOST, SFTP_USERNAME e SFTP_PRIVATE_KEY ou SFTP_PASSWORD.",
    );
  }

  const remotePath = validateRemotePath(
    process.env.SFTP_REMOTE_PATH ??
      `/public_html/${landingSlug}`,
  );

  if (process.env.NODE_ENV === "production" && !process.env.SFTP_HOST_FINGERPRINT) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "Configure SFTP_HOST_FINGERPRINT em produção.",
    );
  }

  return {
    host,
    port: getNumberEnv("SFTP_PORT", 22),
    username,
    password: privateKey ? undefined : password,
    privateKey,
    privateKeyPassphrase: process.env.SFTP_PRIVATE_KEY_PASSPHRASE,
    hostFingerprint: process.env.SFTP_HOST_FINGERPRINT?.trim(),
    remotePath,
    publicLandingPageUrl:
      process.env.PUBLIC_LANDING_PAGE_URL ??
      "https://idasan.com.br/iii-congresso-brasileiro-de-direito-administrativo-sancionador/",
    connectionTimeout: getNumberEnv("SFTP_CONNECTION_TIMEOUT", 30000),
    readyTimeout: getNumberEnv("SFTP_READY_TIMEOUT", 30000),
    keepBackups: Math.max(1, getNumberEnv("SFTP_KEEP_BACKUPS", 3)),
  };
}
