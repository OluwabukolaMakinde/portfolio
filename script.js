// script.js
console.log("JS LOADED ✅");
// Mobile Navigation Toggle
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navbar = document.getElementById("navbar");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Smooth scroll (account for sticky navbar)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    const target = href ? document.querySelector(href) : null;
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 72;
    const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 2;

    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  if (!navbar) return;

  if (window.pageYOffset > 50) {
    navbar.style.backgroundColor = "rgba(246, 241, 232, 0.92)";
    navbar.style.backdropFilter = "blur(10px)";
    navbar.style.boxShadow = "0 2px 14px rgba(20, 20, 20, 0.06)";
  } else {
    navbar.style.backgroundColor = "rgba(246, 241, 232, 0.78)";
    navbar.style.boxShadow = "none";
  }
});

// Active nav highlight
const sectionsForActive = Array.from(document.querySelectorAll("section[id]"));
const navLinksForActive = Array.from(document.querySelectorAll(".nav-link"));

function updateActiveNav() {
  const scrollY = window.pageYOffset;
  const navHeight = navbar ? navbar.offsetHeight : 72;

  let currentId = "";
  for (const section of sectionsForActive) {
    const top = section.offsetTop - navHeight - 120;
    if (scrollY >= top) currentId = section.id;
  }

  navLinksForActive.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href === `#${currentId}`) link.classList.add("active");
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// Contact form UI feedback (no backend)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = "Message Sent!";
      submitButton.style.backgroundColor = "#1f1f1c";

      contactForm.reset();

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "";
      }, 2200);
    }, 900);
  });
}

// Reveal animations (IntersectionObserver + reduced-motion)
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  const staggerEls = document.querySelectorAll("[data-stagger]");

  staggerEls.forEach((el, i) => el.style.setProperty("--delay", `${i * 110}ms`));

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// Hero "Read more" toggle
(function () {
  const btn = document.getElementById("heroStoryToggle");
  const more = document.getElementById("heroStoryMore");
  if (!btn || !more) return;

  btn.addEventListener("click", () => {
    const isOpen = more.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.textContent = isOpen ? "Read less" : "Read more";
  });
})();


// About "Show more / Show less" toggle
(function () {
  const btn = document.getElementById("aboutToggle");
  const more = document.getElementById("aboutMore");
  if (!btn || !more) return;

  btn.addEventListener("click", () => {
    const isOpen = more.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.textContent = isOpen ? "Show less" : "Show more";
  });
})();


// Intro overlay (dark map cover -> wipe reveal into page)
(function () {
  const overlay = document.getElementById("introOverlay");
  if (!overlay) return;

  document.body.classList.add("is-locked");
  document.body.classList.add("has-intro");

  const HOLD_MS = 2200; // show map a bit longer
  const WIPE_MS = 1800; // wipe duration should match CSS animation time

  window.addEventListener("load", () => {
    setTimeout(() => {
      overlay.classList.add("is-leaving");
      document.body.classList.add("intro-done");

      setTimeout(() => {
        overlay.remove();
        document.body.classList.remove("is-locked");
        document.body.classList.remove("has-intro");
      }, WIPE_MS);
    }, HOLD_MS);
  });
})();


