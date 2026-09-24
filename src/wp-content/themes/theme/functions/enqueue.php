<?php
    function {{theme_prefix}}_scripts() {
        global $release;
        // Set false if you want to load on the <head>.
        if (!is_admin()) {
            wp_enqueue_style( '{{theme_prefix}}-style', get_stylesheet_uri(), array(), $release, 'all' );
            include_once( get_stylesheet_directory() . '/includes/css-enqueue.php' );
            wp_deregister_script('jquery');
            wp_enqueue_script( '{{theme_prefix}}-javascript', get_template_directory_uri() . '/assets/javascript/javascript.min.js', array(), $release, true );
            if ( is_single() && get_option( 'thread_comments' ) ) { 
                wp_enqueue_script( 'comment-reply' );
            }
        }
    }
    add_action( 'wp_enqueue_scripts', '{{theme_prefix}}_scripts' );
?>