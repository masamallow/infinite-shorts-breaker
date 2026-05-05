function showToast(text: string, durationMs = 5000) {
  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.textContent = text; // As a best practice to prevent the creation of XSS injection vectors.
  Object.assign(toast.style, {
    position: 'fixed',
    top: '15px',
    right: '15px',
    padding: '25px',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #73a5ff, #5477f5)',
    boxShadow: '0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(77, 96, 232, 0.3)',
    borderRadius: '2px',
    fontSize: 'x-large',
    maxWidth: 'calc(50% - 20px)',
    zIndex: '2147483647',
    pointerEvents: 'none',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(toast);

  // TODO maybe fix; This was set to be discarded upon page transition.
  setTimeout(() => toast.remove(), durationMs);
}

export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  runAt: 'document_start',
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

    function triggerStop(reason: string) {
      showToast(`InfiniteShortsBreaker: ${reason}`);
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
