/**
 * Editor side of the Button block. Plain JavaScript on purpose: no build step,
 * no JSX, nothing to compile. wp.element.createElement is aliased to el.
 */
( function ( blocks, blockEditor, element, components, i18n ) {
    var el = element.createElement;
    var Fragment = element.Fragment;
    var useBlockProps = blockEditor.useBlockProps;
    var RichText = blockEditor.RichText;
    var InspectorControls = blockEditor.InspectorControls;
    var URLInput = blockEditor.URLInput;
    var __ = i18n.__;

    blocks.registerBlockType( '{{theme_slug}}/button', {
        edit: function ( props ) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;

            return el(
                Fragment,
                null,
                el(
                    InspectorControls,
                    null,
                    el(
                        components.PanelBody,
                        { title: __( 'Link', '{{theme_slug}}' ) },
                        // URLInput suggests the site's own pages and posts as
                        // you type their name, and takes a plain URL too
                        el(
                            components.BaseControl,
                            {
                                id: 'url-' + props.clientId,
                                label: __( 'URL', '{{theme_slug}}' ),
                                __nextHasNoMarginBottom: true
                            },
                            el( URLInput, {
                                id: 'url-' + props.clientId,
                                value: attributes.url,
                                onChange: function ( url ) {
                                    setAttributes( { url: url } );
                                },
                                __nextHasNoMarginBottom: true
                            } )
                        ),
                        el( components.ToggleControl, {
                            label: __( 'Open in a new tab', '{{theme_slug}}' ),
                            checked: attributes.opensInNewTab,
                            onChange: function ( value ) {
                                setAttributes( { opensInNewTab: value } );
                            }
                        } )
                    )
                ),
                el( RichText, Object.assign( useBlockProps( { className: 'button' } ), {
                    tagName: 'span',
                    value: attributes.text,
                    placeholder: __( 'Button text', '{{theme_slug}}' ),
                    onChange: function ( value ) {
                        setAttributes( { text: value } );
                    }
                } ) )
            );
        },

        // Dynamic block: the front end comes from render.php
        save: function () {
            return null;
        }
    } );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.wp.i18n );
