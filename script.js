// Mobile nav toggle + active link highlighting + resume modal
document.addEventListener("DOMContentLoaded", () => {
  // ----- Mobile nav -----
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }

  // ----- Active nav link -----
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    }
  });

  // ----- Resume modal -----
  const modal = document.getElementById("resume-modal");
  const openers = document.querySelectorAll("[data-open-resume]");
  const closeBtn = modal ? modal.querySelector(".modal-close") : null;

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  openers.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    // Close when clicking the backdrop (but not the content)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // ----- Lightbox -----
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lightboxImage) lightboxImage.src = "";
  }

  // Wire up every image inside a .work-thumb (skip images inside a linked card — those open their target instead)
  document.querySelectorAll(".work-thumb img").forEach((img) => {
    if (img.closest(".work-card-link")) return;
    img.addEventListener("click", () => {
      const card = img.closest(".work-card");
      const title = card ? card.querySelector(".work-meta h4") : null;
      const meta = card ? card.querySelector(".work-meta p") : null;
      const caption = [title && title.textContent, meta && meta.textContent]
        .filter(Boolean)
        .join(" — ");
      openLightbox(img.src, img.alt, caption);
    });
  });

  // Case study figure images — open in lightbox unless wrapped in a link
  document.querySelectorAll(".case-figure img").forEach((img) => {
    if (img.closest("a")) return;
    img.addEventListener("click", () => {
      const figure = img.closest(".case-figure");
      const captionEl = figure ? figure.querySelector("figcaption") : null;
      const caption = captionEl ? captionEl.textContent.trim() : "";
      openLightbox(img.src, img.alt, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  // ----- Letter-by-letter reveal on scroll into view -----
  // Recursively wraps every character in a .letter span while preserving nested elements.
  function splitLetters(node, counter, stagger) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent;
        const frag = document.createDocumentFragment();
        [...text].forEach((char) => {
          const span = document.createElement("span");
          span.className = "letter";
          span.setAttribute("aria-hidden", "true");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.transitionDelay = `${counter.i * stagger}s`;
          frag.appendChild(span);
          counter.i++;
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitLetters(child, counter, stagger);
      }
    });
  }

  const revealTargets = document.querySelectorAll(".footer-cta, .text-reveal");
  revealTargets.forEach((el) => {
    const originalText = el.textContent;
    el.setAttribute("aria-label", originalText);
    splitLetters(el, { i: 0 }, 0.045);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("animate"));
  }

  // ----- Scroll-triggered section reveal (.reveal-on-scroll) -----
  const scrollRevealTargets = document.querySelectorAll(".reveal-on-scroll");
  if ("IntersectionObserver" in window && scrollRevealTargets.length) {
    const scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            scrollRevealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    scrollRevealTargets.forEach((el) => scrollRevealObserver.observe(el));
  } else {
    scrollRevealTargets.forEach((el) => el.classList.add("is-visible"));
  }
});
