<?php
    // The reload client is only injected while `pnpm dev` runs: that is what
    // writes the .livereload marker, and it removes it when stopped.
    function {{theme_prefix}}_livereload() {
        $marker = get_stylesheet_directory() . '/.livereload';

        if ( ! file_exists( $marker ) ) {
            return;
        }

        $port = (int) trim( file_get_contents( $marker ) );

        if ( ! $port ) {
            return;
        }
        ?>
        <script>
            (function () {
                var source = new EventSource('http://localhost:<?php echo $port; ?>/');

                source.onmessage = function () { window.location.reload(); };

                // A marker left behind by a watcher that died would have the
                // browser retrying for ever, so the first failure ends it
                source.onerror = function () { source.close(); };
            })();
        </script>
        <?php
    }
    add_action( 'wp_footer', '{{theme_prefix}}_livereload' );
?>
