import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { dataDir, publishedLandingPath, savedProjectPath, uploadsDir } from "./publishing/paths";

function getStorageBucket() {
  return getEnvValue("CMS_SUPABASE_BUCKET") ?? getEnvValue("SUPABASE_STORAGE_BUCKET") ?? "cms";
}
const storageRoot = "cbdas";
const savedProjectObjectPath = `${storageRoot}/landing.grapes.json`;
const publishedLandingObjectPath = `${storageRoot}/landing.html`;
const uploadsObjectPrefix = `${storageRoot}/uploads`;

type SaveLandingInput = {
  html: string;
  css: string;
  mode?: unknown;
  siteCssHref?: string;
  renderedHtml: string;
};

type StoredAsset = {
  body: Buffer;
  contentType: string;
};

let cachedSupabase: SupabaseClient | null | undefined;
let didEnsureBucket = false;
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

  cachedFileEnv = {};

  for (const envPath of [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../..", ".env"),
  ]) {
    try {
      cachedFileEnv = {
        ...cachedFileEnv,
        ...parseEnv(readFileSync(envPath, "utf8")),
      };
    } catch {
      // Optional env files.
    }
  }

  return cachedFileEnv;
}

function getEnvValue(name: string) {
  return process.env[name] ?? getFileEnv()[name];
}

function getSupabaseAdmin() {
  if (cachedSupabase !== undefined) {
    return cachedSupabase;
  }

  const url = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    cachedSupabase = null;
    return cachedSupabase;
  }

  cachedSupabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cachedSupabase;
}

async function ensureStorageBucket(supabase: SupabaseClient) {
  if (didEnsureBucket) {
    return;
  }

  const { error: getBucketError } = await supabase.storage.getBucket(getStorageBucket());

  if (!getBucketError) {
    didEnsureBucket = true;
    return;
  }

  const { error: createBucketError } = await supabase.storage.createBucket(getStorageBucket(), {
    public: false,
  });

  if (createBucketError && !/already exists/i.test(createBucketError.message)) {
    throw createBucketError;
  }

  didEnsureBucket = true;
}

async function uploadTextObject(supabase: SupabaseClient, objectPath: string, body: string, contentType: string) {
  await ensureStorageBucket(supabase);

  const { error } = await supabase.storage.from(getStorageBucket()).upload(objectPath, body, {
    cacheControl: "0",
    contentType,
    upsert: true,
  });

  if (error) {
    throw error;
  }
}

async function downloadObject(supabase: SupabaseClient, objectPath: string) {
  const { data, error } = await supabase.storage.from(getStorageBucket()).download(objectPath);

  if (error) {
    throw error;
  }

  return Buffer.from(await data.arrayBuffer());
}

export function hasPersistentCmsStorage() {
  return Boolean(getSupabaseAdmin());
}

export async function saveLanding(input: SaveLandingInput) {
  const supabase = getSupabaseAdmin();
  const projectJson = JSON.stringify(
    {
      html: input.html,
      css: input.css,
      mode: input.mode,
      siteCssHref: input.siteCssHref,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  if (supabase) {
    await Promise.all([
      uploadTextObject(supabase, savedProjectObjectPath, projectJson, "application/json; charset=utf-8"),
      uploadTextObject(supabase, publishedLandingObjectPath, input.renderedHtml, "text/html; charset=utf-8"),
    ]);
    return;
  }

  await mkdir(dataDir, { recursive: true });
  await Promise.all([
    writeFile(savedProjectPath, projectJson, "utf8"),
    writeFile(publishedLandingPath, input.renderedHtml, "utf8"),
  ]);
}

export async function readSavedProjectJson() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    return (await downloadObject(supabase, savedProjectObjectPath)).toString("utf8");
  }

  return readFile(savedProjectPath, "utf8");
}

export async function readPublishedLandingHtml() {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    return (await downloadObject(supabase, publishedLandingObjectPath)).toString("utf8");
  }

  return readFile(publishedLandingPath, "utf8");
}

export async function uploadEditorImage(file: File) {
  const extension = getSafeExtension(file);

  if (!extension) {
    throw new Error("Formato de imagem nao suportado.");
  }

  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await ensureStorageBucket(supabase);
    const { error } = await supabase.storage
      .from(getStorageBucket())
      .upload(`${uploadsObjectPrefix}/${fileName}`, buffer, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return `/uploads/${fileName}`;
  }

  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return `/uploads/${fileName}`;
}

export async function readUploadedAsset(relativePath: string): Promise<StoredAsset> {
  const normalizedPath = normalizeUploadPath(relativePath);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const body = await downloadObject(supabase, `${uploadsObjectPrefix}/${normalizedPath}`);

    return {
      body,
      contentType: getContentType(normalizedPath),
    };
  }

  return {
    body: await readFile(path.join(uploadsDir, normalizedPath)),
    contentType: getContentType(normalizedPath),
  };
}

export async function copyStoredUploadsToDirectory(destinationDir: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return;
  }

  const files = await listUploadObjectPaths(supabase);

  await Promise.all(
    files.map(async (objectPath) => {
      const relativePath = objectPath.slice(`${uploadsObjectPrefix}/`.length);
      const targetPath = path.join(destinationDir, relativePath);

      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, await downloadObject(supabase, objectPath));
    }),
  );
}

async function listUploadObjectPaths(supabase: SupabaseClient, prefix = uploadsObjectPrefix): Promise<string[]> {
  const { data, error } = await supabase.storage.from(getStorageBucket()).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw error;
  }

  const objectPaths: string[] = [];

  for (const entry of data ?? []) {
    const entryPath = `${prefix}/${entry.name}`;

    if (entry.id) {
      objectPaths.push(entryPath);
      continue;
    }

    objectPaths.push(...(await listUploadObjectPaths(supabase, entryPath)));
  }

  return objectPaths;
}

async function getLocalUploadPaths(dir: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const paths: string[] = [];

  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      paths.push(...(await getLocalUploadPaths(absolutePath, relativePath)));
      continue;
    }

    paths.push(relativePath);
  }

  return paths;
}

export async function copyLocalUploadsToDirectory(destinationDir: string) {
  const files = await getLocalUploadPaths(uploadsDir);

  await Promise.all(
    files.map(async (relativePath) => {
      const targetPath = path.join(destinationDir, relativePath);

      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, await readFile(path.join(uploadsDir, relativePath)));
    }),
  );
}

function normalizeUploadPath(value: string) {
  const normalizedPath = path.posix.normalize(value.replaceAll("\\", "/")).replace(/^\/+/, "");

  if (!normalizedPath || normalizedPath.startsWith("../") || normalizedPath.includes("/../")) {
    throw new Error("Caminho de upload invalido.");
  }

  return normalizedPath;
}

function getSafeExtension(file: File) {
  const mimeExtension = extensionByMimeType[file.type];

  if (mimeExtension) {
    return mimeExtension;
  }

  const nameExtension = path.extname(file.name).toLowerCase();

  return Object.values(extensionByMimeType).includes(nameExtension) ? nameExtension : "";
}

const extensionByMimeType: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
};

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".gif") return "image/gif";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".webp") return "image/webp";

  return "application/octet-stream";
}
