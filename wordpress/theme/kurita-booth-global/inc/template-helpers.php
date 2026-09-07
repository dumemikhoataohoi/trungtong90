<?php
/**
 * Small shared helpers used by header/footer/templates/blocks.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Custom nav walker: outputs flat <a> tags (no <ul><li>) to match the
 * original static markup exactly — .nav a { ... } in site.css expects
 * direct <a> children of <nav class="nav">.
 */
class KBG_Flat_Nav_Walker extends Walker_Nav_Menu {
	public function start_lvl( &$output, $depth = 0, $args = null ) {}
	public function end_lvl( &$output, $depth = 0, $args = null ) {}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$classes = empty( $item->classes ) ? array() : (array) $item->classes;
		if ( in_array( 'current-menu-item', $classes, true ) || in_array( 'current_page_item', $classes, true ) ) {
			$classes[] = 'active';
		}
		$class_attr = trim( implode( ' ', array_filter( $classes ) ) );
		$output    .= sprintf(
			'<a href="%s"%s>%s</a>',
			esc_url( $item->url ),
			$class_attr ? ' class="' . esc_attr( $class_attr ) . '"' : '',
			esc_html( $item->title )
		);
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {}
}

/**
 * Fallback nav (used only until the admin sets up Appearance → Menus →
 * Primary Navigation). Mirrors the original 9-link static nav so the
 * front end never looks broken on a fresh install.
 */
function kbg_fallback_nav_menu() {
	$links = array(
		home_url( '/' )                 => __( 'Home', 'kbg' ),
		home_url( '/why-kurita-max/' )  => __( 'Why KURITA MAX', 'kbg' ),
		home_url( '/max-series/' )      => __( 'MAX Series', 'kbg' ),
		home_url( '/which-max/' )       => __( 'Which MAX?', 'kbg' ),
		home_url( '/engineering/' )     => __( 'Engineering', 'kbg' ),
		home_url( '/applications/' )    => __( 'Applications', 'kbg' ),
		home_url( '/case-studies/' )    => __( 'Case Studies', 'kbg' ),
		home_url( '/about/' )           => __( 'About', 'kbg' ),
		home_url( '/contact/' )         => __( 'Contact', 'kbg' ),
	);
	echo '<nav class="nav">';
	foreach ( $links as $url => $label ) {
		printf( '<a href="%s">%s</a>', esc_url( $url ), esc_html( $label ) );
	}
	echo '</nav>';
}

/**
 * Resolve the Site Survey page URL for the repeated header/footer/CTA
 * buttons. Looks for a page using the "Site Survey" block template first
 * (by slug), then falls back to a Site Setting, then "#".
 */
function kbg_site_survey_url() {
	$page = get_page_by_path( 'site-survey' );
	if ( $page ) {
		return get_permalink( $page );
	}
	$setting = kbg_get_setting( 'site_survey_url' );
	return $setting ? $setting : home_url( '/site-survey/' );
}

function kbg_contact_url() {
	$page = get_page_by_path( 'contact' );
	return $page ? get_permalink( $page ) : home_url( '/contact/' );
}

/** Shared markup helpers for the kbg/two-col-media-text block. */
function kbg_two_col_text_html( $attributes ) {
	ob_start();
	if ( $attributes['eyebrow'] ) : ?>
		<span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span>
	<?php endif;
	if ( $attributes['heading'] ) : ?>
		<h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2>
	<?php endif;
	if ( $attributes['text'] ) :
		foreach ( explode( "\n\n", $attributes['text'] ) as $para ) :
			if ( trim( $para ) === '' ) { continue; }
			?>
			<p class="section-sub"><?php echo esc_html( trim( $para ) ); ?></p>
			<?php
		endforeach;
	endif;
	if ( ! empty( $attributes['buttonText'] ) && ! empty( $attributes['buttonUrl'] ) ) : ?>
		<div class="hero-actions">
			<a href="<?php echo esc_url( $attributes['buttonUrl'] ); ?>" class="btn btn-secondary"><?php echo esc_html( $attributes['buttonText'] ); ?></a>
		</div>
	<?php endif;
	return ob_get_clean();
}

function kbg_two_col_media_html( $attributes, $image_url ) {
	$order = 'left' === $attributes['mediaPosition'] ? '' : 'order:2';
	ob_start();
	if ( 'placeholder' === $attributes['mediaType'] ) : ?>
		<div class="hero-photo" style="<?php echo esc_attr( $order ); ?>;background:var(--navy-900);aspect-ratio:4/3;display:flex;align-items:center;justify-content:center">
			<div style="color:#fff;text-align:center;padding:32px">
				<div style="font-size:22px;font-weight:800"><?php echo esc_html( $attributes['placeholderTitle'] ); ?></div>
				<div style="font-size:13px;color:#9fb0c7;margin-top:8px;text-transform:uppercase;letter-spacing:.08em"><?php echo esc_html( $attributes['placeholderLabel'] ); ?></div>
			</div>
		</div>
	<?php elseif ( $image_url ) : ?>
		<div class="hero-photo" style="<?php echo esc_attr( $order ); ?>">
			<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $attributes['heading'] ?? '' ); ?>">
		</div>
	<?php endif;
	return ob_get_clean();
}

