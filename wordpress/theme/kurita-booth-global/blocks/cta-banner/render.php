<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$primary_url = ! empty( $attributes['primaryUrl'] ) ? $attributes['primaryUrl'] : kbg_site_survey_url();
?>
<section class="section">
	<div class="container">
		<div class="cta-banner">
			<div class="cta-banner-text">
				<h3><?php echo esc_html( $attributes['heading'] ); ?></h3>
				<?php if ( $attributes['text'] ) : ?><p><?php echo esc_html( $attributes['text'] ); ?></p><?php endif; ?>
			</div>
			<div class="cta-banner-actions">
				<?php if ( $attributes['primaryText'] ) : ?>
					<a href="<?php echo esc_url( $primary_url ); ?>" class="btn btn-primary"><?php echo esc_html( $attributes['primaryText'] ); ?></a>
				<?php endif; ?>
				<?php if ( $attributes['secondaryText'] && $attributes['secondaryUrl'] ) : ?>
					<a href="<?php echo esc_url( $attributes['secondaryUrl'] ); ?>" class="btn btn-secondary"><?php echo esc_html( $attributes['secondaryText'] ); ?></a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
