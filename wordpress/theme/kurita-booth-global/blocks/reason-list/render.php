<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
?>
<section class="<?php echo esc_attr( $section_class ); ?>">
	<div class="container">
		<div class="reason-list">
			<?php foreach ( (array) $attributes['items'] as $i => $item ) : ?>
				<div class="reason-item">
					<div class="reason-num"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></div>
					<div>
						<h3><?php echo esc_html( $item['heading'] ?? '' ); ?></h3>
						<p><?php echo esc_html( $item['text'] ?? '' ); ?></p>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php if ( $attributes['noteText'] ) : ?>
			<div class="note-box mt-lg"><?php echo esc_html( $attributes['noteText'] ); ?></div>
		<?php endif; ?>
	</div>
</section>
