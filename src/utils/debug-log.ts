export function debugLog(...args: unknown[]) {
	// biome-ignore lint/suspicious/noConsole: the one place allowed to write to the console
	if (import.meta.env.DEV) console.log(...args);
}
