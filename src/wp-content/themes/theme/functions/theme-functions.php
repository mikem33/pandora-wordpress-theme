<?php
    /**
     * Function for register a sidebar.
     */
    if (function_exists('register_sidebar')) {
        register_sidebar(array(
            'name' => __('Sidebar Widgets','theme-slug'),
            'id'   => 'sidebar-widgets',
            'description'   => __( 'These are widgets for the sidebar.','theme-slug'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h2>',
            'after_title'   => '</h2>'
        ));
    }

    /**
     * Load the theme stylesheet inside the block editor, so a block looks the
     * same there as it does on the front.
     */
    add_theme_support( 'editor-styles' );
    add_editor_style( 'style.css' );

    /**
     * Function for activate thumbnails and size.
     */
    add_theme_support( 'post-thumbnails' );
    add_image_size( 'gallery-thumbnail', 150, 150, true );

    /**
     * Create default menu spaces.
     */
    function {{theme_prefix}}_register_menus() {
        register_nav_menus(
            array(
              'header-menu' => __('Header Menu', 'theme-slug'),
              'extra-menu' => __('Extra Menu', 'theme-slug')
            )
        );
    }
    add_action( 'init', '{{theme_prefix}}_register_menus' );

    /**
     * Determine the text of the 'Read more'
     * @param  string   $more_link          The original link of the full post.
     * @param  string   $more_link_text     The original text of the link to the full post.
     * @return string
     */
    function {{theme_prefix}}_more_link($more_link, $more_link_text) {
        return str_replace($more_link_text, __('Read more &raquo;', 'theme-slug'), $more_link);
    }
    add_filter('the_content_more_link', '{{theme_prefix}}_more_link', 10, 2);

    /**
     * Custom Excerpt for posts.
     * @param  boolean  $totalPoints    The punctuation of importance of the text.
     * @param  boolean  $showTitle      Determines if the title has to appear or not.
     * @param  boolean  $titlePoints    The punctuation set to the title.
     * @param  boolean  $echo           Determines if the result text has to be echoed or returned.
     * @return string
     */
    function {{theme_prefix}}_post_excerpt($totalPoints = false, $showTitle = true, $titlePoints = false, $echo = true) {
        if ($totalPoints == false) {
            $totalPoints = 150;
        }
        if ($titlePoints == false) {
            $titlePoints = 1.2;
        }
        if ($showTitle == true) {
            $title = get_the_title();
            $pointsTitle = floor(strlen($title) * $titlePoints);
            $pointsContent = $totalPoints - $pointsTitle;
            $content = strip_tags(get_the_content());
            $content = {{theme_prefix}}_shorten_paragraph($content, $pointsContent);
            if ($echo == true){
                echo '<h3>'.$title.'</h3><p>'.$content.'</p>';
            } else {
                return '<h3 >'.$title.'</h3><p>'.$content.'</p>';
            }
        } else {
            $pointsContent = $totalPoints;
            $content = strip_tags(get_the_content());
            $content = {{theme_prefix}}_shorten_paragraph($content, $pointsContent);
            if ($echo == true){
                echo '<p>'.$content.'</p>';
            } else {
                return '<p>'.$content.'</p>';
            }
        }
    }

    /**
     * Meta description text for the head tag.
     */
    function {{theme_prefix}}_meta_description() {
        $current_post = get_post();
        $post_content = {{theme_prefix}}_shorten_paragraph($current_post->post_content, 300);
        echo strip_tags($post_content);
    }

    /**
     * Shorten paragraph function.
     * @param  string   $paragraph  The original text
     * @param  integer  $characters The number of characters to show
     * @return string               The result string.
     */
    function {{theme_prefix}}_shorten_paragraph($paragraph, $characters) {
        if (strlen($paragraph) <= $characters) {
            return $paragraph;
        } else {
            $newParagraph = mb_substr($paragraph, 0, $characters).'...';
            return $newParagraph;
        }
    }

    /**
     * Add custom classes to the previous and next pagination links.
     */
    function {{theme_prefix}}_next_posts_link_attributes() { return 'class="button button--next"'; }    
    function {{theme_prefix}}_previous_posts_link_attributes() { return 'class="button button--previous"'; }
    add_filter('{{theme_prefix}}_next_posts_link_attributes', '{{theme_prefix}}_next_posts_link_attributes');
    add_filter('{{theme_prefix}}_previous_posts_link_attributes', '{{theme_prefix}}_previous_posts_link_attributes');

    /**
     * Adds a responsive embed wrapper around oEmbed content
     * Filters the oEmbed process to run the {{theme_prefix}}_responsive_embed() function
     * @param  string $html The oEmbed markup
     * @param  string $url  The URL being embedded
     * @param  array  $attr An array of attributes
     * @return string       Updated embed markup
     */
    function {{theme_prefix}}_responsive_embed($html, $url, $attr) {
        return $html!=='' ? '<div class="embed-container">'.$html.'</div>' : '';
    }
    add_filter('embed_oembed_html', '{{theme_prefix}}_responsive_embed', 10, 3);
?>