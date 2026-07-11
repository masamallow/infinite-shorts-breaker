import "./style.css";

console.log("[Popup] loaded");

const viewLimitInput = document.getElementById("viewLimit") as HTMLInputElement;
const timeLimitInput = document.getElementById("timeLimit") as HTMLInputElement;
const settingsForm = document.getElementById("settings") as HTMLFormElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;
const popupTitleEl = document.getElementById(
	"popupTitle",
) as HTMLHeadingElement;
const viewLimitLabelEl = document.getElementById(
	"viewLimitLabel",
) as HTMLSpanElement;
const viewsUnitEl = document.getElementById("viewsUnit") as HTMLSpanElement;
const timeLimitLabelEl = document.getElementById(
	"timeLimitLabel",
) as HTMLSpanElement;
const minutesUnitEl = document.getElementById("minutesUnit") as HTMLSpanElement;
const saveButton = document.getElementById("saveBtn") as HTMLButtonElement;

type PopupMessageKey =
	| "popup_title"
	| "popup_view_limit_label"
	| "popup_views_unit"
	| "popup_time_limit_label"
	| "popup_minutes_unit"
	| "popup_save_button"
	| "popup_validation_error"
	| "popup_settings_saved";

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

document.documentElement.lang = browser.i18n.getUILanguage() || "en";
document.title = getMessage("popup_title", "Infinite Shorts Breaker");
popupTitleEl.textContent = document.title;
viewLimitLabelEl.textContent = getMessage(
	"popup_view_limit_label",
	"View limit",
);
viewsUnitEl.textContent = getMessage("popup_views_unit", "views");
timeLimitLabelEl.textContent = getMessage(
	"popup_time_limit_label",
	"Time limit",
);
minutesUnitEl.textContent = getMessage("popup_minutes_unit", "minutes");
saveButton.textContent = getMessage("popup_save_button", "Save");

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
