import { browser } from "wxt/browser";

/** User-configured limits. `timeLimit` is in minutes. Field names match the storage keys. */
export type Settings = {
	viewLimit: number;
	timeLimit: number;
};

export const DEFAULT_SETTINGS: Settings = {
	viewLimit: 5,
	timeLimit: 5,
};

export async function loadSettings(): Promise<Settings> {
	const stored = await browser.storage.local.get(["viewLimit", "timeLimit"]);
	return {
		viewLimit:
			typeof stored.viewLimit === "number"
				? stored.viewLimit
				: DEFAULT_SETTINGS.viewLimit,
		timeLimit:
			typeof stored.timeLimit === "number"
				? stored.timeLimit
				: DEFAULT_SETTINGS.timeLimit,
	};
}

export async function saveSettings(settings: Settings): Promise<void> {
	await browser.storage.local.set(settings);
}
