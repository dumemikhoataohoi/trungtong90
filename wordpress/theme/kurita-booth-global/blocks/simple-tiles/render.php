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
$grid_class = 'grid grid-' . max( 1, min( 6, (int) $attributes['columns'] ) );
$navy_tile  = 'navy' === $attributes['style'];
?>
<section class="<?php echo esc_attr( $section_class ); ?>">
	<div class="container">
		<?php if ( $attributes['eyebrow'] || $attributes['heading'] || $attributes['intro'] ) : ?>
			<div class="section-head center">
				<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
				<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
				<?php if ( $attributes['intro'] ) : ?><p class="section-sub"><?php echo esc_html( $attributes['intro'] ); ?></p><?php endif; ?>
			</div>
		<?php endif; ?>
		<div class="<?php echo esc_attr( $grid_class ); ?>">
			<?php foreach ( (array) $attributes['items'] as $item ) : ?>
				<?php if ( $navy_tile ) : ?>
					<div class="card" style="background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.16);text-align:center">
						<h3 style="color:#fff"><?php echo esc_html( $item['value'] ?? '' ); ?></h3>
						<?php if ( ! empty( $item['note'] ) ) : ?><p style="color:#9fb0c7;margin-top:8px"><?php echo esc_html( $item['note'] ); ?></p><?php endif; ?>
					</div>
				<?php else : ?>
					<div class="card center">
						<?php if ( ! empty( $item['label'] ) ) : ?>
							<b style="font-size:12px;color:var(--steel-400);text-transform:uppercase;letter-spacing:.06em"><?php echo esc_html( $item['label'] ); ?></b>
						<?php endif; ?>
						<h3 style="margin-top:10px"><?php echo esc_html( $item['value'] ?? '' ); ?></h3>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
