<?php
    /**
     * Stylesheets loaded only on the templates that need them. Each file in
     * assets/css/styl/pages/ compiles to assets/css/pages/ and is enqueued here.
     */
    if (is_page_template('page-templates/template-custom-blocks.php')) {
        wp_enqueue_style( 
            '{{theme_prefix}}-custom-blocks-style', 
            get_stylesheet_directory_uri() . '/assets/css/pages/custom-blocks.css', 
            array(), 
            $release, 
            'all' 
        );
    }
