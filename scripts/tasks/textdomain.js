const fs = require('fs-extra');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function log(message) {
  console.log(`[BUILD] ${message}`);
}

async function fixTextdomains(themeDir, textDomain) {
  const phpFiles = await fs.readdir(themeDir, { recursive: true });
  let fixed = 0;

  for (const file of phpFiles) {
    if (!file.endsWith('.php')) continue;

    const filePath = path.join(themeDir, file);
    let content = await fs.readFile(filePath, 'utf-8');
    const original = content;

    // Replace 'theme-slug' and "theme-slug" with actual textdomain
    content = content.replace(/(['"])theme-slug\1/g, `'${textDomain}'`);

    if (content !== original) {
      fixed++;
      await fs.writeFile(filePath, content, 'utf-8');
    }
  }

  if (fixed > 0) {
    log(`Fixed textdomain in ${fixed} file(s)`);
  }
}

async function checkTextdomain(theme) {
  const BUILD = path.join(ROOT, 'build');
  const themeBuild = path.join(BUILD, 'wp-content', 'themes', theme.slug);
  await fixTextdomains(themeBuild, theme.slug);
}

module.exports = {
  checkTextdomain
};
