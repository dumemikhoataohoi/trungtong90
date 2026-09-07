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

	registerBlockType("kbg/choose-your-max", {
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
						el(TextareaControl, { label: "Intro", value: a.intro, onChange: s("intro") }),
						el(TextControl, { label: "Result CTA button text", value: a.resultCtaText, onChange: s("resultCtaText") })
					),
					el(
						PanelBody,
						{ title: "Layout", initialOpen: false },
						el(SelectControl, {
							label: "Section background",
							value: a.sectionStyle,
							options: [{ label: "White", value: "default" }, { label: "Light gray (alt)", value: "alt" }],
							onChange: s("sectionStyle"),
						})
					),
					el(
						PanelBody,
						{ title: "Footer link (optional)", initialOpen: false },
						el(TextControl, { label: "Link text", value: a.footerLinkText, onChange: s("footerLinkText") }),
						el(TextControl, { label: "Link URL", value: a.footerLinkUrl, onChange: s("footerLinkUrl") })
					)
				),
				el("p", { style: { fontStyle: "italic", color: "#757575" } }, "Problem chips are pulled automatically from MAX Series → Which MAX Rules."),
				el(ServerSideRender, { block: "kbg/choose-your-max", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
