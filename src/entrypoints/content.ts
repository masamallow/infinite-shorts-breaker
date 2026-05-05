import './content/style.css';

const PENDING_TOAST_TTL_MS = 5 * 60_000;

type PendingToast = { reason: string; expiresAt: number };

function isPendingToast(v: unknown): v is PendingToast {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as { reason?: unknown }).reason === 'string' &&
    typeof (v as { expiresAt?: unknown }).expiresAt === 'number'
  );
}

export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  runAt: 'document_start',
  cssInjectionMode: 'ui',
  async main(ctx) {
    console.log('[ContentScript] YouTube Shorts content script loaded.');

    let started = false;
    let maxViewLimit = 5;
    let maxTimeLimitInMinutes = 5;
    let viewCount = 0;
    let timerId: number | undefined;

    chrome.storage.local.get(['viewLimit', 'timeLimit'], res => {
      maxViewLimit = res.viewLimit ?? maxViewLimit;
      maxTimeLimitInMinutes = res.timeLimit ?? maxTimeLimitInMinutes;
    });

    consumePendingToast();

    async function showToast(text: string, durationMs = 5000) {
      const ui = await createShadowRootUi(ctx, {
        name: 'isb-toast',
        position: 'inline',
        anchor: 'body',
        isolateEvents: true,
        onMount(container) {
          const el = document.createElement('div');
          el.className = 'toast';
          el.setAttribute('role', 'alert');
          el.setAttribute('aria-live', 'assertive');
          el.popover = 'manual';
          el.textContent = text; // As a best practice to prevent the creation of XSS injection vectors.
          container.appendChild(el);
          el.showPopover();
        },
      });
      ui.mount();
      ctx.setTimeout(() => ui.remove(), durationMs);
    }

    async function consumePendingToast() {
      // Wait for body before showToast tries to anchor to it (runAt: 'document_start').
      if (document.readyState === 'loading') {
        await new Promise<void>(resolve => {
          document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
        });
      }
      const { pendingToast } = await chrome.storage.local.get('pendingToast');
      if (pendingToast === undefined) return;
      await chrome.storage.local.remove('pendingToast');
      if (!isPendingToast(pendingToast) || pendingToast.expiresAt < Date.now()) return;
      await showToast(`InfiniteShortsBreaker: ${pendingToast.reason}`);
    }

    function startTimer() {
      const start = Date.now();
      timerId = ctx.setInterval(() => {
        if ((Date.now() - start) >= maxTimeLimitInMinutes * 60_000) {
          triggerStop(browser.i18n.getMessage("toast_time_exceeded"));
        }
      }, 10_000);
    }

    function onNavigate() {
      if (!location.pathname.startsWith('/shorts/')) {
        // Cleanup when transition to other than Shorts
        cleanup();
        return;
      }
      if (!started) {
        // Timer starts when first short reaches
        started = true;
        startTimer();
      }

      viewCount++;
      console.log('[Limiter] viewCount =', viewCount);
      if (viewCount > maxViewLimit) {
        triggerStop(browser.i18n.getMessage("toast_view_exceeded"));
      }
    }

    async function triggerStop(reason: string) {
      await chrome.storage.local.set({
        pendingToast: { reason, expiresAt: Date.now() + PENDING_TOAST_TTL_MS },
      });
      cleanup();
      window.location.href = 'https://www.youtube.com/';
    }

    function cleanup() {
      console.log('[Limiter] cleanup');
      if (timerId !== undefined) {
        // TODO: Perhaps NOT necessary to clearInterval, because using ctx.setInterval()
        clearInterval(timerId);
        timerId = undefined;
      }
      viewCount = 0;
      started = false;
    }

    // triggered when new/refreshed pages
    ctx.addEventListener(window, 'yt-navigate-finish', onNavigate);
  },
});
