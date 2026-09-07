(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/funnel-steps", {
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
						el(TextareaControl, { label: "Intro", value: a.intro, onChange: s("intro") })
					),
					el(
						PanelBody,
						{ title: "Layout", initialOpen: false },
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [{ label: "White", value: "default" }, { label: "Light gray (alt)", value: "alt" }],
							onChange: s("sectionStyle"),
						}),
						el(SelectControl, {
							label: "Orientation",
							value: a.orientation,
							options: [{ label: "Horizontal", value: "horizontal" }, { label: "Vertical", value: "vertical" }],
							onChange: s("orientation"),
						}),
						el(TextControl, { label: "Max width (vertical only, e.g. 640px)", value: a.maxWidth, onChange: s("maxWidth") })
					),
					el(
						PanelBody,
						{ title: "Steps", initialOpen: true },
						el(KBG.RepeaterField, {
							items: a.steps,
							onChange: s("steps"),
							fields: [
								{ key: "heading", label: "Step heading" },
								{ key: "text", label: "Step text", type: "textarea" },
							],
							newItem: { heading: "", text: "" },
							addLabel: "+ Add step",
						})
					)
				),
				el(ServerSideRender, { block: "kbg/funnel-steps", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
