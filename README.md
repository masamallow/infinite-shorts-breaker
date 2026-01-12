# Infinite Shorts Breaker: YouTube Shorts time & view limits

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/aeiaflolhodpikhchopbfgebobofbdjk?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/aeiaflolhodpikhchopbfgebobofbdjk)

Stop endless YouTube Shorts autoplay by setting view-count and watch-time limits. Built as a small, privacy-first Chrome extension.

> "Aza Raskin invented the infinite scroll. By his calculation, infinite scrolling costs the world the equivalent of 200,000 life hours per day in wasted productivity."

## Features

- Set a maximum number of Shorts views and total watch time (minutes)
- Local-only settings stored in `chrome.storage.local`
- Minimal permissions (storage + YouTube) and scoped to Shorts pages
- Lightweight and fast; no remote code

## Browser Compatibility

- Chrome 88+ (Manifest V3)
- Firefox (Manifest V3 support required)

## Install

### Chrome Web Store (recommended)

Install from the Chrome Web Store:
https://chromewebstore.google.com/detail/aeiaflolhodpikhchopbfgebobofbdjk

### Manual install (development)
```bash
# Clone the repository
git clone https://github.com/masamallow/infinite-shorts-breaker.git
cd infinite-shorts-breaker

# Install dependencies
npm install

# Build for Chrome
npm run build
```

Load the extension from `.output/chrome-mv3` in Chrome's developer mode.

## Usage
1. Open the extension popup and set View Limit and Time Limit (minutes)
2. Watch YouTube Shorts as usual
3. When a limit is reached, a toast is shown and you are redirected to YouTube Home

## Permissions

- `storage`: store view/time limits locally
- `https://www.youtube.com/*`: detect Shorts pages and apply limits

## Privacy

- Collected user data: none
- Settings are stored locally only; nothing is sent externally

## Development

Requirements: Node.js (LTS) and npm

```bash
npm run dev
```

## Build / Package

```bash
npm run build
npm run zip
```

Firefox builds are also supported:

```bash
npm run build:firefox
npm run zip:firefox
```

## Tech Stack

- WXT
- TypeScript
- Manifest V3

## Contributing

This is a personal project and is not accepting external contributions at this time.
Bug reports are welcome via GitHub Issues.
