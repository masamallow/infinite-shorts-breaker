export const PENDING_TOAST_TTL_MS = 5 * 60_000;

export type PendingToast = { reason: string; expiresAt: number };

export function isPendingToast(v: unknown): v is PendingToast {
	return (
		typeof v === "object" &&
		v !== null &&
		typeof (v as { reason?: unknown }).reason === "string" &&
		typeof (v as { expiresAt?: unknown }).expiresAt === "number"
	);
}

export function createPendingToast(
	reason: string,
	nowMs = Date.now(),
): PendingToast {
	return { reason, expiresAt: nowMs + PENDING_TOAST_TTL_MS };
}

export function isPendingToastExpired(
	toast: PendingToast,
	nowMs = Date.now(),
): boolean {
	return toast.expiresAt < nowMs;
}
