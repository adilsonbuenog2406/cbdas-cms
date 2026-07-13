import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDeploymentTmpDir, publishedLandingPath, siteDistPublicDir, uploadsDir } from "./paths";
import { createDeploymentManifest } from "./create-manifest";
import { validateRelease } from "./validate-release";
import { DeploymentError } from "./types";

const publishedRuntimeStyle = `
<style id="cms-published-runtime-style">
  header.fixed {
    position: absolute !important;
  }

  header.fixed .header-dropdown-shell[data-cms-menu-open="true"] {
    display: block !important;
  }

  header.fixed .header-dropdown-shell[data-cms-menu-open="false"] {
    display: none !important;
  }

  @media (max-width: 1023px) {
    header.fixed .cms-mobile-header-menu[data-cms-menu-open="true"] {
      display: block !important;
    }

    header.fixed .cms-mobile-header-menu[data-cms-menu-open="false"] {
      display: none !important;
    }
  }

  [data-cbdas-shortcuts-art] {
    opacity: 1 !important;
    transform: none !important;
  }
</style>`;

const publishedRuntimeScript = `
<script id="cms-published-runtime-script">
(function () {
  var headerMenuItems = [
    { label: "Inscrições", href: "#inscricoes" },
    { label: "Programação", href: "#programacao" },
    { label: "Oficinas", href: "#oficinas" },
    { label: "Palestrantes Confirmados", href: "#palestrantes" },
    { label: "Patrocinadores", href: "#patrocinadores" },
    { label: "Submissão de Artigos", href: "#artigos-cientificos" },
    { label: "Guia", href: "#guia-cbdas" },
    { label: "Local", href: "#local" },
    { label: "Contato", href: "#contato" }
  ];

  function closeMenus(header) {
    header.querySelectorAll("button[aria-label*='menu'], .header-desktop-toggle").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });

    header.querySelectorAll("[data-cms-menu-open]").forEach(function (menu) {
      menu.setAttribute("data-cms-menu-open", "false");
    });
  }

  function buildDesktopDropdown() {
    var shell = document.createElement("div");
    shell.className = "header-dropdown-shell hidden lg:block";
    shell.setAttribute("data-cms-menu-open", "false");
    shell.innerHTML =
      '<div class="header-dropdown-wrap container mx-auto px-4 md:px-6">' +
        '<div class="header-dropdown-panel w-full p-5 md:p-6">' +
          '<div class="header-dropdown-grid grid gap-3 md:grid-cols-2">' +
            headerMenuItems.map(function (item) {
              return '<a data-cbdas-header-menu-option="true" href="' + item.href + '" class="header-dropdown-link type-nav rounded-2xl px-4 py-3 text-idasan-blue transition-colors hover:text-idasan-blue">' + item.label + '</a>';
            }).join("") +
            '<a data-cbdas-header-menu-option="true" href="https://docs.google.com/forms/d/e/1FAIpQLSczNtrBcQndorRXiGjOzr9X2pCgn4PlsxqT9zxMHquvpoaQHQ/viewform" target="_blank" rel="noopener noreferrer" class="header-dropdown-link type-nav flex items-center justify-between rounded-2xl px-4 py-3 text-idasan-blue transition-colors hover:text-idasan-blue">Seja um patrocinador</a>' +
          '</div>' +
          '<div class="header-dropdown-action mt-5 flex justify-center">' +
            '<a data-cbdas-header-menu-option="true" href="https://www.eventweb.com.br/iii_cbdas/home-event/" class="inline-flex items-center justify-center rounded-full bg-idasan-yellow px-6 py-3 type-button text-idasan-blue shadow-sm">Inscreva-se</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    return shell;
  }

  function buildMobileDropdown() {
    var shell = document.createElement("div");
    shell.className = "cms-mobile-header-menu overflow-hidden border-t border-gray-100 bg-white lg:hidden";
    shell.setAttribute("data-cms-menu-open", "false");
    shell.innerHTML =
      '<div class="container mx-auto flex flex-col gap-4 px-4 py-6">' +
        headerMenuItems.map(function (item) {
          return '<a href="' + item.href + '" class="type-nav border-b border-gray-50 py-2 text-idasan-blue">' + item.label + '</a>';
        }).join("") +
        '<a href="https://docs.google.com/forms/d/e/1FAIpQLSczNtrBcQndorRXiGjOzr9X2pCgn4PlsxqT9zxMHquvpoaQHQ/viewform" target="_blank" rel="noopener noreferrer" class="type-nav border-b border-gray-50 py-2 text-idasan-blue">Seja um patrocinador</a>' +
        '<a href="https://www.eventweb.com.br/iii_cbdas/home-event/" class="type-button mt-4 inline-flex items-center justify-center rounded-full bg-idasan-yellow px-6 py-3 text-idasan-blue">Inscreva-se</a>' +
      '</div>';

    return shell;
  }

  function ensureHeaderMenus(header) {
    var desktop = header.querySelector(".header-dropdown-shell");
    var mobile = header.querySelector(".cms-mobile-header-menu");

    if (!desktop) {
      desktop = buildDesktopDropdown();
      header.appendChild(desktop);
    } else {
      desktop.setAttribute("data-cms-menu-open", "false");
    }

    if (!mobile) {
      mobile = buildMobileDropdown();
      header.appendChild(mobile);
    }

    return { desktop: desktop, mobile: mobile };
  }

  function installHeaderMenu() {
    var header = document.querySelector("header.fixed");

    if (!header) {
      return;
    }

    var menus = ensureHeaderMenus(header);

    header.querySelectorAll("button[aria-label*='menu'], .header-desktop-toggle").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var isOpen = button.getAttribute("aria-expanded") === "true";
        var nextValue = isOpen ? "false" : "true";

        header.querySelectorAll("button[aria-label*='menu'], .header-desktop-toggle").forEach(function (currentButton) {
          currentButton.setAttribute("aria-expanded", nextValue);
        });

        menus.desktop.setAttribute("data-cms-menu-open", nextValue);
        menus.mobile.setAttribute("data-cms-menu-open", nextValue);
      });
    });

    header.querySelectorAll(".header-dropdown-shell a, .cms-mobile-header-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenus(header);
      });
    });

    document.addEventListener("click", function (event) {
      if (!header.contains(event.target)) {
        closeMenus(header);
      }
    });
  }

  function installCongressActionsMobileMenu() {
    var button = document.querySelector('[aria-controls="mobile-congress-actions-menu"]');
    var menu = document.getElementById("mobile-congress-actions-menu");

    if (!button || !menu) {
      return;
    }

    menu.style.display = "none";
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      menu.style.display = isOpen ? "none" : "block";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    installHeaderMenu();
    installCongressActionsMobileMenu();
  });
})();
</script>`;

