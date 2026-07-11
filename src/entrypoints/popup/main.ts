import "./style.css";

console.log("[Popup] loaded");

const viewLimitInput = document.getElementById("viewLimit") as HTMLInputElement;
const timeLimitInput = document.getElementById("timeLimit") as HTMLInputElement;
const settingsForm = document.getElementById("settings") as HTMLFormElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;

type PopupMessageKey = "popup_validation_error" | "popup_settings_saved";

function getMessage(key: PopupMessageKey, fallback: string) {
	return browser.i18n.getMessage(key) || fallback;
}

const validationErrorMessage = getMessage(
	"popup_validation_error",
	"Please enter valid positive integers.",
);
const settingsSavedMessage = getMessage(
	"popup_settings_saved",
	"Settings saved!",
);

function setMessage(text: string, state: "success" | "error") {
	messageEl.textContent = text;
	messageEl.dataset.state = state;
}

chrome.storage.local.get(["viewLimit", "timeLimit"], (result) => {
	if (result.viewLimit !== undefined) {
		viewLimitInput.value = String(result.viewLimit);
	}
	if (result.timeLimit !== undefined) {
		timeLimitInput.value = String(result.timeLimit);
	}
});

settingsForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	const viewLimit = Number(viewLimitInput.value);
	const timeLimit = Number(timeLimitInput.value);

	if (
		!Number.isInteger(viewLimit) ||
		!Number.isInteger(timeLimit) ||
		viewLimit < 1 ||
		timeLimit < 1
	) {
		setMessage(validationErrorMessage, "error");
		return;
	}

	await chrome.storage.local.set({ viewLimit, timeLimit });

	console.log("[Popup] Settings saved", { viewLimit, timeLimit });
	setMessage(settingsSavedMessage, "success");
});
