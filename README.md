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

## Stylesheets for a single template

`style.css` is loaded on every page. Anything that belongs to one template only
goes in `assets/css/styl/pages/`, compiles to `assets/css/pages/` and is
enqueued from `includes/css-enqueue.php`, which ships with a commented example
to copy:

```php
if ( is_page_template( 'page-templates/template-home.php' ) ) {
    wp_enqueue_style( 'theme-home-style', … );
}
```

That way a landing page carries its own CSS and no other page pays for it.

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

The theme registers whatever it finds there, so starting a block is copying the
folder, renaming it in `block.json` and writing the three files. Nothing else
needs editing.

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
