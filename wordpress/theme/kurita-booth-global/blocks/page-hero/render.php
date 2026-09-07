<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="page-hero">
	<div class="container">
		<div class="breadcrumb">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'kbg' ); ?></a> / <?php echo esc_html( get_the_title() ); ?>
		</div>
		<h1><?php echo esc_html( $attributes['heading'] ); ?></h1>
		<?php if ( ! empty( $attributes['intro'] ) ) : ?>
			<p><?php echo esc_html( $attributes['intro'] ); ?></p>
		<?php endif; ?>
	</div>
</section>
