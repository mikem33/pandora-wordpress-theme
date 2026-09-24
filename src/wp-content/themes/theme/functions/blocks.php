<?php
    /**
     * Every folder inside blocks/ with a block.json is registered on init, so a
     * new block needs no wiring beyond copying the folder.
     */
    function {{theme_prefix}}_register_blocks() {
        foreach ( glob( get_stylesheet_directory() . '/blocks/*/block.json' ) as $block ) {
            register_block_type( dirname( $block ) );

            $name  = basename( dirname( $block ) );
            $style = '/assets/css/blocks/' . $name . '.css';

            if ( ! file_exists( get_stylesheet_directory() . $style ) ) {
                continue;
            }

            // Compiled away from the block, but still loaded only on the pages
            // where the block is used
            wp_enqueue_block_style( '{{theme_slug}}/' . $name, array(
                'handle' => '{{theme_slug}}-block-' . $name,
                'src'    => get_stylesheet_directory_uri() . $style,
                'path'   => get_stylesheet_directory() . $style,
                'ver'    => wp_get_theme()->get( 'Version' ),
            ) );
        }
    }
    add_action( 'init', '{{theme_prefix}}_register_blocks' );

    /**
     * Each block's editor script, enqueued with the WordPress packages it
     * needs. Declaring them here rather than in block.json is what lets the
     * script be plain JavaScript with no build step.
     */
    function {{theme_prefix}}_enqueue_block_editors() {
        foreach ( glob( get_stylesheet_directory() . '/assets/javascript/blocks/*.js' ) as $editor ) {
            $name = basename( $editor, '.js' );

            wp_enqueue_script(
                '{{theme_slug}}-block-editor-' . $name,
                get_stylesheet_directory_uri() . '/assets/javascript/blocks/' . $name . '.js',
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
