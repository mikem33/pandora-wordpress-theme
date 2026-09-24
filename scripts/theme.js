#!/usr/bin/env node

// Compiles the theme in place. This is the script that travels inside the
// generated project, where there is no src/ to generate from.

const fs = require('fs-extra');
const http = require('http');
const path = require('path');
const chokidar = require('chokidar');

const manifest = require('../manifest.json');
const theme = manifest.theme;

const { compileStyles } = require('./tasks/styles');
const { compileJavaScript } = require('./tasks/scripts');
const { compileSvgSprites } = require('./tasks/sprites');
const { generateThemeJson } = require('./tasks/theme-json');

const ROOT = path.join(__dirname, '..');
const THEME = path.join(ROOT, 'wp-content', 'themes', theme.slug);

// The theme reads this file to know whether to inject the reload client
const MARKER = path.join(THEME, '.livereload');
const PORT = Number(process.env.LIVERELOAD_PORT) || 35729;

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
      compileSvgSprites(THEME),
      generateThemeJson(THEME)
    ]);

    log(`Done`);
    return true;
  } catch (err) {
    logError(`Compilation failed: ${err.message}`);
    if (!watchMode) process.exit(1);
    return false;
  }
}

function startLiveReload() {
  const clients = new Set();

  const server = http.createServer((req, res) => {
    // The page is served by WordPress on another origin, so it needs CORS
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('\n');

    clients.add(res);
    req.on('close', () => clients.delete(res));
  });

  server.listen(PORT);
  fs.writeFileSync(MARKER, String(PORT), 'utf-8');

  // Idle connections get dropped by proxies without a periodic byte
  const ping = setInterval(() => {
    for (const client of clients) client.write(': ping\n\n');
  }, 30000);

  function stop() {
    clearInterval(ping);
    fs.removeSync(MARKER);
  }

  process.on('SIGINT', () => { stop(); process.exit(0); });
  process.on('SIGTERM', () => { stop(); process.exit(0); });
  process.on('exit', stop);

  log(`Live reload listening on port ${PORT}`);

  return function notify() {
    for (const client of clients) client.write('data: reload\n\n');
  };
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

  const notify = startLiveReload();

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
    const compiled = await compileTheme();
    running = false;

    if (queued) {
      queued = false;
      await recompile();
      return;
    }

    if (compiled) notify();
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
