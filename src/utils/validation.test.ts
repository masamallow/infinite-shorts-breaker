import { describe, expect, it } from "vitest";
import { parsePositiveInteger } from "@/utils/validation";

describe("parsePositiveInteger", () => {
	it("parses positive integers", () => {
		expect(parsePositiveInteger("5")).toBe(5);
		expect(parsePositiveInteger("1")).toBe(1);
	});

	it("rejects zero and negative numbers", () => {
		expect(parsePositiveInteger("0")).toBe(null);
		expect(parsePositiveInteger("-3")).toBe(null);
	});

	it("rejects non-integers", () => {
		expect(parsePositiveInteger("3.5")).toBe(null);
	});

	it("rejects empty and non-numeric input", () => {
		expect(parsePositiveInteger("")).toBe(null);
		expect(parsePositiveInteger("abc")).toBe(null);
		expect(parsePositiveInteger("Infinity")).toBe(null);
	});

	it("follows Number() coercion rules (current behavior)", () => {
		expect(parsePositiveInteger("  7 ")).toBe(7);
		expect(parsePositiveInteger("1e2")).toBe(100);
	});
});
