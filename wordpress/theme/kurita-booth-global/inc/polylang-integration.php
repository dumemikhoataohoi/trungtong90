<?php
/**
 * Polylang integration. Every hook here is guarded with function_exists()
 * so the theme works fine before Polylang is installed — install it from
 * Plugins → Add New on the live site (blocked from this dev sandbox by
 * network policy, see the setup docs).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Make our CPTs and taxonomy translatable once Polylang loads. */
function kbg_polylang_register_types( $types ) {
	$types['max_series']       = 'max_series';
	$types['case_study']       = 'case_study';
	$types['brochure']         = 'brochure';
	$types['kbg_problem_map']  = 'kbg_problem_map';
	return $types;
}
add_filter( 'pll_get_post_types', 'kbg_polylang_register_types' );

function kbg_polylang_register_taxonomies( $taxonomies ) {
	$taxonomies['case_study_type'] = 'case_study_type';
	return $taxonomies;
}
add_filter( 'pll_get_taxonomies', 'kbg_polylang_register_taxonomies' );

/**
 * Register the Site Settings strings for Polylang's String Translations
 * screen (Languages → String translations) so the topbar/footer copy can
 * have a Vietnamese version without a second options row per field.
 */
function kbg_polylang_register_strings() {
	if ( ! function_exists( 'pll_register_string' ) ) {
		return;
	}
	$defaults = kbg_settings_defaults();
	$opts     = wp_parse_args( get_option( KBG_OPTION_NAME, array() ), $defaults );
	$labels   = array(
		'topbar_text'        => 'Top announcement bar text',
		'footer_description' => 'Footer brand description',
		'footer_disclaimer'  => 'Footer legal disclaimer',
		'markets_note'       => 'Footer Markets note',
	);
	foreach ( $labels as $key => $label ) {
		if ( ! empty( $opts[ $key ] ) ) {
			pll_register_string( $key, $opts[ $key ], 'KURITA BOOTH GLOBAL', true );
		}
	}
}
add_action( 'init', 'kbg_polylang_register_strings', 30 );

/**
 * Language switcher markup — same pill styling as the original .lang-toggle
 * (site.css), but real <a> links to the translated post (full navigation,
 * not a client-side text swap) since each language is now a separate post.
 */
function kbg_render_language_switcher() {
	if ( ! function_exists( 'pll_the_languages' ) ) {
		// Polylang not active yet: render the static EN badge only, no
		// broken VI link — matches the "controlled" fallback philosophy
		// used everywhere else in this theme.
		echo '<div class="lang-toggle"><a class="is-active" href="#">EN</a></div>';
		return;
	}
	$langs = pll_the_languages( array(
		'raw'               => 1,
		'hide_if_empty'     => 0,
		'display_names_as'  => 'slug',
	) );
	if ( ! $langs ) {
		return;
	}
	echo '<div class="lang-toggle">';
	foreach ( $langs as $lang ) {
		printf(
			'<a href="%s" class="%s">%s</a>',
			esc_url( $lang['url'] ),
			$lang['current_lang'] ? 'is-active' : '',
			esc_html( strtoupper( $lang['slug'] ) )
		);
	}
	echo '</div>';
}
