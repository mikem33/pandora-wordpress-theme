<?php
    function pandora_scripts() {
        // Set false if you want to load on the <head>.
        if (!is_admin()) {
            wp_enqueue_style( 'pandora-style', get_stylesheet_uri(), array(), '1.00', 'all' );
            wp_deregister_script('jquery');
            wp_enqueue_script( 'javascript', get_template_directory_uri() . '/assets/javascript/javascript.min.js', array(),'', true );
            if ( is_single() && get_option( 'thread_comments' ) ) { 
                wp_enqueue_script( 'comment-reply' );            
            }
        }
    }
    add_action( 'wp_enqueue_scripts', 'pandora_scripts' );
?>