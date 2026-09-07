<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$section_class = 'section';
if ( 'alt' === $attributes['sectionStyle'] ) {
	$section_class .= ' section--alt';
} elseif ( 'navy' === $attributes['sectionStyle'] ) {
	$section_class .= ' section--navy';
}
$card_class = 'card' . ( 'pillar' === $attributes['cardStyle'] ? ' pillar-card' : '' );
$grid_class = 'grid grid-' . max( 1, min( 6, (int) $attributes['columns'] ) );
?>
<section class="<?php echo esc_attr( $section_class ); ?>">
	<div class="container">
		<?php if ( $attributes['eyebrow'] || $attributes['heading'] || $attributes['intro'] ) : ?>
			<div class="section-head<?php echo $attributes['centerHeading'] ? ' center' : ''; ?>">
				<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
				<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
				<?php if ( $attributes['intro'] ) : ?><p class="section-sub"><?php echo esc_html( $attributes['intro'] ); ?></p><?php endif; ?>
			</div>
		<?php endif; ?>

		<div class="<?php echo esc_attr( $grid_class ); ?>">
			<?php foreach ( (array) $attributes['items'] as $item ) : ?>
				<div class="<?php echo esc_attr( $card_class ); ?>">
					<div class="card-icon"><?php echo kbg_icon_svg( $item['icon'] ?? 'check' ); ?></div>
					<h3><?php echo esc_html( $item['heading'] ?? '' ); ?></h3>
					<p><?php echo esc_html( $item['text'] ?? '' ); ?></p>
					<?php if ( ! empty( $item['linkUrl'] ) && ! empty( $item['linkText'] ) ) : ?>
						<div class="hero-actions" style="margin-top:14px">
							<a href="<?php echo esc_url( $item['linkUrl'] ); ?>" class="tag" style="background:var(--navy-800);color:#fff"><?php echo esc_html( $item['linkText'] ); ?></a>
						</div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>

		<?php if ( $attributes['footerLinkUrl'] && $attributes['footerLinkText'] ) : ?>
			<div class="center mt-lg">
				<a href="<?php echo esc_url( $attributes['footerLinkUrl'] ); ?>" class="btn btn-outline"><?php echo esc_html( $attributes['footerLinkText'] ); ?></a>
			</div>
		<?php endif; ?>
	</div>
</section>
