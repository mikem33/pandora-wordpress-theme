<form method="get" id="searchform" action="<?php bloginfo('url'); ?>/">
    <input type="text" id="s" name="s" placeholder="<?php _e('Buscar','theme-slug'); ?>" value="<?php the_search_query(); ?>">
    <input type="submit" value="">
</form>