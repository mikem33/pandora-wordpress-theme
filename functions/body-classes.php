<?php
    // Customising the classes on the body_class function.    
    function my_class_names($classes) {  
        global $wp_query;
        global $post;
      
        $arr = array();  
        
        if(is_front_page()) {
            $arr[] = 'page__home';
        }

        if(is_page()) {  
            $page_slug = $post->post_name;
            $page_id = get_the_ID();
            $page_template_slug = str_replace(array('page-templates/', '.php'), '', get_page_template_slug($page_id));
            $arr[] = 'page__'. $page_template_slug .' page__' . $page_slug;
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
    
    add_filter('body_class','my_class_names');
?>