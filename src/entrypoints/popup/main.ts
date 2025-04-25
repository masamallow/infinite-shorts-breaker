console.log('[Popup] loaded');

const scrollLimitInput = document.getElementById('scrollLimit') as HTMLInputElement;
const timeLimitInput = document.getElementById('timeLimit') as HTMLInputElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;

// Load the current settings from Chrome storage
chrome.storage.local.get(['scrollLimit', 'timeLimit'], (result) => {
  if (result.scrollLimit !== undefined) {
    scrollLimitInput.value = String(result.scrollLimit);
  }
  if (result.timeLimit !== undefined) {
    timeLimitInput.value = String(result.timeLimit);
  }
});

saveBtn.addEventListener('click', async () => {
  const scrollLimit = Number(scrollLimitInput.value);
  const timeLimit = Number(timeLimitInput.value);

  // Save the settings
  await chrome.storage.local.set({
    scrollLimit,
    timeLimit,
  });

  console.log('[Popup] Settings saved', {scrollLimit, timeLimit});
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
