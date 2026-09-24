const fs = require('fs-extra');
const path = require('path');
const stylus = require('stylus');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

async function compileStylusFile(inputPath, outputPath, extraPaths = []) {
  const content = await fs.readFile(inputPath, 'utf-8');

  return new Promise((resolve, reject) => {
    // 'dest' makes both the sources and the sourceMappingURL relative to the CSS file
    const renderer = stylus(content)
      .set('filename', inputPath)
      .set('dest', outputPath)
      .set('compress', true)
      .set('include css', true)
      .set('sourcemap', { comment: true })
      .set('paths', [path.dirname(inputPath), ...extraPaths]);

    renderer.render(async (err, css) => {
      if (err) {
        logError(`Stylus compilation error in ${inputPath}: ${err.message}`);
        reject(err);
        return;
      }

      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, css, 'utf-8');
      await fs.writeFile(`${outputPath}.map`, JSON.stringify(renderer.sourcemap), 'utf-8');
      log(`Compiled ${path.relative(ROOT, inputPath)} → ${path.relative(ROOT, outputPath)}`);

      resolve();
    });
  });
}

async function compileMainStyle(themeDir) {
  const inputFile = path.join(themeDir, 'assets', 'css', 'styl', 'style.styl');
  const outputFile = path.join(themeDir, 'style.css');
  await compileStylusFile(inputFile, outputFile);
}

async function compilePageStyles(themeDir) {
  const pagesDir = path.join(themeDir, 'assets', 'css', 'styl', 'pages');
  const outputDir = path.join(themeDir, 'assets', 'css', 'pages');

  if (!await fs.pathExists(pagesDir)) {
    log(`Pages directory not found, skipping page styles`);
    return;
  }

  const files = await fs.readdir(pagesDir);
  for (const file of files) {
    if (!file.endsWith('.styl')) continue;

    const inputFile = path.join(pagesDir, file);
    const outputFile = path.join(outputDir, file.replace('.styl', '.css'));
    await compileStylusFile(inputFile, outputFile);
  }
}

// Each block keeps its CSS next to it, which is what block.json points at
async function compileBlockStyles(themeDir) {
  const blocksDir = path.join(themeDir, 'blocks');

  if (!await fs.pathExists(blocksDir)) return;

  const entries = await fs.readdir(blocksDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const inputFile = path.join(blocksDir, entry.name, 'style.styl');
    if (!await fs.pathExists(inputFile)) continue;

    // The theme's styl folder goes in as a lookup path, so a block can import
    // the same utilities the main stylesheet uses
    await compileStylusFile(
      inputFile,
      path.join(blocksDir, entry.name, 'style.css'),
      [path.join(themeDir, 'assets', 'css', 'styl')]
    );
  }
}

async function compileStyles(themeDir) {
  log(`Compiling stylesheets`);
  await compileMainStyle(themeDir);
  await compilePageStyles(themeDir);
  await compileBlockStyles(themeDir);
}

module.exports = {
  compileStyles
};
