<?php get_header(); ?>
    <div class="wrapper">
        <?php if (have_posts()) : ?>
            <header>
                <?php 
                    $post = $posts[0]; // hack: set $post so that the_date() works
                    if (is_category()) : 
                ?>
                    <h1 class="page-title"><?php _e('Archivo de la Categoría','theme-slug'); ?> &ldquo;<?php single_cat_title(); ?>&rdquo;</h1>
                <?php elseif (is_tag()) : ?>
                    <h1 class="page-title"><?php _e('Entradas etiquetadas con','theme-slug'); ?> &ldquo;<?php single_tag_title(); ?>&rdquo;</h1>
                <?php elseif (is_day()) : ?>
                    <h1 class="page-title"><?php _e('Archivo de fecha','theme-slug'); ?> <?php the_time('F jS, Y'); ?></h1>
                <?php elseif (is_month()) : ?>
                    <h1 class="page-title"><?php _e('Archivo de','theme-slug'); ?> <?php the_time('F, Y'); ?></h1>
                <?php elseif (is_year()) : ?>
                    <h1 class="page-title"><?php _e('Archivo del año','theme-slug'); ?> <?php the_time('Y'); ?></h1>
                <?php elseif (is_author()) : ?>
                    <h1 class="page-title"><?php _e('Archivo por Autor','theme-slug'); ?></h1>
                <?php elseif (isset($_GET['paged']) && !empty($_GET['paged'])) : ?>
                    <h1 class="page-title"><?php _e('Archivos de Blog','theme-slug'); ?></h1>
                <?php endif; ?>
            </header><!-- #head-title -->
            <?php while (have_posts()) : the_post(); ?>

                <article id="post-<?php the_ID(); ?>" class="post">
                    <header>
                        <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php _e('Enlace permanente a','theme-slug'); ?> <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
                        <p><?php _e('Publicado el','theme-slug'); ?> <?php the_time('F jS, Y'); ?></p>
                    </header>
                    <div class="content">
                        <?php the_excerpt(); ?>
                    </div>
                    <footer>
                        <p><?php _e('Publicado bajo la/s categoría/s','theme-slug'); ?> <?php the_category(', '); ?> &bull; <?php edit_post_link('Edit', '', ' &bull; '); ?> <?php comments_popup_link(__('Responder a este post &raquo;','theme-slug'), __('1 Respuesta &raquo;','theme-slug'), __('% Respuestas &raquo;','theme-slug')); ?></p>
                    </footer>
                </article>

            <?php endwhile; ?>

            <nav>
                <p><?php posts_nav_link('&nbsp;&bull;&nbsp;'); ?></p>
            </nav>

        <?php else : ?>

            <article class="post">
                <h1><?php _e('No se ha encontrado.','theme-slug'); ?></h1>
                <p><?php _e('Lo sentimos, pero el recurso solicitado no se encuentra.','theme-slug'); ?></p>
                <?php get_search_form(); ?>
            </article>

        <?php endif; ?>
    </div><!-- .wrapper -->
    
<?php get_footer(); ?>
