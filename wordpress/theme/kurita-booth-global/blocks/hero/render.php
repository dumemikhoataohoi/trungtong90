<?php
/**
 * Server-side render for kbg/hero. $attributes matches block.json.
 * This file is the single source of truth for the hero's markup — the
 * editor preview (ServerSideRender) and the live front end both call it.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$primary_url   = ! empty( $attributes['primaryCtaUrl'] ) ? $attributes['primaryCtaUrl'] : kbg_site_survey_url();
$secondary_url = ! empty( $attributes['secondaryCtaUrl'] ) ? $attributes['secondaryCtaUrl'] : home_url( '/max-series/' );
$image_url     = ! empty( $attributes['imageUrl'] ) ? $attributes['imageUrl'] : ( $attributes['imageId'] ? wp_get_attachment_image_url( $attributes['imageId'], 'kbg-hero' ) : KBG_THEME_URI . '/assets/img/view-max-vm301w.jpg' );
$meta_items    = ! empty( $attributes['metaItems'] ) ? $attributes['metaItems'] : array();
?>
<section class="hero">
	<div class="container hero-grid">
		<div>
			<span class="hero-badge"><?php echo esc_html( $attributes['badgeText'] ); ?></span>
			<h1 class="hero-title">
				<?php echo esc_html( $attributes['headingLine1'] ); ?><br>
				<em><?php echo esc_html( $attributes['headingAccentLine'] ); ?></em>
			</h1>
			<p class="hero-sub"><?php echo esc_html( $attributes['subtext'] ); ?></p>
			<div class="hero-actions">
				<a href="<?php echo esc_url( $primary_url ); ?>" class="btn btn-primary"><?php echo esc_html( $attributes['primaryCtaText'] ); ?></a>
				<a href="<?php echo esc_url( $secondary_url ); ?>" class="btn btn-secondary"><?php echo esc_html( $attributes['secondaryCtaText'] ); ?></a>
			</div>
			<?php if ( $meta_items ) : ?>
				<div class="hero-meta">
					<?php foreach ( $meta_items as $item ) : ?>
						<div>
							<strong><?php echo esc_html( $item['value'] ?? '' ); ?></strong>
							<span><?php echo esc_html( $item['label'] ?? '' ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="hero-visual">
			<div class="hero-photo">
				<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $attributes['imageCaptionTitle'] ); ?>">
			</div>
			<div class="hero-photo-cap">
				<?php echo esc_html( $attributes['imageCaptionTitle'] ); ?>
				<span><?php echo esc_html( $attributes['imageCaptionSub'] ); ?></span>
			</div>
		</div>
	</div>
</section>
