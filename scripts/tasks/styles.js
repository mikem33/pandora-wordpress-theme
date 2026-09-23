const fs = require('fs-extra');
const path = require('path');
const stylus = require('stylus');

const ROOT = path.join(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

async function compileStylusFile(inputPath, outputPath) {
  const content = await fs.readFile(inputPath, 'utf-8');

  return new Promise((resolve, reject) => {
    // 'dest' makes both the sources and the sourceMappingURL relative to the CSS file
    const renderer = stylus(content)
      .set('filename', inputPath)
      .set('dest', outputPath)
      .set('compress', true)
      .set('include css', true)
      .set('sourcemap', { comment: true })
      .set('paths', [path.dirname(inputPath)]);

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

async function compileMainStyle(theme) {
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  const inputFile = path.join(themeBuild, 'assets', 'css', 'styl', 'style.styl');
  const outputFile = path.join(themeBuild, 'style.css');
  await compileStylusFile(inputFile, outputFile);
}

async function compilePageStyles(theme) {
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  const pagesDir = path.join(themeBuild, 'assets', 'css', 'styl', 'pages');
  const outputDir = path.join(themeBuild, 'assets', 'css', 'pages');

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

async function compileStyles(theme) {
  log(`Compiling stylesheets`);
  await compileMainStyle(theme);
  await compilePageStyles(theme);
}

module.exports = {
  compileStyles
};
