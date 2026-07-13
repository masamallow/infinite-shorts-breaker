import { beforeEach, describe, expect, it } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/utils/settings";

describe("loadSettings", () => {
	beforeEach(() => {
		fakeBrowser.reset();
	});

	it("returns the defaults when storage is empty", async () => {
		expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
	});

	it("returns stored values", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: 12, timeLimit: 3 });

		expect(await loadSettings()).toEqual({ viewLimit: 12, timeLimit: 3 });
	});

	it("falls back per field when storage is partial", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: 12 });

		expect(await loadSettings()).toEqual({
			viewLimit: 12,
			timeLimit: DEFAULT_SETTINGS.timeLimit,
		});
	});

	it("ignores non-number stored values", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: "10", timeLimit: null });

		expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
	});
});

describe("saveSettings", () => {
	beforeEach(() => {
		fakeBrowser.reset();
	});

	it("persists the limits under the expected storage keys", async () => {
		await saveSettings({ viewLimit: 12, timeLimit: 3 });

		expect(
			await fakeBrowser.storage.local.get(["viewLimit", "timeLimit"]),
		).toEqual({ viewLimit: 12, timeLimit: 3 });
	});

	it("round-trips through loadSettings", async () => {
		await saveSettings({ viewLimit: 7, timeLimit: 20 });

		expect(await loadSettings()).toEqual({ viewLimit: 7, timeLimit: 20 });
	});
});
