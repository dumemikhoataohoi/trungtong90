<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$products = get_posts( array(
	'post_type'      => 'max_series',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order',
	'order'          => 'ASC',
	'post_status'    => 'publish',
) );
$positions = kbg_max_series_positions();
?>
<section class="section">
	<div class="container">
		<?php if ( $attributes['eyebrow'] || $attributes['heading'] || $attributes['intro'] ) : ?>
			<div class="section-head">
				<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
				<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
				<?php if ( $attributes['intro'] ) : ?><p class="section-sub"><?php echo esc_html( $attributes['intro'] ); ?></p><?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( ! $products ) : ?>
			<p class="note-box"><?php esc_html_e( 'No MAX Series products published yet. Add them under MAX Series → Add New.', 'kbg' ); ?></p>
		<?php else : ?>
			<div class="grid grid-5">
				<?php foreach ( $products as $p ) :
					$accent   = get_post_meta( $p->ID, '_kbg_accent', true ) ?: 'acc-adv';
					$position = get_post_meta( $p->ID, '_kbg_position', true );
					$message  = get_post_meta( $p->ID, '_kbg_message', true );
					$desc     = has_excerpt( $p ) ? get_the_excerpt( $p ) : wp_trim_words( $p->post_content, 24 );
					?>
					<div class="product-card">
						<div class="product-accent" style="background:var(--<?php echo esc_attr( $accent ); ?>)"></div>
						<div class="product-body">
							<span class="product-badge" style="background:var(--<?php echo esc_attr( $accent ); ?>)"><?php echo esc_html( strtoupper( $positions[ $position ] ?? $position ) ); ?></span>
							<h3><?php echo esc_html( get_the_title( $p ) ); ?></h3>
							<?php if ( $message ) : ?><p class="product-msg"><?php echo esc_html( $message ); ?></p><?php endif; ?>
							<p class="desc"><?php echo esc_html( $desc ); ?></p>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( $attributes['footerLinkUrl'] && $attributes['footerLinkText'] ) : ?>
			<div class="center mt-lg">
				<a href="<?php echo esc_url( $attributes['footerLinkUrl'] ); ?>" class="btn btn-outline"><?php echo esc_html( $attributes['footerLinkText'] ); ?></a>
			</div>
		<?php endif; ?>
	</div>
</section>
