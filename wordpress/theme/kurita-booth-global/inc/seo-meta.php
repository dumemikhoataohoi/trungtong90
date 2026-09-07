<?php
/**
 * Minimal built-in SEO fields (title/meta description/social image), so the
 * site is SEO-functional even before Rank Math/Yoast is installed. If
 * Rank Math or Yoast IS active, this steps out of the way entirely.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_seo_plugin_active() {
	return defined( 'RANK_MATH_VERSION' ) || defined( 'WPSEO_VERSION' );
}

function kbg_seo_meta_box() {
	if ( kbg_seo_plugin_active() ) {
		return;
	}
	$screens = array( 'page', 'max_series', 'case_study' );
	foreach ( $screens as $screen ) {
		add_meta_box( 'kbg_seo', __( 'SEO (basic)', 'kbg' ), 'kbg_render_seo_meta_box', $screen, 'normal', 'low' );
	}
}
add_action( 'add_meta_boxes', 'kbg_seo_meta_box' );

function kbg_render_seo_meta_box( $post ) {
	wp_nonce_field( 'kbg_save_seo', 'kbg_seo_nonce' );
	$title = get_post_meta( $post->ID, '_kbg_seo_title', true );
	$desc  = get_post_meta( $post->ID, '_kbg_seo_description', true );
	?>
	<p>
		<label for="kbg_seo_title"><strong><?php esc_html_e( 'SEO title (leave blank to use the page title)', 'kbg' ); ?></strong></label><br>
		<input type="text" class="large-text" id="kbg_seo_title" name="kbg_seo_title" value="<?php echo esc_attr( $title ); ?>">
	</p>
	<p>
		<label for="kbg_seo_description"><strong><?php esc_html_e( 'Meta description', 'kbg' ); ?></strong></label><br>
		<textarea class="large-text" rows="2" id="kbg_seo_description" name="kbg_seo_description"><?php echo esc_textarea( $desc ); ?></textarea>
	</p>
	<p class="description"><?php esc_html_e( 'Social share image uses the Featured Image. URL slug and heading structure are controlled from the normal editor above.', 'kbg' ); ?></p>
	<?php
}

function kbg_save_seo_meta( $post_id ) {
	if ( ! isset( $_POST['kbg_seo_nonce'] ) || ! wp_verify_nonce( $_POST['kbg_seo_nonce'], 'kbg_save_seo' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	update_post_meta( $post_id, '_kbg_seo_title', isset( $_POST['kbg_seo_title'] ) ? sanitize_text_field( wp_unslash( $_POST['kbg_seo_title'] ) ) : '' );
	update_post_meta( $post_id, '_kbg_seo_description', isset( $_POST['kbg_seo_description'] ) ? sanitize_textarea_field( wp_unslash( $_POST['kbg_seo_description'] ) ) : '' );
}
add_action( 'save_post', 'kbg_save_seo_meta' );

function kbg_output_seo_head() {
	if ( kbg_seo_plugin_active() || ! is_singular() ) {
		return;
	}
	global $post;
	$desc = get_post_meta( $post->ID, '_kbg_seo_description', true );
	if ( $desc ) {
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	}
	if ( has_post_thumbnail( $post ) ) {
		$img = wp_get_attachment_image_url( get_post_thumbnail_id( $post ), 'kbg-hero' );
		printf( '<meta property="og:image" content="%s">' . "\n", esc_url( $img ) );
	}
	printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( kbg_get_seo_title( $post ) ) );
}
add_action( 'wp_head', 'kbg_output_seo_head', 1 );

function kbg_get_seo_title( $post = null ) {
	$post = $post ? $post : get_post();
	if ( ! $post ) {
		return get_bloginfo( 'name' );
	}
	$custom = get_post_meta( $post->ID, '_kbg_seo_title', true );
	return $custom ? $custom : get_the_title( $post );
}

function kbg_filter_document_title( $title_parts ) {
	if ( kbg_seo_plugin_active() || ! is_singular() ) {
		return $title_parts;
	}
	$custom = get_post_meta( get_the_ID(), '_kbg_seo_title', true );
	if ( $custom ) {
		$title_parts['title'] = $custom;
	}
	return $title_parts;
}
add_filter( 'document_title_parts', 'kbg_filter_document_title' );
