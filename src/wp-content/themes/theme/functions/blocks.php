<?php
    /**
     * Every folder inside blocks/ with a block.json is registered on init, so a
     * new block needs no wiring beyond copying the folder.
     */
    function {{theme_prefix}}_register_blocks() {
        {{theme_prefix}}_register_block_assets();

        foreach ( glob( get_stylesheet_directory() . '/blocks/*/block.json' ) as $block ) {
            register_block_type( dirname( $block ) );
        }
    }
    add_action( 'init', '{{theme_prefix}}_register_blocks' );

    /**
     * The handle a block.json names for one of its assets. Scripts and styles
     * are separate namespaces in WordPress, so the editor script and the editor
     * stylesheet can share a name without colliding.
     */
    function {{theme_prefix}}_block_handle( $block, $variant = '' ) {
        return '{{theme_slug}}-block-' . $block . ( $variant ? '-' . $variant : '' );
    }

    /**
     * Registers every block asset the build produced, so a block.json can name
     * it and WordPress takes care of the rest:
     *
     *   style        the front end, only on the pages where the block renders
     *   editorStyle  the editor only
     *   editorScript the editor only
     *   viewScript   the front end, only where the block renders
     *
     * Leaving a field out of block.json is how a block says it does not need
     * that asset: nothing is enqueued by the mere fact that the file exists.
     */
    function {{theme_prefix}}_register_block_assets() {
        // The editor script is plain JavaScript with no build step, so the
        // WordPress packages it uses are declared here instead of bundled
        $editor_deps = array( 'wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components', 'wp-i18n' );

        foreach ( {{theme_prefix}}_assets() as $name => $asset ) {
            if ( ! preg_match( '/^block\.([^.]+)\.(?:(editor|view)\.)?(css|js)$/', $name, $matches ) ) {
                continue;
            }

            list( , $block, $variant, $extension ) = $matches;

            $handle  = {{theme_prefix}}_block_handle( $block, $variant );
            $url     = {{theme_prefix}}_asset_url( $name );
            $version = {{theme_prefix}}_asset_version( $name );

            if ( 'css' === $extension ) {
                wp_register_style( $handle, $url, array(), $version );

                // Lets WordPress inline a small stylesheet instead of serving
                // it as a request of its own
                wp_style_add_data( $handle, 'path', {{theme_prefix}}_asset_path( $name ) );

                continue;
            }

            wp_register_script(
                $handle,
                $url,
                'editor' === $variant ? $editor_deps : array(),
                $version,
                true
            );
        }
    }

    /**
     * Styles the editor canvas. enqueue_block_assets is the hook that reaches
     * inside the editor iframe; enqueue_block_editor_assets stays outside it.
     *
     * Every block's stylesheet goes in, not only the ones already on the page,
     * so a block looks right the moment it is inserted. Only the handles a
     * block.json actually declares are loaded, and WordPress prints each one
     * once however many times it is enqueued.
     */
    function {{theme_prefix}}_editor_canvas_styles() {
        if ( ! is_admin() ) {
            return;
        }

        wp_register_style( '{{theme_slug}}-editor-canvas', false );
        wp_enqueue_style( '{{theme_slug}}-editor-canvas' );

        foreach ( WP_Block_Type_Registry::get_instance()->get_all_registered() as $block_type ) {
            if ( 0 !== strpos( $block_type->name, '{{theme_slug}}/' ) ) {
                continue;
            }

            foreach ( $block_type->style_handles as $handle ) {
                wp_enqueue_style( $handle );
            }
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
