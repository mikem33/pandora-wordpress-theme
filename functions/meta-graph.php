<?php
    /**
    Metadata : Open Graph, Twitter Card, Dublin Core
    **/

    function multi_metadata() {
        
        if ( ! is_404() ) {
            
            global $post;
            $cpt = $post->post_type;
            $cat = get_the_category(); 
            $fname = get_the_author_meta('first_name');
            $lname = get_the_author_meta('last_name');
            $author = trim( "$fname $lname" );
            $site_lang = get_bloginfo('language');
            
            if(get_the_post_thumbnail($post->ID, 'thumbnail')) {
                $thumbnail_id = get_post_thumbnail_id($post->ID);
                $thumbnail_object = get_post($thumbnail_id);
                $image = $thumbnail_object->guid;
            } else {    
                $image = ''; 
            }
            
        /*If not a Single Page*/
        if ( !is_single() || is_home() ) { ?> 
            <meta name="DC.Title" content="<?php the_title(); ?>">
            <meta name="DC.Publisher" content="<?php echo get_bloginfo('name'); ?>">
            <meta name="DC.Language" scheme="UTF-8" content="<?php echo $site_lang; ?>">
            <meta property="og:title" content="<?php the_title(); ?>" />
        <?php }
        
        /*If is a Single Page*/
            if ( is_single() ) {    ?>
                <meta property="og:title" content="<?php the_title(); ?>" />
                <?php if (!empty($description)) { ?>
                <meta property="og:description" content="<?php the_excerpt(); ?>" />
                <?php } ?>
                <meta property="og:type" content="article" />
                <meta property="og:url" content="<?php the_permalink(); ?>" />
                <meta property="og:image" content="<?php echo $image; ?>">
                <meta property="og:site_name" content="<?php echo get_bloginfo('name'); ?>" />
                <meta name="twitter:card" value="summary_large_image" />
                <meta name="twitter:url" value="<?php the_permalink(); ?>" />
                <meta name="twitter:title" value="<?php the_title(); ?>" />
                <?php if (!empty($description)) { ?>
                    <meta name="twitter:description" value="<?php the_excerpt(); ?>" />
                <?php } ?>
                <meta name="twitter:image" value="<?php echo $image; ?>" />
                <?php $twitter_id = '';
                if (!empty($twitter_id) ){ ?>
                    <meta name="twitter:site" value="<?php echo $twitter_id; ?>" />
                    <meta name="twitter:creator" value="<?php echo $twitter_id; ?>" />
                <?php } if ( $author ) { ?>
                <meta name="DC.Creator" content="<?php echo $author; ?>">
                <?php }  
                if (has_category()) { ?>
                    <meta name="DC.Subject" content="<?php echo $cat; ?>">
                <?php } 
                if (!empty($description)) { ?>
                    <meta name="DC.Description" content="<?php the_excerpt(); ?>">
                <?php } ?>
                <meta name="DC.Identifier" content="<?php the_permalink(); ?>">
                <meta name="DC.Date" content="<?php the_time('Y-m-d'); ?>">
                <meta name="DC.Title" content="<?php the_title(); ?>">
                <meta name="DC.Publisher" content="<?php echo get_bloginfo('name'); ?>">
                <meta name="DC.Language" scheme="UTF-8" content="<?php echo $site_lang; ?>">
            <?php }         
        }
    }
    add_action( 'wp_head', 'multi_metadata' );
?>