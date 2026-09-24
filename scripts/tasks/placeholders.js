const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

const REQUIRED = ['slug', 'prefix', 'name', 'description', 'author', 'author_uri', 'version'];

function applyPlaceholders(content, theme) {
  return content
    .replace(/{{theme_name}}/g, theme.name)
    .replace(/{{theme_description}}/g, theme.description)
    .replace(/{{theme_author}}/g, theme.author)
    .replace(/{{theme_author_uri}}/g, theme.author_uri)
    .replace(/{{theme_version}}/g, theme.version)
    .replace(/{{theme_slug}}/g, theme.slug)
    .replace(/{{theme_prefix}}/g, theme.prefix);
}

async function replaceInFiles(filePaths, theme) {
  for (const filePath of filePaths) {
    if (!await fs.pathExists(filePath)) continue;

    const content = await fs.readFile(filePath, 'utf-8');
    const replaced = applyPlaceholders(content, theme);

    if (replaced === content) continue;

    await fs.writeFile(filePath, replaced, 'utf-8');
    log(`Replaced placeholders in ${path.relative(ROOT, filePath)}`);
  }
}

// The PHP of the theme, plus what the blocks declare about themselves
async function filesWithPlaceholders(themeDir) {
  const entries = await fs.readdir(themeDir, { recursive: true });
  return entries
    .filter(entry => entry.endsWith('.php') || entry.endsWith('block.json') || entry.endsWith(path.join('blocks', 'editor.js')))
    .map(entry => path.join(themeDir, entry));
}

async function replacePlaceholders(theme) {
  const missing = REQUIRED.filter(key => !theme[key]);

  if (missing.length > 0) {
    throw new Error(`manifest.json is missing theme.${missing.join(', theme.')}`);
  }

  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);

  const filesToReplace = [
    path.join(themeBuild, 'assets', 'css', 'styl', 'style.styl'),
    path.join(BUILD, 'manifest.json'),
    path.join(BUILD, 'package.json'),
    ...await filesWithPlaceholders(themeBuild)
  ];

  await replaceInFiles(filesToReplace, theme);
}

module.exports = {
  replacePlaceholders
};
