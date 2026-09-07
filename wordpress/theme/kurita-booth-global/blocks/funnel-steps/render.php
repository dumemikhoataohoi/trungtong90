<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
$vertical      = 'vertical' === $attributes['orientation'];
$wrap_class    = $vertical ? 'funnel-v' : 'funnel';
$steps         = (array) $attributes['steps'];
$count         = count( $steps );
$style_attr    = $vertical && $attributes['maxWidth'] ? ' style="max-width:' . esc_attr( $attributes['maxWidth'] ) . ';margin:0 auto"' : '';
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

		<div class="<?php echo esc_attr( $wrap_class ); ?>"<?php echo $style_attr; ?>>
			<?php foreach ( $steps as $i => $step ) : ?>
				<div class="funnel-step">
					<div class="step-no"><?php echo esc_html( $i + 1 ); ?></div>
					<h4><?php echo esc_html( $step['heading'] ?? '' ); ?></h4>
					<p><?php echo esc_html( $step['text'] ?? '' ); ?></p>
				</div>
				<?php if ( $i < $count - 1 ) : ?>
					<div class="funnel-arrow"><?php echo kbg_icon_svg( 'arrow' ); ?></div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</section>
