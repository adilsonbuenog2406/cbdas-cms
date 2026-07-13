import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requireFromCms = createRequire(path.join(repoRoot, "apps/cms/package.json"));
const JSZip = requireFromCms("jszip");
const siteDistDir = path.join(repoRoot, "apps/site/dist");
const cmsPublicDir = path.join(repoRoot, "apps/cms/public");
const syncedDistDir = path.join(cmsPublicDir, "site-dist");
const exportsDir = path.join(cmsPublicDir, "exports");
const manifestPath = path.join(cmsPublicDir, "site-dist-manifest.json");
const zipPath = path.join(exportsDir, "cbdas-site.zip");

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".otf": "font/otf",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".md", ".txt", ".xml"]);

function toPublicPath(relativePath) {
  return relativePath.split(path.sep).join("/");
}

async function assertSiteDistExists() {
  try {
    const siteDistStats = await stat(siteDistDir);

    if (!siteDistStats.isDirectory()) {
      throw new Error();
    }
  } catch {
    throw new Error(
      `apps/site/dist nao existe. Execute "pnpm build:site" antes de sincronizar o CMS.`,
    );
  }
}

async function walkDist(relativeDirectory = "") {
  const absoluteDirectory = path.join(siteDistDir, relativeDirectory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const relativePath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkDist(relativePath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const sourcePath = path.join(siteDistDir, relativePath);
    const targetPath = path.join(syncedDistDir, relativePath);
    const fileStats = await stat(sourcePath);
    const extension = path.extname(entry.name).toLowerCase();
    const publicRelativePath = toPublicPath(relativePath);
    const publicDirectory = toPublicPath(path.dirname(relativePath));

    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(sourcePath, targetPath);

    files.push({
      name: entry.name,
      relativePath: publicRelativePath,
      publicUrl: `/site-dist/${encodeURI(publicRelativePath).replaceAll("%2F", "/")}`,
      extension,
      mimeType: mimeTypes[extension] ?? "application/octet-stream",
      size: fileStats.size,
      directory: publicDirectory === "." ? "" : publicDirectory,
      isImage: imageExtensions.has(extension),
      isText: textExtensions.has(extension),
    });
  }

  return files;
}

async function createZip(files) {
  const zip = new JSZip();

  await Promise.all(
    files.map(async (file) => {
      const buffer = await readFile(path.join(siteDistDir, file.relativePath));
      zip.file(file.relativePath, buffer, {
        binary: true,
        date: new Date(),
      });
    }),
  );

  await mkdir(exportsDir, { recursive: true });
  await writeFile(zipPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

async function main() {
  await assertSiteDistExists();
  await Promise.all([
    rm(syncedDistDir, { recursive: true, force: true }),
    rm(exportsDir, { recursive: true, force: true }),
    rm(manifestPath, { force: true }),
  ]);
  await mkdir(syncedDistDir, { recursive: true });

  const files = (await walkDist()).sort((first, second) =>
    first.relativePath.localeCompare(second.relativePath, "pt-BR"),
  );
  const manifest = {
    generatedAt: new Date().toISOString(),
    source: "apps/site/dist",
    publicRoot: "/site-dist",
    exportUrl: "/exports/cbdas-site.zip",
    files,
  };

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await createZip(files);

  console.log(
    `Sincronizado apps/site/dist -> apps/cms/public/site-dist (${files.length} arquivos).`,
  );
  console.log("Manifesto: apps/cms/public/site-dist-manifest.json");
  console.log("ZIP: apps/cms/public/exports/cbdas-site.zip");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
