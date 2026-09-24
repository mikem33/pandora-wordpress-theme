const fs = require('fs-extra');
const path = require('path');
const { minify } = require('terser');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

async function compileJavaScript(themeDir) {
  const compileDir = path.join(themeDir, 'assets', 'javascript', 'compile');
  const outputDir = path.join(themeDir, 'assets', 'javascript');
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

// Each block's editor script, minified next to the theme's other JavaScript
async function compileBlockScripts(themeDir) {
  const blocksDir = path.join(themeDir, 'blocks');
  const outputDir = path.join(themeDir, 'assets', 'javascript', 'blocks');

  if (!await fs.pathExists(blocksDir)) return;

  const entries = await fs.readdir(blocksDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const inputFile = path.join(blocksDir, entry.name, 'editor.js');
    if (!await fs.pathExists(inputFile)) continue;

    const source = await fs.readFile(inputFile, 'utf-8');
    const result = await minify(source);
    const outputFile = path.join(outputDir, `${entry.name}.js`);

    await fs.ensureDir(outputDir);
    await fs.writeFile(outputFile, result.code, 'utf-8');
    log(`Compiled ${path.relative(ROOT, inputFile)} → ${path.relative(ROOT, outputFile)}`);
  }
}

module.exports = {
  compileJavaScript,
  compileBlockScripts
};
