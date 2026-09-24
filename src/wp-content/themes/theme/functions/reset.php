<?php
    // Remove Emoji Icons.
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Removing the style on html tag for the user bar.
    function {{theme_prefix}}_remove_admin_bar_styles() { remove_action('wp_head', '_admin_bar_bump_cb'); }
    add_action('get_header', '{{theme_prefix}}_remove_admin_bar_styles');

    // Deregister OEmbed for remote posts embedding.
    function {{theme_prefix}}_deregister_scripts(){ wp_deregister_script( 'wp-embed' ); }
    add_action( 'wp_footer', '{{theme_prefix}}_deregister_scripts' );

    // WordPress marks the preset utility classes it generates from theme.json
    // as !important. A class already outranks an element selector, so the flag
    // is dropped to keep the cascade readable. Note the trade-off: a choice made
    // in the editor now loses against a theme rule more specific than one class.
    function {{theme_prefix}}_global_styles_without_important() {
        $styles = wp_styles();
        $css    = $styles->get_data( 'global-styles', 'after' );

        if ( empty( $css ) ) {
            return;
        }

        $styles->add_data( 'global-styles', 'after', str_replace( ' !important', '', (array) $css ) );
    }
    // Core enqueues the stylesheet in both places, hence the two hooks.
    add_action( 'wp_enqueue_scripts', '{{theme_prefix}}_global_styles_without_important', 20 );
    add_action( 'wp_footer', '{{theme_prefix}}_global_styles_without_important', 5 );
?>