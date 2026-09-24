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

    // WordPress declares its own palette, gradients, duotones, shadows, sizes
    // and aspect ratios, and writes every one of them into the global
    // stylesheet. Setting defaultPalette to false in theme.json only hides them
    // from the editor, so they are dropped here, at the source, before the
    // merge. The theme's own presets, declared in tokens.json, are untouched.
    function {{theme_prefix}}_trim_default_presets( $theme_json ) {
        $data = $theme_json->get_data();

        unset(
            $data['settings']['color']['palette'],
            $data['settings']['color']['gradients'],
            $data['settings']['color']['duotone'],
            $data['settings']['typography']['fontSizes'],
            $data['settings']['spacing']['spacingSizes'],
            $data['settings']['shadow']['presets'],
            $data['settings']['dimensions']['aspectRatios']
        );

        // A new object, not update_with(): that one merges, and a merge can
        // add or overwrite but never remove
        return new WP_Theme_JSON_Data( $data, 'default' );
    }
    add_filter( 'wp_theme_json_data_default', '{{theme_prefix}}_trim_default_presets' );

    // WordPress inlines any stylesheet below 20 KB, so core's block CSS is
    // repeated in the HTML of every page. As files they are fetched once and
    // cached for the rest of the visit.
    add_filter( 'styles_inline_size_limit', '__return_zero' );
?>