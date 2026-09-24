<?php
    /**
     * Every folder inside blocks/ with a block.json is registered on init.
     * Its style.css is declared there, so WordPress loads it only on the pages
     * where the block appears.
     */
    function {{theme_prefix}}_register_blocks() {
        wp_register_script(
            '{{theme_slug}}-blocks-editor',
            get_stylesheet_directory_uri() . '/blocks/editor.js',
            array( 'wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n' ),
            wp_get_theme()->get( 'Version' ),
            true
        );

        foreach ( glob( get_stylesheet_directory() . '/blocks/*/block.json' ) as $block ) {
            register_block_type( dirname( $block ) );
        }
    }
    add_action( 'init', '{{theme_prefix}}_register_blocks' );

    /**
     * The theme's own category, so its blocks are not scattered among the
     * WordPress ones in the inserter.
     */
    function {{theme_prefix}}_block_category( $categories ) {
        array_unshift( $categories, array(
            'slug'  => '{{theme_slug}}',
            'title' => '{{theme_name}}',
        ) );

        return $categories;
    }
    add_filter( 'block_categories_all', '{{theme_prefix}}_block_category' );
?>
