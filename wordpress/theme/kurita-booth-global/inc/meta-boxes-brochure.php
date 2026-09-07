<?php
/**
 * Hand-rolled meta box for Brochure fields (PDF file + download button
 * text). Thumbnail uses WP's native Featured Image box.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_brochure_enqueue_admin( $hook ) {
	global $post_type;
	if ( 'brochure' !== $post_type ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_script( 'kbg-admin-meta', KBG_THEME_URI . '/assets/js/admin-meta.js', array( 'jquery' ), KBG_THEME_VERSION, true );
	wp_enqueue_style( 'kbg-admin-meta', KBG_THEME_URI . '/assets/css/admin-meta.css', array(), KBG_THEME_VERSION );
}
add_action( 'admin_enqueue_scripts', 'kbg_brochure_enqueue_admin' );

function kbg_add_brochure_meta_boxes() {
	add_meta_box( 'kbg_brochure_details', __( 'Brochure File', 'kbg' ), 'kbg_render_brochure_meta_box', 'brochure', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'kbg_add_brochure_meta_boxes' );

function kbg_render_brochure_meta_box( $post ) {
	wp_nonce_field( 'kbg_save_brochure', 'kbg_brochure_nonce' );

	$pdf_id      = (int) get_post_meta( $post->ID, '_kbg_pdf_id', true );
	$button_text = get_post_meta( $post->ID, '_kbg_button_text', true );
	if ( '' === $button_text ) {
		$button_text = __( 'Download Brochure (PDF)', 'kbg' );
	}
	$pdf_url  = $pdf_id ? wp_get_attachment_url( $pdf_id ) : '';
	$pdf_name = $pdf_id ? basename( get_attached_file( $pdf_id ) ) : '';
	?>
	<table class="form-table kbg-meta-table">
		<tr>
			<th><?php esc_html_e( 'PDF file', 'kbg' ); ?></th>
			<td>
				<div class="kbg-media-picker">
					<input type="hidden" class="kbg-media-id" name="kbg_pdf_id" value="<?php echo esc_attr( $pdf_id ); ?>">
					<span class="kbg-file-name" style="<?php echo $pdf_name ? '' : 'display:none;'; ?>"><?php echo esc_html( $pdf_name ); ?></span>
					<button type="button" class="button kbg-file-select"><?php echo $pdf_id ? esc_html__( 'Replace PDF', 'kbg' ) : esc_html__( 'Select PDF', 'kbg' ); ?></button>
					<?php if ( $pdf_url ) : ?>
						<a href="<?php echo esc_url( $pdf_url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'View current file', 'kbg' ); ?></a>
					<?php endif; ?>
				</div>
				<p class="description"><?php esc_html_e( 'Brochure design is not changed here — only the file being served and the label below.', 'kbg' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="kbg_button_text"><?php esc_html_e( 'Download button text', 'kbg' ); ?></label></th>
			<td><input type="text" class="regular-text" id="kbg_button_text" name="kbg_button_text" value="<?php echo esc_attr( $button_text ); ?>"></td>
		</tr>
	</table>
	<p class="description"><?php esc_html_e( 'Thumbnail/cover image uses the Featured Image box on the right.', 'kbg' ); ?></p>
	<?php
}

function kbg_save_brochure_meta( $post_id ) {
	if ( ! isset( $_POST['kbg_brochure_nonce'] ) || ! wp_verify_nonce( $_POST['kbg_brochure_nonce'], 'kbg_save_brochure' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	update_post_meta( $post_id, '_kbg_pdf_id', isset( $_POST['kbg_pdf_id'] ) ? (int) $_POST['kbg_pdf_id'] : 0 );
	update_post_meta( $post_id, '_kbg_button_text', isset( $_POST['kbg_button_text'] ) ? sanitize_text_field( wp_unslash( $_POST['kbg_button_text'] ) ) : '' );
}
add_action( 'save_post_brochure', 'kbg_save_brochure_meta' );
