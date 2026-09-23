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

async function copyManifest() {
  await copyFile(path.join(ROOT, 'manifest.json'), path.join(BUILD, 'manifest.json'));
}

async function copyDevelopmentFiles() {
  // These belong to the generated theme, not to this repo, so they come from src/
  await copyFile(path.join(SRC, '.gitignore'), path.join(BUILD, '.gitignore'));
  await copyFile(path.join(SRC, 'package.json'), path.join(BUILD, 'package.json'));

  await copyDir(path.join(ROOT, 'scripts'), path.join(BUILD, 'scripts'));
}

module.exports = {
  copyThemeFiles,
  copyManifest,
  copyDevelopmentFiles
};