function injectBeforeClosingTag(html: string, closingTag: string, content: string) {
  if (html.includes(content.trim().slice(0, 48))) {
    return html;
  }

  return html.includes(closingTag)
    ? html.replace(closingTag, `${content}\n${closingTag}`)
    : `${html}\n${content}`;
}

export function rewritePublishedHtml(html: string, deploymentId: string) {
  const deploymentMeta = `<meta name="cms-deployment-id" content="${deploymentId}">`;
  const htmlWithMeta = html.includes('name="cms-deployment-id"')
    ? html.replace(
        /<meta\s+name="cms-deployment-id"\s+content="[^"]*"\s*\/?>/i,
        deploymentMeta,
      )
    : html.replace("</head>", `    ${deploymentMeta}\n  </head>`);

  const htmlWithRuntime = injectBeforeClosingTag(
    injectBeforeClosingTag(htmlWithMeta, "</head>", publishedRuntimeStyle),
    "</body>",
    publishedRuntimeScript,
  );

  return htmlWithRuntime
    .replaceAll('url("/assets/', 'url("assets/')
    .replaceAll("url('/assets/", "url('assets/")
    .replaceAll("url(/assets/", "url(assets/")
    .replaceAll('src="/assets/', 'src="assets/')
    .replaceAll('href="/assets/', 'href="assets/')
    .replaceAll('src="/uploads/', 'src="uploads/')
    .replaceAll('href="/uploads/', 'href="uploads/')
    .replaceAll('src="/tailwind-browser.js"', 'src="tailwind-browser.js"')
    .replaceAll('href="/logodark.webp"', 'href="logodark.webp"')
    .replaceAll('href="/', 'href="../')
    .replaceAll('src="/', 'src="../');
}

export async function buildRelease(deploymentId: string) {
  const releaseDir = getDeploymentTmpDir(deploymentId);

  await rm(releaseDir, { recursive: true, force: true });
  await mkdir(releaseDir, { recursive: true });

  try {
    await cp(siteDistPublicDir, releaseDir, {
      recursive: true,
      filter: (source) =>
        !source.endsWith(".map") &&
        !source.includes(`${path.sep}.git${path.sep}`) &&
        !source.includes(`${path.sep}node_modules${path.sep}`),
    });
  } catch {
    throw new DeploymentError(
      "RELEASE_BUILD_FAILED",
      "Build sincronizado do site não encontrado. Execute pnpm build:cms.",
    );
  }

  let landingHtml: string;

  try {
    landingHtml = await readFile(publishedLandingPath, "utf8");
  } catch {
    throw new DeploymentError(
      "RELEASE_BUILD_FAILED",
      "Nenhuma landing salva foi encontrada em data/landing.html.",
    );
  }

  await writeFile(
    path.join(releaseDir, "index.html"),
    rewritePublishedHtml(landingHtml, deploymentId),
    "utf8",
  );

  await cp(uploadsDir, path.join(releaseDir, "uploads"), {
    recursive: true,
    force: true,
  }).catch(() => {});

  const { manifest, manifestHash } = await createDeploymentManifest(releaseDir, deploymentId);
  await validateRelease(releaseDir, manifest);

  return {
    releaseDir,
    manifest,
    manifestHash,
  };
}
