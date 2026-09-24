<?php get_header(); ?>
    
    <div class="wrapper">
        <?php while (have_posts()) : the_post(); ?>

            <article id="post-<?php the_ID(); ?>" class="post">
                <header>
                    <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Enlace permanente a <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
                    <time datetime="<?php echo date(DATE_W3C); ?>" pubdate class="updated"><?php the_time('F j, Y') ?></time>
                </header>
                <div class="post-content">
                    
                    <?php the_content(); ?>

                </div><!-- .post-content -->
                <footer>
                    <div class="meta">
                        <p><?php _e('Posted in', 'theme-slug'); ?> <?php the_category(', '); ?> &vert; <?php edit_post_link(__('Edit', 'theme-slug'), '', ' &vert; '); ?> <?php comments_popup_link(__('Comment on this post &raquo;', 'theme-slug'), __('1 reply &raquo;', 'theme-slug'), __('% replies &raquo;','theme-slug')); ?></p>
                    </div><!-- meta -->
                </footer>
            </article><!-- .post -->

        <?php endwhile; ?>

        <nav class="navigation">
            <div class="next-posts"><?php next_posts_link(__('Next page &raquo;', 'theme-slug')) ?></div>
            <div class="prev-posts"><?php previous_posts_link(__('&laquo; Previous page', 'theme-slug')) ?></div>
        </nav>

    </div><!-- /.wrapper -->

<?php get_footer(); ?>