#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');

const manifest = require('../manifest.json');
// The default identity. The wizard passes its own instead of writing it here.
const defaultTheme = manifest.theme;

// Import task modules
const { copyThemeFiles, writeManifest, copyDevelopmentFiles } = require('./tasks/copy');
const { replacePlaceholders } = require('./tasks/placeholders');
const { checkTextdomain } = require('./tasks/textdomain');
const { compileStyles } = require('./tasks/styles');
const { compileJavaScript, compileBlockScripts } = require('./tasks/scripts');
const { compileSvgSprites } = require('./tasks/sprites');
const { generateThemeJson } = require('./tasks/theme-json');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const SRC = path.join(ROOT, 'src');

const watchMode = process.argv.includes('--watch');

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logError(message) {
  console.error(`[ERROR] ${message}`);
}

// =============================================================================
// BUILD TASKS
// =============================================================================

async function cleanBuild() {
  if (await fs.pathExists(BUILD)) {
    log(`Removing build directory`);
    await fs.remove(BUILD);
  }
}

// =============================================================================
// BUILD ORCHESTRATION
// =============================================================================

async function runBuild(theme = defaultTheme) {
  try {
    log(`Starting build`);

    await cleanBuild();
    await copyThemeFiles(theme);
    await writeManifest(theme);
    await copyDevelopmentFiles();
    await checkTextdomain(theme);
    await replacePlaceholders(theme);

    const themeDir = path.join(BUILD, 'wp-content', 'themes', theme.slug);

    // Run styles and scripts in parallel
    await Promise.all([
      compileStyles(themeDir),
      compileJavaScript(themeDir),
      compileBlockScripts(themeDir),
      compileSvgSprites(themeDir),
      generateThemeJson(themeDir)
    ]);

    log(`Build completed successfully!`);
  } catch (err) {
    logError(`Build failed: ${err.message}`);
    throw err;
  }
}

async function startWatch() {
  log(`Starting watch mode...`);

  const watchDirs = [
    path.join(SRC, 'wp-content'),
    path.join(SRC, '.gitignore'),
    path.join(ROOT, 'manifest.json')
  ];

  // Initial build
  await runBuild();

  const watcher = chokidar.watch(watchDirs, {
    ignored: /(^|[\/\\])\.|node_modules/,
    ignoreInitial: true,
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100
    }
  });

  let running = false;
  let queued = false;

  async function rebuild() {
    // A build wipes and recopies the whole tree, so two of them must never overlap
    if (running) {
      queued = true;
      return;
    }

    running = true;
    await runBuild();
    running = false;

    if (queued) {
      queued = false;
      await rebuild();
    }
  }

  watcher.on('all', (event, filepath) => {
    log(`${event}: ${path.relative(ROOT, filepath)}`);
    rebuild();
  });

  log(`Watching for changes. Press Ctrl+C to stop.`);
}

// =============================================================================
// MAIN
// =============================================================================

if (require.main === module) {
  if (watchMode) {
    startWatch().catch(() => process.exit(1));
  } else {
    runBuild().catch(() => process.exit(1));
  }
}

module.exports = {
  runBuild
};
