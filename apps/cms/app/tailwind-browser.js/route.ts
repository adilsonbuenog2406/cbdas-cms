import { readFile } from "node:fs/promises";
import path from "node:path";

const tailwindBrowserPath = path.resolve(process.cwd(), "public/site-dist/tailwind-browser.js");

export async function GET() {
  try {
    const file = await readFile(tailwindBrowserPath);

    return new Response(file, {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "content-type": "text/javascript; charset=utf-8",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
