import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";

const sessionCookieName = "cms_session";
const dataDir = path.resolve(process.cwd(), "data");
const savedProjectPath = path.join(dataDir, "landing.grapes.json");
const publishedLandingPath = path.join(dataDir, "landing.html");

function renderDocument(html: string, css: string, siteCssHref?: string) {
  const siteStylesheet = siteCssHref
    ? `    <link rel="stylesheet" crossorigin href="${siteCssHref}" />\n`
    : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
${siteStylesheet}    <link rel="icon" type="image/webp" sizes="192x192" href="/logodark.webp" />
    <title>IDASAN | III CBDAS</title>
    <style>${css}</style>
  </head>
  <body>
${html}
  </body>
</html>`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (cookieStore.get(sessionCookieName)?.value !== "ok") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    html?: unknown;
    css?: unknown;
    mode?: unknown;
    siteCssHref?: unknown;
  };

  if (typeof payload.html !== "string" || typeof payload.css !== "string") {
    return Response.json({ error: "Invalid editor payload" }, { status: 400 });
  }

  const siteCssHref =
    payload.mode === "original-site" && typeof payload.siteCssHref === "string"
      ? payload.siteCssHref
      : undefined;

  await mkdir(dataDir, { recursive: true });
  await Promise.all([
    writeFile(
      savedProjectPath,
      JSON.stringify(
        {
          html: payload.html,
          css: payload.css,
          mode: payload.mode,
          siteCssHref,
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      "utf8",
    ),
    writeFile(publishedLandingPath, renderDocument(payload.html, payload.css, siteCssHref), "utf8"),
  ]);

  return Response.json({ ok: true });
}
