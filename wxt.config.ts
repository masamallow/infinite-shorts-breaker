import {defineConfig} from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    // name: 'Infinite Shorts Breaker: Set viewing and time limits!',
    name: "__MSG_extName__",
    version: '0.1.2',
    description: "__MSG_extDescription__",
    permissions: ['storage'],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    default_locale: 'en',
  },
  srcDir: "src",
  vite: () => ({
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }),
});
