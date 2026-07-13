import { readFile } from "node:fs/promises";
import path from "node:path";

const siteIndexPath = path.resolve(process.cwd(), "public/site-dist/index.html");

const editorFlagScript = `<script>
window.__CBDAS_EDITOR_CANVAS__ = true;
window.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    window.setTimeout(() => {
      this.callback(
        [
          {
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target,
            time: performance.now()
          }
        ],
        this
      );
    }, 0);
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};
</script>`;

const snapshotScript = `<script>
(function () {
  var expectedSectionSelectors = [
    "#programacao",
    "#oficinas",
    "#inscricoes",
    "#empenho",
    "#artigos-cientificos",
    "#inscricoes-descontos",
    "#palestrantes",
    "#guia-cbdas",
    "#local",
    "#patrocinadores",
    "#contato"
  ];

  function normalizeUrlAttribute(element, attributeName) {
    var value = element.getAttribute(attributeName);

    if (!value || value.indexOf(window.location.origin + "/") !== 0) {
      return;
    }

    element.setAttribute(attributeName, value.slice(window.location.origin.length));
  }

  function postSnapshot(attempt) {
    var root = document.getElementById("root");

    if (!root) {
      retry(attempt);
      return;
    }

    var text = root.textContent || "";
    var isStillLoading = text.indexOf("Carregando") !== -1 && text.length < 80;
    var missingSections = expectedSectionSelectors.filter(function (selector) {
      return !root.querySelector(selector);
    });

    if ((isStillLoading || missingSections.length > 0) && attempt < 120) {
      retry(attempt);
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
        html: clone.outerHTML,
        missingSections: missingSections
      },
      window.location.origin
    );
  }

  function retry(attempt) {
    window.setTimeout(function () {
      postSnapshot(attempt + 1);
    }, 100);
  }

  window.setTimeout(function () {
    postSnapshot(0);
  }, 200);
})();
</script>`;

function rewriteDistUrls(html: string) {
  return html
    .replaceAll('src="./assets/', 'src="/assets/')
    .replaceAll('href="./assets/', 'href="/assets/')
    .replaceAll('src="./tailwind-browser.js"', 'src="/tailwind-browser.js"')
    .replaceAll('href="./logodark.webp"', 'href="/logodark.webp"');
}

function injectEditorScripts(html: string) {
  return html
    .replace("</head>", `${editorFlagScript}</head>`)
    .replace("</body>", `${snapshotScript}</body>`);
}

export async function GET() {
  try {
    const html = injectEditorScripts(rewriteDistUrls(await readFile(siteIndexPath, "utf8")));

    return new Response(html, {
      headers: {
        "cache-control": "no-store",
        "content-type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Failed to render editor site source", error);

    return new Response("Site build not found. Run pnpm --filter site build.", {
      status: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }
}
