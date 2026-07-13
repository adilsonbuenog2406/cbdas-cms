import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const sessionCookieName = "cms_session";
const uploadDir = path.resolve(process.cwd(), "data/uploads");
const maxUploadBytes = 12 * 1024 * 1024;

const extensionByMimeType: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
};

function getSafeExtension(file: File) {
  const mimeExtension = extensionByMimeType[file.type];

  if (mimeExtension) {
    return mimeExtension;
  }

  const nameExtension = path.extname(file.name).toLowerCase();

  return Object.values(extensionByMimeType).includes(nameExtension) ? nameExtension : "";
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(sessionCookieName)?.value !== "ok") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return Response.json({ error: "Envie um arquivo de imagem valido." }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return Response.json({ error: "A imagem deve ter no maximo 12 MB." }, { status: 413 });
  }

  const extension = getSafeExtension(file);

  if (!extension) {
    return Response.json({ error: "Formato de imagem nao suportado." }, { status: 400 });
  }

  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, buffer);

  return Response.json({
    src: `/uploads/${fileName}`,
  });
}
