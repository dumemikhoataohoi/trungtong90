(function (wp, KBG) {
	var el = KBG.el;
	var registerBlockType = wp.blocks.registerBlockType;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var ServerSideRender = wp.serverSideRender;

	registerBlockType("kbg/page-hero", {
		edit: function (props) {
			var a = props.attributes;
			var set = props.setAttributes;
			return el(
				"div",
				useBlockProps(),
				el(TextControl, { label: "Heading", value: a.heading, onChange: function (v) { set({ heading: v }); } }),
				el(TextareaControl, { label: "Intro text", value: a.intro, onChange: function (v) { set({ intro: v }); } }),
				el(ServerSideRender, { block: "kbg/page-hero", attributes: a })
			);
		},
		save: function () {
			return null;
		},
	});
})(window.wp, window.KBG);
