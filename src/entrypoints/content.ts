import {
	isShortsPath,
	isTimeLimitExceeded,
	isViewLimitExceeded,
} from "@/utils/limits";
import {
	createPendingToast,
	isPendingToast,
	isPendingToastExpired,
} from "@/utils/pending-toast";
import { DEFAULT_SETTINGS, loadSettings } from "@/utils/settings";
import "./content/style.css";

export default defineContentScript({
	matches: ["*://www.youtube.com/*"],
	runAt: "document_start",
	cssInjectionMode: "ui",
	async main(ctx) {
		console.log("[ContentScript] YouTube Shorts content script loaded.");

		let started = false;
		let maxViewLimit = DEFAULT_SETTINGS.viewLimit;
		let maxTimeLimitInMinutes = DEFAULT_SETTINGS.timeLimit;
		let viewCount = 0;
		let timerId: number | undefined;

		loadSettings().then((settings) => {
			maxViewLimit = settings.viewLimit;
			maxTimeLimitInMinutes = settings.timeLimit;
		});

		consumePendingToast();

		async function showToast(text: string, durationMs = 5000) {
			const ui = await createShadowRootUi(ctx, {
				name: "isb-toast",
				position: "inline",
				anchor: "body",
				isolateEvents: true,
				onMount(container) {
					const el = document.createElement("div");
					el.className = "toast";
					el.setAttribute("role", "alert");
					el.setAttribute("aria-live", "assertive");
					el.popover = "manual";
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
			if (document.readyState === "loading") {
				await new Promise<void>((resolve) =>
					document.addEventListener("DOMContentLoaded", () => resolve(), {
						once: true,
					}),
				);
			}
			const { pendingToast } = await browser.storage.local.get("pendingToast");
			if (pendingToast === undefined) return;
			await browser.storage.local.remove("pendingToast");
			if (!isPendingToast(pendingToast) || isPendingToastExpired(pendingToast))
				return;
			await showToast(`InfiniteShortsBreaker: ${pendingToast.reason}`);
		}

		function startTimer() {
			const start = Date.now();
			timerId = ctx.setInterval(() => {
				if (isTimeLimitExceeded(start, Date.now(), maxTimeLimitInMinutes)) {
					triggerStop(browser.i18n.getMessage("toast_time_exceeded"));
				}
			}, 10_000);
		}

		function onNavigate() {
			if (!isShortsPath(location.pathname)) {
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
			console.log("[Limiter] viewCount =", viewCount);
			if (isViewLimitExceeded(viewCount, maxViewLimit)) {
				triggerStop(browser.i18n.getMessage("toast_view_exceeded"));
			}
		}

		async function triggerStop(reason: string) {
			await browser.storage.local.set({
				pendingToast: createPendingToast(reason),
			});
			cleanup();
			window.location.href = "https://www.youtube.com/";
		}

		function cleanup() {
			console.log("[Limiter] cleanup");
			if (timerId !== undefined) {
				clearInterval(timerId);
				timerId = undefined;
			}
			viewCount = 0;
			started = false;
		}

		// triggered when new/refreshed pages
		ctx.addEventListener(window, "yt-navigate-finish", onNavigate);
	},
});
