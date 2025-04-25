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

// import './style.css';
// import typescriptLogo from '@/assets/typescript.svg';
// import viteLogo from '/wxt.svg';
// import { setupCounter } from '@/components/counter';
//
// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://wxt.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="WXT logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>WXT + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the WXT and TypeScript logos to learn more
//     </p>
//   </div>
// `;
//
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
