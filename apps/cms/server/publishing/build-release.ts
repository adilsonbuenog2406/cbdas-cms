import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDeploymentTmpDir, siteDistPublicDir, uploadsDir } from "./paths";
import { createDeploymentManifest } from "./create-manifest";
import { validateRelease } from "./validate-release";
import { DeploymentError } from "./types";

export function injectDeploymentMeta(html: string, deploymentId: string) {
  const deploymentMeta = `<meta name="cms-deployment-id" content="${deploymentId}">`;

  if (html.includes('name="cms-deployment-id"')) {
    return html.replace(
      /<meta\s+name="cms-deployment-id"\s+content="[^"]*"\s*\/?>/i,
      deploymentMeta,
    );
  }

  return html.includes("</head>")
    ? html.replace(
        "</head>",
        `    ${deploymentMeta}\n  </head>`,
      )
    : `${deploymentMeta}\n${html}`;
}

export async function buildRelease(deploymentId: string) {
  const releaseDir = getDeploymentTmpDir(deploymentId);

  await rm(releaseDir, { recursive: true, force: true });
  await mkdir(releaseDir, { recursive: true });

  try {
    await cp(siteDistPublicDir, releaseDir, {
      recursive: true,
      filter: (source) =>
        !source.endsWith(".map") &&
        !source.includes(`${path.sep}.git${path.sep}`) &&
        !source.includes(`${path.sep}node_modules${path.sep}`),
    });
  } catch {
    throw new DeploymentError(
      "RELEASE_BUILD_FAILED",
      "Build sincronizado do site não encontrado. Execute pnpm build:cms.",
    );
  }

  const releaseIndexPath = path.join(releaseDir, "index.html");
  let siteIndexHtml: string;

  try {
    siteIndexHtml = await readFile(releaseIndexPath, "utf8");
  } catch {
    throw new DeploymentError(
      "RELEASE_BUILD_FAILED",
      "O build sincronizado do site não contém index.html. Execute pnpm build:cms.",
    );
  }

  await writeFile(releaseIndexPath, injectDeploymentMeta(siteIndexHtml, deploymentId), "utf8");

  await cp(uploadsDir, path.join(releaseDir, "uploads"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  const { manifest, manifestHash } = await createDeploymentManifest(releaseDir, deploymentId);
  await validateRelease(releaseDir, manifest);

  return {
    releaseDir,
    manifest,
    manifestHash,
  };
}
