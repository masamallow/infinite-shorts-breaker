import { describe, expect, it } from "vitest";
import {
	isShortsPath,
	isTimeLimitExceeded,
	isViewLimitExceeded,
} from "@/utils/limits";

describe("isViewLimitExceeded", () => {
	it("returns false when the view count equals the limit", () => {
		expect(isViewLimitExceeded(5, 5)).toBe(false);
	});

	it("returns true when the view count is above the limit", () => {
		expect(isViewLimitExceeded(6, 5)).toBe(true);
	});

	it("returns false when the view count is below the limit", () => {
		expect(isViewLimitExceeded(4, 5)).toBe(false);
	});

	it("allows exactly one view when the limit is 1", () => {
		expect(isViewLimitExceeded(1, 1)).toBe(false);
		expect(isViewLimitExceeded(2, 1)).toBe(true);
	});
});

describe("isTimeLimitExceeded", () => {
	const FIVE_MINUTES_MS = 5 * 60_000;

	it("returns false just before the limit", () => {
		expect(isTimeLimitExceeded(0, FIVE_MINUTES_MS - 1, 5)).toBe(false);
	});

	it("returns true exactly at the limit", () => {
		expect(isTimeLimitExceeded(0, FIVE_MINUTES_MS, 5)).toBe(true);
	});

	it("returns true after the limit", () => {
		expect(isTimeLimitExceeded(0, FIVE_MINUTES_MS + 1, 5)).toBe(true);
	});

	it("scales with the configured minutes", () => {
		expect(isTimeLimitExceeded(0, 60_000 - 1, 1)).toBe(false);
		expect(isTimeLimitExceeded(0, 60_000, 1)).toBe(true);
	});

	it("measures elapsed time from the start timestamp", () => {
		const start = 1_000_000;
		expect(isTimeLimitExceeded(start, start + FIVE_MINUTES_MS - 1, 5)).toBe(
			false,
		);
		expect(isTimeLimitExceeded(start, start + FIVE_MINUTES_MS, 5)).toBe(true);
	});
});

describe("isShortsPath", () => {
	it("matches Shorts video pages", () => {
		expect(isShortsPath("/shorts/abc123")).toBe(true);
		expect(isShortsPath("/shorts/")).toBe(true);
	});

	it("does not match other YouTube pages", () => {
		expect(isShortsPath("/watch")).toBe(false);
		expect(isShortsPath("/")).toBe(false);
		expect(isShortsPath("/shortsy/x")).toBe(false);
		expect(isShortsPath("/feed/shorts")).toBe(false);
	});

	it("does not match /shorts without a trailing slash (current behavior)", () => {
		expect(isShortsPath("/shorts")).toBe(false);
	});
});
