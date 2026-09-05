/**
 * DevLink365 site behaviour.
 *
 * Everything here is progressive: the page is complete and readable with
 * JavaScript switched off. This adds the link wiring, the copy button, the
 * scroll reveal, the hero URL animation and the mobile nav.
 */
(function () {
  "use strict";

  var links = window.DEVLINK365_LINKS || {};

  /* --- external links ---------------------------------------------------
     Buttons for npm and GitHub exist in the markup but stay disabled until a
     real URL is set in config.js. */
  function wireLinks() {
    document.querySelectorAll("[data-link]").forEach(function (el) {
      var url = links[el.getAttribute("data-link")];
      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.removeAttribute("aria-disabled");
        el.removeAttribute("title");
      } else {
        el.removeAttribute("href");
        el.setAttribute("aria-disabled", "true");
        el.setAttribute("title", "Coming soon");
      }
    });
  }

  /* --- copy to clipboard ------------------------------------------------ */
  function wireCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var text = button.getAttribute("data-copy") || "";
        var done = function () {
          var original = button.textContent;
          button.textContent = "Copied";
          button.setAttribute("data-copied", "true");
          setTimeout(function () {
            button.textContent = original;
            button.removeAttribute("data-copied");
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
        function fallback() {
          var field = document.createElement("textarea");
          field.value = text;
          field.setAttribute("readonly", "");
          field.style.position = "fixed";
          field.style.opacity = "0";
          document.body.appendChild(field);
          field.select();
          try { document.execCommand("copy"); done(); } catch (e) { /* nothing to do */ }
          document.body.removeChild(field);
        }
      });
    });
  }

  /* --- sticky nav border ------------------------------------------------ */
  function wireNav() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var update = function () { nav.setAttribute("data-stuck", String(window.scrollY > 8)); };
      update();
      window.addEventListener("scroll", update, { passive: true });
    }

    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-links");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.getAttribute("data-open") === "true";
        menu.setAttribute("data-open", String(!open));
        toggle.setAttribute("aria-expanded", String(!open));
      });
      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          menu.setAttribute("data-open", "false");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* --- reveal on scroll -------------------------------------------------- */
  function wireReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = Number(entry.target.getAttribute("data-reveal-delay") || 0);
        setTimeout(function () { entry.target.classList.add("is-in"); }, delay);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* --- hero: type out a fresh public URL --------------------------------
     Purely decorative. The markup already contains a complete example URL, so
     nothing is missing if this never runs. */
  function wireHeroUrl() {
    var target = document.querySelector("[data-hero-url]");
    if (!target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var alphabet = "23456789bcdfghjkmnpqrstvwxyz";
    var prefix = "https://";
    var suffix = ".devlink365.dev";

    function newId() {
      var out = "";
      var random = window.crypto && window.crypto.getRandomValues
        ? window.crypto.getRandomValues(new Uint8Array(8))
        : null;
      for (var i = 0; i < 8; i++) {
        var pick = random ? random[i] % alphabet.length : Math.floor(Math.random() * alphabet.length);
        out += alphabet.charAt(pick);
      }
      return out;
    }

    var cursor = document.createElement("span");
    cursor.className = "transform__cursor";
    cursor.textContent = " ";
    cursor.setAttribute("aria-hidden", "true");

    var text = document.createElement("span");
    target.textContent = "";
    target.appendChild(text);
    target.appendChild(cursor);

    function cycle() {
      var full = prefix + newId() + suffix;
      var index = 0;
      text.textContent = "";
      var typer = setInterval(function () {
        text.textContent = full.slice(0, ++index);
        if (index >= full.length) {
          clearInterval(typer);
          setTimeout(cycle, 4200);
        }
      }, 26);
    }
    cycle();
  }

  /* --- docs: highlight the section you are reading ----------------------- */
  function wireToc() {
    var entries = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (entries.length === 0 || !("IntersectionObserver" in window)) return;

    var byId = {};
    entries.forEach(function (link) { byId[link.getAttribute("href").slice(1)] = link; });

    var observer = new IntersectionObserver(function (records) {
      records.forEach(function (record) {
        if (!record.isIntersecting) return;
        entries.forEach(function (link) { link.classList.remove("is-active"); });
        var active = byId[record.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-96px 0px -70% 0px" });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function start() {
    wireLinks();
    wireCopy();
    wireNav();
    wireReveal();
    wireHeroUrl();
    wireToc();
    document.documentElement.setAttribute("data-js", "true");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
