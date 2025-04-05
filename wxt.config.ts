import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: 'chrome',

  manifest: {
    manifest_version: 3,
    name: 'Infinite Scroll Breaker',
    version: '0.1.0',
    description: 'Stops infinite scrolling on YouTube Shorts',
  },
});
