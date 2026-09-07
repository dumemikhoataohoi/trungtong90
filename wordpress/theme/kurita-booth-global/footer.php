<?php
/**
 * Footer template part — ported from the static site's <footer class="site-footer">.
 * "Explore" / "Get Started" columns use their own nav menu locations so the
 * admin can edit those links from Appearance → Menus too.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>

<footer class="site-footer">
	<div class="container">
		<div class="footer-grid">
			<div class="footer-col">
				<div class="footer-brand-name">
					<?php echo wp_kses_post( preg_replace( '/BOOTH/i', '<b>BOOTH</b>', esc_html( get_bloginfo( 'name' ) ), 1 ) ); ?>
				</div>
				<p class="footer-desc"><?php echo esc_html( kbg_get_setting( 'footer_description' ) ); ?></p>
				<div class="footer-tiers">
					<span>Global Site Brand — <?php bloginfo( 'name' ); ?></span>
					<span>Product Family — KURITA MAX SERIES</span>
					<span>Category — Paint Booth Systems</span>
				</div>
			</div>

			<div class="footer-col">
				<h4><?php esc_html_e( 'Explore', 'kbg' ); ?></h4>
				<?php if ( has_nav_menu( 'footer-explore' ) ) : ?>
					<?php wp_nav_menu( array( 'theme_location' => 'footer-explore', 'container' => false, 'items_wrap' => '<ul>%3$s</ul>' ) ); ?>
				<?php else : ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/why-kurita-max/' ) ); ?>"><?php esc_html_e( 'Why KURITA MAX?', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/max-series/' ) ); ?>"><?php esc_html_e( 'MAX Series Overview', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/engineering/' ) ); ?>"><?php esc_html_e( 'Engineering', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/applications/' ) ); ?>"><?php esc_html_e( 'Applications', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/case-studies/' ) ); ?>"><?php esc_html_e( 'Case Studies', 'kbg' ); ?></a></li>
					</ul>
				<?php endif; ?>
			</div>

			<div class="footer-col">
				<h4><?php esc_html_e( 'Get Started', 'kbg' ); ?></h4>
				<?php if ( has_nav_menu( 'footer-get-started' ) ) : ?>
					<?php wp_nav_menu( array( 'theme_location' => 'footer-get-started', 'container' => false, 'items_wrap' => '<ul>%3$s</ul>' ) ); ?>
				<?php else : ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/which-max/' ) ); ?>"><?php esc_html_e( 'Which MAX is right for you?', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( kbg_site_survey_url() ); ?>"><?php esc_html_e( 'Request a Site Survey', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About KURITA', 'kbg' ); ?></a></li>
						<li><a href="<?php echo esc_url( kbg_contact_url() ); ?>"><?php esc_html_e( 'Contact Us', 'kbg' ); ?></a></li>
					</ul>
				<?php endif; ?>
			</div>

			<div class="footer-col">
				<h4><?php esc_html_e( 'Markets', 'kbg' ); ?></h4>
				<ul>
					<li><span class="badge-phase">Vietnam — <?php esc_html_e( 'Live', 'kbg' ); ?></span></li>
					<li style="margin-top:10px;color:#7f93ac;font-size:13px"><?php echo esc_html( kbg_get_setting( 'markets_note' ) ); ?></li>
				</ul>
			</div>
		</div>

		<p class="footer-disclaimer" style="padding-top:22px"><?php echo esc_html( kbg_get_setting( 'footer_disclaimer' ) ); ?></p>

		<div class="footer-bottom">
			<span>© <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?> · CoatureVietnam. <?php esc_html_e( 'All rights reserved.', 'kbg' ); ?></span>
			<span><?php esc_html_e( 'Phase 1 — English & Vietnamese', 'kbg' ); ?></span>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
