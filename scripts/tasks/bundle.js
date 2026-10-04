const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

// The project's own config, shared with the stylesheets and with the dev server
function viteConfig(themeDir) {
  return path.join(themeDir, '..', '..', '..', 'vite.config.mjs');
}

// One Vite build per output file. IIFE cannot take several entries at once, and
// the theme's scripts are plain scripts, not modules WordPress would load as
// such.
// outDir goes relative to root: Vite joins it to the root even when given an
// absolute path
async function bundleFile({ root, entry, outDir, fileName, name }) {
  const { build } = require('vite');

  await build({
    root,
    configFile: viteConfig(root),
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: false,
      minify: true,
      // No hashes yet: the PHP still enqueues these names
      rollupOptions: {
        input: entry,
        output: {
          format: 'iife',
          name,
          entryFileNames: fileName
        }
      }
    }
  });
}

// Everything in compile/ is bundled together, in alphabetical order, the way the
// concatenation used to work. The difference is that those files can now import
// from node_modules.
function entryPlugin(files) {
  const id = 'virtual:theme-scripts';

  return {
    name: 'theme-scripts-entry',
    resolveId(source) {
      if (source === id) return `\0${id}`;
    },
    load(resolved) {
      if (resolved !== `\0${id}`) return null;
      return files.map(file => `import ${JSON.stringify(file)};`).join('\n');
    }
  };
}

async function bundleJavaScript(themeDir) {
  const compileDir = path.join(themeDir, 'assets', 'javascript', 'compile');

  if (!await fs.pathExists(compileDir)) {
    log(`No JavaScript to bundle`);
    return {};
  }

  const files = (await fs.readdir(compileDir))
    .filter(file => file.endsWith('.js'))
    .sort()
    // Vite reads a leading slash as relative to the project root, which is what
    // the theme folder is here
    .map(file => '/' + path.posix.join('assets', 'javascript', 'compile', file));

  if (files.length === 0) return {};

  const { build } = require('vite');
  const outDir = path.posix.join('assets', 'javascript');

  // rollupOptions rather than lib: a lib entry is resolved as a path before the
  // plugins run, so the virtual module never reaches them
  await build({
    root: themeDir,
    configFile: viteConfig(themeDir),
    logLevel: 'warn',
    plugins: [entryPlugin(files)],
    build: {
      outDir,
      emptyOutDir: false,
      minify: true,
      rollupOptions: {
        input: 'virtual:theme-scripts',
        output: {
          format: 'iife',
          name: 'theme',
          entryFileNames: 'javascript.min.js'
        }
      }
    }
  });

  log(`Bundled ${files.length} file(s) → ${path.relative(ROOT, path.join(themeDir, outDir, 'javascript.min.js'))}`);

  return { 'theme.js': path.posix.join(outDir, 'javascript.min.js') };
}

// A .js sitting in compile/pages/ is a script of its own, bundled to
// assets/javascript/pages/ and loaded only from the template that needs it. The
// general bundle leaves them alone: it reads the files at the root of compile/.
async function bundlePageScripts(themeDir) {
  const pagesDir = path.join(themeDir, 'assets', 'javascript', 'compile', 'pages');
  const entries = {};

  if (!await fs.pathExists(pagesDir)) return entries;

  const outDir = path.posix.join('assets', 'javascript', 'pages');

  for (const file of (await fs.readdir(pagesDir)).sort()) {
    if (!file.endsWith('.js')) continue;

    const name = file.replace(/\.js$/, '');

    await bundleFile({
      root: themeDir,
      entry: '/' + path.posix.join('assets', 'javascript', 'compile', 'pages', file),
      outDir,
      fileName: `${name}.js`,
      name: `page_${name.replace(/-/g, '_')}`
    });

    log(`Bundled ${path.relative(ROOT, path.join(pagesDir, file))} → ${path.relative(ROOT, path.join(themeDir, outDir, `${name}.js`))}`);

    entries[`page.${name}.js`] = path.posix.join(outDir, `${name}.js`);
  }

  return entries;
}

async function bundleBlockScripts(themeDir) {
  const blocksDir = path.join(themeDir, 'blocks');
  const entries = {};

  if (!await fs.pathExists(blocksDir)) return entries;

  const outDir = path.posix.join('assets', 'javascript', 'blocks');

  for (const entry of await fs.readdir(blocksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    for (const [source, suffix] of [['editor.js', ''], ['view.js', '-view']]) {
      const file = path.join(blocksDir, entry.name, source);
      if (!await fs.pathExists(file)) continue;

      await bundleFile({
        root: themeDir,
        entry: '/' + path.posix.join('blocks', entry.name, source),
        outDir,
        fileName: `${entry.name}${suffix}.js`,
        name: `block_${entry.name.replace(/-/g, '_')}${suffix.replace('-', '_')}`
      });

      log(`Bundled ${path.relative(ROOT, file)} → ${path.relative(ROOT, path.join(themeDir, outDir, `${entry.name}${suffix}.js`))}`);

      const name = suffix ? `block.${entry.name}.view.js` : `block.${entry.name}.editor.js`;
      entries[name] = path.posix.join(outDir, `${entry.name}${suffix}.js`);
    }
  }

  return entries;
}

module.exports = {
  bundleJavaScript,
  bundlePageScripts,
  bundleBlockScripts
};
