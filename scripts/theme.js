#!/usr/bin/env node

// Compiles the theme in place. This is the script that travels inside the
// generated project, where there is no src/ to generate from.

const path = require('path');
const chokidar = require('chokidar');

const manifest = require('../manifest.json');
const theme = manifest.theme;

const { compileStyles } = require('./tasks/styles');
const { compileJavaScript } = require('./tasks/scripts');
const { compileSvgSprites } = require('./tasks/sprites');

const ROOT = path.join(__dirname, '..');
const THEME = path.join(ROOT, 'wp-content', 'themes', theme.slug);

const watchMode = process.argv.includes('--watch');

function log(message) {
  console.log(`[THEME] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

async function compileTheme() {
  try {
    log(`Compiling ${theme.name}`);

    await Promise.all([
      compileStyles(THEME),
      compileJavaScript(THEME),
      compileSvgSprites(THEME)
    ]);

    log(`Done`);
  } catch (err) {
    logError(`Compilation failed: ${err.message}`);
    if (!watchMode) process.exit(1);
  }
}

async function startWatch() {
  log(`Starting watch mode...`);

  // Only the sources: watching the whole theme would pick up its own output
  const watchDirs = [
    path.join(THEME, 'assets', 'css', 'styl'),
    path.join(THEME, 'assets', 'javascript', 'compile'),
    path.join(THEME, 'assets', 'images', '_sprites-svg')
  ];

  await compileTheme();

  const watcher = chokidar.watch(watchDirs, {
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  let running = false;
  let queued = false;

  async function recompile() {
    if (running) {
      queued = true;
      return;
    }

    running = true;
    await compileTheme();
    running = false;

    if (queued) {
      queued = false;
      await recompile();
    }
  }

  watcher.on('all', (event, filepath) => {
    log(`${event}: ${path.relative(ROOT, filepath)}`);
    recompile();
  });

  log(`Watching for changes. Press Ctrl+C to stop.`);
}

if (watchMode) {
  startWatch().catch(err => {
    logError(`Watch mode failed: ${err.message}`);
    process.exit(1);
  });
} else {
  compileTheme();
}
