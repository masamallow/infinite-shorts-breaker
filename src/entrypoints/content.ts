import './content/style.css';

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
          el.textContent = text; // As a best practice to prevent the creation of XSS injection vectors.
          container.appendChild(el);
        },
      });
      ui.mount();

      // TODO maybe fix; This was set to be discarded upon page transition.
      ctx.setTimeout(() => ui.remove(), durationMs);
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
      await showToast(`InfiniteShortsBreaker: ${reason}`);
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
