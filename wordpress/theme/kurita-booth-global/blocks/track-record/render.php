<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<section class="section section--navy">
	<div class="container">
		<div class="two-col">
			<div>
				<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
				<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
				<?php if ( $attributes['text'] ) : ?><p class="section-sub"><?php echo esc_html( $attributes['text'] ); ?></p><?php endif; ?>
				<?php if ( $attributes['buttonText'] && $attributes['buttonUrl'] ) : ?>
					<div class="hero-actions">
						<a href="<?php echo esc_url( $attributes['buttonUrl'] ); ?>" class="btn btn-secondary"><?php echo esc_html( $attributes['buttonText'] ); ?></a>
					</div>
				<?php endif; ?>
			</div>
			<div class="stats-row">
				<?php foreach ( (array) $attributes['stats'] as $stat ) : ?>
					<div class="stat">
						<div class="num"><?php echo esc_html( $stat['number'] ?? '' ); ?></div>
						<div class="lbl"><?php echo esc_html( $stat['label'] ?? '' ); ?></div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
