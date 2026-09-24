<?php
    /**
     * Front end of the Button block.
     *
     * @var array    $attributes
     * @var string   $content
     * @var WP_Block $block
     */

    if ( empty( $attributes['text'] ) ) {
        return;
    }

    $url    = ! empty( $attributes['url'] ) ? $attributes['url'] : '#';
    $target = ! empty( $attributes['opensInNewTab'] ) ? ' target="_blank" rel="noopener"' : '';
?>
<a <?php echo get_block_wrapper_attributes( array( 'class' => 'button' ) ); ?> href="<?php echo esc_url( $url ); ?>"<?php echo $target; ?>>
    <?php echo esc_html( $attributes['text'] ); ?>
</a>
