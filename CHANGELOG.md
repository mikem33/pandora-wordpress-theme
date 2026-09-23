# Changelog

## [Unreleased - Modernization in Progress]

### Modernization Plan (June 2026)
- Phase 0: Preparation for Gulp → Vite + Node orchestrator migration
  - Branch: `upgrade`
  - Reference point: Gulp build system v4.0.2
  - Goal: Replace Gulp with custom Node script + Vite for JS/blocks

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

#### Dependencies
- Gulp 4.0.2
- gulp-stylus 2.7.0
- gulp-concat 2.6.1
- gulp-uglify 3.0.2
- gulp-sourcemaps 2.6.5
- gulp-replace 1.1.4
- gulp-checktextdomain 2.2.1
- fs-extra 8.1.0

---

## [2.0.1] - 2026-06-17 (Baseline)
- Last version before modernization
- Gulp-based build system
- jQuery removed in previous commit
- Build structure: `src/` → `build/`
