/* London Chiropody Clinic — shared behaviour: nav toggle, scroll-reveal,
   progress line, quick-contact dialog (native <dialog>), restrained
   magnetic CTA. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.setAttribute("data-open", String(!open));
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("data-open", "false");
      });
    });
  }

  /* ---- Scroll-reveal ---- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay);
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Scroll progress line ---- */
  var progressFill = document.querySelector(".scroll-progress__fill");
  if (progressFill) {
    var ticking = false;
    var updateProgress = function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.setProperty("--progress", pct + "%");
      ticking = false;
    };
    document.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
    }, { passive: true });
    updateProgress();
  }

  /* ---- Quick-contact dialog: native <dialog>, opened from any
     [data-quick-contact-trigger] button (header CTA on every page). ---- */
  var dialog = document.getElementById("quick-contact");
  if (dialog) {
    document.querySelectorAll("[data-quick-contact-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function () { dialog.showModal(); });
    });
    var closeBtn = dialog.querySelector(".quick-contact__close");
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) {
      var rect = dialog.getBoundingClientRect();
      var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }

  /* ---- Restrained magnetic pull on the single hero CTA (opt-in via
     .btn--magnetic), gated behind reduced-motion. ---- */
  if (!reduceMotion) {
    document.querySelectorAll(".btn--magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = "translate(" + (x * 0.12).toFixed(1) + "px, " + (y * 0.22).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }
})();
