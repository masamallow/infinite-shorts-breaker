# Changelog

## [0.3.1](https://github.com/masamallow/infinite-shorts-breaker/compare/v0.3.0...v0.3.1) (2026-11-01)


### 📝 Documentation

* **contributing:** document the release-age cooldown for dependencies ([678dc3e](https://github.com/masamallow/infinite-shorts-breaker/commit/678dc3eb62a0f74542990f519b7e9561bd0e5dfb))
* **pr-template:** use pnpm in the testing checklist ([#70](https://github.com/masamallow/infinite-shorts-breaker/issues/70)) ([af976b8](https://github.com/masamallow/infinite-shorts-breaker/commit/af976b864f278fb0029263120d3fc179b4723182))


### 🛠️ Build System

* **deps:** upgrade wxt to 0.21.4 ([#91](https://github.com/masamallow/infinite-shorts-breaker/issues/91)) ([9ec642b](https://github.com/masamallow/infinite-shorts-breaker/commit/9ec642b7e47f2d8ebcaf8dc8e9327daa8273e4d4))
* make package.json the source of truth for tool versions ([4ef0ed4](https://github.com/masamallow/infinite-shorts-breaker/commit/4ef0ed4b0dd46bc6cca22ca3aec8c67a09b6b429))


### 🤖 Continuous Integration

* **renovate:** align release-age checks with the pnpm cooldown ([086b0ab](https://github.com/masamallow/infinite-shorts-breaker/commit/086b0ab6ddf288a0fbdbb86d990a7da911c6dd50))
* **renovate:** automerge pnpm packageManager updates ([#69](https://github.com/masamallow/infinite-shorts-breaker/issues/69)) ([97a848d](https://github.com/masamallow/infinite-shorts-breaker/commit/97a848d1a3b9ae6b4a286ab837c618cbb2102481))
* **renovate:** limit pnpm automerge to minor and patch updates ([e4cab89](https://github.com/masamallow/infinite-shorts-breaker/commit/e4cab892b8879f7ba605b86145a8557424979d0c))


### ♻️ Code Refactoring

* gate debug logs on import.meta.env.DEV ([#97](https://github.com/masamallow/infinite-shorts-breaker/issues/97)) ([55222f3](https://github.com/masamallow/infinite-shorts-breaker/commit/55222f34ec41c130a2d2e4bfc190dbcd87342977))

## [0.3.0](https://github.com/masamallow/infinite-shorts-breaker/compare/v0.2.0...v0.3.0) (2026-07-11)


### ✨ Features

* **popup:** localize the entire interface ([#54](https://github.com/masamallow/infinite-shorts-breaker/issues/54)) ([228e33e](https://github.com/masamallow/infinite-shorts-breaker/commit/228e33eafb8045a9a127c3b196be597b186222d1))
* **ui:** redesign popup and unify visual styles ([#50](https://github.com/masamallow/infinite-shorts-breaker/issues/50)) ([5f93b85](https://github.com/masamallow/infinite-shorts-breaker/commit/5f93b850b408a9a65c4fbc3e40533fe2f1e2f1d4))


### 🐛 Bug Fixes

* **popup:** improve form submission and validation ([#53](https://github.com/masamallow/infinite-shorts-breaker/issues/53)) ([df37271](https://github.com/masamallow/infinite-shorts-breaker/commit/df37271aed0c15184218543befc48f628c3541b9))


### 🛠️ Build System

* **deps:** upgrade TypeScript to 6.0.3 ([#57](https://github.com/masamallow/infinite-shorts-breaker/issues/57)) ([f14a72f](https://github.com/masamallow/infinite-shorts-breaker/commit/f14a72ffc171c3edc3c440d82f593447a2bf6e49))
* migrate to pnpm 11 ([#55](https://github.com/masamallow/infinite-shorts-breaker/issues/55)) ([3180423](https://github.com/masamallow/infinite-shorts-breaker/commit/318042352b74df4c8ae38dfc3fac9fefce8d3ab7))


### 🤖 Continuous Integration

* **release:** include hidden files when uploading .output artifact ([#38](https://github.com/masamallow/infinite-shorts-breaker/issues/38)) ([9b76b35](https://github.com/masamallow/infinite-shorts-breaker/commit/9b76b3510941f52783b746d2e2173ca0f4c60e93))

## [0.2.0](https://github.com/masamallow/infinite-shorts-breaker/compare/v0.1.2...v0.2.0) (2026-05-07)


### ✨ Features

* rework toast UI (shadow DOM + landing-page surface) ([#32](https://github.com/masamallow/infinite-shorts-breaker/issues/32)) ([a4b70ec](https://github.com/masamallow/infinite-shorts-breaker/commit/a4b70ec29cacdc6dfe962dbb9430a952dda6620c))


### 📝 Documentation

* add documentation and templates for public release ([#7](https://github.com/masamallow/infinite-shorts-breaker/issues/7)) ([70c0d2c](https://github.com/masamallow/infinite-shorts-breaker/commit/70c0d2c692c51f70271be6c5bc3e2ab3cfb0be20))


### 🛠️ Build System

* pin & bump Node version ([0633f70](https://github.com/masamallow/infinite-shorts-breaker/commit/0633f707a355663a81a07a33e9f4ad119a11c8df))
* pin pnpm and declare Node engine; preventing lockfile churn from version drift across contributors. ([f996afa](https://github.com/masamallow/infinite-shorts-breaker/commit/f996afaa57233fd3b284948b2ad3995010079f39))


### 🤖 Continuous Integration

* add CI and release-please automation ([a99b4e3](https://github.com/masamallow/infinite-shorts-breaker/commit/a99b4e3bec1cf0f61437fabcd69509c40718926a))
* **release-please:** expand changelog-sections and add paths-ignore ([#36](https://github.com/masamallow/infinite-shorts-breaker/issues/36)) ([05238fb](https://github.com/masamallow/infinite-shorts-breaker/commit/05238fb3c0fb026ec556935ff9b6bc260c7096fe))


### 🧹 Miscellaneous Chores

* Configure Renovate ([#1](https://github.com/masamallow/infinite-shorts-breaker/issues/1)) ([e6a2095](https://github.com/masamallow/infinite-shorts-breaker/commit/e6a2095bd8f087b96309dc2ab604afc137203ac8))
* introduce Biome for formatting, linting, and CI checks ([#34](https://github.com/masamallow/infinite-shorts-breaker/issues/34)) ([e879688](https://github.com/masamallow/infinite-shorts-breaker/commit/e8796881f997225e0862a7301590ade719629fcd))
* replace npm into pnpm ([770c032](https://github.com/masamallow/infinite-shorts-breaker/commit/770c03291580dfafead011551c40c463b83f8c9f))
