# Changelog

## [4.0.0] - 2026-10-04

The generated theme compiles everything with Vite, loads its assets from a
manifest the build writes, and takes third party libraries from npm without
ever shipping one twice. A major version because what a generated theme looks
like inside has changed: see *Upgrading* at the end.

### Compiling
- Vite compiles the stylesheets and bundles the scripts, in place of Stylus on
  its own and a plain concatenation. Scripts are bundled, not concatenated:
  each file has its own scope and whatever has to be reachable from outside
  goes on `window` on purpose.
- The Vite options live in the project's own `vite.config.mjs`, where a
  generated project can adjust them.
- The CSS target is kept conservative, so the minifier does not rewrite media
  queries into a syntax Safari before 16.4 ignores.
- The theme header in `style.css` is written by the build from the manifest;
  a minifier is free to drop comments, and without it WordPress does not see
  the theme.
- Web fonts are served from `assets/fonts/` again; the path had broken when
  `style.css` moved to the theme root.

### Loading assets
- The build writes `assets/assets.json`, naming every file it produced with a
  fingerprint of its contents. The PHP asks for an asset by name and gets its
  URL and that fingerprint as the version, so a changed file is a changed URL.
  This replaces `$release`, which had to be bumped by hand.
- A stylesheet and a script per template: a `.styl` in
  `assets/css/styl/pages/` and a `.js` in `assets/javascript/compile/pages/`
  compile on their own and are enqueued from `includes/css-enqueue.php` and
  `includes/js-enqueue.php`, only where they are needed.
- The print styles are their own stylesheet, `media="print"`, downloaded only
  by whoever prints, and carry no `!important`.

### Third party libraries
- Install a library and import it from any script or `@import` its CSS from
  any `.styl`, partials included. It is never copied into the file that
  imports it: the build emits it once in `assets/javascript/vendor/` and
  `assets/css/vendor/`, and WordPress loads it before whatever needs it, once,
  however many templates and blocks on the page use it. A page that uses none
  loads none.
- It works in every browser: the import is turned into a read of a global
  rather than relying on import maps.
- Each library is also a handle, `<slug>-vendor-<library>`, for a template to
  enqueue directly. One listed under `"bundle"` in the manifest stays inside
  the file that imports it instead.
- Libraries' stylesheets print before the theme's, so the theme's rules can
  always override them.

### Blocks
- A block's `block.json` says which of its assets load, in `style`,
  `editorStyle`, `editorScript` and `viewScript`. Leaving a field out is how a
  block says it needs no such asset; before, every file that existed loaded.
- `view.js` holds a block's behaviour on the published page, loaded only where
  the block renders. `pnpm create-block` writes one, and the fields, for every
  new block.
- A block's editor styles reach the inspector sidebar, outside the canvas
  iframe, where the panels they fix live. The Button block's URL field no
  longer overflows it.

### Removed
- `functions/acf-stuff.php`.

### Upgrading a theme generated with 3.x
- Enqueue with `<prefix>_asset_url()`, `<prefix>_asset_version()` and
  `<prefix>_asset_deps()` instead of building paths and passing `$release`.
- Add `style`, `editorStyle`, `editorScript` and, if it has one, `viewScript`
  to each block's `block.json`, naming the handles
  `<slug>-block-<block>[-editor|-view]`. A block without them loads none of its
  assets.
- Replace `scripts/`, `package.json` and `vite.config.mjs` with those of a
  freshly generated project, and run `pnpm install`.

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
