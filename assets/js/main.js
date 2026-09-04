(function () {
  "use strict";

  /* ---------- Language toggle (EN default / VI) ---------- */
  var root = document.documentElement;
  var STORAGE_KEY = "kbg-lang";

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-lang") === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  var saved = "en";
  try { saved = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) {}
  applyLang(saved);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-set-lang]");
    if (btn) applyLang(btn.getAttribute("data-set-lang"));
  });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("is-open"); });
    });
  }

  /* ---------- Which MAX? problem selector widget ---------- */
  var RESULTS = {
    "new-booth": {
      req: { en: "Full Booth Requirement Assessment", vi: "Đánh giá toàn diện nhu cầu Paint Booth" },
      model: "MAX Series",
      modelHref: "which-max.html",
      note: {
        en: "Start with a Site Survey — we'll help you identify the right MAX for your shop size, vehicle types and budget.",
        vi: "Bắt đầu bằng Site Survey — chúng tôi sẽ giúp bạn xác định MAX phù hợp với quy mô xưởng, loại xe và ngân sách."
      }
    },
    "airflow": {
      req: { en: "Airflow Redesign (Supply / Exhaust Balance)", vi: "Thiết kế lại luồng khí (cân bằng cấp khí / hút khí)" },
      model: "Max Convert Advance",
      modelHref: "max-series.html#max-convert-advance",
      note: {
        en: "Poor airflow is usually an engineering problem, not a spray-gun problem. Max Convert Advance is engineered around balanced supply/exhaust airflow.",
        vi: "Luồng khí kém thường là vấn đề kỹ thuật, không phải do súng phun sơn. Max Convert Advance được thiết kế xoay quanh việc cân bằng cấp khí và hút khí."
      }
    },
    "defects": {
      req: { en: "Airflow + Paint & Drying Engineering Review", vi: "Rà soát Airflow Engineering và Paint & Drying Engineering" },
      model: "Max Convert Advance",
      modelHref: "max-series.html#max-convert-advance",
      note: {
        en: "Dust and paint defects are often caused by turbulent airflow or an unstable pressure balance inside the booth.",
        vi: "Bụi và lỗi sơn thường do luồng khí bị nhiễu hoặc cân bằng áp suất trong booth không ổn định."
      }
    },
    "drying": {
      req: { en: "Heat & Drying Process Design", vi: "Thiết kế lại quy trình nhiệt và sấy" },
      model: "Max Convert Advance Wide",
      modelHref: "max-series.html#max-convert-advance-wide",
      note: {
        en: "Long drying times point to heat distribution and cycle design. We review your process before recommending equipment.",
        vi: "Thời gian sấy kéo dài thường liên quan đến phân bố nhiệt và thiết kế chu trình. Chúng tôi rà soát quy trình trước khi đề xuất thiết bị."
      }
    },
    "space": {
      req: { en: "Working Space & Layout Review", vi: "Rà soát không gian thao tác và bố trí mặt bằng" },
      model: "Max Convert Advance Wide",
      modelHref: "max-series.html#max-convert-advance-wide",
      note: {
        en: "If technicians need more room to work around larger passenger vehicles, the Wide platform adds space without losing airflow control.",
        vi: "Nếu kỹ thuật viên cần thêm không gian thao tác quanh xe lớn, dòng Wide bổ sung diện tích mà vẫn giữ khả năng kiểm soát luồng khí."
      }
    },
    "large-vehicle": {
      req: { en: "Large-Volume Airflow & Heat Engineering", vi: "Kỹ thuật luồng khí và nhiệt cho không gian lớn" },
      model: "G-Max",
      modelHref: "max-series.html#g-max",
      note: {
        en: "Buses and trucks need airflow and heat design that scales to a much larger enclosed volume. G-Max is built for that scale.",
        vi: "Xe bus và xe tải cần thiết kế luồng khí và nhiệt phù hợp với thể tích không gian lớn hơn nhiều. G-Max được thiết kế cho quy mô đó."
      }
    }
  };

  var chips = document.querySelectorAll(".problem-chip");
  var resultBox = document.getElementById("problem-result");
  if (chips.length && resultBox) {
    var reqVal = resultBox.querySelector("[data-out='req']");
    var modelVal = resultBox.querySelector("[data-out='model']");
    var modelLink = resultBox.querySelector("[data-out='model-link']");
    var noteVal = resultBox.querySelector("[data-out='note']");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        var key = chip.getAttribute("data-problem");
        var data = RESULTS[key];
        if (!data) return;

        reqVal.querySelector(".lang-en").textContent = data.req.en;
        reqVal.querySelector(".lang-vi").textContent = data.req.vi;
        modelVal.textContent = data.model;
        modelLink.setAttribute("href", data.modelHref);
        noteVal.querySelector(".lang-en").textContent = data.note.en;
        noteVal.querySelector(".lang-vi").textContent = data.note.vi;

        resultBox.classList.add("is-visible");
        if (window.innerWidth < 860) {
          resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });
  }

  /* ---------- Static form guard (no backend in this prototype) ---------- */
  document.querySelectorAll("form[data-static-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-success");
      if (msg) msg.style.display = "block";
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
