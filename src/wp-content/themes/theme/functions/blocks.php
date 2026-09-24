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
        // Editor interface styles: the panels live outside the canvas iframe,
        // so these go on the admin page rather than into the canvas
        foreach ( glob( get_stylesheet_directory() . '/assets/css/blocks/*-editor.css' ) as $style ) {
            $name = basename( $style, '.css' );

            wp_enqueue_style(
                '{{theme_slug}}-block-' . $name,
                get_stylesheet_directory_uri() . '/assets/css/blocks/' . $name . '.css',
                array(),
                wp_get_theme()->get( 'Version' )
            );
        }

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
     * Styles the editor canvas. enqueue_block_assets is the hook that reaches
     * inside the editor iframe; enqueue_block_editor_assets stays outside it.
     *
     * The front end is left alone here: there each block's stylesheet is
     * enqueued on render, so it only loads where the block is used.
     */
    function {{theme_prefix}}_editor_canvas_styles() {
        if ( ! is_admin() ) {
            return;
        }

        wp_register_style( '{{theme_slug}}-editor-canvas', false );
        wp_enqueue_style( '{{theme_slug}}-editor-canvas' );

        foreach ( glob( get_stylesheet_directory() . '/assets/css/blocks/*.css' ) as $style ) {
            $name = basename( $style, '.css' );

            if ( str_ends_with( $name, '-editor' ) ) {
                continue;
            }

            wp_enqueue_style(
                '{{theme_slug}}-canvas-' . $name,
                get_stylesheet_directory_uri() . '/assets/css/blocks/' . $name . '.css',
                array(),
                wp_get_theme()->get( 'Version' )
            );
        }

        // Every page renders inside <main class="main h-space v-space">, so the
        // canvas carries the same padding and the content sits where it will
        wp_add_inline_style(
            '{{theme_slug}}-editor-canvas',
            '.editor-styles-wrapper{padding:var(--v-space) var(--h-space)}'
        );

        $post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;

        // The Custom Blocks template has no container, so its canvas is edge to
        // edge like the page it produces
        if ( $post_id && 'page-templates/template-custom-blocks.php' === get_page_template_slug( $post_id ) ) {
            // The canvas is held to contentSize by a rule on the root
            // container, with !important margins. Undoing it takes both a
            // higher specificity and the same flag.
            wp_add_inline_style(
                '{{theme_slug}}-editor-canvas',
                '.editor-styles-wrapper .block-editor-block-list__layout.is-root-container'
                . ' > *:not(.alignleft):not(.alignright):not(.alignfull)'
                . '{max-width:none;margin-left:0 !important;margin-right:0 !important}'
            );
        }
    }
    add_action( 'enqueue_block_assets', '{{theme_prefix}}_editor_canvas_styles' );

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
