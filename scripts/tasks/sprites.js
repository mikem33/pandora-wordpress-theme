const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');

const SVG_TAG = /<svg\b([^>]*)>([\s\S]*)<\/svg>/i;
const VIEW_BOX = /viewBox\s*=\s*["']([^"']+)["']/i;

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

function buildSymbol(name, svg) {
  const tag = svg.match(SVG_TAG);
  if (!tag) return null;

  const [, attributes, content] = tag;
  const viewBox = attributes.match(VIEW_BOX);
  if (!viewBox) return null;

  return `<symbol id="icon-${name}" viewBox="${viewBox[1]}">${content.trim()}</symbol>`;
}

async function compileSvgSprites(theme) {
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  const spritesDir = path.join(themeBuild, 'assets', 'images', '_sprites-svg');
  const outputFile = path.join(themeBuild, 'assets', 'images', 'sprite.svg');

  if (!await fs.pathExists(spritesDir)) {
    log(`No SVG sprites directory, skipping sprite generation`);
    return;
  }

  const files = (await fs.readdir(spritesDir)).filter(file => file.endsWith('.svg')).sort();
  const symbols = [];

  for (const file of files) {
    const svg = await fs.readFile(path.join(spritesDir, file), 'utf-8');
    const symbol = buildSymbol(path.basename(file, '.svg'), svg);

    if (!symbol) {
      logError(`Skipping ${file}: no <svg> root element with a viewBox`);
      continue;
    }

    symbols.push(symbol);
  }

  if (symbols.length === 0) {
    log(`No SVG sprites to compile`);
    return;
  }

  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>`;

  await fs.writeFile(outputFile, sprite, 'utf-8');
  log(`Compiled ${symbols.length} sprite(s) → ${path.relative(ROOT, outputFile)}`);
}

module.exports = {
  compileSvgSprites
};
