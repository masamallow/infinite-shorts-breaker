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
- `perf`, `revert`, `chore`, `build`, `ci`, `refactor`, and `docs` commits are listed in the resulting `CHANGELOG.md` but do not on their own trigger a new release. See: [release-please-config.json](./release-please-config.json).
- Markdown-only or template-only changes do not start the release workflow (see `paths-ignore` in [.github/workflows/release.yml](./.github/workflows/release.yml)). Code, config, or workflow changes do.
- Merging the release PR creates:
  - Version bump in `package.json` and `CHANGELOG.md`
  - Git tag and GitHub Release notes generated from Conventional Commits
  - Build artifact (`.output/*-chrome.zip`) uploaded to workflow artifacts and release assets

### Operational notes

- **Conflict resolution on the release PR**: when the release PR shows as conflicting — typically caused by non-releasable commits (`chore`, `ci`, `refactor`, etc.) piling up on `main` while the release PR sits open — prefer in this order:
  1. Re-run the `Release` workflow via `workflow_dispatch` (`gh workflow run release.yml`).
  2. If that is a no-op, land any pending releasable change (a real `feat:` / `fix:`) on `main`; the release PR will be force-pushed and the conflict will clear.
  3. As a last resort, close the release PR and delete its branch; `release-please` will recreate it on the next push.
- **Forcing a release with no releasable commits on `main`**: append a `Release-As: x.y.z` footer on a (possibly empty) commit pushed to `main`, then trigger the workflow manually because `paths-ignore` will skip an empty push:

  ```bash
  git commit --allow-empty \
    -m "chore: release 0.2.1" \
    -m "Release-As: 0.2.1"
  git push origin main
  gh workflow run release.yml
  ```

- **Hand-editing a release PR**: edits to the release PR's `CHANGELOG.md` can be overwritten by a subsequent `release-please` force-push. If you do hand-edit, merge the PR promptly afterward.

## Tool Versions

[package.json](./package.json) is the source of truth: `devEngines.runtime` for Node.js and `packageManager` for pnpm.  
CI reads them through `actions/setup-node` and `pnpm/action-setup`, and [mise.toml](./mise.toml) makes mise read the same fields.  
Run `mise trust` once after cloning, because mise refuses to load an untrusted file that has a `[settings]` table.

## Dependency Updates

### Release-age cooldown

Renovate and pnpm each hold back releases younger than 7 days (`minimumReleaseAge` in [renovate.json](./renovate.json) and [pnpm-workspace.yaml](./pnpm-workspace.yaml)).  
The cooldown gives the community time to spot and unpublish compromised releases before they reach this repository.  
Keep it for every update, including ones you would like sooner; the only exception is a fix for a known vulnerability.

- Keep the two values equal.
  - If Renovate's is shorter, it proposes versions that pnpm rejects with `ERR_PNPM_NO_MATURE_MATCHING_VERSION`, and the PR stays red without a lockfile update.
- For npm, Renovate's value lives in a `packageRules` entry.
  - `config:best-practices` sets 3 days for npm through a package rule, and package rules outrank the top-level `minimumReleaseAge`.
- Lock file maintenance PRs rely on pnpm's cooldown alone.
  - They carry no release timestamp, so Renovate's check is turned off for them; otherwise it would stay pending forever.
- Vulnerability PRs always need a manual merge (`vulnerabilityAlerts.automerge: false`).
  - They skip Renovate's cooldown, so the pnpm automerge rule must not apply to them.

### Before merging a vulnerability fix early

Merge early only when all of these hold; otherwise let the update wait out the cooldown.

- The vulnerability is reachable in this repository.
  - All dependencies are devDependencies, so check whether the affected code runs during development, tests, or the build, or ends up in the shipped extension.
- An official advisory (GHSA or the project's own security notice) names this exact version as the fix.
  - Fake "urgent security fix" releases are a common move after a maintainer account is compromised.
- If earlier releases carry npm provenance, this one does too, from the same repository and workflow.
  - A missing attestation or a new publisher is a red flag.
- The published package contents, not just the Git tag, show no new install scripts, obfuscated code, or unexpected dependencies compared with the previous version.

### Exempting the fix from pnpm's cooldown

Renovate opens vulnerability PRs without waiting (`vulnerabilityAlerts` defaults to `minimumReleaseAge: null`), but pnpm still enforces its own cooldown.  
Because `minimumReleaseAge` is set explicitly, `minimumReleaseAgeStrict` defaults to `true`, so pnpm refuses to resolve a version younger than 7 days.  
Renovate therefore adds the fixed version to `minimumReleaseAgeExclude` in the same PR:

```yaml
minimumReleaseAgeExclude:
  # Renovate security update: vitest@4.1.11
  - vitest@4.1.11
```

1. Review the PR against the checklist above.
2. Confirm that every `minimumReleaseAgeExclude` entry the PR adds pins an exact version; a bare package name exempts every future release of that package.
3. Merge once CI passes.
4. Once the version is more than 7 days old, remove its entry in a follow-up commit.
   - Renovate leaves the entry in place after the merge.
   - By then the version satisfies `minimumReleaseAge` on its own, so removing the entry cannot break installs.

If Renovate has not opened a PR, bump the dependency on a branch yourself, add its exact version to `minimumReleaseAgeExclude` with a comment naming the advisory, and follow the same steps.
