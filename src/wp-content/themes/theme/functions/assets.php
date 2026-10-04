<?php
    /**
     * The compiled assets, by name.
     *
     * The build writes assets/assets.json with the path and a fingerprint of
     * each file it produced, so nothing here has a path or a version written by
     * hand and a changed file is always a changed URL.
     */
    function {{theme_prefix}}_assets() {
        static $assets = null;

        if ( null === $assets ) {
            $manifest = get_stylesheet_directory() . '/assets/assets.json';
            $assets   = array();

            if ( file_exists( $manifest ) ) {
                $decoded = json_decode( file_get_contents( $manifest ), true );
                $assets  = is_array( $decoded ) ? $decoded : array();
            }
        }

        return $assets;
    }

    /**
     * Url of a compiled asset, or an empty string if the build never made it.
     */
    function {{theme_prefix}}_asset_url( $name ) {
        $assets = {{theme_prefix}}_assets();

        if ( empty( $assets[ $name ]['file'] ) ) {
            return '';
        }

        return get_stylesheet_directory_uri() . '/' . $assets[ $name ]['file'];
    }

    /**
     * Absolute path of a compiled asset, for the arguments that take one.
     */
    function {{theme_prefix}}_asset_path( $name ) {
        $assets = {{theme_prefix}}_assets();

        if ( empty( $assets[ $name ]['file'] ) ) {
            return '';
        }

        return get_stylesheet_directory() . '/' . $assets[ $name ]['file'];
    }

    /**
     * Fingerprint of a compiled asset, to be passed as the version. style.css
     * cannot be renamed, so this is what busts its cache.
     */
    function {{theme_prefix}}_asset_version( $name ) {
        $assets = {{theme_prefix}}_assets();

        return isset( $assets[ $name ]['version'] ) ? $assets[ $name ]['version'] : null;
    }

    /**
     * Handle of a third-party library the build emitted on its own:
     * vendor.swiper.js and vendor.swiper.css are both {{theme_slug}}-vendor-swiper.
     * Scripts and styles are separate namespaces in WordPress, so the name can
     * be shared, and enqueueing it is how a template asks for a library.
     */
    function {{theme_prefix}}_vendor_handle( $name ) {
        return '{{theme_slug}}-vendor-' . preg_replace( '/^vendor\.|\.(js|css)$/', '', $name );
    }

    /**
     * The handles an asset needs loaded before it: the libraries it imported,
     * which the build kept out of it. Pass it as the dependencies when
     * enqueueing, and a library used by several files on a page arrives once.
     */
    function {{theme_prefix}}_asset_deps( $name ) {
        $assets = {{theme_prefix}}_assets();

        if ( empty( $assets[ $name ]['deps'] ) ) {
            return array();
        }

        return array_map( '{{theme_prefix}}_vendor_handle', $assets[ $name ]['deps'] );
    }

    /**
     * Registers every library the build emitted, without loading any. They
     * load when something depends on them or enqueues them by handle.
     */
    function {{theme_prefix}}_register_vendors() {
        foreach ( {{theme_prefix}}_assets() as $name => $asset ) {
            if ( ! preg_match( '/^vendor\.[^.]+\.(js|css)$/', $name, $matches ) ) {
                continue;
            }

            $handle  = {{theme_prefix}}_vendor_handle( $name );
            $url     = {{theme_prefix}}_asset_url( $name );
            $version = {{theme_prefix}}_asset_version( $name );

            if ( 'css' === $matches[1] ) {
                wp_register_style( $handle, $url, array(), $version );
            } else {
                wp_register_script( $handle, $url, array(), $version, true );
            }
        }
    }
    add_action( 'init', '{{theme_prefix}}_register_vendors', 5 );

?>
