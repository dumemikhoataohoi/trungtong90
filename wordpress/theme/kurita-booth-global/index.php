<?php
/**
 * Fallback template (required by WordPress). All real content types have
 * their own template (page.php, single-max_series.php, etc.) — this only
 * catches anything unexpected (e.g. search results, 404s) with a minimal,
 * on-brand layout instead of a raw PHP notice.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<section class="section">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : the_post(); ?>
				<article <?php post_class(); ?>>
					<h1 class="section-title"><?php the_title(); ?></h1>
					<div class="entry-content"><?php the_content(); ?></div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<div class="section-head center">
				<h1 class="section-title"><?php esc_html_e( 'Nothing found', 'kbg' ); ?></h1>
				<p class="section-sub"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to Home', 'kbg' ); ?></a></p>
			</div>
		<?php endif; ?>
	</div>
</section>
<?php
get_footer();
