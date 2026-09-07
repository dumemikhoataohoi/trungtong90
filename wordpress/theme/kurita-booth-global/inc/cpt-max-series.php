<?php
/**
 * MAX Series products (Eco Max, Max Convert Advance, Max Convert Advance
 * Wide, View Max, G-Max). One CPT entry = one product. All fields editable
 * via the meta box in inc/meta-boxes-max-series.php.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_register_cpt_max_series() {
	register_post_type( 'max_series', array(
		'labels' => array(
			'name'               => __( 'MAX Series', 'kbg' ),
			'singular_name'      => __( 'MAX Product', 'kbg' ),
			'add_new_item'       => __( 'Add New MAX Product', 'kbg' ),
			'edit_item'          => __( 'Edit MAX Product', 'kbg' ),
			'all_items'          => __( 'All MAX Products', 'kbg' ),
			'menu_name'          => __( 'MAX Series', 'kbg' ),
			'featured_image'     => __( 'Main Product Image', 'kbg' ),
		),
		'public'       => true,
		'show_in_rest' => true,
		// The "MAX Series" overview lives on a regular editable Page
		// (built from the kbg/max-series-grid block) at /max-series/ —
		// so this CPT's own archive is disabled and single products use
		// a different slug to avoid a URL collision with that Page.
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'max-series-product' ),
		'menu_icon'    => 'dashicons-admin-multisite',
		'menu_position' => 21,
		'supports'     => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
		// page-attributes gives a native "Order" field so the admin can drag
		// the 5 products into the exact order they should render on the site.
	) );
}
add_action( 'init', 'kbg_register_cpt_max_series' );

/**
 * Position badge choices (COMPACT / PROFESSIONAL / ...). Kept as a fixed
 * list — this is exactly the "controlled" part of the design system the
 * brief asks us to protect (colors/badges must stay part of the 5-tier
 * portfolio architecture, not free text).
 */
function kbg_max_series_positions() {
	return array(
		'compact'          => __( 'Compact', 'kbg' ),
		'professional'     => __( 'Professional', 'kbg' ),
		'wide-professional' => __( 'Wide Professional', 'kbg' ),
		'premium'          => __( 'Premium', 'kbg' ),
		'heavy-duty'       => __( 'Heavy Duty', 'kbg' ),
	);
}

/** Accent color swatches — same 5 brand colors already in site.css. */
function kbg_max_series_accents() {
	return array(
		'acc-eco'  => __( 'Green (Eco)', 'kbg' ),
		'acc-adv'  => __( 'Blue (Advance)', 'kbg' ),
		'acc-wide' => __( 'Teal (Wide)', 'kbg' ),
		'acc-view' => __( 'Red (View Max)', 'kbg' ),
		'acc-gmax' => __( 'Orange (G-Max)', 'kbg' ),
	);
}
