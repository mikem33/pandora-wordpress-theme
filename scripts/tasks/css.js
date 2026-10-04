const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
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
    configFile: false,
    logLevel: 'warn',
    css: {
      preprocessorOptions: {
        // Keyed by file extension, styl, not by the preprocessor's name: with
        // 'stylus' Vite silently ignores every option here
        styl: {
          // Lets a stylesheet inline a plain .css it imports, from the theme or
          // from node_modules
          'include css': true,
          paths: [
            path.join(themeDir, 'assets', 'css', 'styl'),
            path.join(ROOT, 'node_modules')
          ]
        }
      }
    },
    build: {
      outDir,
      emptyOutDir: false,
      cssMinify: true,
      // Without this the minifier rewrites the media queries to range syntax
      // (width>=75rem), which Safari below 16.4 ignores altogether
      cssTarget: ['chrome90', 'firefox90', 'safari14'],
      rollupOptions: {
        input: entry,
        output: { assetFileNames: fileName }
      }
    }
  });

  log(`Compiled ${entry.replace(/^\//, '')} → ${path.posix.join(outDir === '.' ? '' : outDir, fileName)}`);
}

async function compileMainStyle(themeDir, theme) {
  await compileStylesheet(themeDir, '/assets/css/styl/style.styl', '.', 'style.css');

  const stylesheet = path.join(themeDir, 'style.css');
  const css = await fs.readFile(stylesheet, 'utf-8');
  await fs.writeFile(stylesheet, themeHeader(theme) + css, 'utf-8');
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
