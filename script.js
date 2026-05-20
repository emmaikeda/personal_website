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
});
