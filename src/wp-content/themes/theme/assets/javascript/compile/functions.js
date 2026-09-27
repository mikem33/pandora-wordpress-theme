/**
 * Helpers of the theme.
 *
 * The build bundles this folder with Vite, so whatever is declared here lives in
 * the module's own scope and gets dropped if nothing uses it. Anything that has
 * to be reachable from the outside — an inline script, an attribute in the
 * markup, the console — is hung off window on purpose.
 */

window.isTouchDevice = function () {
    return 'ontouchstart' in window
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
};
