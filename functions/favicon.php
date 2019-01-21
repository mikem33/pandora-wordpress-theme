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
?>