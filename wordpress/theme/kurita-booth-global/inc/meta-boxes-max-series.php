<?php
/**
 * Hand-rolled meta box for MAX Series product fields (no ACF).
 * Long description lives in the native post editor (post_content);
 * this box only covers the structured bits the front-end template needs.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_max_series_enqueue_admin( $hook ) {
	global $post_type;
	if ( 'max_series' !== $post_type ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'kbg-admin-meta', KBG_THEME_URI . '/assets/js/admin-meta.js', array( 'jquery' ), KBG_THEME_VERSION, true );
	wp_enqueue_style( 'kbg-admin-meta', KBG_THEME_URI . '/assets/css/admin-meta.css', array(), KBG_THEME_VERSION );
}
add_action( 'admin_enqueue_scripts', 'kbg_max_series_enqueue_admin' );

function kbg_add_max_series_meta_boxes() {
	add_meta_box( 'kbg_max_series_details', __( 'MAX Product Details', 'kbg' ), 'kbg_render_max_series_meta_box', 'max_series', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'kbg_add_max_series_meta_boxes' );

function kbg_render_max_series_meta_box( $post ) {
	wp_nonce_field( 'kbg_save_max_series', 'kbg_max_series_nonce' );

	$position   = get_post_meta( $post->ID, '_kbg_position', true );
	$accent     = get_post_meta( $post->ID, '_kbg_accent', true );
	$message    = get_post_meta( $post->ID, '_kbg_message', true );
	$best_for   = get_post_meta( $post->ID, '_kbg_best_for', true );
	$features   = get_post_meta( $post->ID, '_kbg_features', true ); // array of strings
	$specs      = get_post_meta( $post->ID, '_kbg_specs', true );    // array of [label,value]
	$gallery    = get_post_meta( $post->ID, '_kbg_gallery', true );  // array of attachment IDs
	$brochure   = get_post_meta( $post->ID, '_kbg_brochure_id', true );
	$cta_text   = get_post_meta( $post->ID, '_kbg_cta_text', true );
	$cta_url    = get_post_meta( $post->ID, '_kbg_cta_url', true );

	$features = is_array( $features ) ? $features : array();
	$specs    = is_array( $specs ) ? $specs : array();
	$gallery  = is_array( $gallery ) ? $gallery : array();

	$brochures = get_posts( array( 'post_type' => 'brochure', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
	?>
	<table class="form-table kbg-meta-table">
		<tr>
			<th><label for="kbg_position"><?php esc_html_e( 'Position badge', 'kbg' ); ?></label></th>
			<td>
				<select name="kbg_position" id="kbg_position">
					<?php foreach ( kbg_max_series_positions() as $key => $label ) : ?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $position, $key ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="kbg_accent"><?php esc_html_e( 'Accent color', 'kbg' ); ?></label></th>
			<td>
				<select name="kbg_accent" id="kbg_accent">
					<?php foreach ( kbg_max_series_accents() as $key => $label ) : ?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $accent, $key ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description"><?php esc_html_e( 'Fixed brand palette — keeps the 5-model color system consistent.', 'kbg' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="kbg_message"><?php esc_html_e( 'Main message', 'kbg' ); ?></label></th>
			<td><input type="text" class="large-text" id="kbg_message" name="kbg_message" value="<?php echo esc_attr( $message ); ?>" placeholder="e.g. Compact &amp; Economic"></td>
		</tr>
		<tr>
			<th><label for="kbg_best_for"><?php esc_html_e( 'Best For', 'kbg' ); ?></label></th>
			<td><input type="text" class="large-text" id="kbg_best_for" name="kbg_best_for" value="<?php echo esc_attr( $best_for ); ?>" placeholder="e.g. Passenger Car / Compact &amp; Budget"></td>
		</tr>

		<tr>
			<th><?php esc_html_e( 'Features', 'kbg' ); ?></th>
			<td>
				<div class="kbg-repeater" data-name="kbg_features">
					<div class="kbg-repeater-rows">
						<?php foreach ( $features as $f ) : ?>
							<div class="kbg-repeater-row">
								<input type="text" class="regular-text" name="kbg_features[]" value="<?php echo esc_attr( $f ); ?>">
								<button type="button" class="button-link kbg-repeater-remove">✕</button>
							</div>
						<?php endforeach; ?>
					</div>
					<template class="kbg-repeater-template">
						<div class="kbg-repeater-row">
							<input type="text" class="regular-text" name="kbg_features[]" value="">
							<button type="button" class="button-link kbg-repeater-remove">✕</button>
						</div>
					</template>
					<button type="button" class="button kbg-repeater-add"><?php esc_html_e( '+ Add feature', 'kbg' ); ?></button>
				</div>
			</td>
		</tr>

		<tr>
			<th><?php esc_html_e( 'Technical specs', 'kbg' ); ?></th>
			<td>
				<div class="kbg-repeater" data-name="kbg_specs">
					<div class="kbg-repeater-rows">
						<?php foreach ( $specs as $s ) : ?>
							<div class="kbg-repeater-row">
								<input type="text" class="regular-text" name="kbg_specs_label[]" placeholder="Label" value="<?php echo esc_attr( $s['label'] ?? '' ); ?>">
								<input type="text" class="regular-text" name="kbg_specs_value[]" placeholder="Value" value="<?php echo esc_attr( $s['value'] ?? '' ); ?>">
								<button type="button" class="button-link kbg-repeater-remove">✕</button>
							</div>
						<?php endforeach; ?>
					</div>
					<template class="kbg-repeater-template">
						<div class="kbg-repeater-row">
							<input type="text" class="regular-text" name="kbg_specs_label[]" placeholder="Label" value="">
							<input type="text" class="regular-text" name="kbg_specs_value[]" placeholder="Value" value="">
							<button type="button" class="button-link kbg-repeater-remove">✕</button>
						</div>
					</template>
					<button type="button" class="button kbg-repeater-add"><?php esc_html_e( '+ Add spec row', 'kbg' ); ?></button>
				</div>
			</td>
		</tr>

		<tr>
			<th><?php esc_html_e( 'Gallery', 'kbg' ); ?></th>
			<td>
				<div class="kbg-repeater" data-name="kbg_gallery">
					<div class="kbg-repeater-rows">
						<?php foreach ( $gallery as $att_id ) : ?>
							<?php kbg_render_media_picker_row( 'kbg_gallery[]', $att_id ); ?>
						<?php endforeach; ?>
					</div>
					<template class="kbg-repeater-template">
						<?php kbg_render_media_picker_row( 'kbg_gallery[]', 0, true ); ?>
					</template>
					<button type="button" class="button kbg-repeater-add"><?php esc_html_e( '+ Add gallery image', 'kbg' ); ?></button>
				</div>
			</td>
		</tr>

		<tr>
			<th><label for="kbg_brochure_id"><?php esc_html_e( 'Brochure PDF', 'kbg' ); ?></label></th>
			<td>
				<select name="kbg_brochure_id" id="kbg_brochure_id">
					<option value=""><?php esc_html_e( '— None —', 'kbg' ); ?></option>
					<?php foreach ( $brochures as $b ) : ?>
						<option value="<?php echo esc_attr( $b->ID ); ?>" <?php selected( (int) $brochure, $b->ID ); ?>><?php echo esc_html( get_the_title( $b ) ); ?></option>
					<?php endforeach; ?>
				</select>
				<p class="description">
					<?php
					printf(
						/* translators: %s: link to Add New Brochure screen */
						esc_html__( 'Upload/replace the PDF under %s.', 'kbg' ),
						'<a href="' . esc_url( admin_url( 'post-new.php?post_type=brochure' ) ) . '">' . esc_html__( 'Brochures → Add New', 'kbg' ) . '</a>'
					);
					?>
				</p>
			</td>
		</tr>

		<tr>
			<th><label for="kbg_cta_text"><?php esc_html_e( 'CTA button text (optional override)', 'kbg' ); ?></label></th>
			<td><input type="text" class="regular-text" id="kbg_cta_text" name="kbg_cta_text" value="<?php echo esc_attr( $cta_text ); ?>" placeholder="See if this model fits you"></td>
		</tr>
		<tr>
			<th><label for="kbg_cta_url"><?php esc_html_e( 'CTA button link (optional override)', 'kbg' ); ?></label></th>
			<td><input type="text" class="regular-text" id="kbg_cta_url" name="kbg_cta_url" value="<?php echo esc_attr( $cta_url ); ?>" placeholder="Defaults to the Which MAX page"></td>
		</tr>
	</table>
	<?php
}

