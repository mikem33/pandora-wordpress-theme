<?php
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
    
    add_filter('acf/settings/show_admin', '__return_false');

    // Disable auto-generated p on ACF WYSIWIG editor
    function ptobr($string) {
        return preg_replace("/<\/p>[^<]*<p>/", "<br /><br />", $string);
    }

    function stripp($string) {
        return preg_replace('/(<p>|<\/p>)/i','',$string) ;
    }
?>