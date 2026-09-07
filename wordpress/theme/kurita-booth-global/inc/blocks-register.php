<?php
/**
 * Auto-registers every custom block found under /blocks/<name>/block.json.
 * Adding a new section block = add a new folder here, nothing else to wire.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_register_blocks() {
	$blocks_dir = KBG_THEME_DIR . '/blocks';
	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}
	foreach ( glob( $blocks_dir . '/*', GLOB_ONLYDIR ) as $dir ) {
		if ( file_exists( $dir . '/block.json' ) ) {
			register_block_type( $dir );
		}
	}
}
add_action( 'init', 'kbg_register_blocks' );

/** Register a "KURITA Sections" category so our blocks group together
 *  in the inserter instead of mixing into "Common"/"Widgets". */
function kbg_register_block_category( $categories ) {
	array_unshift( $categories, array(
		'slug'  => 'kbg-sections',
		'title' => __( 'KURITA Sections', 'kbg' ),
		'icon'  => 'layout',
	) );
	return $categories;
}
add_filter( 'block_categories_all', 'kbg_register_block_category' );

/** Shared editor assets (loaded once, used by every block's edit.js). */
function kbg_enqueue_block_editor_assets() {
	wp_enqueue_script(
		'kbg-blocks-shared',
		KBG_THEME_URI . '/assets/js/blocks-shared.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		KBG_THEME_VERSION,
		true
	);
	wp_enqueue_style( 'kbg-block-editor-style', KBG_THEME_URI . '/assets/css/block-editor.css', array( 'wp-edit-blocks' ), KBG_THEME_VERSION );

	wp_localize_script( 'kbg-blocks-shared', 'KBG_ICONS', kbg_icon_choices() );
}
add_action( 'enqueue_block_editor_assets', 'kbg_enqueue_block_editor_assets' );
