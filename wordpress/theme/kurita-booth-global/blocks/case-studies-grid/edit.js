(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var NumberControl = wp.components.__experimentalNumberControl || wp.components.TextControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/case-studies-grid", {
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
							options: [
								{ label: "White", value: "default" },
								{ label: "Light gray (alt)", value: "alt" },
							],
							onChange: s("sectionStyle"),
						}),
						el(TextControl, { label: "Max number to show (-1 = all)", type: "number", value: a.limit, onChange: function (v) { s("limit")(parseInt(v, 10) || -1); } })
					),
					el(
						PanelBody,
						{ title: "Footer link (optional)", initialOpen: false },
						el(TextControl, { label: "Link text", value: a.footerLinkText, onChange: s("footerLinkText") }),
						el(TextControl, { label: "Link URL", value: a.footerLinkUrl, onChange: s("footerLinkUrl") })
					)
				),
				el("p", { style: { fontStyle: "italic", color: "#757575" } }, "Cases are pulled automatically from Case Studies → All Cases."),
				el(ServerSideRender, { block: "kbg/case-studies-grid", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
