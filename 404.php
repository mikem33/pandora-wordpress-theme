<?php get_header(); ?>
    
    <div class="wrapper">        
        <header>
            <h1 class="page-title"><?php _e('Página No Encontrada','pandora'); ?></h1>            
        </header><!-- .head-title -->
        <article class="content">
            <p><?php _e('Lo sentimos pero la página que estaba buscando no se encuentra o no está disponible en estos momentos.','pandora'); ?></p>
            <?php get_search_form(); ?>
        </article>
    </div>

<?php get_footer(); ?>