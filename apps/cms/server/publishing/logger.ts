import type { DeploymentErrorCode, DeploymentStatus } from "./types";

type DeploymentLog = {
  deploymentId: string;
  userId: string;
  stage: string;
  status: DeploymentStatus;
  filesUploaded?: number;
  bytesUploaded?: number;
  durationMs?: number;
  errorCode?: DeploymentErrorCode | null;
};

export function logDeploymentEvent(event: DeploymentLog) {
  console.log(JSON.stringify({ type: "cms_deployment", ...event }));
}