/**
 * Renders one gallery repeater row with a WP media-picker button. Set
 * $is_template=true to leave the value empty (used inside <template>).
 */
function kbg_render_media_picker_row( $field_name, $att_id = 0, $is_template = false ) {
	$att_id = $is_template ? 0 : (int) $att_id;
	$url    = $att_id ? wp_get_attachment_image_url( $att_id, 'thumbnail' ) : '';
	?>
	<div class="kbg-repeater-row kbg-media-picker">
		<input type="hidden" class="kbg-media-id" name="<?php echo esc_attr( $field_name ); ?>" value="<?php echo esc_attr( $att_id ); ?>">
		<img class="kbg-media-preview" src="<?php echo esc_url( $url ); ?>" style="<?php echo $url ? '' : 'display:none;'; ?>max-height:60px;vertical-align:middle;margin-right:8px;">
		<button type="button" class="button kbg-media-select"><?php esc_html_e( 'Select image', 'kbg' ); ?></button>
		<button type="button" class="button kbg-media-clear" style="<?php echo $url ? '' : 'display:none;'; ?>"><?php esc_html_e( 'Clear', 'kbg' ); ?></button>
		<button type="button" class="button-link kbg-repeater-remove">✕</button>
	</div>
	<?php
}

function kbg_save_max_series_meta( $post_id ) {
	if ( ! isset( $_POST['kbg_max_series_nonce'] ) || ! wp_verify_nonce( $_POST['kbg_max_series_nonce'], 'kbg_save_max_series' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$text_fields = array( 'kbg_position', 'kbg_accent', 'kbg_message', 'kbg_best_for', 'kbg_cta_text' );
	foreach ( $text_fields as $field ) {
		$meta_key = '_' . $field;
		update_post_meta( $post_id, $meta_key, isset( $_POST[ $field ] ) ? sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) : '' );
	}

	update_post_meta( $post_id, '_kbg_cta_url', isset( $_POST['kbg_cta_url'] ) ? esc_url_raw( wp_unslash( $_POST['kbg_cta_url'] ) ) : '' );
	update_post_meta( $post_id, '_kbg_brochure_id', isset( $_POST['kbg_brochure_id'] ) ? (int) $_POST['kbg_brochure_id'] : 0 );

	$features = isset( $_POST['kbg_features'] ) ? array_map( 'sanitize_text_field', wp_unslash( (array) $_POST['kbg_features'] ) ) : array();
	$features = array_values( array_filter( $features, function ( $v ) { return trim( $v ) !== ''; } ) );
	update_post_meta( $post_id, '_kbg_features', $features );

	$labels = isset( $_POST['kbg_specs_label'] ) ? array_map( 'sanitize_text_field', wp_unslash( (array) $_POST['kbg_specs_label'] ) ) : array();
	$values = isset( $_POST['kbg_specs_value'] ) ? array_map( 'sanitize_text_field', wp_unslash( (array) $_POST['kbg_specs_value'] ) ) : array();
	$specs  = array();
	foreach ( $labels as $i => $label ) {
		if ( trim( $label ) === '' && trim( $values[ $i ] ?? '' ) === '' ) {
			continue;
		}
		$specs[] = array( 'label' => $label, 'value' => $values[ $i ] ?? '' );
	}
	update_post_meta( $post_id, '_kbg_specs', $specs );

	$gallery = isset( $_POST['kbg_gallery'] ) ? array_map( 'intval', (array) $_POST['kbg_gallery'] ) : array();
	$gallery = array_values( array_filter( $gallery ) );
	update_post_meta( $post_id, '_kbg_gallery', $gallery );
}
add_action( 'save_post_max_series', 'kbg_save_max_series_meta' );
