import { readFile } from "node:fs/promises";
import path from "node:path";

const uploadDir = path.resolve(process.cwd(), "data/uploads");

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

type UploadRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_request: Request, context: UploadRouteContext) {
  const params = await context.params;
  const requestedPath = params.path.join("/");
  const filePath = path.resolve(uploadDir, requestedPath);

  if (!filePath.startsWith(`${uploadDir}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    return new Response(file, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": contentTypes[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
