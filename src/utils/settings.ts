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

function isPositiveInteger(value: unknown): value is number {
	return typeof value === "number" && Number.isInteger(value) && value >= 1;
}

export async function loadSettings(): Promise<Settings> {
	const stored = await browser.storage.local.get(["viewLimit", "timeLimit"]);
	return {
		viewLimit: isPositiveInteger(stored.viewLimit)
			? stored.viewLimit
			: DEFAULT_SETTINGS.viewLimit,
		timeLimit: isPositiveInteger(stored.timeLimit)
			? stored.timeLimit
			: DEFAULT_SETTINGS.timeLimit,
	};
}

export async function saveSettings(settings: Settings): Promise<void> {
	await browser.storage.local.set(settings);
}
