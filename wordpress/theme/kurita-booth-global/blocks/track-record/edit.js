(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/track-record", {
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
						el(TextControl, { label: "Eyebrow", value: a.eyebrow, onChange: s("eyebrow") }),
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(TextareaControl, { label: "Text", value: a.text, onChange: s("text") }),
						el(TextControl, { label: "Button text", value: a.buttonText, onChange: s("buttonText") }),
						el(TextControl, { label: "Button URL", value: a.buttonUrl, onChange: s("buttonUrl") })
					),
					el(
						PanelBody,
						{ title: "Stats", initialOpen: true },
						el(KBG.RepeaterField, {
							items: a.stats,
							onChange: s("stats"),
							fields: [
								{ key: "number", label: "Number / short value" },
								{ key: "label", label: "Label" },
							],
							newItem: { number: "", label: "" },
							addLabel: "+ Add stat",
						})
					)
				),
				el(ServerSideRender, { block: "kbg/track-record", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
