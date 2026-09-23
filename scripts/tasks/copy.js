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
  // Copy .gitignore from root
  const gitignoreSrc = path.join(ROOT, '.gitignore');
  if (await fs.pathExists(gitignoreSrc)) {
    await copyFile(gitignoreSrc, path.join(BUILD, '.gitignore'));
  }

  // Copy package.json from root
  const packageJsonSrc = path.join(ROOT, 'package.json');
  if (await fs.pathExists(packageJsonSrc)) {
    await copyFile(packageJsonSrc, path.join(BUILD, 'package.json'));
  }

  // Copy scripts/ directory
  const scriptsSrc = path.join(ROOT, 'scripts');
  const scriptsDest = path.join(BUILD, 'scripts');
  if (await fs.pathExists(scriptsSrc)) {
    await copyDir(scriptsSrc, scriptsDest);
  }
}

module.exports = {
  copyThemeFiles,
  copyManifest,
  copyDevelopmentFiles
};
