<?php
/**
 * "Which MAX" problem → engineering requirement → recommended model table
 * that drives the interactive selector widget (Home + Which MAX page).
 * Was a hardcoded JS object in the static site; now editable rows here.
 * Registered under the "Which MAX" admin grouping (see menu_position).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_register_cpt_problem_map() {
	register_post_type( 'kbg_problem_map', array(
		'labels' => array(
			'name'          => __( 'Which MAX — Problem Map', 'kbg' ),
			'singular_name' => __( 'Problem Row', 'kbg' ),
			'add_new_item'  => __( 'Add Problem Row', 'kbg' ),
			'edit_item'     => __( 'Edit Problem Row', 'kbg' ),
			'all_items'     => __( 'Problem Map', 'kbg' ),
			'menu_name'     => __( 'Which MAX Rules', 'kbg' ),
		),
		'public'        => false,
		'show_ui'       => true,
		'show_in_menu'  => 'edit.php?post_type=max_series',
		'supports'      => array( 'title', 'page-attributes' ),
	) );
}
add_action( 'init', 'kbg_register_cpt_problem_map' );
