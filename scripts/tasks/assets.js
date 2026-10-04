const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const { vendorDependencies } = require('./vendor');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

// Short hash of the file's contents. It goes in the version query of every
// asset, so a changed file is a changed URL and nobody has to bump a number by
// hand. style.css cannot be renamed — WordPress reads the theme header from
// that exact name — so versioning this way covers it too.
async function fingerprint(file) {
  const contents = await fs.readFile(file);
  return crypto.createHash('sha256').update(contents).digest('hex').slice(0, 12);
}

// entries maps a logical name to the file's path inside the theme, or to an
// object with that path and the libraries the file imported. Those become deps,
// the logical names of the library files the PHP loads first.
async function writeAssetsManifest(themeDir, entries) {
  const manifest = {};

  for (const [name, entry] of Object.entries(entries).sort()) {
    const file = typeof entry === 'object' ? entry.file : entry;
    const absolute = path.join(themeDir, file);

    if (!await fs.pathExists(absolute)) continue;

    const deps = typeof entry === 'object' ? vendorDependencies(entry) : [];

    manifest[name] = {
      file,
      version: await fingerprint(absolute),
      ...(deps.length ? { deps } : {})
    };
  }

  const target = path.join(themeDir, 'assets', 'assets.json');

  await fs.writeJson(target, manifest, { spaces: 4 });
  log(`Listed ${Object.keys(manifest).length} asset(s) in ${path.relative(ROOT, target)}`);
}

module.exports = {
  writeAssetsManifest
};
