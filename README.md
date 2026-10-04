# Pandora WordPress Theme

A boilerplate that generates WordPress themes. You fill in the project's
details, run one command, and get a working classic theme ready to be dropped
into a WordPress install and developed further.

## Requirements

- Node 18 or newer
- pnpm (the repo pins its version through `packageManager`)

## Generating a theme

```
pnpm install
pnpm wizard
```

The wizard asks for the theme name, slug, prefix, description, author, URL and
version, writes them to `manifest.json` and runs the build. The result lands in
`build/`.

Copy the whole contents of `build/` into your project: it carries the theme
under `wp-content/themes/<slug>/` plus its own build toolchain, so the
generated project keeps compiling on its own without this repo.

## Developing the generated theme

From the root of the generated project:

```
pnpm install
pnpm dev
```

Every change to a `.styl` file, to the JavaScript in `assets/javascript/compile/`,
to an SVG in `assets/images/_sprites-svg/` or to `tokens.json` recompiles the
theme and reloads the browser.

The reload works over Server-Sent Events on port 35729. The watcher writes a
`.livereload` file inside the theme while it runs, and that is what tells the
theme to inject the client; stopping the watcher removes it. Set
`LIVERELOAD_PORT` to use another port.

`pnpm build` does the same in a single pass, without watching.

## Design tokens

`tokens.json`, next to `theme.json` in the theme folder, holds the colours, the
type scale and the spacing steps. It is the only place where those values are
written:

- Stylus reads it when compiling, so the stylesheet gets real values.
- The build writes the palette, the font sizes and the spacing scale into
  `theme.json`, which is how the block editor learns what to offer.

Adding a size or changing a colour is a single edit in that file.

The division of labour is deliberate: `theme.json` declares **what options
exist**, because that is the only thing the editor cannot learn any other way,
while **how things look** stays in the stylesheet.

## Assets: adding and loading them

Everything compiled is listed by the build in `assets/assets.json`, with the
path of each file and a fingerprint of its contents. The PHP asks for an asset
by name and gets back its URL and that fingerprint as the version, so a changed
file is a changed URL and no cache has to be flushed by hand.

```php
wp_enqueue_style(
    'theme-home-style',
    theme_asset_url( 'page.home.css' ),
    array(),
    theme_asset_version( 'page.home.css' )
);
```

The names the build registers:

| Name | Comes from |
|---|---|
| `theme.css` | `assets/css/styl/style.styl` |
| `theme.js` | everything in `assets/javascript/compile/` |
| `page.<name>.css` | `assets/css/styl/pages/<name>.styl` |
| `page.<name>.js` | `assets/javascript/compile/pages/<name>.js` |
| `block.<block>.css` | `blocks/<block>/style.styl` |
| `block.<block>.editor.css` | `blocks/<block>/editor.styl` |
| `block.<block>.editor.js` | `blocks/<block>/editor.js` |
| `sprite.svg` | the SVG files in `assets/images/_sprites-svg/` |

### A stylesheet for one template

Drop a `.styl` in `assets/css/styl/pages/`. The build compiles it and lists it
as `page.<name>.css`; `includes/css-enqueue.php` is where it gets enqueued, and
it ships with the example commented out. Nothing else is needed: a page carries
its own CSS and no other page pays for it.

### A script for one template

The same idea, in `assets/javascript/compile/pages/`. Each file there is
bundled on its own into `assets/javascript/pages/` and listed as
`page.<name>.js`; `includes/js-enqueue.php` is where it gets enqueued. The
general bundle only reads the root of `compile/`, so nothing is loaded twice.

That include runs after `theme.js` is enqueued, so a template's script can
declare it as a dependency. The last argument of `wp_enqueue_script()` is
`$in_footer`: the general bundle goes in the footer and so should anything
non-essential, but a script that has to run before the page paints passes
`false`.

### Your own JavaScript

Add a file to `assets/javascript/compile/`. Every file in that folder is bundled
into `theme.js`, in alphabetical order.

They are bundled, not concatenated, so each file has its own scope and anything
no one uses is dropped. Whatever has to be reachable from the outside — an
inline script, an attribute in the markup — goes on `window` on purpose:

```js
window.openMenu = function () { … };
```

### A third party library

Install it and import it. No CDN, no copying files by hand:

```
pnpm add swiper
```

```js
// assets/javascript/compile/main.js
import Swiper from 'swiper';

new Swiper('.slider', { loop: true });
```

Its CSS is imported from any `.styl`, and `node_modules` is already a lookup
path:

```stylus
@import 'swiper/swiper-bundle.css'
```

That inlines the library's CSS into the stylesheet doing the import, which is
usually what you want: one request, and your own rules can come right after it.

To keep a library away from the pages that do not use it, import it from a file
in `compile/pages/` rather than from `main.js`. It then travels inside that
template's bundle and nowhere else. Two templates importing the same library
get a copy each, which is the price of not shipping it to everyone.

### A block's assets

See the Blocks section: a block's folder holds its `style.styl`, its
`editor.js` and, if its interface needs it, an `editor.styl`. The build compiles
them and the theme loads a block's CSS only on the pages where the block is
used.

## Blocks

Each block lives in its own folder under the theme's `blocks/`:

```
blocks/
  editor.styl          editor-only styles, never served to the front
  button/
    block.json         name, attributes, category
    render.php         the front end markup
    editor.js          the editor controls
    style.styl         its stylesheet
```

The theme registers whatever it finds there, so a block needs no wiring. To
start one:

```
pnpm create-block
```

It asks for a title, a slug, an icon and a description, and writes the folder
with the four files already filled in. It works both here and inside a
generated project, where it uses that project's own slug.

The icon is a [Dashicons](https://developer.wordpress.org/resource/dashicons/)
name, which is the quickest way to get one. WordPress now draws its own block
icons from SVG instead, so for a custom or brand icon, pass an SVG element as
the `icon` in `registerBlockType` inside `editor.js` and drop the field from
`block.json`.

The blocks are dynamic: the front end comes from `render.php`, so the markup
stays in PHP with the theme's own classes, and the editor side is plain
JavaScript. There is no JSX and nothing to compile for it.

`style.styl` compiles to `assets/css/blocks/<block>.css` and is served only on
the pages where the block is used. `editor.js` is minified to
`assets/javascript/blocks/<block>.js`. A block's stylesheet can import
`utilities/utilities`, which is how it reaches the same tokens as the rest of
the theme.

## Layout of this repo

```
manifest.json          the theme's identity, written by the wizard
scripts/
  build.js             generates build/ from src/
  wizard.js            asks for the details and builds
  theme.js             compiles a generated theme in place
  tasks/               copy, placeholders, textdomain, styles, scripts, sprites, theme-json
src/
  .gitignore           the generated project's own gitignore
  package.json         the generated project's own package.json, with placeholders
  wp-content/themes/theme/
    tokens.json        colours, type scale, spacing
    theme.json         the catalogue the block editor reads
    blocks/            one folder per block
    assets/css/styl/   Stylus sources
    assets/javascript/compile/   JavaScript, concatenated in alphabetical order
build/                 the generated theme. Not versioned: rebuild it
```

Placeholders such as `{{theme_name}}` and `{{theme_prefix}}` are replaced at
build time with the values in `manifest.json`, including the textdomain of every
PHP file.
