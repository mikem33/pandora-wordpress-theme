<?php
    // Remove Emoji Icons.
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Removing the style on html tag for the user bar.
    function my_filter_head() { remove_action('wp_head', '_admin_bar_bump_cb'); }
    add_action('get_header', 'my_filter_head');

    // Deregister OEmbed for remote posts embedding.
    function my_deregister_scripts(){ wp_deregister_script( 'wp-embed' ); }
    add_action( 'wp_footer', 'my_deregister_scripts' );
?>