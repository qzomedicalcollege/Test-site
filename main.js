"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    scroll: null
  };

  initAOS();
  initLocomotive(state);
  initMobileNav();
  initParticles();
  initTypewriter();
  initParallax();
  initCursor();
  initCounters();
  initSlider();
  initModals(state);
  initContactForm();

  window.addEventListener("resize", debounce(() => {
    if (state.scroll) state.scroll.update();
  }, 200));
});

/* AOS scroll animations */
function initAOS() {
  if (!window.AOS) return;

  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 90
  });
}

/* Smooth inertial scroll */
function initLocomotive(state) {
  const container = document.querySelector("[data-scroll-container]");

  if (!container || !window.LocomotiveScroll || window.innerWidth < 768) {
    return;
  }

  state.scroll = new LocomotiveScroll({
    el: container,
    smooth: true,
    lerp: 0.075,
    multiplier: 1,
    smartphone: { smooth: false },
    tablet: { smooth: true }
  });

  if (window.AOS) {
    state.scroll.on("scroll", () => AOS.refresh());
  }

  setTimeout(() => state.scroll.update(), 500);
}

/* Mobile hamburger navigation */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* particles.js config */
function initParticles() {
  const target = document.getElementById("particles-js");

  if (!target || !window.particlesJS) return;

  particlesJS("particles-js", {
    particles: {
      number: {
        value: 78,
        density: { enable: true, value_area: 900 }
      },
      color: { value: ["#8b5cf6", "#22d3ee", "#f472b6"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.55,
        random: true,
        anim: { enable: true, speed: 0.6, opacity_min: 0.15, sync: false }
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#22d3ee",
        opacity: 0.18,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.25,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        grab: { distance: 170, line_linked: { opacity: 0.36 } },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

/* Typewriter hero text */
function initTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  if (!target) return;

  const words = target.dataset.typewriter
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);

  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = words[wordIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    target.textContent = current.slice(0, charIndex);

    let delay = deleting ? 42 : 78;

    if (!deleting && charIndex === current.length) {
      delay = 1250;
      deleting = true;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 240;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

/* Mouse parallax layers */
function initParallax() {
  const layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.parallax || 10);
      layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });
}

/* Custom cursor */
function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!dot || !ring || window.innerWidth < 768) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  const animate = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  };

  animate();

  const interactive = "a, button, input, textarea, select, .project-card, .modal-card";

  document.querySelectorAll(interactive).forEach((element) => {
    element.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
    element.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
  });
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = Number(element.dataset.count);
    const duration = 1500;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target).toString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toString();
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.45 });

  counters.forEach((counter) => observer.observe(counter));
}

/* Project slider */
function initSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector(".slider-track");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");

  if (!track || !prev || !next) return;

  const step = () => track.querySelector(".project-card")?.getBoundingClientRect().width + 16 || 320;

  next.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });
}

/* Portfolio modals */
function initModals(state) {
  const triggers = document.querySelectorAll("[data-modal-target]");
  const modals = document.querySelectorAll(".modal");

  if (!triggers.length || !modals.length) return;

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (state.scroll) state.scroll.stop();
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (state.scroll) state.scroll.start();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger.dataset.modalTarget));
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      const isClose = event.target.closest(".modal-close");
      const isBackdrop = event.target === modal;

      if (isClose || isBackdrop) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document.querySelectorAll(".modal.is-open").forEach(closeModal);
  });
}

/* Static contact form UX */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "Message prepared. Connect this form to Formspree, Netlify Forms or your backend to receive submissions.";
    }

    form.reset();
  });
}

/* Utility */
function debounce(callback, delay = 200) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}
