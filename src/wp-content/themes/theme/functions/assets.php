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
?>
