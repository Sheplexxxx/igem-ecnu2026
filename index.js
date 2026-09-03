document.addEventListener("DOMContentLoaded", async () => {
  await loadSiteComponents();
  initNavigation();
  initSideNav();
  initHomeExperience();
});

async function loadSiteComponents() {
  await Promise.all([
    loadComponent("site-header", "header.html"),
    loadComponent("site-footer", "footer.html"),
  ]);
}

async function loadComponent(targetId, file) {
  const target = document.getElementById(targetId);

  if (!target) return;

  try {
    const componentUrl = `${file}?v=20260901c`;
    const response = await fetch(componentUrl, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load ${file}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function initNavigation() {
  const mobileBtn = document.querySelector(".mobile-btn");
  const nav = document.querySelector(".nav");
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  const topbar = document.querySelector(".topbar");

  setActiveNavItem();

  dropdowns.forEach((dropdown) => {
    dropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
  });

  function closeNavigation({ returnFocus = false } = {}) {
    nav?.classList.remove("open");
    mobileBtn?.setAttribute("aria-expanded", "false");
    mobileBtn?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");

    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      dropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });

    if (returnFocus) mobileBtn?.focus();
  }

  if (mobileBtn && nav) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      mobileBtn.setAttribute("aria-expanded", String(isOpen));
      mobileBtn.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("nav-open", isOpen);
    });
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      dropdowns.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("open");
          item.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
        }
      });

      const isOpen = dropdown.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        closeNavigation();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation({ returnFocus: nav?.classList.contains("open") });
  });

  document.addEventListener("click", (event) => {
    if (topbar?.contains(event.target)) return;
    const hasOpenDropdown = Array.from(dropdowns).some((dropdown) => dropdown.classList.contains("open"));
    if (nav?.classList.contains("open") || hasOpenDropdown) closeNavigation();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeNavigation();
    }
  });

  let scrollFrame = null;
  function updateTopbar() {
    topbar?.classList.toggle("scrolled", window.scrollY > 12);
    scrollFrame = null;
  }

  window.addEventListener("scroll", () => {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(updateTopbar);
  }, { passive: true });
  updateTopbar();
}

function setActiveNavItem() {
  const currentPage = getCurrentPage();
  const directLinks = {
    "index.html": '[data-nav-page="home"]',
    "awards.html": '[data-nav-page="awards"]',
  };
  const groups = {
    project: [
      "Projectdescription.html",
      "Projectengineering.html",
      "Projectimplementation.html",
      "Projectcontribution.html",
    ],
    "wet-lab": [
      "WLexperiments.html",
      "WLresults.html",
      "WLnotebook.html",
      "WLsafety.html",
    ],
    "dry-lab": ["DLmodeling.html", "DLsoftware.html", "DLartdesign.html"],
    "human-practices": ["human-practices.html", "education.html"],
    team: ["team.html", "attributions.html"],
  };

  document.querySelectorAll(".nav .active").forEach((item) => {
    item.classList.remove("active");
  });

  const directSelector = directLinks[currentPage];

  if (directSelector) {
    document.querySelector(directSelector)?.classList.add("active");
    return;
  }

  Object.entries(groups).forEach(([group, pages]) => {
    if (!pages.includes(currentPage)) return;

    document
      .querySelector(`[data-nav-group="${group}"] .nav-trigger`)
      ?.classList.add("active");
  });
}

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
}

function initSideNav() {
  const sideLinks = document.querySelectorAll(".side-link");
  const sections = document.querySelectorAll(".section-block");

  if (!sideLinks.length || !sections.length) return;

  function updateSideNav() {
    let currentId = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= 160 && rect.bottom >= 160) {
        currentId = section.id;
      }
    });

    sideLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateSideNav);
  updateSideNav();
}

function initHomeExperience() {
  const home = document.querySelector(".story-home");
  if (!home) return;

  initHomeSwitchers(home);
  initScrollDrivenSwitchers(home);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("motion-ready");

  const revealItems = Array.from(home.querySelectorAll("[data-reveal]"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px",
  });

  revealItems.forEach((item) => observer.observe(item));
}

function initHomeSwitchers(home) {
  home.querySelectorAll("[data-switcher]").forEach((switcher) => {
    const tabs = Array.from(switcher.querySelectorAll('[role="tab"]'));
    const panels = Array.from(switcher.querySelectorAll('[role="tabpanel"]'));

    function selectTab(nextTab) {
      const targetId = nextTab.getAttribute("aria-controls");

      tabs.forEach((tab) => {
        const isActive = tab === nextTab;
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.hidden = !isActive;
        if (isActive) {
          panel.style.animation = "none";
          window.requestAnimationFrame(() => {
            panel.style.animation = "";
          });
        }
      });

      switcher.dataset.active = targetId;
      const scene = switcher.closest("[data-auto-switcher]");
      if (scene) scene.dataset.autoIndex = String(tabs.indexOf(nextTab));
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
        event.preventDefault();

        let nextIndex = index;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;

        selectTab(tabs[nextIndex]);
        tabs[nextIndex].focus();
      });
    });

    const selectedTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (selectedTab) selectTab(selectedTab);
  });
}

function initScrollDrivenSwitchers(home) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scenes = Array.from(home.querySelectorAll("[data-auto-switcher]"));
  if (reduceMotion || !scenes.length) return;

  const stickyQuery = window.matchMedia("(min-width: 1021px) and (min-height: 680px)");
  let scrollFrame = null;

  function updateScene(scene) {
    const switcherName = scene.dataset.autoSwitcher;
    const switcher = scene.querySelector(`[data-switcher="${switcherName}"]`);
    const tabs = Array.from(switcher?.querySelectorAll('[role="tab"]') || []);
    if (!switcher || !tabs.length) return;

    const rect = scene.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    let progress;
    if (stickyQuery.matches) {
      const travel = Math.max(1, rect.height - window.innerHeight);
      progress = Math.max(0, Math.min(0.999, -rect.top / travel));
    } else {
      const travel = Math.max(1, rect.height - window.innerHeight * 0.3);
      progress = Math.max(0, Math.min(0.999, (window.innerHeight * 0.3 - rect.top) / travel));
    }

    const nextIndex = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
    if (Number(scene.dataset.autoIndex) === nextIndex) return;
    tabs[nextIndex].click();
  }

  function updateAutoSwitchers() {
    scenes.forEach(updateScene);
    scrollFrame = null;
  }

  function requestUpdate() {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(updateAutoSwitchers);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  stickyQuery.addEventListener?.("change", requestUpdate);
  requestUpdate();
}
