<?php get_header(); ?>
    
    <div class="wrapper">
        <header>
            <h1 class="page-title"><?php _e('Page not found','theme-slug'); ?></h1>
        </header><!-- .head-title -->
        <article class="content">
            <p><?php _e('Sorry, the page you were looking for is not here, or is not available right now.','theme-slug'); ?></p>
            <?php get_search_form(); ?>
        </article>
    </div>

<?php get_footer(); ?>