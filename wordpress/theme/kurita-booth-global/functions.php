<?php
/**
 * KURITA BOOTH GLOBAL theme bootstrap.
 *
 * Design rule for this whole theme: the visual system (assets/css/site.css,
 * assets/js/site.js) is a verbatim port of the approved static site and must
 * not be redesigned here. Everything in inc/ only wires WordPress content
 * (CPTs, meta boxes, blocks, settings) into that fixed markup/CSS.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KBG_THEME_VERSION', '1.0.0' );
define( 'KBG_THEME_DIR', get_template_directory() );
define( 'KBG_THEME_URI', get_template_directory_uri() );

/* ---------------------------------------------------------------------
 * Theme setup
 * ------------------------------------------------------------------- */
function kbg_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'custom-line-height' );

	// Load the real front-end stylesheet inside the block-editor canvas
	// (which WordPress renders in its own iframe) so ServerSideRender
	// previews look exactly like the live site, not unstyled HTML.
	add_theme_support( 'editor-styles' );
	add_editor_style( array(
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
		'assets/css/site.css',
	) );

	register_nav_menus( array(
		'primary' => __( 'Primary Navigation (Header)', 'kbg' ),
		'footer-explore'    => __( 'Footer — Explore', 'kbg' ),
		'footer-get-started' => __( 'Footer — Get Started', 'kbg' ),
	) );

	// Fixed crop sizes matching each design slot, so an admin-uploaded image
	// can never distort a card/grid and break the responsive layout.
	add_image_size( 'kbg-hero', 960, 720, true );          // hero-photo (4:3)
	add_image_size( 'kbg-product-card', 800, 500, true );  // product-media (16:10)
	add_image_size( 'kbg-case-card', 640, 360, true );     // case-media (16:9)
	add_image_size( 'kbg-brochure-thumb', 300, 420, true ); // portrait brochure cover
}
add_action( 'after_setup_theme', 'kbg_theme_setup' );

/* ---------------------------------------------------------------------
 * Assets — ported verbatim, no redesign, no framework added
 * ------------------------------------------------------------------- */
function kbg_enqueue_assets() {
	wp_enqueue_style( 'kbg-google-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap', array(), null );
	wp_enqueue_style( 'kbg-site', KBG_THEME_URI . '/assets/css/site.css', array(), KBG_THEME_VERSION );
	wp_enqueue_script( 'kbg-site', KBG_THEME_URI . '/assets/js/site.js', array(), KBG_THEME_VERSION, true );

	// "Which MAX" selector data — editable from WP Admin (Problem Map),
	// falls back to the built-in defaults in site.js if empty.
	wp_localize_script( 'kbg-site', 'KBG_PROBLEM_MAP', kbg_get_problem_map_for_js() );
}
add_action( 'wp_enqueue_scripts', 'kbg_enqueue_assets' );

/* ---------------------------------------------------------------------
 * Includes
 * ------------------------------------------------------------------- */
require_once KBG_THEME_DIR . '/inc/cpt-max-series.php';
require_once KBG_THEME_DIR . '/inc/cpt-case-study.php';
require_once KBG_THEME_DIR . '/inc/cpt-brochure.php';
require_once KBG_THEME_DIR . '/inc/cpt-problem-map.php';
require_once KBG_THEME_DIR . '/inc/meta-boxes-max-series.php';
require_once KBG_THEME_DIR . '/inc/meta-boxes-case-study.php';
require_once KBG_THEME_DIR . '/inc/meta-boxes-brochure.php';
require_once KBG_THEME_DIR . '/inc/meta-boxes-problem-map.php';
require_once KBG_THEME_DIR . '/inc/seo-meta.php';
require_once KBG_THEME_DIR . '/inc/settings-page.php';
require_once KBG_THEME_DIR . '/inc/polylang-integration.php';
require_once KBG_THEME_DIR . '/inc/blocks-register.php';
require_once KBG_THEME_DIR . '/inc/template-helpers.php';

/* ---------------------------------------------------------------------
 * Admin polish: menu order + icons for the requested sidebar grouping
 * (Pages / MAX Series / Case Studies / Brochures / Site Settings)
 * ------------------------------------------------------------------- */
function kbg_admin_menu_order( $menu_order ) {
	if ( ! $menu_order ) {
		return $menu_order;
	}
	$order = array( 'index.php' );
	$wanted = array( 'edit.php?post_type=page', 'edit.php?post_type=max_series', 'edit.php?post_type=case_study', 'edit.php?post_type=brochure' );
	foreach ( $wanted as $slug ) {
		if ( in_array( $slug, $menu_order, true ) ) {
			$order[] = $slug;
		}
	}
	foreach ( $menu_order as $item ) {
		if ( ! in_array( $item, $order, true ) ) {
			$order[] = $item;
		}
	}
	return $order;
}
add_filter( 'custom_menu_order', '__return_true' );
add_filter( 'menu_order', 'kbg_admin_menu_order' );

/**
 * Block-based pages should not be shrunk by the classic "excerpt" content
 * width filters some plugins add — keep this theme's own container widths
 * (defined in site.css) as the single source of truth for layout.
 */
remove_theme_support( 'automatic-feed-links' );
