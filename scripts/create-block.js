#!/usr/bin/env node

// Scaffolds a block: asks for its details and writes the folder with the four
// files already filled in. Works both here and inside a generated project.

const fs = require('fs-extra');
const path = require('path');
const readline = require('node:readline/promises');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_THEME = path.join(ROOT, 'src', 'wp-content', 'themes', 'theme');

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ask(rl, label, fallback) {
  const answer = await rl.question(`${label} [${fallback}]: `);
  return answer.trim() || fallback;
}

function blockJson(namespace, slug, title, icon, description) {
  return {
    $schema: 'https://schemas.wp.org/trunk/block.json',
    apiVersion: 3,
    name: `${namespace}/${slug}`,
    title,
    category: namespace,
    icon,
    description,
    textdomain: namespace,
    attributes: {
      text: { type: 'string', default: '' }
    },
    supports: {
      html: false
    }
  };
}

function renderPhp(slug, title) {
  return `<?php
    /**
     * Front end of the ${title} block.
     *
     * @var array    $attributes
     * @var string   $content
     * @var WP_Block $block
     */

    if ( empty( $attributes['text'] ) ) {
        return;
    }
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => '${slug}' ) ); ?>>
    <p class="${slug}__text"><?php echo wp_kses_post( $attributes['text'] ); ?></p>
</div>
`;
}

function editorJs(namespace, slug, title) {
  return `/**
 * Editor side of the ${title} block. Plain JavaScript on purpose: no build
 * step, no JSX, nothing to compile. wp.element.createElement is aliased to el.
 */
( function ( blocks, blockEditor, element, components, i18n ) {
    var el = element.createElement;
    var useBlockProps = blockEditor.useBlockProps;
    var RichText = blockEditor.RichText;
    var __ = i18n.__;

    blocks.registerBlockType( '${namespace}/${slug}', {
        edit: function ( props ) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            return el(
                'div',
                useBlockProps(),
                el( RichText, {
                    tagName: 'p',
                    className: '${slug}__text',
                    value: attributes.text,
                    placeholder: __( 'Text', '${namespace}' ),
                    onChange: function ( value ) {
                        setAttributes( { text: value } );
                    }
                } )
            );
        },

        // Dynamic block: the front end comes from render.php
        save: function () {
            return null;
        }
    } );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.wp.i18n );
`;
}

function styleStyl(slug, title) {
  return `/* ---------------------------- *\\
    
    $${title}

\\* ---------------------------- */

@import 'utilities/utilities'

.${slug}
    // The theme's variables and mixins are available here
`;
}

async function main() {
  // In this repo a block keeps the placeholders the build replaces; inside a
  // generated project it is written with that project's own slug
  const isBoilerplate = await fs.pathExists(TEMPLATE_THEME);
  const theme = (await fs.readJson(path.join(ROOT, 'manifest.json'))).theme;
  const namespace = isBoilerplate ? '{{theme_slug}}' : theme.slug;

  const themeDir = isBoilerplate
    ? TEMPLATE_THEME
    : path.join(ROOT, 'wp-content', 'themes', theme.slug);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\nNew block. Press enter to keep the value in brackets.\n');

  const title = await ask(rl, 'Title', 'My block');
  const slug = slugify(await ask(rl, 'Slug', slugify(title)));
  const icon = await ask(rl, 'Icon (a Dashicons name)', 'block-default');
  const description = await ask(rl, 'Description', `The ${title} block.`);

  const blockDir = path.join(themeDir, 'blocks', slug);

  if (await fs.pathExists(blockDir)) {
    rl.close();
    console.error(`[ERROR] blocks/${slug} already exists`);
    process.exit(1);
  }

  rl.close();

  await fs.ensureDir(blockDir);
  await fs.writeJson(path.join(blockDir, 'block.json'), blockJson(namespace, slug, title, icon, description), { spaces: 4 });
  await fs.writeFile(path.join(blockDir, 'render.php'), renderPhp(slug, title), 'utf-8');
  await fs.writeFile(path.join(blockDir, 'editor.js'), editorJs(namespace, slug, title), 'utf-8');
  await fs.writeFile(path.join(blockDir, 'style.styl'), styleStyl(slug, title), 'utf-8');

  console.log(`\nWritten to ${path.relative(ROOT, blockDir)}`);
  console.log('Run the build and the block is in the inserter.\n');
}

main().catch(err => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});
