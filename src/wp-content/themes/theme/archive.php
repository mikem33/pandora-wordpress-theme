<?php get_header(); ?>
    <div class="wrapper">
        <?php if (have_posts()) : ?>
            <header>
                <?php 
                    $post = $posts[0]; // hack: set $post so that the_date() works
                    if (is_category()) : 
                ?>
                    <h1 class="page-title"><?php _e('Category archive','theme-slug'); ?> &ldquo;<?php single_cat_title(); ?>&rdquo;</h1>
                <?php elseif (is_tag()) : ?>
                    <h1 class="page-title"><?php _e('Posts tagged','theme-slug'); ?> &ldquo;<?php single_tag_title(); ?>&rdquo;</h1>
                <?php elseif (is_day()) : ?>
                    <h1 class="page-title"><?php _e('Daily archive','theme-slug'); ?> <?php the_time('F jS, Y'); ?></h1>
                <?php elseif (is_month()) : ?>
                    <h1 class="page-title"><?php _e('Monthly archive','theme-slug'); ?> <?php the_time('F, Y'); ?></h1>
                <?php elseif (is_year()) : ?>
                    <h1 class="page-title"><?php _e('Yearly archive','theme-slug'); ?> <?php the_time('Y'); ?></h1>
                <?php elseif (is_author()) : ?>
                    <h1 class="page-title"><?php _e('Author archive','theme-slug'); ?></h1>
                <?php elseif (isset($_GET['paged']) && !empty($_GET['paged'])) : ?>
                    <h1 class="page-title"><?php _e('Blog archives','theme-slug'); ?></h1>
                <?php endif; ?>
            </header><!-- #head-title -->
            <?php while (have_posts()) : the_post(); ?>

                <article id="post-<?php the_ID(); ?>" class="post">
                    <header>
                        <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php _e('Permalink to','theme-slug'); ?> <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
                        <p><?php _e('Posted on','theme-slug'); ?> <?php the_time('F jS, Y'); ?></p>
                    </header>
                    <div class="content">
                        <?php the_excerpt(); ?>
                    </div>
                    <footer>
                        <p><?php _e('Filed under','theme-slug'); ?> <?php the_category(', '); ?> &bull; <?php edit_post_link(__('Edit', 'theme-slug'), '', ' &bull; '); ?> <?php comments_popup_link(__('Reply to this post &raquo;','theme-slug'), __('1 reply &raquo;','theme-slug'), __('% replies &raquo;','theme-slug')); ?></p>
                    </footer>
                </article>

            <?php endwhile; ?>

            <nav>
                <p><?php posts_nav_link('&nbsp;&bull;&nbsp;'); ?></p>
            </nav>

        <?php else : ?>

            <article class="post">
                <h1><?php _e('Nothing found.','theme-slug'); ?></h1>
                <p><?php _e('Sorry, the resource you asked for is not here.','theme-slug'); ?></p>
                <?php get_search_form(); ?>
            </article>

        <?php endif; ?>
    </div><!-- .wrapper -->
    
<?php get_footer(); ?>
