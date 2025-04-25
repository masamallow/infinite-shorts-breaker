export default defineContentScript({
  matches: ['*://www.youtube.com/*'],
  runAt: 'document_start',
  async main() {
    console.log('[ContentScript] YouTube Shorts content script loaded.');

    let started = false;
    let scrollLimit = 5;
    let timeLimit = 10;
    let viewCount = 0;
    let timerId: number | undefined;

    chrome.storage.local.get(['scrollLimit', 'timeLimit'], res => {
      scrollLimit = res.scrollLimit ?? scrollLimit;
      timeLimit = res.timeLimit ?? timeLimit;
    });

    function startTimer() {
      const start = Date.now();
      timerId = window.setInterval(() => {
        if ((Date.now() - start) >= timeLimit * 60_000) {
          triggerStop('Time limit exceeded');
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
      if (viewCount >= scrollLimit) {
        triggerStop('Scroll limit exceeded');
      }
    }

    function triggerStop(reason: string) {
      alert(`Infinite Scroll Breaker: ${reason}`);
      cleanup();
      window.location.href = 'https://www.youtube.com/';
    }

    function cleanup() {
      console.log('[Limiter] cleanup');
      if (timerId !== undefined) {
        clearInterval(timerId);
        timerId = undefined;
      }
      viewCount = 0;
      started = false;
    }

    // triggered when new/refreshed pages
    window.addEventListener('yt-navigate-finish', onNavigate);
  },
});
