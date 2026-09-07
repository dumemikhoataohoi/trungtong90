<?php
/**
 * Hand-rolled meta box for Case Study fields (customer type is a taxonomy,
 * handled natively by WP's built-in taxonomy metabox — not duplicated here).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_case_study_enqueue_admin( $hook ) {
	global $post_type;
	if ( 'case_study' !== $post_type ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_script( 'kbg-admin-meta', KBG_THEME_URI . '/assets/js/admin-meta.js', array( 'jquery' ), KBG_THEME_VERSION, true );
	wp_enqueue_style( 'kbg-admin-meta', KBG_THEME_URI . '/assets/css/admin-meta.css', array(), KBG_THEME_VERSION );
}
add_action( 'admin_enqueue_scripts', 'kbg_case_study_enqueue_admin' );

function kbg_add_case_study_meta_boxes() {
	add_meta_box( 'kbg_case_study_details', __( 'Case Study Details', 'kbg' ), 'kbg_render_case_study_meta_box', 'case_study', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'kbg_add_case_study_meta_boxes' );

function kbg_render_case_study_meta_box( $post ) {
	wp_nonce_field( 'kbg_save_case_study', 'kbg_case_study_nonce' );

	$problem  = get_post_meta( $post->ID, '_kbg_problem', true );
	$solution = get_post_meta( $post->ID, '_kbg_solution', true );
	$result   = get_post_meta( $post->ID, '_kbg_result', true );
	$location = get_post_meta( $post->ID, '_kbg_location', true );
	$related  = (int) get_post_meta( $post->ID, '_kbg_related_max_id', true );
	$highlight = (bool) get_post_meta( $post->ID, '_kbg_highlight', true );
	$icon      = get_post_meta( $post->ID, '_kbg_icon', true ) ?: 'building';

	$max_products = get_posts( array( 'post_type' => 'max_series', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) );
	?>
	<table class="form-table kbg-meta-table">
		<tr>
			<th><label for="kbg_problem"><?php esc_html_e( 'Problem', 'kbg' ); ?></label></th>
			<td><textarea id="kbg_problem" name="kbg_problem" rows="2" class="large-text"><?php echo esc_textarea( $problem ); ?></textarea></td>
		</tr>
		<tr>
			<th><label for="kbg_solution"><?php esc_html_e( 'Solution', 'kbg' ); ?></label></th>
			<td><textarea id="kbg_solution" name="kbg_solution" rows="2" class="large-text"><?php echo esc_textarea( $solution ); ?></textarea></td>
		</tr>
		<tr>
			<th><label for="kbg_result"><?php esc_html_e( 'Result', 'kbg' ); ?></label></th>
			<td><textarea id="kbg_result" name="kbg_result" rows="2" class="large-text"><?php echo esc_textarea( $result ); ?></textarea></td>
		</tr>
		<tr>
			<th><label for="kbg_icon"><?php esc_html_e( 'Card icon', 'kbg' ); ?></label></th>
			<td>
				<select id="kbg_icon" name="kbg_icon">
					<?php foreach ( kbg_icon_choices() as $key ) : ?>
						<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $icon, $key ); ?>><?php echo esc_html( $key ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="kbg_location"><?php esc_html_e( 'Location', 'kbg' ); ?></label></th>
			<td><input type="text" class="regular-text" id="kbg_location" name="kbg_location" value="<?php echo esc_attr( $location ); ?>" placeholder="e.g. Japan, or Ho Chi Minh City, Vietnam"></td>
		</tr>
		<tr>
			<th><label for="kbg_related_max_id"><?php esc_html_e( 'Related MAX product', 'kbg' ); ?></label></th>
			<td>
				<select id="kbg_related_max_id" name="kbg_related_max_id">
					<option value=""><?php esc_html_e( '— None —', 'kbg' ); ?></option>
					<?php foreach ( $max_products as $p ) : ?>
						<option value="<?php echo esc_attr( $p->ID ); ?>" <?php selected( $related, $p->ID ); ?>><?php echo esc_html( get_the_title( $p ) ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><?php esc_html_e( 'Highlight this case', 'kbg' ); ?></th>
			<td>
				<label>
					<input type="checkbox" name="kbg_highlight" value="1" <?php checked( $highlight ); ?>>
					<?php esc_html_e( 'Show with the red "highlight" card style (e.g. "First Vietnam Installation").', 'kbg' ); ?>
				</label>
			</td>
		</tr>
	</table>
	<p class="description">
		<?php esc_html_e( 'Customer Type (Car Dealer / Independent Repair Shop / ...) is set in the box on the right. Publish/unpublish uses the normal WordPress Publish status above.', 'kbg' ); ?>
	</p>
	<?php
}

function kbg_save_case_study_meta( $post_id ) {
	if ( ! isset( $_POST['kbg_case_study_nonce'] ) || ! wp_verify_nonce( $_POST['kbg_case_study_nonce'], 'kbg_save_case_study' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$textareas = array( 'kbg_problem', 'kbg_solution', 'kbg_result' );
	foreach ( $textareas as $field ) {
		update_post_meta( $post_id, '_' . $field, isset( $_POST[ $field ] ) ? sanitize_textarea_field( wp_unslash( $_POST[ $field ] ) ) : '' );
	}
	update_post_meta( $post_id, '_kbg_location', isset( $_POST['kbg_location'] ) ? sanitize_text_field( wp_unslash( $_POST['kbg_location'] ) ) : '' );
	update_post_meta( $post_id, '_kbg_icon', isset( $_POST['kbg_icon'] ) ? sanitize_key( wp_unslash( $_POST['kbg_icon'] ) ) : 'building' );
	update_post_meta( $post_id, '_kbg_related_max_id', isset( $_POST['kbg_related_max_id'] ) ? (int) $_POST['kbg_related_max_id'] : 0 );
	update_post_meta( $post_id, '_kbg_highlight', isset( $_POST['kbg_highlight'] ) ? 1 : 0 );
}
add_action( 'save_post_case_study', 'kbg_save_case_study_meta' );
