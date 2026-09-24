<?php
    /**
     * Comments. The markup of each one lives in functions/comments.php, and
     * the form is built by comment_form() so plugins and the nonce work.
     */

    if ( post_password_required() ) {
        return;
    }

    $comment_required = (bool) get_option( 'require_name_email' );
    $commenter        = wp_get_current_commenter();
?>

<section id="comments" class="comments">

    <?php if ( have_comments() ) : ?>

        <h3 class="comments-title">
            <?php
                comments_number(
                    __( 'No comments', 'theme-slug' ),
                    __( 'One comment', 'theme-slug' ),
                    __( '% comments', 'theme-slug' )
                );
            ?>
        </h3>

        <ol class="comment-list">
            <?php
                wp_list_comments( array(
                    'style'    => 'ol',
                    'callback' => '{{theme_prefix}}_comment',
                ) );
            ?>
        </ol>

        <?php the_comments_pagination(); ?>

    <?php endif; ?>

    <?php if ( ! comments_open() && get_comments_number() ) : ?>
        <p class="no-comments"><?php _e( 'Comments are closed.', 'theme-slug' ); ?></p>
    <?php endif; ?>

    <?php
        comment_form( array(
            'title_reply'          => __( 'Leave a comment', 'theme-slug' ),
            'comment_notes_before' => '',
            'comment_field'        => sprintf(
                '<p class="comment-form-comment"><label class="screen-reader-text" for="comment">%1$s</label><textarea id="comment" name="comment" cols="45" rows="8" placeholder="%1$s" required></textarea></p>',
                esc_attr__( 'Comment', 'theme-slug' )
            ),
            'fields'               => array(
                'author' => sprintf(
                    '<p class="comment-form-author"><label class="screen-reader-text" for="author">%1$s</label><input id="author" name="author" type="text" value="%2$s" placeholder="%1$s"%3$s></p>',
                    esc_attr__( 'Name', 'theme-slug' ),
                    esc_attr( $commenter['comment_author'] ),
                    $comment_required ? ' required' : ''
                ),
                'email'  => sprintf(
                    '<p class="comment-form-email"><label class="screen-reader-text" for="email">%1$s</label><input id="email" name="email" type="email" value="%2$s" placeholder="%1$s"%3$s></p>',
                    esc_attr__( 'Email', 'theme-slug' ),
                    esc_attr( $commenter['comment_author_email'] ),
                    $comment_required ? ' required' : ''
                ),
                'url'    => sprintf(
                    '<p class="comment-form-url"><label class="screen-reader-text" for="url">%1$s</label><input id="url" name="url" type="url" value="%2$s" placeholder="%1$s"></p>',
                    esc_attr__( 'Website', 'theme-slug' ),
                    esc_attr( $commenter['comment_author_url'] )
                ),
            ),
        ) );
    ?>

</section><!-- #comments -->
