import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export type SiteDistFile = {
  name: string;
  relativePath: string;
  publicUrl: string;
  extension: string;
  mimeType: string;
  size: number;
  directory: string;
  isImage: boolean;
  isText: boolean;
};

export type SiteDistManifest = {
  generatedAt: string;
  source: string;
  publicRoot: string;
  exportUrl: string;
  files: SiteDistFile[];
};

export type SiteDistDirectory = {
  name: string;
  path: string;
};

const cmsPublicDir = path.resolve(process.cwd(), "public");
const siteDistDir = path.join(cmsPublicDir, "site-dist");
const manifestPath = path.join(cmsPublicDir, "site-dist-manifest.json");
const maxTextPreviewBytes = 512 * 1024;

export function normalizeCmsRelativePath(value: string | undefined) {
  if (!value) {
    return "";
  }

  const normalized = value.replaceAll("\\", "/").replace(/^\/+/, "").replace(/\/+$/, "");

  if (
    normalized.includes("\0") ||
    normalized.includes("..") ||
    path.isAbsolute(normalized)
  ) {
    return "";
  }

  return normalized;
}

export async function loadSiteDistManifest(): Promise<SiteDistManifest> {
  try {
    const payload = JSON.parse(await readFile(manifestPath, "utf8")) as SiteDistManifest;

    return {
      generatedAt: payload.generatedAt,
      source: payload.source,
      publicRoot: payload.publicRoot,
      exportUrl: payload.exportUrl,
      files: Array.isArray(payload.files) ? payload.files : [],
    };
  } catch {
    throw new Error(
      'Build sincronizado nao encontrado. Execute "pnpm build:cms" ou "pnpm sync:site-dist".',
    );
  }
}

export async function getExportZipInfo() {
  const zipPath = path.join(cmsPublicDir, "exports/cbdas-site.zip");
  const zipStats = await stat(zipPath);

  return {
    publicUrl: "/exports/cbdas-site.zip",
    size: zipStats.size,
    updatedAt: zipStats.mtime.toISOString(),
  };
}

export function getSiteDistDirectories(files: SiteDistFile[], currentDirectory: string) {
  const directories = new Map<string, SiteDistDirectory>();
  const prefix = currentDirectory ? `${currentDirectory}/` : "";

  files.forEach((file) => {
    if (!file.relativePath.startsWith(prefix)) {
      return;
    }

    const remainingPath = file.relativePath.slice(prefix.length);
    const separatorIndex = remainingPath.indexOf("/");

    if (separatorIndex === -1) {
      return;
    }

    const directoryName = remainingPath.slice(0, separatorIndex);
    const directoryPath = prefix ? `${prefix}${directoryName}` : directoryName;

    directories.set(directoryPath, {
      name: directoryName,
      path: directoryPath,
    });
  });

  return Array.from(directories.values()).sort((first, second) =>
    first.name.localeCompare(second.name, "pt-BR"),
  );
}

export function getSiteDistFilesInDirectory(
  files: SiteDistFile[],
  currentDirectory: string,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return files
    .filter((file) => file.directory === currentDirectory)
    .filter((file) =>
      normalizedQuery ? file.name.toLowerCase().includes(normalizedQuery) : true,
    )
    .sort((first, second) => first.name.localeCompare(second.name, "pt-BR"));
}

export function getBreadcrumbs(currentDirectory: string) {
  if (!currentDirectory) {
    return [];
  }

  const segments = currentDirectory.split("/");

  return segments.map((segment, index) => ({
    label: segment,
    path: segments.slice(0, index + 1).join("/"),
  }));
}

export function getSiteDistFileByPath(files: SiteDistFile[], relativePath: string) {
  const normalizedPath = normalizeCmsRelativePath(relativePath);

  return files.find((file) => file.relativePath === normalizedPath);
}

export async function readSiteDistTextFile(file: SiteDistFile) {
  if (!file.isText || file.size > maxTextPreviewBytes) {
    return null;
  }

  const resolvedPath = path.resolve(siteDistDir, file.relativePath);

  if (!resolvedPath.startsWith(`${siteDistDir}${path.sep}`)) {
    return null;
  }

  return readFile(resolvedPath, "utf8");
}

export function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB"];
  let nextSize = size / 1024;
  let unitIndex = 0;

  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024;
    unitIndex += 1;
  }

  return `${nextSize.toFixed(nextSize >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

export function formatBuildDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Indisponivel";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
