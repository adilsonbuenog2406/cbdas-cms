import { readFile } from "node:fs/promises";
import path from "node:path";

const logoPath = path.resolve(process.cwd(), "public/site-dist/logodark.webp");

export async function GET() {
  try {
    const file = await readFile(logoPath);

    return new Response(file, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": "image/webp",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
