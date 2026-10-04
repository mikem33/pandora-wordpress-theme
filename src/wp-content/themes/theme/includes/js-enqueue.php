<?php
    /**
     * Scripts for a single template.
     *
     * Every .js in assets/javascript/compile/pages/ bundles to
     * assets/javascript/pages/, and is loaded from here only where it is
     * needed, so a page does not carry the JavaScript of the rest of the site.
     *
     * The build lists each one in assets/assets.json under page.<name>.js,
     * which is what the helpers below resolve, fingerprint included.
     *
     * A third-party library goes in as an import inside one of those files and
     * Vite bundles it along, so it only travels with the template that needs
     * it.
     *
     * The last argument is $in_footer. The theme's general script goes in the
     * footer, which is where anything non-essential belongs; pass false for a
     * script that has to run before the page paints.
     *
     * Example:
     * if ( is_page_template( 'page-templates/template-home.php' ) ) {
     *     wp_enqueue_script(
     *         '{{theme_slug}}-home-script',
     *         {{theme_prefix}}_asset_url( 'page.home.js' ),
     *         array(),
     *         {{theme_prefix}}_asset_version( 'page.home.js' ),
     *         true
     *     );
     * }
     */
