<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$products  = get_posts( array( 'post_type' => 'max_series', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC', 'post_status' => 'publish' ) );
$positions = kbg_max_series_positions();
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
?>
<section class="<?php echo esc_attr( $section_class ); ?>">
	<div class="container">
		<div class="section-head center">
			<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
			<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
		</div>
		<?php if ( $products ) : ?>
		<div class="table-wrap">
			<table class="compare">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Position', 'kbg' ); ?></th>
						<th><?php esc_html_e( 'Model', 'kbg' ); ?></th>
						<th><?php esc_html_e( 'Main Message', 'kbg' ); ?></th>
						<th><?php esc_html_e( 'Best For', 'kbg' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $products as $p ) :
						$accent   = get_post_meta( $p->ID, '_kbg_accent', true ) ?: 'acc-adv';
						$position = get_post_meta( $p->ID, '_kbg_position', true );
						?>
						<tr>
							<td><span class="tag" style="background:var(--<?php echo esc_attr( $accent ); ?>);color:#fff"><?php echo esc_html( strtoupper( $positions[ $position ] ?? $position ) ); ?></span></td>
							<td><b><?php echo esc_html( get_the_title( $p ) ); ?></b></td>
							<td><?php echo esc_html( get_post_meta( $p->ID, '_kbg_message', true ) ); ?></td>
							<td><?php echo esc_html( get_post_meta( $p->ID, '_kbg_best_for', true ) ); ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
		<?php endif; ?>
	</div>
</section>
