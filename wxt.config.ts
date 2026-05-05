import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	manifest: {
		// name: 'Infinite Shorts Breaker: Set viewing and time limits!',
		name: "__MSG_extName__",
		description: "__MSG_extDescription__",
		permissions: ["storage"],
		content_security_policy: {
			extension_pages: "script-src 'self'; object-src 'self';",
		},
		default_locale: "en",
		// Required for Popover API (showPopover) and Promise-based chrome.storage.
		minimum_chrome_version: "114",
		browser_specific_settings: {
			// For Firefox (Gecko engine)
			gecko: {
				strict_min_version: "125.0",
			},
		},
	},
	srcDir: "src",
	vite: () => ({
		esbuild: {
			drop: ["console", "debugger"],
		},
	}),
});
