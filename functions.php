 <?php
    
    // Favicon function
    function pandora_favicon() { ?>
        <link rel="apple-touch-icon" sizes="180x180" href="<?php echo bloginfo('stylesheet_directory') ?>/assets/images/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="<?php echo bloginfo('stylesheet_directory') ?>/assets/images/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="<?php echo bloginfo('stylesheet_directory') ?>/assets/images/favicons/favicon-16x16.png">
        <link rel="manifest" href="<?php echo bloginfo('stylesheet_directory') ?>/assets/images/favicons/site.webmanifest">
        <link rel="mask-icon" href="<?php echo bloginfo('stylesheet_directory') ?>/assets/images/favicons/safari-pinned-tab.svg" color="#5bbad5">
        <meta name="msapplication-TileColor" content="#2b5797">
        <meta name="theme-color" content="#ffffff">
    <?php }
    add_action('wp_head', 'pandora_favicon');

    // Remove Emoji Icons
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    function pandora_scripts() {
        // Set false if you want to load on the <head>.
        if (!is_admin()) {
            wp_enqueue_style( 'pandora-style', get_stylesheet_uri(), array(), '1.00', 'all' );
            wp_deregister_script('jquery');
            wp_enqueue_script( 'javascript', get_template_directory_uri() . '/assets/js/javascript.min.js', array(),'', true );
            if ( is_single() && get_option( 'thread_comments' ) ) { 
                wp_enqueue_script( 'comment-reply' );            
            }
        }
    }
    add_action( 'wp_enqueue_scripts', 'pandora_scripts' );

    // Enqueue Fonts.
    function load_fonts() {
        wp_register_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css');
        wp_enqueue_style( 'font-awesome');
    }
    
    add_action('wp_print_styles', 'load_fonts');
    
    if (function_exists('register_sidebar')) {
        register_sidebar(array(
            'name' => __('Sidebar Widgets','pandora'),
            'id'   => 'sidebar-widgets',
            'description'   => __( 'These are widgets for the sidebar.','pandora'),
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h2>',
            'after_title'   => '</h2>'
        ));
    }

    // Removing the style on html tag for the user bar.
    add_action('get_header', 'my_filter_head');

    function my_filter_head() {
        remove_action('wp_head', '_admin_bar_bump_cb');
    }
    //add_theme_support( 'post-formats', array('aside', 'gallery', 'link', 'image', 'quote', 'status', 'audio', 'chat', 'video')); // Add 3.1 post format theme support.

    // Function for activate thumbnails and size.       
    add_theme_support( 'post-thumbnails' );
    add_image_size( 'gallery-thumbnail', 150, 150, true );

    // Customising the classes on the body_class function.
    add_filter('body_class','my_class_names');  
    function my_class_names($classes) {  
        global $wp_query;  
      
        $arr = array();  
        
        if(is_front_page()) {
            $arr[] = 'page__home';
        }

        if(is_page()) {  
            global $post;
            $post_slug=$post->post_name;
            $arr[] = 'page__' . $post_slug;  
        }  
      
        if(is_single()) {  
            $post_id = $wp_query->get_queried_object_id();  
            $arr[] = 'post single post-id-' . $post_id;  
        }
        
        if(is_404()) {
            $arr[] = 'page__404';   
        }

        if ( is_admin_bar_showing() ) {
            $arr[] = 'showing-admin-bar';
        }
        
        if (is_user_logged_in()) {
            $arr[] = 'logged-in';
        }
        
        return $arr;  
    }

    function register_my_menus() {
        register_nav_menus(
            array(
              'header-menu' => __('Header Menu', 'pandora'),
              'extra-menu' => __('Extra Menu', 'pandora')
            )
        );
    }
    add_action( 'init', 'register_my_menus' );
    
    // ACF Options Page.
    if(function_exists('acf_add_options_page')) { 
         acf_add_options_page(array(
            'page_title'    => 'Footer',
            'menu_title'    => 'Footer',
            'menu_slug'     => 'custom_footer',
            'capability'    => 'edit_posts',
            'redirect'      => false, 
        ));  
    }
    
    //add_filter('acf/settings/show_admin', '__return_false');

    // Disable auto-generated p on ACF WYSIWIG editor
    function ptobr($string) {
        return preg_replace("/<\/p>[^<]*<p>/", "<br /><br />", $string);}

    function stripp($string) {
        return preg_replace('/(<p>|<\/p>)/i','',$string) ;
    }

    // Determine the text of the 'Read more'
    function my_more_link($more_link, $more_link_text) {
    return str_replace($more_link_text, 'Leer más &raquo;', $more_link);
    }
    add_filter('the_content_more_link', 'my_more_link', 10, 2);
    
?>