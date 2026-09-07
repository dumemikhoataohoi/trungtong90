<?php
/**
 * "Site Settings" admin page — the handful of small strings that appear on
 * every page (topbar announcement, footer description/disclaimer, contact
 * snippet) and therefore don't belong to any single Page/CPT entry.
 *
 * Deliberately plain Settings API (core WordPress, no plugin) so this still
 * works even before Polylang/Rank Math are installed on the live site.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KBG_OPTION_GROUP', 'kbg_site_settings' );
define( 'KBG_OPTION_NAME', 'kbg_site_settings' );

function kbg_settings_defaults() {
	return array(
		'topbar_text'         => 'KURITA BOOTH GLOBAL — ASEAN Paint Booth Digital Marketing Platform',
		'footer_description'  => "A digital sales platform connecting ASEAN paint booth demand with the Japanese engineering of 株式会社栗田工業 (Kurita Kogyo Co., Ltd.), starting in Vietnam.",
		'footer_disclaimer'   => 'KURITA BOOTH GLOBAL is the ASEAN digital marketing & sales platform for the KURITA MAX SERIES paint booth line, operated for 株式会社栗田工業 (Kurita Kogyo Co., Ltd.) by CoatureVietnam. Product specifications shown are for orientation only and are subject to KURITA technical approval prior to quotation.',
		'contact_phone'       => '+84 (0) 000 000 000',
		'contact_email'       => 'info@kuritabooth.global',
		'contact_address'     => 'CoatureVietnam — Ho Chi Minh City, Vietnam',
		'site_survey_url'     => '',
		'markets_note'        => 'Expanding next to Thailand, Indonesia & Malaysia.',
	);
}

function kbg_get_setting( $key ) {
	$opts = wp_parse_args( get_option( KBG_OPTION_NAME, array() ), kbg_settings_defaults() );
	$val  = isset( $opts[ $key ] ) ? $opts[ $key ] : '';

	// If Polylang string translation is active, prefer the translated string
	// (registered in inc/polylang-integration.php) for the current language.
	if ( function_exists( 'pll__' ) && $val !== '' ) {
		return pll__( $val );
	}
	return $val;
}

function kbg_register_settings() {
	register_setting( KBG_OPTION_GROUP, KBG_OPTION_NAME );

	add_settings_section( 'kbg_general', __( 'Header & Footer Text', 'kbg' ), '__return_false', KBG_OPTION_GROUP );

	$fields = array(
		'topbar_text'        => __( 'Top announcement bar text', 'kbg' ),
		'footer_description' => __( 'Footer brand description', 'kbg' ),
		'footer_disclaimer'  => __( 'Footer legal disclaimer', 'kbg' ),
		'markets_note'       => __( 'Footer "Markets" note', 'kbg' ),
		'contact_phone'      => __( 'Contact — Phone / WhatsApp / Zalo', 'kbg' ),
		'contact_email'      => __( 'Contact — Email', 'kbg' ),
		'contact_address'    => __( 'Contact — Office address', 'kbg' ),
		'site_survey_url'    => __( 'Site Survey page URL (leave blank to auto-detect the "Site Survey" page)', 'kbg' ),
	);

	foreach ( $fields as $key => $label ) {
		add_settings_field(
			'kbg_' . $key,
			$label,
			'kbg_render_settings_field',
			KBG_OPTION_GROUP,
			'kbg_general',
			array( 'key' => $key )
		);
	}
}
add_action( 'admin_init', 'kbg_register_settings' );

function kbg_render_settings_field( $args ) {
	$opts = wp_parse_args( get_option( KBG_OPTION_NAME, array() ), kbg_settings_defaults() );
	$key  = $args['key'];
	$val  = isset( $opts[ $key ] ) ? $opts[ $key ] : '';

	if ( in_array( $key, array( 'footer_description', 'footer_disclaimer' ), true ) ) {
		printf(
			'<textarea name="%s[%s]" rows="3" class="large-text">%s</textarea>',
			esc_attr( KBG_OPTION_NAME ),
			esc_attr( $key ),
			esc_textarea( $val )
		);
	} else {
		printf(
			'<input type="text" name="%s[%s]" value="%s" class="regular-text">',
			esc_attr( KBG_OPTION_NAME ),
			esc_attr( $key ),
			esc_attr( $val )
		);
	}
}

function kbg_settings_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'KURITA BOOTH GLOBAL — Site Settings', 'kbg' ); ?></h1>
		<p><?php esc_html_e( 'These strings appear on every page (top bar, footer, contact details). For page-by-page content, edit the Pages listed in the menu instead.', 'kbg' ); ?></p>
		<?php if ( function_exists( 'pll__' ) ) : ?>
			<p><em><?php esc_html_e( 'Polylang is active — after saving, translate these strings for Vietnamese under Languages → String translations.', 'kbg' ); ?></em></p>
		<?php endif; ?>
		<form method="post" action="options.php">
			<?php
			settings_fields( KBG_OPTION_GROUP );
			do_settings_sections( KBG_OPTION_GROUP );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

function kbg_add_settings_menu() {
	add_menu_page(
		__( 'Site Settings', 'kbg' ),
		__( 'Site Settings', 'kbg' ),
		'manage_options',
		'kbg-site-settings',
		'kbg_settings_page_html',
		'dashicons-admin-generic',
		59
	);
}
add_action( 'admin_menu', 'kbg_add_settings_menu' );
