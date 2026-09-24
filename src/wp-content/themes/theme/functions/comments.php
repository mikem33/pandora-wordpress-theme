<?php
    /**
     * Markup of a single comment, handed to wp_list_comments().
     *
     * The walker closes the list item itself, so this only opens it.
     */
    function {{theme_prefix}}_comment( $comment, $args, $depth ) { ?>
        <li id="comment-<?php comment_ID(); ?>" <?php comment_class( 'comment' ); ?>>
            <article class="comment-body">
                <header class="comment-header">
                    <div class="avatar">
                        <?php echo get_avatar( $comment, 48 ); ?>
                    </div>
                    <div class="comment-meta">
                        <span class="comment-author"><?php comment_author_link( $comment ); ?></span>
                        <a class="comment-permalink" href="<?php echo esc_url( get_comment_link( $comment, $args ) ); ?>">
                            <time datetime="<?php comment_time( 'c' ); ?>">
                                <?php
                                    printf(
                                        /* translators: 1: comment date, 2: comment time */
                                        esc_html__( '%1$s at %2$s', 'theme-slug' ),
                                        get_comment_date( '', $comment ),
                                        get_comment_time()
                                    );
                                ?>
                            </time>
                        </a>
                    </div><!-- .comment-meta -->

                    <?php if ( '0' === $comment->comment_approved ) : ?>
                        <p class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'theme-slug' ); ?></p>
                    <?php endif; ?>
                </header>

                <div class="comment-content">
                    <?php comment_text(); ?>
                </div>

                <?php
                    comment_reply_link( array_merge( $args, array(
                        'depth'     => $depth,
                        'max_depth' => $args['max_depth'],
                        'before'    => '<p class="comment-reply">',
                        'after'     => '</p>',
                    ) ) );
                ?>
            </article>
        </li>
    <?php }
?>
