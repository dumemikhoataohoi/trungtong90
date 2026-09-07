<?php
/**
 * Shared script-dependency manifest for every block's edit.asset.php.
 * Mirrors what @wordpress/scripts would auto-generate if we used a build
 * step — written by hand here since this theme intentionally has none.
 */
return array(
	'dependencies' => array(
		'wp-blocks',
		'wp-element',
		'wp-block-editor',
		'wp-components',
		'wp-i18n',
		'wp-server-side-render',
		'kbg-blocks-shared',
	),
	'version' => KBG_THEME_VERSION,
);
