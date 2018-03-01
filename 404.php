<?php get_header(); ?>
    
    <div class="wrapper">
        <article id="container">
            <header class="head-title">
                <h1 class="page-title">Página No Encontrada</h1>
                <a href="<?php echo home_url(); ?>/" class="backhome">Volver al inicio &raquo;</a>
            </header><!-- .head-title -->
            <section id="content">
                <p>Lo sentimos pero la página que estaba buscando no se encuentra o no está disponible en estos momentos.</p>
                <?php get_search_form(); ?>
            </section>

<?php get_footer(); ?>