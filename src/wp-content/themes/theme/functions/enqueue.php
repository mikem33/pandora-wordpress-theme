<?php
    function {{theme_prefix}}_scripts() {
        // Set false if you want to load on the <head>.
        if (!is_admin()) {
            wp_enqueue_style(
                '{{theme_slug}}-style',
                {{theme_prefix}}_asset_url( 'theme.css' ),
                array(),
                {{theme_prefix}}_asset_version( 'theme.css' ),
                'all'
            );

            // Only downloaded when something is actually printed
            if ( {{theme_prefix}}_asset_url( 'print.css' ) ) {
                wp_enqueue_style(
                    '{{theme_slug}}-print',
                    {{theme_prefix}}_asset_url( 'print.css' ),
                    array(),
                    {{theme_prefix}}_asset_version( 'print.css' ),
                    'print'
                );
            }

            include_once( get_stylesheet_directory() . '/includes/css-enqueue.php' );

            wp_deregister_script('jquery');

            wp_enqueue_script(
                '{{theme_slug}}-javascript',
                {{theme_prefix}}_asset_url( 'theme.js' ),
                array(),
                {{theme_prefix}}_asset_version( 'theme.js' ),
                true
            );

            if ( is_single() && get_option( 'thread_comments' ) ) { 
                wp_enqueue_script( 'comment-reply' );
            }
        }
    }
    add_action( 'wp_enqueue_scripts', '{{theme_prefix}}_scripts' );
?>
