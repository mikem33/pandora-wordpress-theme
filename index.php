<?php get_header(); ?>

    <div class="wrapper">
        <section id="container">
            <section id="blog">
                <?php while (have_posts()) : the_post(); ?>

                    <article id="post-<?php the_ID(); ?>" class="post">
                        <header>
                            <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Enlace permanente a <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
                            <time datetime="<?php echo date(DATE_W3C); ?>" pubdate class="updated"><?php the_time('F j, Y') ?></time>
                        </header>
                        <section class="post-content">
                            
                            <?php the_content('Leer más'); ?>

                        </section><!-- .post-content -->
                        <footer>
                            <div class="meta">
                                <p>Posted in <?php the_category(', '); ?> &vert; <?php edit_post_link('Editar', '', ' &vert; '); ?> <?php comments_popup_link('Comenta la entrada &raquo;', '1 Response &raquo;', '% Responses &raquo;'); ?></p>
                            </div><!-- meta -->
                        </footer>
                    </article><!-- .post -->

                    <?php endwhile; ?>

                    <nav class="navigation">
                        <div class="next-posts"><?php next_posts_link('Página Siguiente &raquo;') ?></div>
                        <div class="prev-posts"><?php previous_posts_link('&laquo; Página Anterior') ?></div>
                    </nav>

        </section><!-- #blog -->
    
    </section><!-- #container -->

<?php get_footer(); ?>