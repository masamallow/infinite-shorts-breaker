console.log('[Popup] loaded');

const viewLimitInput = document.getElementById('viewLimit') as HTMLInputElement;
const timeLimitInput = document.getElementById('timeLimit') as HTMLInputElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;

// Load the current settings from Chrome storage
chrome.storage.local.get(['viewLimit', 'timeLimit'], (result) => {
  if (result.viewLimit !== undefined) {
    viewLimitInput.value = String(result.viewLimit);
  }
  if (result.timeLimit !== undefined) {
    timeLimitInput.value = String(result.timeLimit);
  }
});

saveBtn.addEventListener('click', async () => {
  const viewLimit = Number(viewLimitInput.value);
  const timeLimit = Number(timeLimitInput.value);

  // Save the settings
  await chrome.storage.local.set({
    viewLimit,
    timeLimit,
  });

  console.log('[Popup] Settings saved', {viewLimit, timeLimit});
  const messageContainer = document.getElementById('message');
  if (messageContainer) {
    messageContainer.textContent = 'Settings saved!';
  } else {
    const newMessageContainer = document.createElement('div');
    newMessageContainer.id = 'message';
    newMessageContainer.textContent = 'Settings saved!';
    document.body.appendChild(newMessageContainer);
  }
});
