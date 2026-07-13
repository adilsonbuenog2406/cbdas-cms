import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDeploymentTmpDir, publishedLandingPath, siteDistPublicDir, uploadsDir } from "./paths";
import { createDeploymentManifest } from "./create-manifest";
import { validateRelease } from "./validate-release";
import { DeploymentError } from "./types";

function rewritePublishedHtml(html: string, deploymentId: string) {
  const deploymentMeta = `<meta name="cms-deployment-id" content="${deploymentId}">`;
  const htmlWithMeta = html.includes('name="cms-deployment-id"')
    ? html.replace(
        /<meta\s+name="cms-deployment-id"\s+content="[^"]*"\s*\/?>/i,
        deploymentMeta,
      )
    : html.replace("</head>", `    ${deploymentMeta}\n  </head>`);

  return htmlWithMeta
    .replaceAll('src="/assets/', 'src="assets/')
    .replaceAll('href="/assets/', 'href="assets/')
    .replaceAll('src="/uploads/', 'src="uploads/')
    .replaceAll('href="/uploads/', 'href="uploads/')
    .replaceAll('src="/tailwind-browser.js"', 'src="tailwind-browser.js"')
    .replaceAll('href="/logodark.webp"', 'href="logodark.webp"')
    .replaceAll('href="/', 'href="../')
    .replaceAll('src="/', 'src="../');
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

  let landingHtml: string;

  try {
    landingHtml = await readFile(publishedLandingPath, "utf8");
  } catch {
    throw new DeploymentError(
      "RELEASE_BUILD_FAILED",
      "Nenhuma landing salva foi encontrada em data/landing.html.",
    );
  }

  await writeFile(
    path.join(releaseDir, "index.html"),
    rewritePublishedHtml(landingHtml, deploymentId),
    "utf8",
  );

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
