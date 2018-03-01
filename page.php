<?php get_header(); ?>
    
    <div class="wrapper">        
        <header class="head-title">
            <h1 class="page-title"><?php the_title(); ?></h1>               
        </header><!-- .head-title -->
            
        <?php while (have_posts()) : the_post(); ?>
            <article class="post">
                <?php the_content(); ?>
            </article>
        <?php endwhile; ?>
    </div><!-- .wrapper -->

<?php get_footer(); ?>