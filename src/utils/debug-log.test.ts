import { afterEach, describe, expect, it, vi } from "vitest";
import { debugLog } from "@/utils/debug-log";

describe("debugLog", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	it("writes to the console in development", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => {});

		debugLog("[Test] value =", 1);

		expect(log).toHaveBeenCalledWith("[Test] value =", 1);
	});

	it("stays silent in production", () => {
		vi.stubEnv("DEV", false);
		const log = vi.spyOn(console, "log").mockImplementation(() => {});

		debugLog("[Test] value =", 1);

		expect(log).not.toHaveBeenCalled();
	});
});
