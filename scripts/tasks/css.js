const fs = require('fs-extra');
const path = require('path');

const { collectStylesheetImports } = require('./vendor');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

// The project's own config: the Stylus options and the CSS target live there, so
// a project can adjust them without touching these tasks
function viteConfig(themeDir) {
  return path.join(themeDir, '..', '..', '..', 'vite.config.mjs');
}

// WordPress identifies a theme by this comment, and a CSS minifier is free to
// drop comments, so the build writes it instead of carrying it through Stylus.
function themeHeader(theme) {
  return [
    '/*',
    `Theme Name: ${theme.name}`,
    `Description: ${theme.description}`,
    `Author: ${theme.author}`,
    `Author URI: ${theme.author_uri}`,
    `Version: ${theme.version}`,
    '*/',
    ''
  ].join('\n');
}

// One Vite build per stylesheet. A .styl entry emits only its CSS, and outDir is
// read relative to the root, which is the theme folder.
//
// No sourcemaps: Vite emits none for a CSS-only entry, neither as a file nor
// inlined.
//
// Returns the library stylesheets it @imported, which are left out of it and
// emitted once on their own. Stylus runs on the main thread for that: in a
// worker the import would never be seen.
async function compileStylesheet(themeDir, entry, outDir, fileName) {
  const { build } = require('vite');

  const styles = await collectStylesheetImports(themeDir, () => build({
    root: themeDir,
    configFile: viteConfig(themeDir),
    logLevel: 'warn',
    css: { preprocessorMaxWorkers: 0 },
    build: {
      outDir,
      emptyOutDir: false,
      cssMinify: true,
      rollupOptions: {
        input: entry,
        output: { assetFileNames: fileName }
      }
    }
  }));

  log(`Compiled ${entry.replace(/^\//, '')} → ${path.posix.join(outDir === '.' ? '' : outDir, fileName)}`);

  return styles;
}

// style.css has to sit at the theme root, which is where WordPress reads the
// header from. Vite refuses to treat that as an output directory, and rightly
// so: with emptyOutDir on it would wipe the theme. So it is built aside and
// moved into place.
async function compileMainStyle(themeDir, theme) {
  const staging = path.posix.join('assets', 'css', '.build');

  const styles = await compileStylesheet(themeDir, '/assets/css/styl/style.styl', staging, 'style.css');

  const built = path.join(themeDir, staging, 'style.css');
  const stylesheet = path.join(themeDir, 'style.css');

  await fs.writeFile(stylesheet, themeHeader(theme) + await fs.readFile(built, 'utf-8'), 'utf-8');
  await fs.remove(path.join(themeDir, staging));

  return { 'theme.css': { file: 'style.css', styles } };
}

// A .styl sitting at the root of styl/ is a stylesheet of its own, compiled to
// assets/css/. Partials start with an underscore and style.styl has its own
// place, at the theme root.
async function compileRootStyles(themeDir) {
  const stylDir = path.join(themeDir, 'assets', 'css', 'styl');
  const entries = {};

  for (const file of (await fs.readdir(stylDir)).sort()) {
    if (!file.endsWith('.styl') || file.startsWith('_') || file === 'style.styl') continue;

    const name = file.replace(/\.styl$/, '');

    const styles = await compileStylesheet(
      themeDir,
      '/' + path.posix.join('assets', 'css', 'styl', file),
      path.posix.join('assets', 'css'),
      `${name}.css`
    );

    entries[`${name}.css`] = { file: path.posix.join('assets', 'css', `${name}.css`), styles };
  }

  return entries;
}

async function compilePageStyles(themeDir) {
  const pagesDir = path.join(themeDir, 'assets', 'css', 'styl', 'pages');
  const entries = {};

  if (!await fs.pathExists(pagesDir)) return entries;

  for (const file of (await fs.readdir(pagesDir)).sort()) {
    // Partials are imported by the pages, not pages of their own
    if (!file.endsWith('.styl') || file.startsWith('_')) continue;

    const name = file.replace(/\.styl$/, '');

    const styles = await compileStylesheet(
      themeDir,
      '/' + path.posix.join('assets', 'css', 'styl', 'pages', file),
      path.posix.join('assets', 'css', 'pages'),
      `${name}.css`
    );

    entries[`page.${name}.css`] = { file: path.posix.join('assets', 'css', 'pages', `${name}.css`), styles };
  }

  return entries;
}

async function compileBlockStyles(themeDir) {
  const blocksDir = path.join(themeDir, 'blocks');
  const entries = {};

  if (!await fs.pathExists(blocksDir)) return entries;

  const outDir = path.posix.join('assets', 'css', 'blocks');

  for (const entry of await fs.readdir(blocksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    // editor.styl is only loaded in the editor, hence its own file
    for (const [source, suffix] of [['style.styl', ''], ['editor.styl', '-editor']]) {
      if (!await fs.pathExists(path.join(blocksDir, entry.name, source))) continue;

      const styles = await compileStylesheet(
        themeDir,
        '/' + path.posix.join('blocks', entry.name, source),
        outDir,
        `${entry.name}${suffix}.css`
      );

      const name = suffix ? `block.${entry.name}.editor.css` : `block.${entry.name}.css`;
      entries[name] = { file: path.posix.join(outDir, `${entry.name}${suffix}.css`), styles };
    }
  }

  return entries;
}

async function compileStyles(themeDir, theme) {
  log(`Compiling stylesheets`);

  return Object.assign(
    await compileMainStyle(themeDir, theme),
    await compileRootStyles(themeDir),
    await compilePageStyles(themeDir),
    await compileBlockStyles(themeDir)
  );
}

module.exports = {
  compileStyles
};
