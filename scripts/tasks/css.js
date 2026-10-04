const fs = require('fs-extra');
const path = require('path');

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
// inlined. They come back in development once the dev server serves the CSS.
async function compileStylesheet(themeDir, entry, outDir, fileName) {
  const { build } = require('vite');

  await build({
    root: themeDir,
    configFile: viteConfig(themeDir),
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: false,
      cssMinify: true,
      rollupOptions: {
        input: entry,
        output: { assetFileNames: fileName }
      }
    }
  });

  log(`Compiled ${entry.replace(/^\//, '')} → ${path.posix.join(outDir === '.' ? '' : outDir, fileName)}`);
}

// style.css has to sit at the theme root, which is where WordPress reads the
// header from. Vite refuses to treat that as an output directory, and rightly
// so: with emptyOutDir on it would wipe the theme. So it is built aside and
// moved into place.
async function compileMainStyle(themeDir, theme) {
  const staging = path.posix.join('assets', 'css', '.build');

  await compileStylesheet(themeDir, '/assets/css/styl/style.styl', staging, 'style.css');

  const built = path.join(themeDir, staging, 'style.css');
  const stylesheet = path.join(themeDir, 'style.css');

  await fs.writeFile(stylesheet, themeHeader(theme) + await fs.readFile(built, 'utf-8'), 'utf-8');
  await fs.remove(path.join(themeDir, staging));
}

async function compilePageStyles(themeDir) {
  const pagesDir = path.join(themeDir, 'assets', 'css', 'styl', 'pages');

  if (!await fs.pathExists(pagesDir)) return;

  for (const file of (await fs.readdir(pagesDir)).sort()) {
    if (!file.endsWith('.styl')) continue;

    await compileStylesheet(
      themeDir,
      '/' + path.posix.join('assets', 'css', 'styl', 'pages', file),
      path.posix.join('assets', 'css', 'pages'),
      file.replace(/\.styl$/, '.css')
    );
  }
}

async function compileBlockStyles(themeDir) {
  const blocksDir = path.join(themeDir, 'blocks');

  if (!await fs.pathExists(blocksDir)) return;

  const outDir = path.posix.join('assets', 'css', 'blocks');

  for (const entry of await fs.readdir(blocksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    // editor.styl is only loaded in the editor, hence its own file
    for (const [source, suffix] of [['style.styl', ''], ['editor.styl', '-editor']]) {
      if (!await fs.pathExists(path.join(blocksDir, entry.name, source))) continue;

      await compileStylesheet(
        themeDir,
        '/' + path.posix.join('blocks', entry.name, source),
        outDir,
        `${entry.name}${suffix}.css`
      );
    }
  }
}

async function compileStyles(themeDir, theme) {
  log(`Compiling stylesheets`);
  await compileMainStyle(themeDir, theme);
  await compilePageStyles(themeDir);
  await compileBlockStyles(themeDir);
}

module.exports = {
  compileStyles
};
