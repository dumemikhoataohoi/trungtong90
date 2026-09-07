/**
 * Shared editor-only helpers used by every KURITA block's edit.js.
 * Plain wp.element (no JSX/build step) — keeps the whole theme dependency
 * free, matching the original static site's zero-build-tool philosophy.
 *
 * Exposes window.KBG = { el, Fragment, RepeaterField, MediaField, icons }
 */
(function (wp) {
	"use strict";
	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var Button = wp.components.Button;
	var MediaUpload = wp.blockEditor ? wp.blockEditor.MediaUpload : wp.editor.MediaUpload;

	/**
	 * Renders an editable list of row objects with add/remove controls.
	 *
	 * @param {Object}   props
	 * @param {Array}    props.items   Current array value.
	 * @param {Function} props.onChange Called with the new array.
	 * @param {Array}    props.fields  [{ key, label, type: 'text'|'textarea' }]
	 * @param {Object}   props.newItem Template object used for "+ Add row".
	 * @param {string}   [props.addLabel]
	 */
	function RepeaterField(props) {
		var items = props.items || [];
		var fields = props.fields;

		function updateRow(index, key, value) {
			var next = items.slice();
			next[index] = Object.assign({}, next[index], { [key]: value });
			props.onChange(next);
		}
		function removeRow(index) {
			var next = items.slice();
			next.splice(index, 1);
			props.onChange(next);
		}
		function addRow() {
			props.onChange(items.concat([Object.assign({}, props.newItem)]));
		}
		function moveRow(index, dir) {
			var target = index + dir;
			if (target < 0 || target >= items.length) return;
			var next = items.slice();
			var tmp = next[index];
			next[index] = next[target];
			next[target] = tmp;
			props.onChange(next);
		}

		return el(
			"div",
			{ className: "kbg-editor-repeater" },
			items.map(function (item, index) {
				return el(
					"div",
					{ key: index, className: "kbg-editor-repeater-row", style: { border: "1px solid #ddd", padding: "10px", marginBottom: "8px", borderRadius: "4px" } },
					fields.map(function (f) {
						if (f.type === "select") {
							return el(SelectControl, {
								key: f.key,
								label: f.label,
								value: item[f.key] || (f.options[0] && f.options[0].value) || "",
								options: f.options,
								onChange: function (val) {
									updateRow(index, f.key, val);
								},
							});
						}
						var Control = f.type === "textarea" ? TextareaControl : TextControl;
						return el(Control, {
							key: f.key,
							label: f.label,
							value: item[f.key] || "",
							onChange: function (val) {
								updateRow(index, f.key, val);
							},
						});
					}),
					el(
						"div",
						{ style: { display: "flex", gap: "6px" } },
						el(Button, { isSmall: true, onClick: function () { moveRow(index, -1); } }, "↑"),
						el(Button, { isSmall: true, onClick: function () { moveRow(index, 1); } }, "↓"),
						el(Button, { isSmall: true, isDestructive: true, onClick: function () { removeRow(index); } }, "Remove")
					)
				);
			}),
			el(Button, { isSecondary: true, onClick: addRow }, props.addLabel || "+ Add row")
		);
	}

	/**
	 * Simple image picker: shows a thumbnail + "Select"/"Remove" buttons,
	 * stores the attachment ID (props.value) and calls onChange(id, url).
	 */
	function MediaField(props) {
		return el(
			"div",
			{ className: "kbg-editor-media", style: { marginBottom: "12px" } },
			props.label ? el("p", null, el("strong", null, props.label)) : null,
			props.url ? el("img", { src: props.url, style: { maxWidth: "100%", maxHeight: 160, display: "block", marginBottom: 6 } }) : null,
			el(
				MediaUpload,
				{
					onSelect: function (media) {
						props.onChange(media.id, media.url);
					},
					allowedTypes: ["image"],
					value: props.value,
					render: function (obj) {
						return el(
							Fragment,
							null,
							el(Button, { isSecondary: true, onClick: obj.open }, props.value ? "Replace image" : "Select image"),
							props.value
								? el(Button, { isLink: true, isDestructive: true, onClick: function () { props.onChange(0, ""); } }, "Remove")
								: null
						);
					},
				}
			)
		);
	}

	window.KBG = {
		el: el,
		Fragment: Fragment,
		RepeaterField: RepeaterField,
		MediaField: MediaField,
	};
})(window.wp);
