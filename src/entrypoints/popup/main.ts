import "./style.css";

console.log("[Popup] loaded");

const viewLimitInput = document.getElementById("viewLimit") as HTMLInputElement;
const timeLimitInput = document.getElementById("timeLimit") as HTMLInputElement;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
const messageEl = document.getElementById("message") as HTMLParagraphElement;

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

saveBtn.addEventListener("click", async () => {
	const viewLimit = Number(viewLimitInput.value);
	const timeLimit = Number(timeLimitInput.value);

	if (
		!Number.isFinite(viewLimit) ||
		!Number.isFinite(timeLimit) ||
		viewLimit < 1 ||
		timeLimit < 1
	) {
		setMessage("Please enter valid positive numbers.", "error");
		return;
	}

	await chrome.storage.local.set({ viewLimit, timeLimit });

	console.log("[Popup] Settings saved", { viewLimit, timeLimit });
	setMessage("Settings saved!", "success");
});
