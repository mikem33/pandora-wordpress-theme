# Changelog

## [3.0.0] - 2026-09-24

The boilerplate builds with Node instead of Gulp, generates a theme from one
command, and ships with block support. Released in two prereleases first,
3.0.0-beta.1 and 3.0.0-beta.2.

### Generating a theme
- `pnpm wizard` asks for the name, slug, prefix, description, author, URL and
  version, and generates the theme. Blank answers take the value in the repo's
  `manifest.json`, which the wizard never writes to: the answers travel in
  memory and land as the generated project's own manifest.
- Every value reaches the theme: the folder name, the `style.css` header, the
  textdomain of every PHP file, and the prefix of every function and asset
  handle, which used to be `pandora_` and `pd-` whatever the project was called.
- `build/` is no longer versioned. It is regenerated with `pnpm build`.

### Working on a generated theme
- It carries its own toolchain: `pnpm build` and `pnpm dev` compile its Stylus,
  its JavaScript and its SVG sprites in place, with no `src/` involved.
- `pnpm dev` reloads the browser after each successful compile, over
  Server-Sent Events, with no dependencies and no proxy.
- `pnpm create-block` scaffolds a block folder with its four files.

### Build
- `scripts/build.js` orchestrates the build and each step lives in
  `scripts/tasks/`. Stylus compiles through its own library and JavaScript is
  minified with terser; no bundler was needed.
- SVG sprites are built without dependencies: the files in `_sprites-svg/`
  become `<symbol>` elements in a single `sprite.svg`.
- pnpm pinned, with the lockfile tracked.

### Design tokens and the editor
- `tokens.json`, next to `theme.json`, holds the colours, the type scale, the
  spacing steps, the base font size and the layout widths. Stylus reads it when
  compiling and the build writes the same values into `theme.json`, so the
  stylesheet and the block editor cannot drift apart.
- `theme.json` declares only what the editor cannot learn any other way. How
  things look stays in the stylesheet.
- The theme's stylesheet is loaded inside the editor, so a block looks there
  as it will on the front.
- WordPress's own presets are dropped from the global stylesheet and its block
  CSS is served as files instead of being inlined into every page, which takes
  a page from 22.5 KB to 10.7 KB.

### Blocks
- One folder per block under `blocks/`, with `block.json`, `render.php`,
  `editor.js` and `style.styl`. The theme registers whatever it finds there.
- Blocks are dynamic: the front end is PHP with the theme's own classes, and
  the editor side is plain JavaScript with nothing to compile.
- A block's CSS is served only on the pages where the block is used.
- Reference block: Button, a link that can point at a page of the site by name.
- The theme's blocks get their own category in the inserter.

### PHP
- Every function the theme declares carries the project's prefix. Fifteen of
  them sat in the global namespace with names any plugin could take, and a
  collision is a fatal error.
- `comments.php` rebuilt on `wp_list_comments()` and `comment_form()`, keeping
  the theme's own markup: the previous one posted a hand-written form with no
  nonce and supported neither threads nor pagination.
- The search form has a label, an accessible button and unique ids.
- Every string is English inside `gettext`, so a generated theme can be
  translated with a `.po` file.
- `wp_body_open()` added, the deprecated `STYLESHEETPATH` replaced, and a
  Google Fonts loader that did nothing removed.

## [2.0.1] - 2026-06-17 (Baseline)
- Last version before the modernization
- Gulp-based build system: `clean-build`, `copy-theme-files`, `copy-manifest`,
  `copy-development-files`, `checktextdomain`, `replace-css-handlebars`,
  `main-style`, `pages-style` and `js`
- Dependencies: Gulp 4.0.2, gulp-stylus, gulp-concat, gulp-uglify,
  gulp-sourcemaps, gulp-replace, gulp-checktextdomain, fs-extra
- jQuery removed in a previous commit
- Build structure: `src/` → `build/`
