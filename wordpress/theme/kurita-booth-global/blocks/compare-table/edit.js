(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var SelectControl = wp.components.SelectControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/compare-table", {
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
						{ title: "Heading", initialOpen: true },
						el(TextControl, { label: "Eyebrow", value: a.eyebrow, onChange: s("eyebrow") }),
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [
								{ label: "White", value: "default" },
								{ label: "Light gray (alt)", value: "alt" },
							],
							onChange: s("sectionStyle"),
						})
					)
				),
				el(ServerSideRender, { block: "kbg/compare-table", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
