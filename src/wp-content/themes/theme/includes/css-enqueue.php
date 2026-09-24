<?php
    /**
     * Stylesheets for a single template.
     *
     * Every .styl in assets/css/styl/pages/ compiles to assets/css/pages/, and
     * is loaded from here only where it is needed, so a page does not carry the
     * CSS of the rest of the site.
     *
     * Example:
     * if ( is_page_template( 'page-templates/template-home.php' ) ) {
     *     wp_enqueue_style(
     *         '{{theme_prefix}}-home-style',
     *         get_stylesheet_directory_uri() . '/assets/css/pages/home.css',
     *         array(),
     *         $release,
     *         'all'
     *     );
     * }
     */
