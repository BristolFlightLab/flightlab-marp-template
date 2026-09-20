# Bristol Flight Lab · Marp theme

A [Marp](https://marp.app) theme reproducing the Bristol Flight Lab PowerPoint template, so lecture slides can be written in Markdown, kept in Git, and exported to HTML, PDF, PPTX or PNG.

## Quick start

```bash
npm install
npm run build        # dist/slides.html  (self-contained, iframe-friendly)
npm run pdf          # dist/slides.pdf
npm run pptx         # dist/slides.pptx  (image-backed slides)
npm run watch        # rebuild HTML on save
npm run serve        # preview server for every .md in the repo
```

Exports need Google Chrome, Chromium or Edge installed. The VS Code [Marp extension](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) previews decks live; point its `markdown.marp.themes` setting at `themes/flightlab.css`.

## Writing a deck

Start every deck with this front matter:

```markdown
---
marp: true
theme: flightlab
paginate: true
header: "AENG20003 · Aircraft Performance"
footer: "your.email@bristol.ac.uk"
author: "Your Name"
---
```

Slides are separated by `---`. Pick a layout with a class directive on the first line of the slide:

| Class | PowerPoint layout | Notes |
|---|---|---|
| *(none)* | Title and Content | `# Title` then any Markdown |
| `title` | Title Slide | `# Title`, `## subtitle`, paragraphs. Red background, no footer or page number |
| `title-inverted` | Inverted Title Slide | Same structure, white background |
| `section` | Section Header | `# Title` plus one `##` line, sits in the red band |
| `blank` | Blank | Footer rule only, no header band |
| `blank-logo` | Blank w/ Logo | Crest plus footer rule |

```markdown
---

<!-- _class: section -->

# Part 2

## The drag polar
```

`_class` with the underscore applies to that slide only. Without the underscore it applies to every following slide.

With `paginate: true` every slide except the cover shows `n / m` in the footer bar. Turn it off for one slide with `<!-- _paginate: false -->`.

### Columns

Two Content and Comparison layouts are a wrapper div:

```html
<div class="columns">
<div>

Left column Markdown

</div>
<div>

Right column Markdown

</div>
</div>
```

Keep the blank lines inside each `<div>` so Markdown is parsed. `columns-3` gives three columns.

### Utilities

`.callout` (grey box with red rule), `.caption`, `.center`, `.small`, `.tiny`, `.muted`, and colour spans `.red .teal .cyan .orange .purple .magenta .lime` matching the theme accents.

Images: `![center w:600](fig.svg)` centres and sizes. `![bg right:40%](photo.jpg)` gives the Picture-with-Content split. Marp's [image syntax](https://marpit.marp.app/image-syntax) covers the rest.

### Maths

KaTeX is on by default: `$C_L$` inline, `$$ ... $$` display. The PowerPoint theme embedded Cambria Math; KaTeX renders its own maths font so nothing extra is needed.

### Video

Raw HTML is enabled in `.marprc.yml`, so `<iframe>` and `<video>` work in the HTML deck. They export blank in PDF and PPTX. Add a linked poster image on the same slide if you distribute those.

### Presenter notes

HTML comments are speaker notes. In the HTML deck press `P` for presenter view.

## Theme internals

- `src/flightlab.css` is the editable theme. Every flat field, band and rule is drawn in CSS as a single-colour gradient layer, so colours and dimensions are tunable numbers rather than baked into artwork.
- `npm run build:theme` inlines the artwork as data URIs into `themes/flightlab.css`, which is what Marp loads. Marp injects a theme into a `<style>` tag, so relative paths inside it would not resolve. Every build script runs it first. Commit both files.
- `assets/` holds only the artwork CSS cannot draw: the University crest in two colourways, and the Flight Lab edge, meaning the slanted line with its roundel, bird and aircraft, at the three sizes the layouts use. They were extracted from the official Flight Lab PowerPoint template.

### Adjusting the furniture

The geometry lives in custom properties at the top of `src/flightlab.css`:

| Token | Default | Controls |
|---|---|---|
| `--fl-band` | `76px` | height of the red header band |
| `--fl-rule` | `19px` | height of the red footer rule |
| `--fl-field` | `890px` | flat red field on title slides, before the edge |
| `--fl-edge` | `390px` | width of the full-height edge artwork |
| `--fl-overlap` | `24px` | how far flat fields run under the edge artwork, so no seam shows at the joint when a slide is scaled |

Changing `--fl-band` or `--fl-rule` moves the band or rule but not the edge artwork, which is drawn at a fixed size, so keep both at their defaults unless you also redraw the artwork.

### Fonts

The original theme uses Trebuchet MS, which ships with macOS and Windows but has no web licence. The stack is `"Trebuchet MS", "Fira Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`. Lecture machines will match PowerPoint exactly. If a deck is embedded on a site where Trebuchet may be missing, load Fira Sans from Google Fonts in the host page, or add an `@import` to the top of `src/flightlab.css`.

### Colours

| Token | Hex | Source |
|---|---|---|
| `--fl-red` | `#B01C2E` | brand red (dk2) |
| `--fl-grey` | `#E3E6E5` | lt2 |
| `--fl-teal` | `#00C0B5` | accent 1 |
| `--fl-cyan` | `#0CC6DE` | accent 2 |
| `--fl-orange` | `#EE7219` | accent 3 |
| `--fl-purple` | `#9278D1` | accent 4 |
| `--fl-magenta` | `#E0249A` | accent 5 |
| `--fl-lime` | `#BED600` | accent 6 |
| `--fl-link` | `#0563C1` | hyperlink |

Recolouring the deck is a matter of overriding `--fl-red`, except inside the crest and edge artwork, whose colours are part of the SVG files in `assets/`.

## Using the theme in another repo

Install it as a dev dependency straight from GitHub. The `semver:` range tracks the newest release within version 1, and never picks up unreleased work:

```bash
npm install --save-dev @marp-team/marp-cli "github:BristolFlightLab/flightlab-marp-template#v2.0.0"
```

Then point Marp at the installed theme in that repo's `.marprc.yml`:

```yaml
themeSet: node_modules/flightlab-marp-template/themes
```

and use `theme: flightlab` in each deck. The built stylesheet has every logo inlined, so nothing else needs copying. For the VS Code extension, set `markdown.marp.themes` to `./node_modules/marp-template/themes/flightlab.css`.

To move to the latest compatible release, run `npm update marp-template`. The lock file pins the exact release you're on until you do, so builds stay reproducible.

## Releases

Releases follow [semantic versioning](https://semver.org) and are tagged `vX.Y.Z` on `main`. Changes are listed in [CHANGELOG.md](CHANGELOG.md).

- **Patch** (1.0.**1**): fixes that shouldn't change how existing decks look beyond the fix itself.
- **Minor** (1.**1**.0): new layouts, classes or options. Existing decks render as before.
- **Major** (**2**.0.0): anything that can change or break existing decks, such as renaming or removing a class, changing a layout's structure, or moving the theme file. Downstream repos only move to it deliberately, by editing their `^1.0.0` range.

To cut a release, update `CHANGELOG.md`, run `npm run build:theme` so `themes/flightlab.css` is current, then:

```bash
npm version minor -m "Release v%s"
git push --follow-tags
```

`npm version` bumps `package.json`, commits and creates the tag in one step.

## Embedding a deck

`npm run build` produces one HTML file with the theme inlined. Marp leaves the deck's own images as separate files, so the build copies everything else in `example/` into `dist/` beside it. Deploy the folder, not just the HTML. Host it and embed with

```html
<iframe src="https://example.com/slides/lecture-03/" width="960" height="540" allowfullscreen></iframe>
```

For SharePoint or Blackboard the host must send a permissive `Content-Security-Policy: frame-ancestors` header and must not send `X-Frame-Options: DENY`. On Cloudflare Pages that is a `_headers` file next to the deck.

## Licence

- **Code and example:** published for use within the University of Bristol and Bristol Flight Lab. No open-source licence is granted, so all rights are reserved. If you want to reuse any of it elsewhere, please ask.
- **Brand:** the logos, colour palette and visual design are not for reuse. See [BRAND.md](BRAND.md).
- **Your slides:** decks you write with this theme are your own content. Nothing here claims any rights over them.

## Acknowledgements

Built on [Marp](https://marp.app) by the Marp team, used under the MIT licence. The theme extends Marp Core's default theme through `@import "default"`, which Marp resolves when it builds a deck, so no Marp code is copied into this repository. Decks exported by Marp include its runtime, which is also MIT licensed.

## The artwork

`assets/` is vendored from
[`flightlab-brand`](https://github.com/BristolFlightLab/flightlab-brand), the
single source for Flight Lab artwork, and `BRAND-VERSION` records the tag it
came from. To take a newer one and rebuild the theme:

```bash
npm run brand v1.1.0 && npm run build:theme
```

It is vendored rather than nested as a submodule because npm installs a git
dependency as a tarball, and a tarball would not carry submodule contents.

> **The package was renamed in v2.0.0**, from `marp-template` to
> `flightlab-marp-template`, so that it matches the repository. That moves the
> installed path, so when you bump to v2.0.0 you must also change
> `.marprc.yml`:
>
> ```yaml
> themeSet: node_modules/flightlab-marp-template/themes
> ```
>
> Nothing else changes: the theme CSS is byte-identical to v1.1.0. Staying on
> v1.x keeps working indefinitely.
