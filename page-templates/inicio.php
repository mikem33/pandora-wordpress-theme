<?php
/*
Template Name: Inicio
*/
get_header(); ?>

		<?php /* FIXED FORM */ ?>
		<div class="wrapper wrapper--fixed" id="fixed">
			<aside class="fixed-part">
				<span><a href="tel:<?php the_field('contact_phone'); ?>"><?php the_field('contact_phone_sentence'); ?></a></span>
				<span class="more-info"><a href="#"><i></i>Más Información</a></span>
				<div class="contact-form">
					<img src="<?php bloginfo('template_directory'); ?>/assets/images/logo.png" class="logo-form" width="281" height="68" alt="Ecox Care" />
					<p class="contact-form__text"><?php the_field('contact_form_sentence'); ?></p>
					<?php echo do_shortcode('[contact-form-7 id="9" title="Formulario de contacto 1"]'); ?>
					<img src="<?php bloginfo('template_directory'); ?>/assets/images/ico-vital-signs.png" width="47" height="15" alt="Ico Vital Signs" class="ico-vital-signs" />
				</div><!-- .contact-form -->
			</aside><!-- .fixed-part -->
		</div>
		
		<?php /* MAIN CONTAINER */ ?>
		<div class="container container--full-page main" style="background-image: url('<?php the_field("bg_main_img"); ?>');">
			<div class="overlay overlay--green"></div>
		    <div class="wrapper">
		    	<div class="content content--main">
				    <header class="header">
				        <a href="<?php echo home_url(); ?>/">
				            <?php /*<p><?php bloginfo('name'); ?></p>*/ ?>
				            <img src="<?php bloginfo('template_directory'); ?>/assets/images/logo.png" width="247" height="83" alt="Ecox Care" />
				        </a>
				    </header><!-- .header -->
				    <section class="text--main">
				    	<article>
				    		<?php the_field('text_main'); ?>
				    	</article>
				    	<div class="promo">
				    		<div class="left">
					    		<div class="promo--circle">
					    			<?php if( get_field('promo_circle_title')): ?><p class="title"><?php the_field('promo_circle_title'); ?></p><?php endif; ?>
					    			<p class="price"><?php the_field('promo_circle_price'); ?></p>
					    			<p class="subtitle"><?php the_field('promo_circle_subtitle'); ?></p>
									<p class="promo--legend"><?php the_field('promo_legend'); ?></p>
					    		</div><!-- .promo--circle -->
					    		
					    	</div>
					    	<div class="half left">
					    		<?php if( have_rows('advantages_list') ): ?>
					    			<ul>
									<?php while ( have_rows('advantages_list') ) : the_row(); ?>
								        
								        <li><?php the_sub_field('advantage'); ?></li>

									<?php endwhile; ?>
									</ul>
								<?php endif; ?>
					    	</div>
				    	</div><!-- .promo--circle -->
				    </section><!-- .text--main -->
				</div><!-- .content .content--main -->
		    </div><!-- .wrapper -->
		</div><!-- .container .container--full-page -->
		
		<?php /* SECOND CONTAINER */ ?>
		<div class="container container--full-page secondary">
			<div class="wrapper--ghost">
				<div class="content">
					<section class="text--secondary">
						<figure>
							<img src="<?php the_field('bg_secondary_img'); ?>" alt="&iquest;Cu&aacute;ndo debo acudir?" width="640" height="429" />
						</figure>
						<article>
							<?php the_field('text_secondary'); ?>
							<footer>
								<p><?php the_field('texto_footer_secondary'); ?></p>
							</footer>
						</article>
					</section><!-- .text--secondary -->
					<section class="advantages-tree">
						<?php the_field('title_etapas'); ?>
						<div class="advantages-secondary-list">							
							<?php if( have_rows('secondary_advantages_list') ): ?>
								<?php $counter = 0; while ( have_rows('secondary_advantages_list') ) : the_row(); ?>
									<article class="circle-<?php echo $counter; ?>" data-title="<?php the_sub_field('advantage_secondary_title'); ?>">
										<div>
											<span class="ghost-title"><?php the_sub_field('advantage_secondary_title'); ?></span>
											<?php the_sub_field('advantage_secondary_text'); ?>
										</div>
									</article>
								<?php $counter++; endwhile; ?>								
							<?php endif; ?>				
						</div><!-- .advantages-secondary-list -->						
					</section><!-- .advantages-tree -->
					<section class="text--tertiary">
						<figure>
							<img src="<?php the_field('bg_tertiary_img'); ?>" alt="&Uacute;ltima tecnolog&iacute;a" width="640" height="426" />
						</figure>
						<article>
							<?php the_field('text_tertiary'); ?>
							<footer>
								<?php the_field('texto_footer_tertiary'); ?>
							</footer>
						</article>
					</section><!-- .text--secondary__foot -->
				</div><!-- .content -->
			</div>
			<div id="bumper"></div><!-- #bumper -->
		</div><!-- .container container--full-page .secondary -->		
		
<?php get_footer(); ?>