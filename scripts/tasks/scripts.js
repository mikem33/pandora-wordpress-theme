const fs = require('fs-extra');
const path = require('path');
const { minify } = require('terser');

const ROOT = path.join(__dirname, '..', '..');
const BUILD = path.join(ROOT, 'build');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

async function compileJavaScript(theme) {
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  const compileDir = path.join(themeBuild, 'assets', 'javascript', 'compile');
  const outputDir = path.join(themeBuild, 'assets', 'javascript');
  const outputFile = path.join(outputDir, 'javascript.min.js');

  if (!await fs.pathExists(compileDir)) {
    log(`JavaScript compile directory not found, skipping JS compilation`);
    return;
  }

  const files = (await fs.readdir(compileDir)).filter(f => f.endsWith('.js')).sort();

  if (files.length === 0) {
    log(`No JavaScript files to compile`);
    return;
  }

  let combined = '';
  for (const file of files) {
    const content = await fs.readFile(path.join(compileDir, file), 'utf-8');
    combined += content + '\n';
  }

  try {
    const result = await minify(combined);
    if (result.error) {
      logError(`JavaScript minification error: ${result.error}`);
      return;
    }
    combined = result.code;
  } catch (err) {
    logError(`JavaScript minification failed: ${err.message}`);
    return;
  }

  await fs.ensureDir(outputDir);
  await fs.writeFile(outputFile, combined, 'utf-8');
  log(`Compiled JavaScript → ${path.relative(ROOT, outputFile)}`);
}

module.exports = {
  compileJavaScript
};
