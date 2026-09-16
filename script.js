(function () {
  "use strict";

  /* ================= CONFIG ================= */
  var WHATSAPP_NUMBER = "5511975745618"; // 11 97574-5618
  var WHATSAPP_MESSAGE = "Olá, Gui! Vi seu site e gostaria de conversar sobre a criação de um site para meu negócio.";
  var LINKEDIN_URL = "https://www.linkedin.com/in/guilherme-garcia-liziero/";

  var whatsappHref = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);

  var whatsappIds = [
    "whatsBtnHeader",
    "whatsBtnMobileNav",
    "whatsBtnHero",
    "whatsBtnCta",
    "whatsBtnFinal",
    "whatsBtnFooter",
    "whatsFloat"
  ];
  whatsappIds.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", whatsappHref);
  });

  ["linkedinLink", "linkedinLinkFooter"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute("href", LINKEDIN_URL);
  });

  /* ================= YEAR ================= */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ================= HEADER BLUR ON SCROLL ================= */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ================= MOBILE MENU ================= */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ================= SCROLL REVEAL ================= */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ================= FAQ ACCORDION ================= */
  var accItems = document.querySelectorAll(".acc-item");
  accItems.forEach(function (item) {
    var question = item.querySelector(".acc-question");
    var answer = item.querySelector(".acc-answer");

    question.addEventListener("click", function () {
      var isOpen = question.getAttribute("aria-expanded") === "true";

      accItems.forEach(function (other) {
        var otherQ = other.querySelector(".acc-question");
        var otherA = other.querySelector(".acc-answer");
        otherQ.setAttribute("aria-expanded", "false");
        otherA.style.maxHeight = null;
      });

      if (!isOpen) {
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ================= HERO MOCKUPS — LEVE PARALLAX NO MOUSE ================= */
  var heroVisual = document.getElementById("heroVisual");
  if (heroVisual && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var mocks = heroVisual.querySelectorAll(".mock");
    var baseTransforms = ["rotate(-6deg)", "rotate(3deg)", "rotate(-2deg)"];

    heroVisual.addEventListener("mousemove", function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      mocks.forEach(function (mock, i) {
        var depth = (i + 1) * 4;
        mock.style.transform =
          baseTransforms[i] +
          " translate(" + (x * depth) + "px, " + (y * depth) + "px)";
      });
    });

    heroVisual.addEventListener("mouseleave", function () {
      mocks.forEach(function (mock, i) {
        mock.style.transform = baseTransforms[i];
      });
    });
  }
})();
