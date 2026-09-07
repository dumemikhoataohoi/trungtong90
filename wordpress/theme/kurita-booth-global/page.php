<?php
/**
 * Generic page template used by Home + all 9 informational pages. Every
 * visual section (hero, page-hero, cards, CTA...) is a block placed in the
 * editor — this template intentionally adds nothing on top, so the block
 * sequence the admin arranges is exactly what renders.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
while ( have_posts() ) :
	the_post();
	the_content();
endwhile;
get_footer();
