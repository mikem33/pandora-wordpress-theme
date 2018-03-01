<?php get_header(); ?>

    <div class="wrapper">        
        
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" class="post">
                    <header>
                        <h1><?php the_title(); ?></h1>
                        <div class="meta">
                            <time datetime="<?php echo date(DATE_W3C); ?>" pubdate class="updated"><?php the_time('F j, Y') ?></time>
                            <p><?php _e('Publicado en', 'pandora'); ?> <?php edit_post_link(__('Editar', 'pandora'), '', ' &vert; '); ?> <?php comments_popup_link(__('Comenta la entrada &raquo;', 'pandora'), __('1 Respuesta &raquo;', 'pandora'), __('% Respuestas &raquo;','pandora')); ?></p>
                        </div><!-- meta -->
                    </header>
                    <section class="post-content">
                        
                        <?php the_content(); ?>

                    </section><!-- .post-content -->
                </article><!-- .post -->
                
                <?php comments_template(); ?>

            <?php endwhile; ?>
        <?php else : ?>                
            <article class="post">
                <section class="post-content-inner">
                    <p><?php _e('Lo siento no hay posts que coincidan con su búsqueda.','pandora'); ?></p>
                </section>
            </article><!-- .post -->            
        <?php endif; ?>
    </div><!-- .wrapper -->
                
<?php get_footer(); ?>