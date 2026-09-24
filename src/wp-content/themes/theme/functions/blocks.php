<?php
    /**
     * Every folder inside blocks/ with a block.json is registered on init.
     * Its style.css is declared there, so WordPress loads it only on the pages
     * where the block appears.
     */
    function {{theme_prefix}}_register_blocks() {
        foreach ( glob( get_stylesheet_directory() . '/blocks/*/block.json' ) as $block ) {
            register_block_type( dirname( $block ) );
        }
    }
    add_action( 'init', '{{theme_prefix}}_register_blocks' );

    /**
     * Each block's editor.js, enqueued with the WordPress packages it needs.
     * Declaring them here rather than in block.json is what lets the script be
     * plain JavaScript with no build step, and keeps a new block down to
     * copying a folder.
     */
    function {{theme_prefix}}_enqueue_block_editors() {
        foreach ( glob( get_stylesheet_directory() . '/blocks/*/editor.js' ) as $editor ) {
            $name = basename( dirname( $editor ) );

            wp_enqueue_script(
                '{{theme_slug}}-block-' . $name,
                get_stylesheet_directory_uri() . '/blocks/' . $name . '/editor.js',
                array( 'wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n' ),
                wp_get_theme()->get( 'Version' ),
                true
            );
        }
    }
    add_action( 'enqueue_block_editor_assets', '{{theme_prefix}}_enqueue_block_editors' );

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
