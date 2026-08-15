document.addEventListener("DOMContentLoaded", async () => {
  await loadSiteComponents();
  initNavigation();
  initSideNav();
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
    const response = await fetch(file);

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

  setActiveNavItem();

  if (mobileBtn && nav) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      mobileBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-trigger");

    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 980) return;

      event.preventDefault();

      dropdowns.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("open");
        }
      });

      dropdown.classList.toggle("open");
    });
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        nav?.classList.remove("open");
        mobileBtn?.setAttribute("aria-expanded", "false");
        dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      nav?.classList.remove("open");
      mobileBtn?.setAttribute("aria-expanded", "false");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
    }
  });
}

function setActiveNavItem() {
  const currentPage = getCurrentPage();
  const directLinks = {
    "index.html": '[data-nav-page="home"]',
    "team.html": '[data-nav-page="team"]',
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
