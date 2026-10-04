import path from 'node:path';
import fs from 'node:fs';

/**
 * Shared Vite options for the theme's assets.
 *
 * The build tasks in scripts/ point at this file, and from the dev server it is
 * the config Vite reads on its own, so the options live in one place.
 *
 * Note the preprocessor key: Vite keys these by file extension, styl, not by
 * the preprocessor's name. Under stylus every option here is silently dropped.
 */

const root = import.meta.dirname;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf-8'));
const theme = path.join(root, 'wp-content', 'themes', manifest.theme.slug);

export default {
    css: {
        preprocessorOptions: {
            styl: {
                // Lets a stylesheet inline a plain .css it imports, whether it
                // comes from the theme or from node_modules
                'include css': true,
                paths: [
                    path.join(theme, 'assets', 'css', 'styl'),
                    path.join(root, 'node_modules')
                ]
            }
        }
    },

    build: {
        // Without this the CSS minifier rewrites media queries to range syntax,
        // (width>=75rem), which Safari below 16.4 ignores altogether
        cssTarget: ['chrome90', 'firefox90', 'safari14']
    }
};
