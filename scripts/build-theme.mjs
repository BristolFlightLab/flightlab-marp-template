// Build themes/flightlab.css, the stylesheet Marp actually loads, from
// src/flightlab.css.
//
// Marp injects a theme into a <style> tag in the generated HTML, so relative
// url() paths inside it would resolve against the deck rather than the theme.
// Every asset is therefore inlined as a data URI. Each one is inlined once, as
// a custom property, because several layouts share the same crest.
//
// Usage: node scripts/build-theme.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(root, "src/flightlab.css");
const out = resolve(root, "themes/flightlab.css");

const ASSET = /url\(["']?\.\.\/assets\/([^"')]+)["']?\)/g;

let css = readFileSync(src, "utf8");

// Collect every asset the theme references, once each.
const assets = new Map();
for (const [, file] of css.matchAll(ASSET)) {
  if (assets.has(file)) continue;
  const svg = readFileSync(resolve(root, "assets", file));
  const name = `--fl-img-${basename(file, extname(file))}`;
  assets.set(file, {
    name,
    value: `url("data:image/svg+xml;base64,${svg.toString("base64")}")`,
  });
}

css = css.replace(ASSET, (_, file) => `var(${assets.get(file).name})`);

// Declare them ahead of the theme so the custom properties are always defined.
const decls = [...assets.values()]
  .map(({ name, value }) => `  ${name}: ${value};`)
  .join("\n");

const header = [
  "/* @theme flightlab */",
  "/* GENERATED FILE - edit src/flightlab.css and run `npm run build:theme` */",
  "/* Code: MIT licence. The embedded images are University of Bristol brand assets, not covered by it; see BRAND.md. */",
  ":root {",
  decls,
  "}",
  "",
].join("\n");

// src/flightlab.css carries its own @theme marker; only one may survive.
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, header + css.replace("/* @theme flightlab */\n", ""));

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
console.log(
  `themes/flightlab.css written - ${assets.size} assets inlined, ${kb(
    readFileSync(out).length
  )}`
);
