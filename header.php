<!DOCTYPE html>
<html class="no-js" <?php echo get_language_attributes(); ?>>
    <head>
        <meta http-equiv="Content-Type" content="<?php bloginfo( 'html_type' ); ?>; charset=<?php bloginfo( 'charset' ); ?>">
        <?php if ( is_front_page() ) : ?>
            <title><?php bloginfo( 'name' ); ?> - <?php bloginfo( 'description' ); ?></title>
            <meta name="description" content="<?php bloginfo( 'description' ); ?>">
        <?php elseif ( is_single() ) : ?>
            <title><?php wp_title('-',true,'right'); ?><?php bloginfo('name'); ?></title>
            <meta name="description" content="<?php meta_description(); ?>">
        <?php else : ?>
            <title><?php wp_title('-',true,'right'); ?><?php bloginfo('name'); ?></title>
            <meta name="description" content="<?php bloginfo( 'description' ); ?>">
        <?php endif; ?>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1">
            
        <link rel="alternate" type="text/xml" title="<?php bloginfo( 'name' ); ?> RSS 0.92 Feed" href="<?php bloginfo( 'rss_url' ); ?>">
        <link rel="alternate" type="application/atom+xml" title="<?php bloginfo( 'name' ); ?> Atom Feed" href="<?php bloginfo( 'atom_url' ); ?>">
        <link rel="alternate" type="application/rss+xml" title="<?php bloginfo( 'name' ); ?> RSS 2.0 Feed" href="<?php bloginfo( 'rss2_url' ); ?>">
        <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>       