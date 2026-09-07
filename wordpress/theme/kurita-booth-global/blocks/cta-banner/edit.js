(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/cta-banner", {
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
						{ title: "Content", initialOpen: true },
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(TextareaControl, { label: "Text", value: a.text, onChange: s("text") }),
						el(TextControl, { label: "Primary button text", value: a.primaryText, onChange: s("primaryText") }),
						el(TextControl, { label: "Primary button URL (blank = Site Survey page)", value: a.primaryUrl, onChange: s("primaryUrl") }),
						el(TextControl, { label: "Secondary button text (optional)", value: a.secondaryText, onChange: s("secondaryText") }),
						el(TextControl, { label: "Secondary button URL", value: a.secondaryUrl, onChange: s("secondaryUrl") })
					)
				),
				el(ServerSideRender, { block: "kbg/cta-banner", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
