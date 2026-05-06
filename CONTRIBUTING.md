# Contributing

This is a personal project and is not accepting external code contributions at this time.

## What Is Welcome

- Bug reports via GitHub Issues
- Questions and usage feedback via GitHub Issues

## Maintainer Release Flow

### Commit & PR conventions

- The `main` branch commit log follows [Conventional Commits](https://www.conventionalcommits.org/) (for example: `feat: ...`, `fix: ...`, `docs: ...`).
- This applies whether the change lands via a squash-merged PR or a direct push.

### How `release-please` produces a release

- On each update to `main`, `release-please` evaluates the commits since the last release.
- It creates or updates a release PR (titled like `chore(main): release x.y.z`) when it detects releasable units (`feat`, `fix`, or `deps`).
- `chore`, `build`, `ci`, `refactor`, and `docs` commits are listed in the resulting `CHANGELOG.md` but do not on their own trigger a new release. See: [release-please-config.json](./release-please-config.json).
- Markdown-only or template-only changes do not start the release workflow (see `paths-ignore` in [.github/workflows/release.yml](./.github/workflows/release.yml)). Code, config, or workflow changes do.
- Merging the release PR creates:
  - Version bump in `package.json` and `CHANGELOG.md`
  - Git tag and GitHub Release notes generated from Conventional Commits
  - Build artifact (`.output/*-chrome.zip`) uploaded to workflow artifacts and release assets

### Operational notes

- **Conflict resolution on the release PR**: when the release PR shows as conflicting (typically caused by `chore`-only commits piling up on `main` while the release PR sits open), prefer in this order:
  1. Re-run the `Release` workflow via `workflow_dispatch` (`gh workflow run release.yml`).
  2. If that is a no-op, land any pending releasable change (a real `feat:` / `fix:`) on `main`; the release PR will be force-pushed and the conflict will clear.
  3. As a last resort, close the release PR and delete its branch; `release-please` will recreate it on the next push.
- **Forcing a release out of `chore`-only history**: append a `Release-As: x.y.z` footer on a (possibly empty) commit pushed to `main`:

  ```bash
  git commit --allow-empty \
    -m "chore: release 0.2.1" \
    -m "Release-As: 0.2.1"
  git push origin main
  ```

- **Hand-editing a release PR**: edits to the release PR's `CHANGELOG.md` can be overwritten by a subsequent `release-please` force-push. If you do hand-edit, merge the PR promptly afterward.
