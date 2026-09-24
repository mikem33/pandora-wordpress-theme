const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src');
const BUILD = path.join(ROOT, 'build');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

async function copyFile(src, dest) {
  log(`Copying ${path.relative(ROOT, src)}`);
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest);
}

async function copyDir(src, dest) {
  log(`Copying ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
  await fs.copy(src, dest);
}

async function copyThemeFiles(theme) {
  const themeSrc = path.join(SRC, 'wp-content', 'themes', 'theme');
  const themeDest = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  await copyDir(themeSrc, themeDest);
}

// The generated project gets its own manifest, with the identity it was built
// with. The one in the repo root is only the default and is never touched.
async function writeManifest(theme) {
  const manifest = await fs.readJson(path.join(ROOT, 'manifest.json'));
  const dest = path.join(BUILD, 'manifest.json');

  await fs.ensureDir(BUILD);
  await fs.writeJson(dest, { ...manifest, theme }, { spaces: 4 });
  log(`Writing ${path.relative(ROOT, dest)}`);
}

// The generator (build.js, copy, placeholders, textdomain) stays behind: the
// generated project has no src/ to generate from, it compiles in place
const THEME_TOOLCHAIN = [
  'theme.js',
  path.join('tasks', 'styles.js'),
  path.join('tasks', 'scripts.js'),
  path.join('tasks', 'sprites.js'),
  path.join('tasks', 'theme-json.js')
];

async function copyDevelopmentFiles() {
  // These belong to the generated theme, not to this repo, so they come from src/
  await copyFile(path.join(SRC, '.gitignore'), path.join(BUILD, '.gitignore'));
  await copyFile(path.join(SRC, 'package.json'), path.join(BUILD, 'package.json'));

  for (const file of THEME_TOOLCHAIN) {
    await copyFile(path.join(ROOT, 'scripts', file), path.join(BUILD, 'scripts', file));
  }
}

module.exports = {
  copyThemeFiles,
  writeManifest,
  copyDevelopmentFiles
};
