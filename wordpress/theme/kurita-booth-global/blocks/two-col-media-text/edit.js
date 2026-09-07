(function (wp, KBG) {
	var el = KBG.el;
	var Fragment = KBG.Fragment;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/two-col-media-text", {
		edit: function (props) {
			var a = props.attributes;
			var set = props.setAttributes;
			function s(key) {
				return function (v) {
					var next = {};
					next[key] = v;
					set(next);
				};
			}
			return el(
				"div",
				useBlockProps(),
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: "Text", initialOpen: true },
						el(TextControl, { label: "Eyebrow", value: a.eyebrow, onChange: s("eyebrow") }),
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(TextareaControl, { label: "Text (blank line = new paragraph)", value: a.text, onChange: s("text"), rows: 6 }),
						el(TextControl, { label: "Button text (optional)", value: a.buttonText, onChange: s("buttonText") }),
						el(TextControl, { label: "Button URL", value: a.buttonUrl, onChange: s("buttonUrl") })
					),
					el(
						PanelBody,
						{ title: "Layout & media", initialOpen: false },
						el(SelectControl, {
							label: "Media position",
							value: a.mediaPosition,
							options: [{ label: "Right", value: "right" }, { label: "Left", value: "left" }],
							onChange: s("mediaPosition"),
						}),
						el(SelectControl, {
							label: "Media type",
							value: a.mediaType,
							options: [{ label: "Photo", value: "image" }, { label: "Navy placeholder box (no photo yet)", value: "placeholder" }],
							onChange: s("mediaType"),
						}),
						a.mediaType === "image"
							? el(KBG.MediaField, { value: a.imageId, url: a.imageUrl, onChange: function (id, url) { set({ imageId: id, imageUrl: url }); } })
							: el(
									Fragment,
									null,
									el(TextControl, { label: "Placeholder title", value: a.placeholderTitle, onChange: s("placeholderTitle") }),
									el(TextControl, { label: "Placeholder label", value: a.placeholderLabel, onChange: s("placeholderLabel") })
							  ),
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [{ label: "White", value: "default" }, { label: "Light gray (alt)", value: "alt" }],
							onChange: s("sectionStyle"),
						})
					)
				),
				el(ServerSideRender, { block: "kbg/two-col-media-text", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
