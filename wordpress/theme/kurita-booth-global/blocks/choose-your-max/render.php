<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$args = array(
	'post_type'      => 'kbg_problem_map',
	'posts_per_page' => -1,
	'orderby'        => 'menu_order',
	'order'          => 'ASC',
	'post_status'    => 'publish',
);
if ( function_exists( 'pll_current_language' ) ) {
	$args['lang'] = pll_current_language();
}
$rows = get_posts( $args );
$section_class = 'section' . ( 'alt' === $attributes['sectionStyle'] ? ' section--alt' : '' );
?>
<section class="<?php echo esc_attr( $section_class ); ?>" id="choose-your-max">
	<div class="container">
		<div class="section-head center">
			<?php if ( $attributes['eyebrow'] ) : ?><span class="eyebrow"><?php echo esc_html( $attributes['eyebrow'] ); ?></span><?php endif; ?>
			<?php if ( $attributes['heading'] ) : ?><h2 class="section-title"><?php echo esc_html( $attributes['heading'] ); ?></h2><?php endif; ?>
			<?php if ( $attributes['intro'] ) : ?><p class="section-sub"><?php echo esc_html( $attributes['intro'] ); ?></p><?php endif; ?>
		</div>

		<?php if ( ! $rows ) : ?>
			<p class="note-box"><?php esc_html_e( 'No problem rows published yet. Add them under MAX Series → Which MAX Rules.', 'kbg' ); ?></p>
		<?php else : ?>
			<div class="problem-grid">
				<?php foreach ( $rows as $row ) :
					$key  = get_post_meta( $row->ID, '_kbg_key', true );
					$icon = get_post_meta( $row->ID, '_kbg_icon', true ) ?: 'check';
					if ( ! $key ) { continue; }
					?>
					<button class="problem-chip" data-problem="<?php echo esc_attr( $key ); ?>">
						<?php echo kbg_icon_svg( $icon ); ?>
						<span><?php echo esc_html( get_the_title( $row ) ); ?></span>
					</button>
				<?php endforeach; ?>
			</div>

			<div class="problem-result" id="problem-result">
				<div class="problem-result-grid">
					<div class="pr-step">
						<b><?php esc_html_e( 'Engineering Requirement', 'kbg' ); ?></b>
						<div class="val" data-out="req">—</div>
					</div>
					<div class="pr-arrow"><?php echo kbg_icon_svg( 'arrow' ); ?></div>
					<div class="pr-step">
						<b><?php esc_html_e( 'Potential MAX', 'kbg' ); ?></b>
						<div class="val"><a data-out="model-link" href="#" style="color:var(--red)"><span data-out="model">—</span></a></div>
					</div>
				</div>

				<?php if ( $attributes['showFlowDiagram'] ) : ?>
					<div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap;align-items:stretch">
						<div style="flex:1;min-width:110px;padding:12px;border:1px solid var(--line);border-radius:8px">
							<div style="width:22px;height:22px;border-radius:50%;background:var(--navy-900);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:8px">1</div>
							<b style="font-size:13px;display:block"><?php esc_html_e( 'Problem', 'kbg' ); ?></b>
							<div style="font-size:11.5px;color:var(--steel-600);margin-top:4px"><?php esc_html_e( 'What you selected above', 'kbg' ); ?></div>
						</div>
						<div style="flex:1;min-width:110px;padding:12px;border:1px solid var(--line);border-radius:8px">
							<div style="width:22px;height:22px;border-radius:50%;background:var(--navy-900);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:8px">2</div>
							<b style="font-size:13px;display:block"><?php esc_html_e( 'Potential MAX', 'kbg' ); ?></b>
							<div style="font-size:11.5px;color:var(--steel-600);margin-top:4px"><?php esc_html_e( 'Instant match from the website', 'kbg' ); ?></div>
						</div>
						<div style="flex:1;min-width:110px;padding:12px;border:1px solid var(--line);border-radius:8px">
							<div style="width:22px;height:22px;border-radius:50%;background:var(--navy-900);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:8px">3</div>
							<b style="font-size:13px;display:block"><?php esc_html_e( 'Site Survey', 'kbg' ); ?></b>
							<div style="font-size:11.5px;color:var(--steel-600);margin-top:4px"><?php esc_html_e( 'On-site visit & findings', 'kbg' ); ?></div>
						</div>
						<div style="flex:1;min-width:110px;padding:12px;border:1px solid var(--line);border-radius:8px">
							<div style="width:22px;height:22px;border-radius:50%;background:var(--navy-900);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:8px">4</div>
							<b style="font-size:13px;display:block"><?php esc_html_e( 'KURITA Technical Review', 'kbg' ); ?></b>
							<div style="font-size:11.5px;color:var(--steel-600);margin-top:4px"><?php esc_html_e( 'Japan engineering validates', 'kbg' ); ?></div>
						</div>
						<div style="flex:1;min-width:110px;padding:12px;border:1px solid var(--red);border-radius:8px">
							<div style="width:22px;height:22px;border-radius:50%;background:var(--red);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-bottom:8px">5</div>
							<b style="font-size:13px;display:block"><?php esc_html_e( 'Final Recommendation', 'kbg' ); ?></b>
							<div style="font-size:11.5px;color:var(--steel-600);margin-top:4px"><?php esc_html_e( 'Confirmed MAX model', 'kbg' ); ?></div>
						</div>
					</div>
					<p style="margin-top:12px;font-size:12px;font-style:italic;color:var(--steel-400)">
						<?php esc_html_e( 'This is a potential match based on your answer — not a final decision.', 'kbg' ); ?>
					</p>
				<?php else : ?>
					<p style="margin-top:10px;font-size:12px;font-style:italic;color:var(--steel-400)">
						<?php esc_html_e( 'Final model confirmed after Site Survey + KURITA technical review.', 'kbg' ); ?>
					</p>
				<?php endif; ?>

				<p class="form-note" style="margin-top:18px;font-size:14px;color:var(--steel-600)" data-out="note"></p>
				<div style="margin-top:18px">
					<a href="<?php echo esc_url( kbg_site_survey_url() ); ?>" class="btn btn-primary btn-sm"><?php echo esc_html( $attributes['resultCtaText'] ); ?></a>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $attributes['footerLinkUrl'] && $attributes['footerLinkText'] ) : ?>
			<div class="center mt-lg">
				<a href="<?php echo esc_url( $attributes['footerLinkUrl'] ); ?>" class="btn btn-outline"><?php echo esc_html( $attributes['footerLinkText'] ); ?></a>
			</div>
		<?php endif; ?>
	</div>
</section>
