/**
 * Editor side of the theme's blocks. Plain JavaScript on purpose: no build
 * step, no JSX, nothing to compile. wp.element.createElement is aliased to el.
 */
( function ( blocks, blockEditor, element, components, i18n ) {
    var el = element.createElement;
    var Fragment = element.Fragment;
    var useBlockProps = blockEditor.useBlockProps;
    var RichText = blockEditor.RichText;
    var InspectorControls = blockEditor.InspectorControls;
    var __ = i18n.__;

    blocks.registerBlockType( '{{theme_slug}}/cta', {
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
                        el( components.TextControl, {
                            label: __( 'URL', '{{theme_slug}}' ),
                            value: attributes.buttonUrl,
                            onChange: function ( value ) {
                                setAttributes( { buttonUrl: value } );
                            }
                        } )
                    )
                ),
                el(
                    'div',
                    useBlockProps( { className: 'cta' } ),
                    el( RichText, {
                        tagName: 'h2',
                        className: 'cta__heading beta',
                        value: attributes.heading,
                        placeholder: __( 'Heading', '{{theme_slug}}' ),
                        onChange: function ( value ) {
                            setAttributes( { heading: value } );
                        }
                    } ),
                    el( RichText, {
                        tagName: 'p',
                        className: 'cta__text',
                        value: attributes.text,
                        placeholder: __( 'Text', '{{theme_slug}}' ),
                        onChange: function ( value ) {
                            setAttributes( { text: value } );
                        }
                    } ),
                    el( RichText, {
                        tagName: 'span',
                        className: 'cta__button',
                        value: attributes.buttonText,
                        placeholder: __( 'Button', '{{theme_slug}}' ),
                        onChange: function ( value ) {
                            setAttributes( { buttonText: value } );
                        }
                    } )
                )
            );
        },

        // Dynamic block: the front end comes from render.php
        save: function () {
            return null;
        }
    } );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.wp.i18n );
