(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var RangeControl = wp.components.RangeControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/simple-tiles", {
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
						{ title: "Heading (optional)", initialOpen: true },
						el(TextControl, { label: "Eyebrow", value: a.eyebrow, onChange: s("eyebrow") }),
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(TextareaControl, { label: "Intro", value: a.intro, onChange: s("intro") })
					),
					el(
						PanelBody,
						{ title: "Layout", initialOpen: false },
						el(SelectControl, {
							label: "Tile style",
							value: a.style,
							options: [{ label: "Light (label above value)", value: "light" }, { label: "Navy (roadmap style)", value: "navy" }],
							onChange: s("style"),
						}),
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [{ label: "White", value: "default" }, { label: "Light gray (alt)", value: "alt" }, { label: "Navy (dark)", value: "navy" }],
							onChange: s("sectionStyle"),
						}),
						el(RangeControl, { label: "Columns", value: a.columns, onChange: s("columns"), min: 2, max: 6 })
					),
					el(
						PanelBody,
						{ title: "Tiles", initialOpen: true },
						el(KBG.RepeaterField, {
							items: a.items,
							onChange: s("items"),
							fields: [
								{ key: "label", label: "Label (light style only)" },
								{ key: "value", label: "Value / heading (e.g. 🇻🇳 Vietnam)" },
								{ key: "note", label: "Note (navy style only)" },
							],
							newItem: { label: "", value: "", note: "" },
							addLabel: "+ Add tile",
						})
					)
				),
				el(ServerSideRender, { block: "kbg/simple-tiles", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
