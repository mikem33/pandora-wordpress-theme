const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function title(slug) {
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function clamp(min, fluid, max) {
  return min === max ? min : `clamp(${min}, ${fluid}, ${max})`;
}

function palette(colors) {
  return Object.entries(colors).map(([slug, color]) => ({ slug, name: title(slug), color }));
}

function fontSizes(sizes) {
  return Object.entries(sizes).map(([slug, size]) => ({
    slug,
    name: title(slug),
    size: clamp(size.min, size.fluid, size.max)
  }));
}

function spacingSizes(spacing) {
  return Object.entries(spacing).map(([slug, size], index) => ({
    slug,
    name: String(index + 1),
    size
  }));
}

async function generateThemeJson(themeDir) {
  const tokensPath = path.join(themeDir, 'tokens.json');
  const themeJsonPath = path.join(themeDir, 'theme.json');

  const tokens = await fs.readJson(tokensPath);
  const themeJson = await fs.readJson(themeJsonPath);

  themeJson.settings.layout = tokens.layout;
  themeJson.settings.color.palette = palette(tokens.colors);
  themeJson.settings.typography.fontSizes = fontSizes(tokens.fontSizes);
  themeJson.settings.spacing.spacingSizes = spacingSizes(tokens.spacing);

  await fs.writeJson(themeJsonPath, themeJson, { spaces: 4 });
  log(`Wrote the tokens into ${path.relative(ROOT, themeJsonPath)}`);
}

module.exports = {
  generateThemeJson
};
