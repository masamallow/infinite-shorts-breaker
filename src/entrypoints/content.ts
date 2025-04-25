export default defineContentScript({
  matches: ['*://www.youtube.com/shorts/*'],
  runAt: 'document_idle',
  async main() {
    console.log('[ContentScript] YouTube Shorts content script loaded.');

    // We'll store the settings here
    let scrollLimit = 5;
    let timeLimitInMinutes = 10;
    let scrollCount = 0;

    // Retrieve initial settings
    chrome.storage.local.get(['scrollLimit', 'timeLimit'], (result) => {
      if (result.scrollLimit !== undefined) {
        scrollLimit = result.scrollLimit;
      }
      if (result.timeLimit !== undefined) {
        timeLimitInMinutes = result.timeLimit;
      }
      console.log('[ContentScript] Loaded settings:', {scrollLimit, timeLimitInMinutes});
    });

    // Listen for changes to settings
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes.scrollLimit) {
          scrollLimit = changes.scrollLimit.newValue;
        }
        if (changes.timeLimit) {
          timeLimitInMinutes = changes.timeLimit.newValue;
        }
        console.log('[ContentScript] Updated settings:', {scrollLimit, timeLimitInMinutes});
      }
    });

    // Track time
    const startTime = Date.now();
    const checkTimeInterval = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsedMinutes = elapsedMs / (60_000);

      if (elapsedMinutes >= timeLimitInMinutes) {
        triggerStop('Time Limit exceeded');
      }
    }, 10_000); // check every 10 seconds

    // Track scroll changes
    window.addEventListener('wheel', () => {
      scrollCount++;
      console.log(`[ContentScript] Scroll count = ${scrollCount}`);
      if (scrollCount >= scrollLimit) {
        triggerStop('Scroll Limit exceeded');
      }
    });

    // This function stops the user from continuing
    function triggerStop(reason: string) {
      console.log(`[ContentScript] ${reason}, stopping...`);
      alert(`Infinite Scroll Breaker: ${reason}`);
      clearInterval(checkTimeInterval);

      // Option A: redirect to top page
      window.location.href = 'https://www.youtube.com/';

      // Option B: disable further scrolling
      // document.body.style.overflow = 'hidden';
    }
  },
});
