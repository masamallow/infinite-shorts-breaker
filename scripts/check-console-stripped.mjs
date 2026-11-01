// Fails when a production build still contains console calls.
// wxt.config.ts strips them, but a bundler upgrade can silently disable that
// step while lint, types, tests and the build itself all stay green.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const outDir = process.argv[2] ?? ".output/chrome-mv3";

// Only calls count: wxt's internal logger passes `console.log` as a value to a
// function that is empty in production, so a plain `console.log` search always
// matches. The tags catch calls that a minifier reached through an alias.
const forbidden = /\bconsole\.[a-z]+\s*\(|\[(?:ContentScript|Limiter|Popup)\]/g;

const files = readdirSync(outDir, { recursive: true, withFileTypes: true })
	.filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
	.map((entry) => path.join(entry.parentPath, entry.name));

if (files.length === 0) {
	console.error(`No JavaScript files found in ${outDir}.`);
	process.exit(1);
}

const failures = files.flatMap((file) =>
	[...readFileSync(file, "utf8").matchAll(forbidden)].map(
		(match) => `${file}: ${match[0]}`,
	),
);

if (failures.length > 0) {
	console.error(`Found ${failures.length} console leftovers:`);
	console.error(failures.join("\n"));
	process.exit(1);
}

console.log(`No console leftovers in ${files.length} files.`);
