import type { MouseEvent } from 'react';

const MENU_CLOSE_MS = 360;

export function scrollToSection(hash: string): boolean {
  const id = hash.replace(/^#/, '').trim();

  if (!id) {
    window.scrollTo({ top: 0, behavior: 'auto' });
    window.history.replaceState(null, '', window.location.pathname);
    return true;
  }

  const target = document.getElementById(id);
  if (!target) {
    return false;
  }

  target.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
  window.history.replaceState(null, '', `#${id}`);
  return true;
}

function scheduleScrollToSection(hash: string): void {
  window.setTimeout(() => {
    const found = scrollToSection(hash);
    const id = hash.replace(/^#/, '').trim();
    const target = id ? document.getElementById(id) : null;

    // #region agent log
    fetch('http://127.0.0.1:7518/ingest/60af46bd-a9d9-461f-8498-d4bf9d98495d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '465c74' },
      body: JSON.stringify({
        sessionId: '465c74',
        runId: 'scroll-fix-v2',
        hypothesisId: 'E-F',
        location: 'scrollToSection.ts:scheduleScrollToSection',
        message: 'deferred scrollIntoView',
        data: {
          hash,
          found,
          scrollY: window.scrollY,
          targetTop: target?.getBoundingClientRect().top ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, MENU_CLOSE_MS);
}

export function handleInPageNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onAfterNavigate?: () => void,
): void {
  if (!href.startsWith('#')) {
    return;
  }

  event.preventDefault();
  onAfterNavigate?.();
  scheduleScrollToSection(href);
}
