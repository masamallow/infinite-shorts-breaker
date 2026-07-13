/** True once more Shorts than the allowed number have been viewed (strictly greater). */
export function isViewLimitExceeded(
	viewCount: number,
	maxViews: number,
): boolean {
	return viewCount > maxViews;
}

/** True when elapsed wall-clock time has reached the limit (inclusive). */
export function isTimeLimitExceeded(
	startedAtMs: number,
	nowMs: number,
	maxMinutes: number,
): boolean {
	return nowMs - startedAtMs >= maxMinutes * 60_000;
}

/** True when a location.pathname points at a YouTube Shorts page. */
export function isShortsPath(pathname: string): boolean {
	return pathname.startsWith("/shorts/");
}
