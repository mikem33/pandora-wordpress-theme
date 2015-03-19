<?php get_header(); ?>
	<div class="wrapper">
		<section class="container">
			<header class="head-title">

				<?php if (have_posts()) : ?>

					<?php $post = $posts[0]; // hack: set $post so that the_date() works ?>
					<?php if (is_category()) { ?>
					<h1 class="page-title">Archivo de la Categoría &ldquo;<?php single_cat_title(); ?>&rdquo;</h1>

					<?php } elseif(is_tag()) { ?>
					<h1 class="page-title">Entradas etiquetadas con &ldquo;<?php single_tag_title(); ?>&rdquo;</h1>

					<?php } elseif (is_day()) { ?>
					<h1 class="page-title">Archivo de fecha <?php the_time('F jS, Y'); ?></h1>

					<?php } elseif (is_month()) { ?>
					<h1 class="page-title">Archivo de <?php the_time('F, Y'); ?></h1>

					<?php } elseif (is_year()) { ?>
					<h1 class="page-title">Archivo del año <?php the_time('Y'); ?></h1>

					<?php } elseif (is_author()) { ?>
					<h1 class="page-title">Archivo por Autor</h1>

					<?php } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
					<h1 class="page-title">Archivos de Blog</h1>

				<?php } ?>

			</header><!-- #head-title -->
			<?php while (have_posts()) : the_post(); ?>

				<article id="post-<?php the_ID(); ?>" class="post">
					<header>
						<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
						<p>Publicado el <?php the_time('F jS, Y'); ?></p>
					</header>
					<section>
						<?php the_excerpt(); ?>

					</section>
					<footer>
						<p>Publicado bajo la/s categoría/s <?php the_category(', '); ?> &bull; <?php edit_post_link('Edit', '', ' &bull; '); ?> <?php comments_popup_link('Respond to this post &raquo;', '1 Response &raquo;', '% Responses &raquo;'); ?></p>
					</footer>
				</article>

				<?php endwhile; ?>

				<nav>
					<p><?php posts_nav_link('&nbsp;&bull;&nbsp;'); ?></p>
				</nav>

				<?php else : ?>

				<article class="post">
					<h1>No se ha encontrado.</h1>
					<p>Lo sentimos, pero el recurso solicitado no se encuentra.</p>
					<?php get_search_form(); ?>
				</article>

				<?php endif; ?>

		</section><!-- .container -->
	</div><!-- .wrapper -->
	
<?php get_footer(); ?>
