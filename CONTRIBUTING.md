# Contributing

This is a personal project and is not accepting external code contributions at this time.

## What Is Welcome

- Bug reports via GitHub Issues
- Questions and usage feedback via GitHub Issues

## Maintainer Release Flow

- Commit using Conventional Commits (for example: `feat: ...`, `fix: ...`, `docs: ...`)
- On each update to `main`, `release-please` updates or creates a release PR
- Merging the release PR creates:
  - Version bump in `package.json` and `CHANGELOG.md`
  - Git tag and GitHub Release notes generated from Conventional Commits
  - Build artifact (`.output/*-chrome.zip`) uploaded to workflow artifacts and release assets
