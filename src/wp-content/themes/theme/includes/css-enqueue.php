<?php
    /**
     * Stylesheets for a single template.
     *
     * Every .styl in assets/css/styl/pages/ compiles to assets/css/pages/, and
     * is loaded from here only where it is needed, so a page does not carry the
     * CSS of the rest of the site.
     *
     * The build lists each one in assets/assets.json under page.<name>.css,
     * which is what the helpers below resolve, fingerprint included.
     *
     * Example:
     * if ( is_page_template( 'page-templates/template-home.php' ) ) {
     *     wp_enqueue_style(
     *         '{{theme_slug}}-home-style',
     *         {{theme_prefix}}_asset_url( 'page.home.css' ),
     *         {{theme_prefix}}_asset_deps( 'page.home.css' ),
     *         {{theme_prefix}}_asset_version( 'page.home.css' ),
     *         'all'
     *     );
     * }
     */
