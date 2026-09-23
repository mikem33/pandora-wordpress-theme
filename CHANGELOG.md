# Changelog

## [Unreleased - Modernization in Progress]

### Modernization Plan (June 2026)
- Phase 0: Preparation for the Gulp → Node orchestrator migration
  - Branch: `upgrade`
  - Reference point: Gulp build system v4.0.2
  - Goal: Replace Gulp with a custom Node script. A bundler (Vite) is only
    evaluated in Phase 3, if the Gutenberg blocks call for one

#### Current Gulp Build System (Baseline - 2026-06-17)
Build steps replicated in new system:
1. `clean-build` — Removes `build/` directory
2. `copy-theme-files` — Copies `src/wp-content/themes/theme/**` → `build/wp-content/themes/pandora`
3. `copy-manifest` — Copies `manifest.json` → `build/`
4. `copy-development-files` — Copies root files from `src/` (`.gitignore`, etc.)
5. `checktextdomain` — Scans and corrects PHP textdomains using theme slug
6. `replace-css-handlebars` — Replaces placeholders (`{{theme_name}}`, `{{theme_slug}}`, `{{theme_version}}`, etc.) with real values from `manifest.json`
7. `main-style` — Compiles `style.styl` to CSS (minified, sourcemaps in dev)
8. `pages-style` — Compiles `pages/*.styl` files to separate CSS
9. `js` — Concatenates and minifies JavaScript files
10. *Planned*: `svgsprites` — Generates SVG sprite from `assets/images/_sprites-svg/*.svg`

#### Dependencies (baseline)
- Gulp 4.0.2
- gulp-stylus 2.7.0
- gulp-concat 2.6.1
- gulp-uglify 3.0.2
- gulp-sourcemaps 2.6.5
- gulp-replace 1.1.4
- gulp-checktextdomain 2.2.1
- fs-extra 8.1.0

#### Phase 1 — Node build system (done)
- `scripts/build.js` orchestrates the build; each step lives in `scripts/tasks/`
- Stylus compiled with the `stylus` library, CSS sourcemaps included
- JavaScript concatenated and minified with `terser`, still a single
  `javascript.min.js`
- SVG sprite generation implemented without dependencies: the SVG files in
  `assets/images/_sprites-svg/` become `<symbol>` elements in a single
  `sprite.svg`
- Watch mode (`pnpm dev`) rebuilds on change, skipping chokidar's initial scan
- The generated theme now gets its own `.gitignore` and `package.json` from
  `src/`, with the manifest values replaced, instead of the boilerplate's
- `build/` is no longer versioned: it is regenerated with `pnpm build`
- pnpm pinned to 12.6.0 and `pnpm-lock.yaml` tracked
- Runtime dependencies: fs-extra, stylus, terser, chokidar

---

## [2.0.1] - 2026-06-17 (Baseline)
- Last version before modernization
- Gulp-based build system
- jQuery removed in previous commit
- Build structure: `src/` → `build/`
