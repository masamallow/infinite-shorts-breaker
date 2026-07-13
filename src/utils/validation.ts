/** Parses a limit input. Returns the integer (>= 1), or null when invalid. */
export function parsePositiveInteger(raw: string): number | null {
	const value = Number(raw);
	return Number.isInteger(value) && value >= 1 ? value : null;
}
