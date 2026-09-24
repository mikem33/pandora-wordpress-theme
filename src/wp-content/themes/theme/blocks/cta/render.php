<?php
    /**
     * Front end of the CTA block.
     *
     * @var array    $attributes
     * @var string   $content
     * @var WP_Block $block
     */

    if ( empty( $attributes['heading'] ) && empty( $attributes['text'] ) ) {
        return;
    }
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'cta' ) ); ?>>
    <?php if ( ! empty( $attributes['heading'] ) ) : ?>
        <h2 class="cta__heading beta"><?php echo wp_kses_post( $attributes['heading'] ); ?></h2>
    <?php endif; ?>

    <?php if ( ! empty( $attributes['text'] ) ) : ?>
        <p class="cta__text"><?php echo wp_kses_post( $attributes['text'] ); ?></p>
    <?php endif; ?>

    <?php if ( ! empty( $attributes['buttonText'] ) && ! empty( $attributes['buttonUrl'] ) ) : ?>
        <a class="cta__button" href="<?php echo esc_url( $attributes['buttonUrl'] ); ?>">
            <?php echo esc_html( $attributes['buttonText'] ); ?>
        </a>
    <?php endif; ?>
</div>
