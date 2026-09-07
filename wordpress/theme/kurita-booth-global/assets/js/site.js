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

  /* ---------- Which MAX? problem selector widget ----------
     Data source: window.KBG_PROBLEM_MAP, injected via wp_localize_script
     from the "Which MAX Rules" admin list, already scoped to the current
     page's language (Polylang — one post per language, same as every
     other content type in this theme). Falls back to English defaults
     below if WordPress has no rows published yet. */
  var RESULTS = (window.KBG_PROBLEM_MAP && Object.keys(window.KBG_PROBLEM_MAP).length)
    ? window.KBG_PROBLEM_MAP
    : {
    "new-booth": {
      req: "Full Booth Requirement Assessment",
      model: "MAX Series",
      modelHref: "which-max.html",
      note: "Start with a Site Survey — we'll help you identify the right MAX for your shop size, vehicle types and budget."
    },
    "airflow": {
      req: "Airflow Redesign (Supply / Exhaust Balance)",
      model: "Max Convert Advance",
      modelHref: "max-series.html#max-convert-advance",
      note: "Poor airflow is usually an engineering problem, not a spray-gun problem. Max Convert Advance is engineered around balanced supply/exhaust airflow."
    },
    "defects": {
      req: "Airflow + Paint & Drying Engineering Review",
      model: "Max Convert Advance",
      modelHref: "max-series.html#max-convert-advance",
      note: "Dust and paint defects are often caused by turbulent airflow or an unstable pressure balance inside the booth."
    },
    "drying": {
      req: "Heat & Drying Process Design",
      model: "Max Convert Advance Wide",
      modelHref: "max-series.html#max-convert-advance-wide",
      note: "Long drying times point to heat distribution and cycle design. We review your process before recommending equipment."
    },
    "space": {
      req: "Working Space & Layout Review",
      model: "Max Convert Advance Wide",
      modelHref: "max-series.html#max-convert-advance-wide",
      note: "If technicians need more room to work around larger passenger vehicles, the Wide platform adds space without losing airflow control."
    },
    "large-vehicle": {
      req: "Large-Volume Airflow & Heat Engineering",
      model: "G-Max",
      modelHref: "max-series.html#g-max",
      note: "Buses and trucks need airflow and heat design that scales to a much larger enclosed volume. G-Max is built for that scale."
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

        reqVal.textContent = data.req;
        modelVal.textContent = data.model;
        modelLink.setAttribute("href", data.modelHref);
        noteVal.textContent = data.note;

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
