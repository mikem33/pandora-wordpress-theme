<?php $search_field_id = wp_unique_id( 'search-field-' ); ?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label class="screen-reader-text" for="<?php echo esc_attr( $search_field_id ); ?>"><?php _e( 'Search for:', 'theme-slug' ); ?></label>
    <input type="search" id="<?php echo esc_attr( $search_field_id ); ?>" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search', 'theme-slug' ); ?>">
    <button type="submit"><?php _e( 'Search', 'theme-slug' ); ?></button>
</form>
