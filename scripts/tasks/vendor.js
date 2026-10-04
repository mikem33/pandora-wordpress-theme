const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

// The theme folder sits three levels below the project root, next to its
// manifest and node_modules
function projectRoot(themeDir) {
  return path.join(themeDir, '..', '..', '..');
}

// =============================================================================
// WHICH IMPORTS ARE LIBRARIES
// =============================================================================

// A bare specifier is a package: 'swiper', 'swiper/modules', '@scope/name'.
// Relative and root-relative paths are the theme's own code, and anything with
// a colon is a virtual module or a node: builtin.
function isPackage(id) {
  return !/^[./\0]/.test(id) && !id.includes(':');
}

// 'swiper/modules' and 'swiper' are the same library and travel in one file
function packageOf(id) {
  const parts = id.split('/');
  return id.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

// The name a library goes by in file names, manifest keys and handles:
// '@splidejs/splide' becomes 'splidejs-splide'
function vendorName(pkg) {
  return pkg.replace(/^@/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function identifier(value) {
  return value.replace(/[^a-z0-9]/gi, '_');
}

// What a script reads instead of importing. The build writes it on both sides,
// so nobody has to know it exists.
function vendorGlobal(id) {
  return `__vendor_${identifier(vendorName(packageOf(id)))}.${identifier(id)}`;
}

// Libraries listed under "bundle" in the manifest are left inside the file that
// imports them, the way it worked before: worth it for something small that
// only one place uses
async function bundledPackages(themeDir) {
  const manifest = path.join(projectRoot(themeDir), 'manifest.json');
  const { bundle = [] } = await fs.readJson(manifest);
  return new Set(bundle);
}

// Everything a script imports from npm stays out of its bundle, unless the
// manifest says otherwise
async function externals(themeDir) {
  const bundled = await bundledPackages(themeDir);
  return id => isPackage(id) && !bundled.has(packageOf(id));
}

// =============================================================================
// STYLESHEETS
// =============================================================================

// A library's CSS is pulled in with an @import from any .styl, partials
// included. Only Stylus walks the partials, so that is where the import has to
// be caught: it is noted down for the stylesheet being compiled and left out of
// it, and the library's CSS is emitted once on its own.
//
// Vite runs preprocessors in worker threads by default, each with its own copy
// of Stylus, so the stylesheet tasks keep them on the main thread for this to
// take effect.
let collecting = null;
let bundledCss = new Set();

function interceptStylusImports(themeDir) {
  const root = projectRoot(themeDir);
  const resolve = request => require.resolve(request, { paths: [root] });

  const Evaluator = require(resolve('stylus/lib/visitor/evaluator'));
  const nodes = require(resolve('stylus/lib/nodes'));

  if (Evaluator.prototype.visitImport.vendorAware) return;

  const original = Evaluator.prototype.visitImport;

  if (typeof original !== 'function') {
    throw new Error('Stylus no longer has Evaluator.prototype.visitImport: library CSS cannot be told apart');
  }

  function visitImport(imported) {
    const spec = imported.path && imported.path.first && imported.path.first.string;

    if (collecting && spec && /\.css$/.test(spec) && isPackage(spec) && !bundledCss.has(packageOf(spec))
        && fs.existsSync(path.join(root, 'node_modules', spec))) {
      collecting.add(spec);
      return nodes.null;
    }

    return original.call(this, imported);
  }

  visitImport.vendorAware = true;
  Evaluator.prototype.visitImport = visitImport;
}

// Runs a stylesheet build and returns the library CSS files it asked for
async function collectStylesheetImports(themeDir, compile) {
  interceptStylusImports(themeDir);
  bundledCss = await bundledPackages(themeDir);

  collecting = new Set();

  try {
    await compile();
    return [...collecting];
  } finally {
    collecting = null;
  }
}

// =============================================================================
// EMITTING THE LIBRARIES
// =============================================================================

// Every library path the theme's scripts and stylesheets used, grouped by
// library, from the entries the other tasks returned
function usedLibraries(entries) {
  const scripts = {};
  const styles = {};

  for (const entry of Object.values(entries)) {
    if (typeof entry !== 'object') continue;

    for (const id of entry.scripts || []) (scripts[packageOf(id)] ??= new Set()).add(id);
    for (const id of entry.styles || []) (styles[packageOf(id)] ??= new Set()).add(id);
  }

  return { scripts, styles };
}

// One script per library, holding every path of it the theme imports, so
// 'swiper' and 'swiper/modules' share one copy of what they have in common.
// Each path is exposed as a module namespace marked as such: without the mark a
// default import would get the whole namespace instead of the default export.
async function bundleVendorScript(themeDir, pkg, ids) {
  const { build } = require('vite');
  const name = vendorName(pkg);
  const entry = `virtual:vendor-${name}`;
  const outDir = path.posix.join('assets', 'javascript', 'vendor');

  const source = [
    ...ids.map((id, i) => `import * as m${i} from ${JSON.stringify(id)};`),
    ...ids.map((id, i) => `const n${i} = Object.assign({ __esModule: true }, m${i});`),
    `export { ${ids.map((id, i) => `n${i} as ${identifier(id)}`).join(', ')} };`
  ].join('\n');

  await build({
    root: themeDir,
    configFile: path.join(projectRoot(themeDir), 'vite.config.mjs'),
    logLevel: 'warn',
    plugins: [{
      name: 'vendor-entry',
      resolveId: id => id === entry ? `\0${entry}` : null,
      load: id => id === `\0${entry}` ? source : null
    }],
    build: {
      outDir,
      emptyOutDir: false,
      minify: true,
      rollupOptions: {
        input: entry,
        // An entry nobody imports would otherwise be emptied of its exports
        preserveEntrySignatures: 'strict',
        output: {
          format: 'iife',
          name: `__vendor_${identifier(name)}`,
          entryFileNames: `${name}.js`
        }
      }
    }
  });

  log(`Bundled ${pkg} → ${path.relative(ROOT, path.join(themeDir, outDir, `${name}.js`))}`);

  return { [`vendor.${name}.js`]: path.posix.join(outDir, `${name}.js`) };
}

// One stylesheet per library with every file of it the theme imports. Built
// through Vite so the url()s inside it are rewritten from where they were.
async function compileVendorStyle(themeDir, pkg, specs) {
  const { build } = require('vite');
  const name = vendorName(pkg);
  const outDir = path.posix.join('assets', 'css', 'vendor');
  const staging = path.join(themeDir, 'assets', 'css', '.vendor');
  const entry = path.join(staging, `${name}.css`);
  const modules = path.join(projectRoot(themeDir), 'node_modules');

  // Relative paths: Vite reads a leading slash as the theme folder
  await fs.outputFile(entry, specs
    .map(spec => `@import ${JSON.stringify(path.relative(staging, path.join(modules, spec)))};`)
    .join('\n'));

  try {
    await build({
      root: themeDir,
      configFile: path.join(projectRoot(themeDir), 'vite.config.mjs'),
      logLevel: 'warn',
      build: {
        outDir,
        emptyOutDir: false,
        cssMinify: true,
        rollupOptions: {
          input: '/' + path.posix.join('assets', 'css', '.vendor', `${name}.css`),
          output: {
            assetFileNames: asset => (asset.names || [asset.name]).some(file => file && file.endsWith('.css'))
              ? `${name}.css`
              : `${name}-[hash][extname]`
          }
        }
      }
    });
  } finally {
    await fs.remove(staging);
  }

  log(`Compiled ${pkg} styles → ${path.relative(ROOT, path.join(themeDir, outDir, `${name}.css`))}`);

  return { [`vendor.${name}.css`]: path.posix.join(outDir, `${name}.css`) };
}

async function buildVendors(themeDir, entries) {
  const { scripts, styles } = usedLibraries(entries);
  const produced = {};

  for (const [pkg, ids] of Object.entries(scripts)) {
    Object.assign(produced, await bundleVendorScript(themeDir, pkg, [...ids].sort()));
  }

  for (const [pkg, specs] of Object.entries(styles)) {
    Object.assign(produced, await compileVendorStyle(themeDir, pkg, [...specs].sort()));
  }

  return produced;
}

// What a manifest entry depends on, by the logical names of the libraries
function vendorDependencies(entry) {
  return [
    ...new Set((entry.scripts || []).map(id => `vendor.${vendorName(packageOf(id))}.js`)),
    ...new Set((entry.styles || []).map(id => `vendor.${vendorName(packageOf(id))}.css`))
  ];
}

module.exports = {
  vendorGlobal,
  externals,
  collectStylesheetImports,
  buildVendors,
  vendorDependencies
};
