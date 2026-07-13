import path from "node:path";
import { readFileSync } from "node:fs";
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

let cachedFileEnv: Record<string, string> | null = null;

function parseEnv(content: string) {
  const values: Record<string, string> = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function getFileEnv() {
  if (cachedFileEnv) {
    return cachedFileEnv;
  }

  const envFiles = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../..", ".env"),
  ];

  cachedFileEnv = {};

  for (const envFile of envFiles) {
    try {
      cachedFileEnv = {
        ...cachedFileEnv,
        ...parseEnv(readFileSync(envFile, "utf8")),
      };
    } catch {
      // Optional env files.
    }
  }

  return cachedFileEnv;
}

function getEnvValue(...names: string[]) {
  const fileEnv = getFileEnv();

  for (const name of names) {
    const value = process.env[name] ?? fileEnv[name];

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getNumberEnv(name: string, fallback: number, ...aliases: string[]) {
  const value = getEnvValue(name, ...aliases);

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
  if (getEnvValue("NEXT_PUBLIC_SFTP_PRIVATE_KEY")) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "A chave privada SFTP nao pode usar prefixo NEXT_PUBLIC_.",
    );
  }

  const host = getEnvValue("SFTP_HOST", "HOSTINGER_SFTP_HOST")?.trim();
  const username = getEnvValue("SFTP_USERNAME", "HOSTINGER_SFTP_USER")?.trim();
  const privateKey = normalizePrivateKey(getEnvValue("SFTP_PRIVATE_KEY"));
  const password = getEnvValue("SFTP_PASSWORD", "HOSTINGER_SFTP_PASSWORD");

  if (!host || !username || (!privateKey && !password)) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "Configure SFTP_HOST, SFTP_USERNAME e SFTP_PRIVATE_KEY ou SFTP_PASSWORD.",
    );
  }

  const remotePath = validateRemotePath(
    getEnvValue("SFTP_REMOTE_PATH", "HOSTINGER_ALLOWED_BASE_PATH") ??
      `/public_html/${landingSlug}`,
  );

  const hostFingerprint = getEnvValue("SFTP_HOST_FINGERPRINT", "HOSTINGER_SFTP_FINGERPRINT");

  if (process.env.NODE_ENV === "production" && !hostFingerprint) {
    throw new DeploymentError(
      "SFTP_CONFIGURATION_INVALID",
      "Configure SFTP_HOST_FINGERPRINT em produção.",
    );
  }

  return {
    host,
    port: getNumberEnv("SFTP_PORT", 22, "HOSTINGER_SFTP_PORT"),
    username,
    password: privateKey ? undefined : password,
    privateKey,
    privateKeyPassphrase: getEnvValue("SFTP_PRIVATE_KEY_PASSPHRASE"),
    hostFingerprint: hostFingerprint?.trim(),
    remotePath,
    publicLandingPageUrl:
      getEnvValue("PUBLIC_LANDING_PAGE_URL") ??
      "https://idasan.com.br/iii-congresso-brasileiro-de-direito-administrativo-sancionador/",
    connectionTimeout: getNumberEnv("SFTP_CONNECTION_TIMEOUT", 30000),
    readyTimeout: getNumberEnv("SFTP_READY_TIMEOUT", 30000),
    keepBackups: Math.max(1, getNumberEnv("SFTP_KEEP_BACKUPS", 3)),
  };
}
