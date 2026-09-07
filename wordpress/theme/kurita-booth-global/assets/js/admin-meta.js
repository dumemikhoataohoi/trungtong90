/**
 * Tiny, dependency-free admin helpers for the hand-rolled meta boxes
 * (no ACF/plugin — this is the entire "repeater" implementation).
 *
 * Markup contract for a repeater:
 * <div class="kbg-repeater" data-name="kbg_features">
 *   <div class="kbg-repeater-rows"> ...existing rows... </div>
 *   <template class="kbg-repeater-template"> ...one row markup... </template>
 *   <button type="button" class="button kbg-repeater-add">+ Add row</button>
 * </div>
 * Each row must include one element with class "kbg-repeater-remove".
 */
(function ($) {
	"use strict";

	function initRepeaters(scope) {
		$(scope)
			.find(".kbg-repeater")
			.each(function () {
				var $repeater = $(this);
				if ($repeater.data("kbgBound")) return;
				$repeater.data("kbgBound", true);

				$repeater.on("click", ".kbg-repeater-add", function (e) {
					e.preventDefault();
					var tpl = $repeater.find(".kbg-repeater-template")[0];
					var clone = document.importNode(tpl.content, true);
					$repeater.find(".kbg-repeater-rows").append(clone);
				});

				$repeater.on("click", ".kbg-repeater-remove", function (e) {
					e.preventDefault();
					$(this).closest(".kbg-repeater-row").remove();
				});
			});
	}

	function initMediaPickers(scope) {
		$(scope)
			.find(".kbg-media-picker")
			.each(function () {
				var $wrap = $(this);
				if ($wrap.data("kbgBound")) return;
				$wrap.data("kbgBound", true);

				$wrap.on("click", ".kbg-media-select", function (e) {
					e.preventDefault();
					var frame = wp.media({
						title: "Select image",
						multiple: false,
						library: { type: "image" },
					});
					frame.on("select", function () {
						var att = frame.state().get("selection").first().toJSON();
						$wrap.find(".kbg-media-id").val(att.id);
						$wrap
							.find(".kbg-media-preview")
							.attr("src", (att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url))
							.show();
						$wrap.find(".kbg-media-clear").show();
					});
					frame.open();
				});

				$wrap.on("click", ".kbg-media-clear", function (e) {
					e.preventDefault();
					$wrap.find(".kbg-media-id").val("");
					$wrap.find(".kbg-media-preview").hide().attr("src", "");
					$(this).hide();
				});

				$wrap.on("click", ".kbg-file-select", function (e) {
					e.preventDefault();
					var frame = wp.media({ title: "Select PDF file", multiple: false, library: { type: "application/pdf" } });
					frame.on("select", function () {
						var att = frame.state().get("selection").first().toJSON();
						$wrap.find(".kbg-media-id").val(att.id);
						$wrap.find(".kbg-file-name").text(att.filename || att.url).show();
					});
					frame.open();
				});
			});
	}

	$(document).ready(function () {
		initRepeaters(document);
		initMediaPickers(document);

		// Re-init media pickers when a repeater clones a new row (e.g. a
		// gallery item) into a ".kbg-repeater-rows" container.
		if (window.MutationObserver) {
			document.querySelectorAll(".kbg-repeater-rows").forEach(function (rows) {
				new MutationObserver(function () {
					initMediaPickers(rows);
				}).observe(rows, { childList: true });
			});
		}
	});
})(jQuery);
