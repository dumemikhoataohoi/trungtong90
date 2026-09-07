(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/reason-list", {
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
						{ title: "Layout", initialOpen: true },
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [{ label: "White", value: "default" }, { label: "Light gray (alt)", value: "alt" }],
							onChange: s("sectionStyle"),
						}),
						el(TextareaControl, { label: "Footnote / disclaimer (optional)", value: a.noteText, onChange: s("noteText") })
					),
					el(
						PanelBody,
						{ title: "Reasons", initialOpen: true },
						el(KBG.RepeaterField, {
							items: a.items,
							onChange: s("items"),
							fields: [
								{ key: "heading", label: "Heading" },
								{ key: "text", label: "Text", type: "textarea" },
							],
							newItem: { heading: "", text: "" },
							addLabel: "+ Add reason",
						})
					)
				),
				el(ServerSideRender, { block: "kbg/reason-list", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
