<?php get_header(); ?>

	<div class="wrapper">
		<?php if (in_category('works')) : ?>

			<header class="work__header">
				<div>
		            <h1><?php the_title(); ?></h1>
		            <?php while (have_posts()) : the_post(); ?>
		            	<?php the_content(); ?>
		            <?php endwhile; ?>
		        </div>
				<a href="<?php echo home_url(); ?>/">
	            	<i class="fa fa-long-arrow-left"></i>
	            </a>
	        </header>
	        <figure class="work__main-img">
	            <img src="<?php the_field('main_image_work'); ?>" alt="" />
	        </figure>
	        <div class="work__gallery">
	        	<?php if( have_rows('work_gallery') ): ?>
	        		<?php while( have_rows('work_gallery') ): the_row(); 

						$image = get_sub_field('gallery_image');									

					?>
			    	<a href="<?php echo $image['url'] ?>" data-lightbox="work-gallery">
						<div class="overlay overlay--red"><i class="fa fa-search-plus"></i></div>
						<img src="<?php echo $image['sizes']['thumbnail']; ?>" width="150" height="150" alt="">
			    	</a>			    	
				<?php endwhile; else : ?>
					<p>There is no gallery.</p>
				<?php endif; ?>	            
	        </div>

		<?php else : ?>
			<section class="container inner-content">
				<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
					<article id="post-<?php the_ID(); ?>" class="post">
						<header>
							<h1><?php the_title(); ?></h1>
							<div class="meta">
								<time datetime="<?php echo date(DATE_W3C); ?>" pubdate class="updated"><?php the_time('F j, Y') ?></time>
								<p>Posted in <?php the_category(', '); ?> &vert; <?php edit_post_link('Editar', '', ' &vert; '); ?> <?php comments_popup_link('Comenta la entrada &raquo;', '1 Response &raquo;', '% Responses &raquo;'); ?></p>
							</div><!-- meta -->
						</header>
						<section class="post-content">
							
							<?php the_content(); ?>

						</section><!-- .post-content -->
					</article><!-- .post -->
					
					<?php comments_template(); ?>

					<?php endwhile; else: ?>
						
					<article class="post">
						<section class="post-content-inner">
							<p>Lo siento no hay posts que coincidan con su búsqueda.</p>
						</section>
					</article><!-- .post -->
					
				<?php endif; ?>
			</section><!-- #container -->
		<?php endif; ?>
	</div><!-- .wrapper -->
				
<?php get_footer(); ?>