(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var SelectControl = wp.components.SelectControl;
	var RangeControl = wp.components.RangeControl;
	var ToggleControl = wp.components.ToggleControl;
	var PanelBody = wp.components.PanelBody;
	var ServerSideRender = wp.serverSideRender;

	var iconOptions = (window.KBG_ICONS || ["check"]).map(function (k) {
		return { label: k, value: k };
	});

	registerBlockType("kbg/icon-card-grid", {
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
						{ title: "Section heading", initialOpen: true },
						el(TextControl, { label: "Eyebrow", value: a.eyebrow, onChange: s("eyebrow") }),
						el(TextControl, { label: "Heading", value: a.heading, onChange: s("heading") }),
						el(TextareaControl, { label: "Intro", value: a.intro, onChange: s("intro") }),
						el(ToggleControl, { label: "Center heading", checked: a.centerHeading, onChange: s("centerHeading") })
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
								{ label: "Navy (dark)", value: "navy" },
							],
							onChange: s("sectionStyle"),
						}),
						el(SelectControl, {
							label: "Card style",
							value: a.cardStyle,
							options: [
								{ label: "Plain", value: "plain" },
								{ label: "Pillar (red top bar — Engineering style)", value: "pillar" },
							],
							onChange: s("cardStyle"),
						}),
						el(RangeControl, { label: "Columns", value: a.columns, onChange: s("columns"), min: 2, max: 6 })
					),
					el(
						PanelBody,
						{ title: "Footer link (optional)", initialOpen: false },
						el(TextControl, { label: "Link text", value: a.footerLinkText, onChange: s("footerLinkText") }),
						el(TextControl, { label: "Link URL", value: a.footerLinkUrl, onChange: s("footerLinkUrl") })
					),
					el(
						PanelBody,
						{ title: "Cards", initialOpen: true },
						el(KBG.RepeaterField, {
							items: a.items,
							onChange: s("items"),
							fields: [
								{ key: "icon", label: "Icon", type: "select", options: iconOptions },
								{ key: "heading", label: "Heading" },
								{ key: "text", label: "Text", type: "textarea" },
								{ key: "linkText", label: "Link text (optional)" },
								{ key: "linkUrl", label: "Link URL (optional)" },
							],
							newItem: { icon: "check", heading: "", text: "", linkText: "", linkUrl: "" },
							addLabel: "+ Add card",
						})
					)
				),
				el(ServerSideRender, { block: "kbg/icon-card-grid", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
