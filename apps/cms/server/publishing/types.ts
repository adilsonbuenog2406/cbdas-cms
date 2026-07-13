export type DeploymentStatus =
  | "queued"
  | "building"
  | "validating"
  | "connecting"
  | "uploading"
  | "verifying"
  | "backing_up"
  | "activating"
  | "health_check"
  | "published"
  | "rolling_back"
  | "rolled_back"
  | "failed";

export type DeploymentMode = "atomic" | "non_atomic";

export type DeploymentErrorCode =
  | "SFTP_CONFIGURATION_INVALID"
  | "SFTP_CONNECTION_FAILED"
  | "SFTP_AUTHENTICATION_FAILED"
  | "SFTP_PERMISSION_DENIED"
  | "RELEASE_BUILD_FAILED"
  | "RELEASE_VALIDATION_FAILED"
  | "REMOTE_STAGING_FAILED"
  | "REMOTE_UPLOAD_FAILED"
  | "REMOTE_VERIFICATION_FAILED"
  | "REMOTE_BACKUP_FAILED"
  | "REMOTE_ACTIVATION_FAILED"
  | "HEALTH_CHECK_FAILED"
  | "ROLLBACK_FAILED"
  | "DEPLOYMENT_ALREADY_RUNNING";

export type DeploymentManifestFile = {
  relativePath: string;
  size: number;
  sha256: string;
  mimeType: string;
};

export type DeploymentManifest = {
  deploymentId: string;
  generatedAt: string;
  totalFiles: number;
  totalBytes: number;
  files: DeploymentManifestFile[];
};

export type DeploymentRecord = {
  id: string;
  userId: string;
  status: DeploymentStatus;
  deploymentMode: DeploymentMode;
  startedAt: string;
  completedAt: string | null;
  totalFiles: number;
  totalBytes: number;
  filesUploaded: number;
  bytesUploaded: number;
  manifestHash: string;
  remotePath: string;
  backupPath: string | null;
  errorCode: DeploymentErrorCode | null;
  errorMessage: string | null;
  currentStage: string;
  publicUrl: string | null;
  warnings: string[];
};

export type DeploymentProgress = {
  filesUploaded?: number;
  bytesUploaded?: number;
  totalFiles?: number;
  totalBytes?: number;
  manifestHash?: string;
  backupPath?: string | null;
  deploymentMode?: DeploymentMode;
  publicUrl?: string | null;
  warning?: string;
};

export class DeploymentError extends Error {
  readonly code: DeploymentErrorCode;

  constructor(code: DeploymentErrorCode, message: string) {
    super(message);
    this.name = "DeploymentError";
    this.code = code;
  }
}
