<?php get_header(); ?>
	<div class="wrapper">
		<section class="container">
			<header class="head-title">
				<h1 class="page-title">Resultados de Búsqueda para &ldquo;<?php the_search_query(); ?>&rdquo;</h1>
			</header><!-- .page-title -->
			<?php if (have_posts()) : ?>

				<article id="post-<?php the_ID(); ?>" class="post">
					<ol>

						<?php while (have_posts()) : the_post(); ?>

						<li>
							<h3><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
							<?php the_excerpt(); ?>
						</li>

						<?php endwhile; ?>

					</ol>
				</article>
				<nav>
					<p><?php posts_nav_link('&nbsp;&bull;&nbsp;'); ?></p>
				</nav>

			<?php else : ?>

				<article class="post">
					<h1>No se ha encontrado.</h1>
					<p>Lo sentimo pero el recurso solicitado no se encuentra.</p>
					<?php get_search_form(); ?>
				</article>

			<?php endif; ?>

		</section><!-- .container -->
	</div><!-- .wrapper -->

<?php get_footer(); ?>