<?php
/**
 * Meta box for one "Which MAX" problem-mapping row. Title field = the
 * problem statement itself, in whatever language this post is (same
 * one-post-per-language pattern as every other content type — translate
 * via Polylang, don't duplicate EN/VI fields on one post).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function kbg_add_problem_map_meta_boxes() {
	add_meta_box( 'kbg_problem_map_details', __( 'Mapping Details', 'kbg' ), 'kbg_render_problem_map_meta_box', 'kbg_problem_map', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'kbg_add_problem_map_meta_boxes' );

function kbg_render_problem_map_meta_box( $post ) {
	wp_nonce_field( 'kbg_save_problem_map', 'kbg_problem_map_nonce' );

	$key            = get_post_meta( $post->ID, '_kbg_key', true );
	$icon           = get_post_meta( $post->ID, '_kbg_icon', true ) ?: 'check';
	$requirement    = get_post_meta( $post->ID, '_kbg_requirement', true );
	$recommended    = (int) get_post_meta( $post->ID, '_kbg_recommended_max_id', true );
	$model_fallback = get_post_meta( $post->ID, '_kbg_model_fallback', true );
	$note           = get_post_meta( $post->ID, '_kbg_note', true );

	$max_products = get_posts( array( 'post_type' => 'max_series', 'posts_per_page' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ) );
	?>
	<p class="description"><?php esc_html_e( 'The Title field above is the problem statement shown on the selector button (e.g. "Poor airflow"). If using Polylang, translate this post normally — the linked Vietnamese post carries its own title/fields.', 'kbg' ); ?></p>
	<table class="form-table kbg-meta-table">
		<tr>
			<th><label for="kbg_key"><?php esc_html_e( 'Shared key (same value on every language version of this row)', 'kbg' ); ?></label></th>
			<td><input type="text" class="regular-text" id="kbg_key" name="kbg_key" value="<?php echo esc_attr( $key ); ?>" placeholder="e.g. poor-airflow" required></td>
		</tr>
		<tr>
			<th><label for="kbg_icon"><?php esc_html_e( 'Chip icon', 'kbg' ); ?></label></th>
			<td>
				<select id="kbg_icon" name="kbg_icon">
					<?php foreach ( kbg_icon_choices() as $ikey ) : ?>
						<option value="<?php echo esc_attr( $ikey ); ?>" <?php selected( $icon, $ikey ); ?>><?php echo esc_html( $ikey ); ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th><label for="kbg_requirement"><?php esc_html_e( 'Engineering requirement', 'kbg' ); ?></label></th>
			<td><input type="text" class="large-text" id="kbg_requirement" name="kbg_requirement" value="<?php echo esc_attr( $requirement ); ?>"></td>
		</tr>
		<tr>
			<th><label for="kbg_recommended_max_id"><?php esc_html_e( 'Recommended MAX', 'kbg' ); ?></label></th>
			<td>
				<select id="kbg_recommended_max_id" name="kbg_recommended_max_id">
					<option value=""><?php esc_html_e( '— Use text fallback below —', 'kbg' ); ?></option>
					<?php foreach ( $max_products as $p ) : ?>
						<option value="<?php echo esc_attr( $p->ID ); ?>" <?php selected( $recommended, $p->ID ); ?>><?php echo esc_html( get_the_title( $p ) ); ?></option>
					<?php endforeach; ?>
				</select>
				<input type="text" class="regular-text" name="kbg_model_fallback" value="<?php echo esc_attr( $model_fallback ); ?>" placeholder="e.g. MAX Series (used only if no product selected above)">
			</td>
		</tr>
		<tr>
			<th><label for="kbg_note"><?php esc_html_e( 'Note', 'kbg' ); ?></label></th>
			<td><textarea id="kbg_note" name="kbg_note" rows="2" class="large-text"><?php echo esc_textarea( $note ); ?></textarea></td>
		</tr>
	</table>
	<?php
}

function kbg_save_problem_map_meta( $post_id ) {
	if ( ! isset( $_POST['kbg_problem_map_nonce'] ) || ! wp_verify_nonce( $_POST['kbg_problem_map_nonce'], 'kbg_save_problem_map' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	$fields = array( 'kbg_key', 'kbg_requirement', 'kbg_model_fallback' );
	foreach ( $fields as $field ) {
		update_post_meta( $post_id, '_' . $field, isset( $_POST[ $field ] ) ? sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) : '' );
	}
	update_post_meta( $post_id, '_kbg_icon', isset( $_POST['kbg_icon'] ) ? sanitize_key( wp_unslash( $_POST['kbg_icon'] ) ) : 'check' );
	update_post_meta( $post_id, '_kbg_note', isset( $_POST['kbg_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['kbg_note'] ) ) : '' );
	update_post_meta( $post_id, '_kbg_recommended_max_id', isset( $_POST['kbg_recommended_max_id'] ) ? (int) $_POST['kbg_recommended_max_id'] : 0 );
}
add_action( 'save_post_kbg_problem_map', 'kbg_save_problem_map_meta' );
