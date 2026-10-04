const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

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

// entries maps a logical name to the file's path inside the theme
async function writeAssetsManifest(themeDir, entries) {
  const manifest = {};

  for (const [name, file] of Object.entries(entries).sort()) {
    const absolute = path.join(themeDir, file);

    if (!await fs.pathExists(absolute)) continue;

    manifest[name] = {
      file,
      version: await fingerprint(absolute)
    };
  }

  const target = path.join(themeDir, 'assets', 'assets.json');

  await fs.writeJson(target, manifest, { spaces: 4 });
  log(`Listed ${Object.keys(manifest).length} asset(s) in ${path.relative(ROOT, target)}`);
}

module.exports = {
  writeAssetsManifest
};
