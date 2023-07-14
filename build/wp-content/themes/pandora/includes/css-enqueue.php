<?php
    if (is_page_template('page-templates/template-home.php')) {
        wp_enqueue_style( 
            'pd-home-style', 
            get_stylesheet_directory_uri() . '/assets/css/pages/home.css', 
            array(), 
            $release, 
            'all' 
        );
    }