/* =========================
   Global Development Projects (Gallery -> Modal)
   Only affects #projects section
   ========================= */
   (function () {
    const section = document.getElementById("projects");
    if (!section) return;
  
    const tiles = Array.from(section.querySelectorAll(".project-tile"));
    const modal = document.getElementById("projectsModal");
  
    const titleEl = document.getElementById("projTitle");
    const locEl = document.getElementById("projLocation");
    const ctxEl = document.getElementById("projContext");
    const roleEl = document.getElementById("projRole");
    const outEl = document.getElementById("projOutcome");
  
    const mainImg = document.getElementById("projMainImage");
    const thumbsWrap = document.getElementById("projThumbs");
    const prevBtn = document.getElementById("projPrevBtn");
    const nextBtn = document.getElementById("projNextBtn");
  
    // If any of these are missing, the modal can't work
    if (!modal || !titleEl || !locEl || !ctxEl || !roleEl || !outEl || !mainImg || !thumbsWrap || !prevBtn || !nextBtn) {
      console.warn("Projects modal: missing required element(s). Check IDs in HTML.");
      return;
    }
  
    let currentImages = [];
    let currentIndex = 0;
  
    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
    }
  
    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      currentImages = [];
      currentIndex = 0;
      thumbsWrap.innerHTML = "";
      mainImg.src = "";
    }
  
    function setActiveImage(idx) {
      if (!currentImages.length) return;
      currentIndex = (idx + currentImages.length) % currentImages.length;
      mainImg.src = currentImages[currentIndex];
  
      const thumbButtons = Array.from(thumbsWrap.querySelectorAll("button"));
      thumbButtons.forEach((btn, i) => btn.classList.toggle("is-active", i === currentIndex));
    }
  
    function buildThumbs(images) {
      thumbsWrap.innerHTML = "";
      images.forEach((src, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `View image ${i + 1}`);
        b.addEventListener("click", () => setActiveImage(i));
  
        const im = document.createElement("img");
        im.src = src;
        im.alt = "Project thumbnail";
        im.loading = "lazy";
  
        b.appendChild(im);
        thumbsWrap.appendChild(b);
      });
    }
  
    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        const title = tile.getAttribute("data-title") || "";
        const location = tile.getAttribute("data-location") || "";
        const context = tile.getAttribute("data-context") || "";
        const role = tile.getAttribute("data-role") || "";
        const outcome = tile.getAttribute("data-outcome") || "";
  
        const imagesStr = tile.getAttribute("data-images") || "";
        currentImages = imagesStr.split(",").map((s) => s.trim()).filter(Boolean);
  
        titleEl.textContent = title;
        locEl.textContent = location;
        ctxEl.textContent = context;
        roleEl.textContent = role;
        outEl.textContent = outcome;
  
        if (currentImages.length) {
          buildThumbs(currentImages);
          setActiveImage(0);
        } else {
          thumbsWrap.innerHTML = "";
          mainImg.src = "";
        }
  
        openModal();
      });
    });
  
    prevBtn.addEventListener("click", () => setActiveImage(currentIndex - 1));
    nextBtn.addEventListener("click", () => setActiveImage(currentIndex + 1));
  
    modal.addEventListener("click", (e) => {
      const closeTarget = e.target.closest("[data-projects-close]");
      if (closeTarget) closeModal();
    });
  
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  })();


  /* =========================
   Research list: summary toggles + show more/less
   Only affects #research
   ========================= */
(function () {
  const section = document.getElementById("research");
  if (!section) return;

  const items = Array.from(section.querySelectorAll("[data-research-item]"));
  const moreBtn = document.getElementById("researchMoreBtn");

  // Show only first N at first
  const INITIAL_VISIBLE = 4;

  function setCollapsedView() {
    items.forEach((item, i) => {
      item.style.display = i < INITIAL_VISIBLE ? "" : "none";
    });
    if (moreBtn) {
      moreBtn.textContent = "Show more research";
      moreBtn.setAttribute("aria-expanded", "false");
      moreBtn.style.display = items.length > INITIAL_VISIBLE ? "" : "none";
    }
  }

  function setExpandedView() {
    items.forEach((item) => (item.style.display = ""));
    if (moreBtn) {
      moreBtn.textContent = "Show less research";
      moreBtn.setAttribute("aria-expanded", "true");
      moreBtn.style.display = "";
    }
  }

  // Summary toggles
  section.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-summary-toggle]");
    if (!btn) return;

    const item = btn.closest("[data-research-item]");
    if (!item) return;

    const summary = item.querySelector("[data-summary]");
    if (!summary) return;

    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));
    btn.textContent = isOpen ? "Show summary" : "Hide summary";

    summary.hidden = isOpen;
  });

  // Show more / less
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      const expanded = moreBtn.getAttribute("aria-expanded") === "true";
      if (expanded) setCollapsedView();
      else setExpandedView();
    });
  }

  // init
  setCollapsedView();
})();


// Awards: show more / show less (Research Awards)
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("researchAwardsToggle");
  const wrapper = document.getElementById("researchAwards");
  if (!toggleBtn || !wrapper) return;

  const hiddenItems = wrapper.querySelectorAll("[data-award-hidden]");
  if (!hiddenItems.length) return;

  let expanded = false;

  // set initial button label (forces it even if HTML is old)
  toggleBtn.textContent = "Show more";

  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;

    hiddenItems.forEach((el) => {
      el.style.display = expanded ? "grid" : "none";
    });

    toggleBtn.textContent = expanded ? "Show less" : "Show more";
    toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
});


// Blog: show more / show less
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("blogToggle");
  const wrapper = document.getElementById("blogList");
  if (!toggleBtn || !wrapper) return;

  const hiddenItems = wrapper.querySelectorAll("[data-blog-hidden]");
  if (!hiddenItems.length) return;

  let expanded = false;

  toggleBtn.textContent = "Show more";

  toggleBtn.addEventListener("click", () => {
    expanded = !expanded;

    // .blog-item is display:flex (column on mobile), not grid
    hiddenItems.forEach((el) => {
      el.style.display = expanded ? "flex" : "none";
    });

    toggleBtn.textContent = expanded ? "Show less" : "Show more";
    toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
});