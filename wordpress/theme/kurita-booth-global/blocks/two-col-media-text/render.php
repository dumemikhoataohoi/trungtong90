<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
$media_order   = 'left' === $attributes['mediaPosition'] ? '' : 'order:2';
$text_order    = 'left' === $attributes['mediaPosition'] ? '' : 'order:1';
$image_url     = ! empty( $attributes['imageUrl'] ) ? $attributes['imageUrl'] : ( $attributes['imageId'] ? wp_get_attachment_image_url( $attributes['imageId'], 'kbg-hero' ) : '' );
?>
<section class="<?php echo esc_attr( $section_class ); ?>">
	<div class="container">
		<div class="two-col">
			<?php if ( 'left' === $attributes['mediaPosition'] ) : ?>
				<?php echo kbg_two_col_media_html( $attributes, $image_url ); ?>
				<div style="<?php echo esc_attr( $text_order ); ?>"><?php echo kbg_two_col_text_html( $attributes ); ?></div>
			<?php else : ?>
				<div style="<?php echo esc_attr( $text_order ); ?>"><?php echo kbg_two_col_text_html( $attributes ); ?></div>
				<?php echo kbg_two_col_media_html( $attributes, $image_url ); ?>
			<?php endif; ?>
		</div>
	</div>
</section>
