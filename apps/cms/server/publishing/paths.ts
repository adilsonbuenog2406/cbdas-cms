import os from "node:os";
import path from "node:path";

export const cmsRoot = process.cwd();
export const dataDir = path.resolve(cmsRoot, "data");
export const deploymentsDir = path.join(dataDir, "deployments");
export const deploymentRecordsDir = path.join(deploymentsDir, "records");
export const deploymentLockPath = path.join(deploymentsDir, "publish.lock.json");
export const publishedLandingPath = path.join(dataDir, "landing.html");
export const siteDistPublicDir = path.join(cmsRoot, "public/site-dist");
export const uploadsDir = path.join(dataDir, "uploads");
export const publishTmpRoot = path.join(os.tmpdir(), "cbdas-publish");

export function getDeploymentTmpDir(deploymentId: string) {
  return path.join(publishTmpRoot, deploymentId);
}
