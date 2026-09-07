(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var PanelBody = wp.components.PanelBody;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/hero", {
		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps();

			function set(key) {
				return function (value) {
					var next = {};
					next[key] = value;
					setAttributes(next);
				};
			}

			return el(
				"div",
				blockProps,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: "Hero content", initialOpen: true },
						el(TextControl, { label: "Badge text", value: attributes.badgeText, onChange: set("badgeText") }),
						el(TextControl, { label: "Heading — line 1", value: attributes.headingLine1, onChange: set("headingLine1") }),
						el(TextControl, { label: "Heading — accent line", value: attributes.headingAccentLine, onChange: set("headingAccentLine") }),
						el(TextareaControl, { label: "Subtext", value: attributes.subtext, onChange: set("subtext") }),
						el(TextControl, { label: "Primary CTA text", value: attributes.primaryCtaText, onChange: set("primaryCtaText") }),
						el(TextControl, { label: "Primary CTA link (blank = Site Survey page)", value: attributes.primaryCtaUrl, onChange: set("primaryCtaUrl") }),
						el(TextControl, { label: "Secondary CTA text", value: attributes.secondaryCtaText, onChange: set("secondaryCtaText") }),
						el(TextControl, { label: "Secondary CTA link (blank = MAX Series)", value: attributes.secondaryCtaUrl, onChange: set("secondaryCtaUrl") }),
						el(TextControl, { label: "Photo caption title", value: attributes.imageCaptionTitle, onChange: set("imageCaptionTitle") }),
						el(TextControl, { label: "Photo caption subtitle", value: attributes.imageCaptionSub, onChange: set("imageCaptionSub") })
					),
					el(
						PanelBody,
						{ title: "Hero photo", initialOpen: false },
						el(KBG.MediaField, {
							value: attributes.imageId,
							url: attributes.imageUrl,
							onChange: function (id, url) {
								setAttributes({ imageId: id, imageUrl: url });
							},
						})
					),
					el(
						PanelBody,
						{ title: "Meta stats (3 numbers under the CTAs)", initialOpen: false },
						el(KBG.RepeaterField, {
							items: attributes.metaItems,
							onChange: function (items) {
								setAttributes({ metaItems: items });
							},
							fields: [
								{ key: "value", label: "Value (e.g. 5 Models)" },
								{ key: "label", label: "Label (e.g. One engineered family)" },
							],
							newItem: { value: "", label: "" },
							addLabel: "+ Add stat",
						})
					)
				),
				el(ServerSideRender, {
					block: "kbg/hero",
					attributes: attributes,
				})
			);
		},
		save: function () {
			return null; // dynamic block — PHP render.php owns the markup
		},
	});
})(window.wp, window.KBG);
