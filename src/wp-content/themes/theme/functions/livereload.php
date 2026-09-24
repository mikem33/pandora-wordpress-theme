<?php
    // The reload client is only injected while `pnpm dev` runs: that is what
    // writes the .livereload marker, and it removes it when stopped.
    function pandora_livereload() {
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
            })();
        </script>
        <?php
    }
    add_action( 'wp_footer', 'pandora_livereload' );
?>
