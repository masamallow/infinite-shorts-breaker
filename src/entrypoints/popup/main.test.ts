/** @vitest-environment happy-dom */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing/fake-browser";
import popupHtml from "./index.html?raw";

/**
 * Mounts the real popup markup (minus its script tag) so the test breaks
 * if index.html and main.ts drift apart on element ids.
 */
function mountPopupDom() {
	const body = popupHtml.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? "";
	document.body.innerHTML = body.replace(/<script[\s\S]*?<\/script>/g, "");
}

function el<T extends HTMLElement>(id: string): T {
	const found = document.getElementById(id);
	if (!found) throw new Error(`missing #${id} in popup fixture`);
	return found as T;
}

async function loadPopup() {
	vi.resetModules();
	await import("./main");
}

function submitForm() {
	el<HTMLFormElement>("settings").dispatchEvent(
		new Event("submit", { bubbles: true, cancelable: true }),
	);
}

describe("popup", () => {
	beforeEach(() => {
		fakeBrowser.reset();
		// fakeBrowser does not implement i18n; stub the methods main.ts calls.
		fakeBrowser.i18n.getMessage = vi.fn(() => "");
		fakeBrowser.i18n.getUILanguage = vi.fn(() => "en");
		mountPopupDom();
	});

	it("falls back to English labels when no translation is available", async () => {
		await loadPopup();

		expect(el("popupTitle").textContent).toBe("Infinite Shorts Breaker");
		expect(el("saveBtn").textContent).toBe("Save");
		expect(el("viewLimitLabel").textContent).toBe("View limit");
		expect(document.documentElement.lang).toBe("en");
	});

	it("uses the translated message when available", async () => {
		fakeBrowser.i18n.getMessage = vi.fn((key: string) =>
			key === "popup_save_button" ? "Guardar" : "",
		);

		await loadPopup();

		expect(el("saveBtn").textContent).toBe("Guardar");
		expect(el("popupTitle").textContent).toBe("Infinite Shorts Breaker");
	});

	it("prefills the inputs with stored settings", async () => {
		await fakeBrowser.storage.local.set({ viewLimit: 12, timeLimit: 3 });

		await loadPopup();

		await vi.waitFor(() => {
			expect(el<HTMLInputElement>("viewLimit").value).toBe("12");
			expect(el<HTMLInputElement>("timeLimit").value).toBe("3");
		});
	});

	it("shows the default limits when storage is empty", async () => {
		await loadPopup();

		await vi.waitFor(() => {
			expect(el<HTMLInputElement>("viewLimit").value).toBe("5");
			expect(el<HTMLInputElement>("timeLimit").value).toBe("5");
		});
	});

	it("saves valid limits and shows a success message", async () => {
		await loadPopup();

		el<HTMLInputElement>("viewLimit").value = "10";
		el<HTMLInputElement>("timeLimit").value = "2";
		submitForm();

		// setMessage runs after saveSettings, so once the message shows,
		// storage is guaranteed to be written.
		await vi.waitFor(() => {
			expect(el("message").textContent).toBe("Settings saved!");
			expect(el("message").dataset.state).toBe("success");
		});
		expect(
			await fakeBrowser.storage.local.get(["viewLimit", "timeLimit"]),
		).toEqual({ viewLimit: 10, timeLimit: 2 });
	});

	it.each([
		"0",
		"2.5",
		"",
		"abc",
	])("rejects the invalid input %j and does not save", async (invalid) => {
		await loadPopup();

		el<HTMLInputElement>("viewLimit").value = invalid;
		el<HTMLInputElement>("timeLimit").value = "2";
		submitForm();

		await vi.waitFor(() => {
			expect(el("message").textContent).toBe(
				"Please enter valid positive integers.",
			);
			expect(el("message").dataset.state).toBe("error");
		});
		expect(await fakeBrowser.storage.local.get("viewLimit")).toEqual({});
	});
});
