<?php
/**
 * Case Studies (Car Dealer, Independent Repair Shop, Large Vehicle,
 * High-Volume Body Shop, Existing Booth Replacement, First Vietnam
 * Installation...). Publish/unpublish uses WordPress' native post status.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_register_cpt_case_study() {
	register_post_type( 'case_study', array(
		'labels' => array(
			'name'          => __( 'Case Studies', 'kbg' ),
			'singular_name' => __( 'Case Study', 'kbg' ),
			'add_new_item'  => __( 'Add New Case Study', 'kbg' ),
			'edit_item'     => __( 'Edit Case Study', 'kbg' ),
			'all_items'     => __( 'All Cases', 'kbg' ),
			'menu_name'     => __( 'Case Studies', 'kbg' ),
		),
		'public'       => true,
		'show_in_rest' => true,
		// Same reasoning as max_series: the "Case Studies" overview is a
		// regular editable Page at /case-studies/, so disable this CPT's
		// own archive and give single cases a different slug.
		'has_archive'  => false,
		'rewrite'      => array( 'slug' => 'case-study-item' ),
		'menu_icon'    => 'dashicons-analytics',
		'menu_position' => 22,
		'supports'     => array( 'title', 'thumbnail', 'page-attributes' ),
		'taxonomies'   => array( 'case_study_type' ),
	) );

	register_taxonomy( 'case_study_type', 'case_study', array(
		'labels' => array(
			'name'          => __( 'Customer Type', 'kbg' ),
			'singular_name' => __( 'Customer Type', 'kbg' ),
		),
		'public'       => true,
		'show_in_rest' => true,
		'hierarchical' => true,
		'rewrite'      => array( 'slug' => 'case-type' ),
	) );
}
add_action( 'init', 'kbg_register_cpt_case_study' );

/** Seed the 5 categories from the project brief on first activation. */
function kbg_seed_case_study_types() {
	if ( get_option( 'kbg_case_types_seeded' ) ) {
		return;
	}
	$terms = array(
		__( 'Car Dealer', 'kbg' ),
		__( 'Independent Repair Shop', 'kbg' ),
		__( 'Large Vehicle', 'kbg' ),
		__( 'High-Volume Body Shop', 'kbg' ),
		__( 'Existing Booth Replacement', 'kbg' ),
	);
	foreach ( $terms as $term ) {
		if ( ! term_exists( $term, 'case_study_type' ) ) {
			wp_insert_term( $term, 'case_study_type' );
		}
	}
	update_option( 'kbg_case_types_seeded', 1 );
}
add_action( 'init', 'kbg_seed_case_study_types', 20 );
