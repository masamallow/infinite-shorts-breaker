import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

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
      Toastify({
        text: `InfiniteShortsBreaker: ${reason}`,
        duration: 5000,
        ariaLive: 'assertive',
        style: {
          fontSize: 'x-large',
          alignContent: 'center',
          padding: '25px',
        },
      }).showToast();
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
