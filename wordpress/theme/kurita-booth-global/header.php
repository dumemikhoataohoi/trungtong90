<?php
/**
 * Header template part — ported from the static site's <header class="site-header">.
 * Nav links come from Appearance → Menus ("Primary Navigation"); until the
 * admin sets one up, kbg_fallback_nav_menu() reproduces the original 9 links.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#kbg-main"><?php esc_html_e( 'Skip to content', 'kbg' ); ?></a>

<header class="site-header">
	<div class="topbar">
		<div class="container">
			<div class="topbar-links">
				<span><?php echo esc_html( kbg_get_setting( 'topbar_text' ) ); ?></span>
			</div>
			<div class="topbar-links">
				<a href="<?php echo esc_url( kbg_site_survey_url() ); ?>"><?php esc_html_e( 'Request a Site Survey', 'kbg' ); ?></a>
				<a href="<?php echo esc_url( kbg_contact_url() ); ?>"><?php esc_html_e( 'Contact', 'kbg' ); ?></a>
			</div>
		</div>
	</div>
	<div class="container nav-wrap">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand">
			<span class="brand-name">
				<?php
				$site_name = get_bloginfo( 'name' );
				// Keep the "BOOTH" mid-word red-accent treatment from the
				// original static logo without hardcoding the whole name.
				echo wp_kses_post( preg_replace( '/BOOTH/i', '<b>BOOTH</b>', esc_html( $site_name ), 1 ) );
				?>
			</span>
			<span class="brand-sub"><?php bloginfo( 'description' ); ?></span>
		</a>

		<?php
		if ( has_nav_menu( 'primary' ) ) {
			wp_nav_menu( array(
				'theme_location' => 'primary',
				'container'      => 'nav',
				'container_class' => 'nav',
				'items_wrap'     => '%3$s',
				'walker'         => new KBG_Flat_Nav_Walker(),
			) );
		} else {
			kbg_fallback_nav_menu();
		}
		?>

		<div class="nav-actions">
			<?php kbg_render_language_switcher(); ?>
			<a href="<?php echo esc_url( kbg_site_survey_url() ); ?>" class="btn btn-primary btn-sm"><?php esc_html_e( 'Request Site Survey', 'kbg' ); ?></a>
			<button class="nav-toggle" aria-label="<?php esc_attr_e( 'Menu', 'kbg' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
			</button>
		</div>
	</div>
</header>

<main id="kbg-main">
