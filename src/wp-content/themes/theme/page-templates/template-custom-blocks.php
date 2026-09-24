<?php
/**
 * Template Name: Custom Blocks
 *
 * No wrapper: the width of each section is decided from the editor, so a
 * block can run full width or sit inside its own container.
 */
?>
<?php get_header(); ?>

    <?php while (have_posts()) : the_post(); ?>
        <?php the_content(); ?>
    <?php endwhile; ?>

<?php get_footer(); ?>
