import Client from "ssh2-sftp-client";
import type { ConnectOptions } from "ssh2-sftp-client";
import { DeploymentError } from "./types";
import type { SftpPublishConfig } from "./config";

function normalizeFingerprint(value: string) {
  return value.replace(/^SHA256:/i, "").replaceAll(":", "").trim();
}

export async function connectSftp(config: SftpPublishConfig) {
  const client = new Client();
  const connectOptions: ConnectOptions = {
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    privateKey: config.privateKey,
    passphrase: config.privateKeyPassphrase,
    readyTimeout: config.readyTimeout,
  };

  if (config.hostFingerprint) {
    const expectedFingerprint = normalizeFingerprint(config.hostFingerprint);
    connectOptions.hostHash = "sha256";
    connectOptions.hostVerifier = (fingerprint) =>
      normalizeFingerprint(String(fingerprint)) === expectedFingerprint;
  }

  try {
    await client.connect(connectOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao conectar via SFTP.";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("auth") || lowerMessage.includes("password")) {
      throw new DeploymentError(
        "SFTP_AUTHENTICATION_FAILED",
        "Falha de autenticação SFTP.",
      );
    }

    throw new DeploymentError("SFTP_CONNECTION_FAILED", "Falha ao conectar ao SFTP.");
  }

  return client;
}
