import {defineConfig} from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Infinite Shorts Breaker: Set viewing and time limits!',
    version: '0.1.0',
    description: 'Stop infinite scrolling on YouTube Shorts with configurable limits.',
    permissions: ['storage'],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    }
  },
  srcDir: "src",
  vite: () => ({
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }),
});
