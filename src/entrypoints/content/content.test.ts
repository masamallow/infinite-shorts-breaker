/** @vitest-environment happy-dom */
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	vi,
} from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { ContentScriptContext } from "wxt/utils/content-script-context";
import contentScript from "../content";

const { createShadowRootUiMock } = vi.hoisted(() => ({
	createShadowRootUiMock:
		vi.fn<
			(
				ctx: unknown,
				options: { onMount: (container: HTMLElement) => void },
			) => Promise<{ mount: () => void; remove: () => void }>
		>(),
}));

// Mock the real module path behind the createShadowRootUi auto-import so the
// toast UI (shadow DOM + Popover API) is not exercised in happy-dom.
vi.mock("wxt/utils/content-script-ui/shadow-root", () => ({
	createShadowRootUi: createShadowRootUiMock,
}));

let ctx: ContentScriptContext | undefined;
let uiMock: { mount: Mock<() => void>; remove: Mock<() => void> };
let hrefSetSpy: ReturnType<typeof spyOnLocationHrefSetter>;

/**
 * Spies on the location.href setter (and neutralizes it) so the redirect in
 * triggerStop can be asserted without happy-dom performing a navigation.
 */
function spyOnLocationHrefSetter() {
	const target = Object.getOwnPropertyDescriptor(window.location, "href")
		? window.location
		: (Object.getPrototypeOf(window.location) as Location);
	return vi.spyOn(target, "href", "set").mockImplementation(() => {});
}

async function flushAsyncWork() {
	for (let i = 0; i < 10; i++) {
		await Promise.resolve();
	}
}

async function startContentScript() {
	ctx = new ContentScriptContext("content-test");
	await contentScript.main(ctx);
	// The content script runs at document_start and waits for DOMContentLoaded.
	if (document.readyState === "loading") {
		document.dispatchEvent(new Event("DOMContentLoaded"));
	}
	await flushAsyncWork();
}

/** Simulates a YouTube SPA navigation to the given path. */
function navigateTo(pathname: string) {
	window.history.replaceState({}, "", pathname);
	window.dispatchEvent(new Event("yt-navigate-finish"));
}

async function getPendingToast() {
	const { pendingToast } = await fakeBrowser.storage.local.get("pendingToast");
	return pendingToast;
}

describe("content script", () => {
	beforeEach(() => {
		fakeBrowser.reset();
		// fakeBrowser does not implement i18n; echo the key back as the message.
		fakeBrowser.i18n.getMessage = vi.fn((key: string) => key);
		uiMock = { mount: vi.fn<() => void>(), remove: vi.fn<() => void>() };
		createShadowRootUiMock.mockReset();
		createShadowRootUiMock.mockResolvedValue(uiMock);
		hrefSetSpy = spyOnLocationHrefSetter();
		window.history.replaceState({}, "", "/");
	});

	afterEach(() => {
		ctx?.abort("test finished");
		ctx = undefined;
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("counts Shorts views and stops once the stored view limit is exceeded", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: 2, timeLimit: 999 });
		await startContentScript();

		navigateTo("/shorts/a");
		navigateTo("/shorts/b");
		await flushAsyncWork();
		expect(await getPendingToast()).toBeUndefined();
		expect(hrefSetSpy).not.toHaveBeenCalled();

		navigateTo("/shorts/c");
		await vi.waitFor(async () => {
			expect(await getPendingToast()).toMatchObject({
				reason: "toast_view_exceeded",
			});
			expect(hrefSetSpy).toHaveBeenCalledWith("https://www.youtube.com/");
		});
	});

	it("resets the view count when navigating away from Shorts", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: 2, timeLimit: 999 });
		await startContentScript();

		navigateTo("/shorts/a");
		navigateTo("/shorts/b");
		navigateTo("/watch");
		navigateTo("/shorts/c");
		navigateTo("/shorts/d");
		await flushAsyncWork();

		expect(await getPendingToast()).toBeUndefined();
		expect(hrefSetSpy).not.toHaveBeenCalled();
	});

	it("stops when the watch time reaches the stored time limit", async () => {
		vi.useFakeTimers();
		await fakeBrowser.storage.local.set({ viewLimit: 999, timeLimit: 1 });
		await startContentScript();

		navigateTo("/shorts/a");
		await vi.advanceTimersByTimeAsync(50_000);
		expect(await getPendingToast()).toBeUndefined();

		await vi.advanceTimersByTimeAsync(10_000);
		expect(await getPendingToast()).toMatchObject({
			reason: "toast_time_exceeded",
		});
		expect(hrefSetSpy).toHaveBeenCalledWith("https://www.youtube.com/");

		// cleanup() cleared the interval, so no new toast is written.
		await fakeBrowser.storage.local.remove("pendingToast");
		await vi.advanceTimersByTimeAsync(60_000);
		expect(await getPendingToast()).toBeUndefined();
	});

	it("shows a valid pending toast once and consumes it", async () => {
		HTMLElement.prototype.showPopover = vi.fn();
		await fakeBrowser.storage.local.set({
			pendingToast: { reason: "hello", expiresAt: Date.now() + 60_000 },
		});

		await startContentScript();

		await vi.waitFor(() => {
			expect(createShadowRootUiMock).toHaveBeenCalledTimes(1);
			expect(uiMock.mount).toHaveBeenCalledTimes(1);
		});
		expect(await getPendingToast()).toBeUndefined();

		// Run the captured onMount to verify the rendered message text.
		const options = createShadowRootUiMock.mock.calls[0][1];
		const container = document.createElement("div");
		options.onMount(container);
		expect(container.firstElementChild?.textContent).toBe(
			"InfiniteShortsBreaker: hello",
		);
	});

	it("consumes an expired pending toast without showing it", async () => {
		await fakeBrowser.storage.local.set({
			pendingToast: { reason: "old", expiresAt: Date.now() - 1 },
		});

		await startContentScript();

		expect(await getPendingToast()).toBeUndefined();
		expect(createShadowRootUiMock).not.toHaveBeenCalled();
	});

	it("consumes a malformed pending toast without showing it", async () => {
		await fakeBrowser.storage.local.set({
			pendingToast: { bogus: true },
		});

		await startContentScript();

		expect(await getPendingToast()).toBeUndefined();
		expect(createShadowRootUiMock).not.toHaveBeenCalled();
	});
});
