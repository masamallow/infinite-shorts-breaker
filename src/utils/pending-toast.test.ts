import { describe, expect, it } from "vitest";
import {
	createPendingToast,
	isPendingToast,
	isPendingToastExpired,
	PENDING_TOAST_TTL_MS,
} from "@/utils/pending-toast";

describe("isPendingToast", () => {
	it("accepts a well-formed pending toast", () => {
		expect(isPendingToast({ reason: "x", expiresAt: 1 })).toBe(true);
	});

	it("accepts extra properties", () => {
		expect(isPendingToast({ reason: "x", expiresAt: 1, extra: true })).toBe(
			true,
		);
	});

	it("rejects null, undefined, and primitives", () => {
		expect(isPendingToast(null)).toBe(false);
		expect(isPendingToast(undefined)).toBe(false);
		expect(isPendingToast("reason")).toBe(false);
		expect(isPendingToast(42)).toBe(false);
	});

	it("rejects objects with missing or wrongly typed fields", () => {
		expect(isPendingToast({})).toBe(false);
		expect(isPendingToast({ reason: "x" })).toBe(false);
		expect(isPendingToast({ expiresAt: 1 })).toBe(false);
		expect(isPendingToast({ reason: 1, expiresAt: 1 })).toBe(false);
		expect(isPendingToast({ reason: "x", expiresAt: "1" })).toBe(false);
	});
});

describe("createPendingToast", () => {
	it("sets expiresAt to now plus the TTL", () => {
		const toast = createPendingToast("time limit", 1_000);
		expect(toast).toEqual({
			reason: "time limit",
			expiresAt: 1_000 + PENDING_TOAST_TTL_MS,
		});
	});

	it("uses a 5 minute TTL", () => {
		expect(PENDING_TOAST_TTL_MS).toBe(5 * 60_000);
	});
});

describe("isPendingToastExpired", () => {
	const toast = { reason: "x", expiresAt: 10_000 };

	it("is not expired exactly at expiresAt (strict comparison)", () => {
		expect(isPendingToastExpired(toast, 10_000)).toBe(false);
	});

	it("is expired one millisecond after expiresAt", () => {
		expect(isPendingToastExpired(toast, 10_001)).toBe(true);
	});

	it("is not expired before expiresAt", () => {
		expect(isPendingToastExpired(toast, 9_999)).toBe(false);
	});
});