/**
 * Fixed icon library (exact inline SVG paths from the original static
 * site) — the "controlled" part of card-grid blocks: admins pick a key,
 * they never paste raw SVG/HTML.
 */
function kbg_icon_library() {
	return array(
		'proven-japan'       => '<path d="M20 12H4M4 12l6-6M4 12l6 6"/><path d="M14 4h2a3 3 0 0 1 0 6"/>',
		'trusted-nationwide' => '<path d="M3 21l7-4 7 4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>',
		'airflow'            => '<path d="M3 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M3 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>',
		'heat'               => '<path d="M12 2v10M12 12a4 4 0 1 0 4 4"/>',
		'paint-drying'       => '<path d="M12 2v10M12 12a4 4 0 1 0 4 4"/><circle cx="12" cy="16" r="0.6" fill="currentColor"/>',
		'safety'             => '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
		'workability'        => '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
		'car'                => '<path d="M3 16l1.5-5A2 2 0 016.4 9.6h11.2A2 2 0 0119.5 11L21 16M3 16v3h2v-3M19 16v3h2v-3M5 16h14"/><circle cx="7" cy="18.5" r="1.3"/><circle cx="17" cy="18.5" r="1.3"/>',
		'suv'                => '<path d="M3 15l2-7h14l2 7v5H3z"/><path d="M3 15h18"/><circle cx="7.5" cy="20" r="1.6"/><circle cx="16.5" cy="20" r="1.6"/>',
		'bus'                => '<rect x="3" y="7" width="18" height="10" rx="1"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="7" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/>',
		'truck'              => '<path d="M3 17h13V6H3zM16 10h4l2 3v4h-6z"/><circle cx="7" cy="19" r="1.6"/><circle cx="18" cy="19" r="1.6"/>',
		'building'           => '<path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9"/>',
		'grid'               => '<path d="M3 3h8v8H3zM13 13h8v8h-8zM3 13h8v8H3zM13 3h8v8h-8z"/>',
		'check'              => '<path d="M20 6 9 17l-5-5"/>',
		'arrow'              => '<path d="M5 12h14M13 6l6 6-6 6"/>',
	);
}

function kbg_icon_svg( $key, $stroke_width = 2 ) {
	$lib = kbg_icon_library();
	$path = isset( $lib[ $key ] ) ? $lib[ $key ] : $lib['check'];
	return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . esc_attr( $stroke_width ) . '">' . $path . '</svg>';
}

function kbg_icon_choices() {
	return array_keys( kbg_icon_library() );
}

/**
 * Build the JS data object for the "Which MAX" selector widget from the
 * kbg_problem_map CPT, scoped to the current language (each translation is
 * its own post via Polylang, same as every other content type in this
 * theme). Returns an empty array if no rows exist yet, in which case
 * site.js quietly falls back to its built-in defaults.
 */
function kbg_get_problem_map_for_js() {
	$args = array(
		'post_type'      => 'kbg_problem_map',
		'posts_per_page' => -1,
		'orderby'        => 'menu_order',
		'order'          => 'ASC',
		'post_status'    => 'publish',
	);
	if ( function_exists( 'pll_current_language' ) ) {
		$args['lang'] = pll_current_language();
	}
	$rows = get_posts( $args );

	$out = array();
	foreach ( $rows as $row ) {
		$key = get_post_meta( $row->ID, '_kbg_key', true );
		if ( ! $key ) {
			continue;
		}
		$max_id   = (int) get_post_meta( $row->ID, '_kbg_recommended_max_id', true );
		$max_post = $max_id ? get_post( $max_id ) : null;

		$out[ $key ] = array(
			'icon'      => get_post_meta( $row->ID, '_kbg_icon', true ) ?: 'check',
			'label'     => get_the_title( $row ),
			'req'       => get_post_meta( $row->ID, '_kbg_requirement', true ),
			'model'     => $max_post ? get_the_title( $max_post ) : get_post_meta( $row->ID, '_kbg_model_fallback', true ),
			'modelHref' => $max_post ? get_permalink( $max_post ) : '#',
			'note'      => get_post_meta( $row->ID, '_kbg_note', true ),
		);
	}
	return $out;
}
