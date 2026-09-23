const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function replacePlaceholders(content, theme) {
  return content
    .replace(/{{theme_name}}/g, theme.name)
    .replace(/{{theme_description}}/g, theme.description)
    .replace(/{{theme_author}}/g, theme.author)
    .replace(/{{theme_author_uri}}/g, theme.author_uri)
    .replace(/{{theme_version}}/g, theme.version)
    .replace(/{{theme_slug}}/g, theme.slug);
}

async function replaceInFiles(filePaths, theme) {
  for (const filePath of filePaths) {
    if (!await fs.pathExists(filePath)) continue;

    const content = await fs.readFile(filePath, 'utf-8');
    const replaced = replacePlaceholders(content, theme);
    await fs.writeFile(filePath, replaced, 'utf-8');
    log(`Replaced placeholders in ${path.relative(ROOT, filePath)}`);
  }
}

async function replaceCssHandlebars(theme) {
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  const filesToReplace = [
    path.join(themeBuild, 'assets', 'css', 'styl', 'style.styl'),
    path.join(BUILD, 'manifest.json'),
    path.join(BUILD, 'package.json')
  ];

  await replaceInFiles(filesToReplace, theme);
}

module.exports = {
  replaceCssHandlebars
};
