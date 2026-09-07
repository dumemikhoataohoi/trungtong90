<?php
/**
 * Brochures — usually one PDF per MAX product, but also supports
 * standalone brochures (e.g. a combined catalog) not tied to a single
 * product. Kept as its own CPT per the admin sidebar the client asked for
 * ("Brochures — All Brochures / Add New").
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_register_cpt_brochure() {
	register_post_type( 'brochure', array(
		'labels' => array(
			'name'          => __( 'Brochures', 'kbg' ),
			'singular_name' => __( 'Brochure', 'kbg' ),
			'add_new_item'  => __( 'Add New Brochure', 'kbg' ),
			'edit_item'     => __( 'Edit Brochure', 'kbg' ),
			'all_items'     => __( 'All Brochures', 'kbg' ),
			'menu_name'     => __( 'Brochures', 'kbg' ),
			'featured_image' => __( 'Brochure Thumbnail', 'kbg' ),
		),
		'public'       => true,
		'show_in_rest' => true,
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'brochure' ),
		'menu_icon'    => 'dashicons-media-document',
		'menu_position' => 23,
		'supports'     => array( 'title', 'thumbnail' ),
	) );
}
add_action( 'init', 'kbg_register_cpt_brochure' );
