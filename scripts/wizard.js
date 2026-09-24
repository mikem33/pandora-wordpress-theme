#!/usr/bin/env node

// Asks for the theme details and generates the theme with them. Nothing is
// written to this repo: the answers land in the generated project.

const fs = require('fs-extra');
const path = require('path');
const readline = require('node:readline/promises');

const { runBuild } = require('./build');

const ROOT = path.join(__dirname, '..');
const DEFAULTS = path.join(ROOT, 'manifest.json');
// What the last generated theme answered, so regenerating it is all enters
const PREVIOUS = path.join(ROOT, 'build', 'manifest.json');

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function prefixify(value) {
  return slugify(value).replace(/-/g, '_');
}

async function ask(rl, label, fallback) {
  const answer = await rl.question(`${label} [${fallback}]: `);
  return answer.trim() || fallback;
}

async function main() {
  const source = await fs.pathExists(PREVIOUS) ? PREVIOUS : DEFAULTS;
  const current = (await fs.readJson(source)).theme;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\nTheme details. Press enter to keep the value in brackets.\n');

  const name = await ask(rl, 'Name', current.name);
  const slug = slugify(await ask(rl, 'Slug', slugify(name)));
  // PHP function names take no hyphens, hence a prefix of its own
  const prefix = prefixify(await ask(rl, 'Prefix for PHP functions and asset handles', prefixify(slug)));
  const description = await ask(rl, 'Description', current.description);
  const author = await ask(rl, 'Author', current.author);
  const authorUri = await ask(rl, 'Author URL', current.author_uri);
  const version = await ask(rl, 'Version', '1.0.0');

  console.log(`\nThe theme will be generated in build/wp-content/themes/${slug}\n`);
  const confirm = await rl.question('Generate? [Y/n]: ');

  rl.close();

  if (confirm.trim().toLowerCase() === 'n') {
    console.log('Cancelled.');
    return;
  }

  // Nothing is written to the repo: the identity goes straight into the build,
  // which writes it as the generated project's own manifest
  await runBuild({
    slug,
    prefix,
    name,
    description,
    author,
    author_uri: authorUri,
    version
  });
}

main().catch(err => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});
