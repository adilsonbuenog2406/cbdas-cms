import { readFile } from "node:fs/promises";
import path from "node:path";

const siteIndexPath = path.resolve(process.cwd(), "public/site-dist/index.html");

async function getSiteModuleSrc() {
  const html = await readFile(siteIndexPath, "utf8");
  const scriptMatch = html.match(/src="\.\/(assets\/index-[^"]+\.js)"/);

  if (!scriptMatch) {
    throw new Error("Site bundle not found");
  }

  return `/${scriptMatch[1]}`;
}

export async function GET() {
  try {
    const siteModuleSrc = await getSiteModuleSrc();

    return new Response(
      `
(function () {
  function normalizeUrlAttribute(element, attributeName) {
    var value = element.getAttribute(attributeName);

    if (!value || value.indexOf(window.location.origin + "/") !== 0) {
      return;
    }

    element.setAttribute(attributeName, value.slice(window.location.origin.length));
  }

  function snapshotSite(attempt) {
    var root = document.getElementById("root");

    if (!root) {
      return;
    }

    var text = root.textContent || "";
    var isStillLoading = text.indexOf("Carregando") !== -1 && text.length < 80;

    if (isStillLoading && attempt < 80) {
      window.setTimeout(function () {
        snapshotSite(attempt + 1);
      }, 100);
      return;
    }

    var clone = root.cloneNode(true);

    clone.querySelectorAll("[src]").forEach(function (element) {
      normalizeUrlAttribute(element, "src");
    });

    clone.querySelectorAll("[href]").forEach(function (element) {
      normalizeUrlAttribute(element, "href");
    });

    window.parent.postMessage(
      {
        type: "cbdas-site-snapshot",
        html: clone.outerHTML
      },
      window.location.origin
    );
  }

  window.__CBDAS_EDITOR_CANVAS__ = true;
  import(${JSON.stringify(siteModuleSrc)}).catch(function (error) {
    console.error("Failed to load CBDAS site bundle in editor", error);
  }).finally(function () {
    window.setTimeout(function () {
      snapshotSite(0);
    }, 200);
  });
})();
`,
      {
        headers: {
          "cache-control": "no-store",
          "content-type": "text/javascript; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error(error);

    return new Response("console.error('Site bundle not found');", {
      status: 500,
      headers: {
        "content-type": "text/javascript; charset=utf-8",
      },
    });
  }
}
