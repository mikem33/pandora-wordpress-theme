<?php 
    // Do not delete these lines
    if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
        die ('Please do not load this page directly. Thanks!');
    if (!empty($post->post_password)) {
        if ($_COOKIE['wp-postpass_' . COOKIEHASH] != $post->post_password) { ?>
            <p class="nocomments">This post is password protected. Enter the password to view comments.</p>
            <?php return;
        }
    }
    $oddcomment = 'class="comment" '; // alternating comments
?>

<?php if ('open' == $post->comment_status) : ?>

    <section class="comment-form">
        <h3>Escribe un comentario</h3>

        <?php if (get_option('comment_registration') && !$user_ID) : ?>
        <p>Debe <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?redirect_to=<?php echo urlencode(get_permalink()); ?>">registrarte</a> para dejar un comentario.</p>
        <?php else : ?>

        <form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post">

            <?php if ($user_ID) : ?>
            <p>Has iniciado sesión como <a href="<?php echo get_option('siteurl'); ?>/wp-admin/profile.php"><?php echo $user_identity; ?></a>. <a href="<?php echo get_option('siteurl'); ?>/wp-login.php?action=logout" title="Log out of this account">Log out &raquo;</a></p>
            <?php else : ?>

            <input type="text" name="author" id="author" value="<?php echo $comment_author; ?>" size="55" tabindex="1" placeholder="Nombre*" <?php if ($req) echo "aria-required='true'"; ?>>
            
            <input type="text" name="email" id="email" value="<?php echo $comment_author_email; ?>" size="55" tabindex="2" placeholder="E-mail*" <?php if ($req) echo "aria-required='true'"; ?>>
            
            <input type="text" name="url" id="url" value="<?php echo $comment_author_url; ?>" size="55" tabindex="3" placeholder="Página Web">

            <?php endif; ?>
            <textarea name="comment" id="comment" cols="55" rows="10" tabindex="4" placeholder="Comentario*"></textarea>
            <input name="submit" type="submit" id="submit" tabindex="5" value="Enviar comentario &rarr;">
            <input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>">
            <?php do_action('comment_form', $post->ID); ?>
            <p>Los campos marcados con un asterisco (*) son obligatorios.</p>

        </form>
        <?php endif; ?>

    </section><!-- .comment-form -->
<?php endif; ?>

<?php if ($comments) : // there are comments ?>

        <section class="commentlist">
            <h3><?php comments_number('', 'One comment', '% comments' ); ?></h3>

            <?php foreach ($comments as $comment) : ?>

            <article <?php echo $oddcomment; ?>id="comment-<?php comment_ID(); ?>">
                <header>
                    <h4>
                        <div class="avatar">
                            <?php echo get_avatar( $comment, 32 ); ?>
                        </div>
                        <div class="comment-meta">
                            <span><?php comment_author_link(); ?></span>
                            <a href="#comment-<?php comment_ID(); ?>" title="Permalink for this comment">
                                <time datetime="<?php echo date(DATE_W3C); ?>" pubdate class="updated">
                                    <?php the_time('F j, Y') ?> at <?php comment_time(); ?>
                                </time> 
                            </a>
                        </div><!-- .meta -->
                    </h4>
                    <?php if ($comment->comment_approved == '0') : ?>
                        <small>Your comment is awaiting moderation.</small>
                    <?php endif; ?>
                </header>
                <section>
                    <?php comment_text(); ?>
                </section>
            </article>

            <?php $oddcomment = (empty($oddcomment)) ? 'class="comment"' : 'class="comment"'; // alternating comments ?>
            <?php endforeach; ?>

        </section>

<?php else : // no comments yet ?>

    <?php if ('open' == $post->comment_status) : ?>
        <!-- [comments are open, but there are no comments] -->

     <?php else : ?>
        <!-- [comments are closed, and no comments] -->
        <p><?php _e('Los comentarios están cerrados.','pandora'); ?></p>

    <?php endif; ?>
<?php endif; ?>