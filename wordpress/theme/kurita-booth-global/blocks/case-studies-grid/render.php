<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$cases = get_posts( array(
	'post_type'      => 'case_study',
	'posts_per_page' => (int) $attributes['limit'],
	'orderby'        => 'menu_order',
	'order'          => 'ASC',
	'post_status'    => 'publish',
) );
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
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

		<?php if ( ! $cases ) : ?>
			<p class="note-box"><?php esc_html_e( 'No case studies published yet. Add them under Case Studies → Add New.', 'kbg' ); ?></p>
		<?php else : ?>
			<div class="grid grid-4">
				<?php foreach ( $cases as $case ) :
					$highlight = (bool) get_post_meta( $case->ID, '_kbg_highlight', true );
					$icon      = get_post_meta( $case->ID, '_kbg_icon', true ) ?: 'building';
					$terms     = get_the_terms( $case, 'case_study_type' );
					$type_label = $terms && ! is_wp_error( $terms ) ? $terms[0]->name : '';
					$card_class = 'case-card' . ( $highlight ? ' case-card--highlight' : '' );
					?>
					<div class="<?php echo esc_attr( $card_class ); ?>">
						<div class="case-media"><?php echo kbg_icon_svg( $icon, 1.5 ); ?></div>
						<div class="case-body">
							<?php if ( $type_label ) : ?>
								<span class="case-tag"<?php echo $highlight ? ' style="color:var(--red)"' : ''; ?>><?php echo esc_html( $type_label ); ?></span>
							<?php endif; ?>
							<h3><?php echo esc_html( get_the_title( $case ) ); ?></h3>
							<p><?php echo esc_html( has_excerpt( $case ) ? get_the_excerpt( $case ) : get_post_meta( $case->ID, '_kbg_result', true ) ); ?></p>
							<?php if ( $highlight ) : ?>
								<a href="<?php echo esc_url( kbg_site_survey_url() ); ?>" class="btn btn-primary btn-sm" style="margin-top:14px"><?php esc_html_e( 'Request a Site Survey', 'kbg' ); ?></a>
							<?php endif; ?>
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
