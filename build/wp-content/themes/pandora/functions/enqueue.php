<?php
    function pandora_scripts() {
        global $release;
        // Set false if you want to load on the <head>.
        if (!is_admin()) {
            wp_enqueue_style( 'pd-style', get_stylesheet_uri(), array(), $release, 'all' );
            include_once( STYLESHEETPATH . '/includes/css-enqueue.php' );
            wp_deregister_script('jquery');
            wp_enqueue_script( 'pd-javascript', get_template_directory_uri() . '/assets/javascript/javascript.min.js', array(), $release, true );
            if ( is_single() && get_option( 'thread_comments' ) ) { 
                wp_enqueue_script( 'comment-reply' );
            }
        }
    }
    add_action( 'wp_enqueue_scripts', 'pandora_scripts' );
?>