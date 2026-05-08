document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.querySelector(".mobile-btn");
  const nav = document.querySelector(".nav");
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  const sideLinks = document.querySelectorAll(".side-link");
  const sections = document.querySelectorAll(".section-block");

  /* Mobile navbar */
  if (mobileBtn && nav) {
    mobileBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  /* Mobile dropdown */
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

  /* Sidebar active highlight */
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

  /* Close mobile nav after clicking page link */
  const allNavLinks = document.querySelectorAll(".nav a");

  allNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        nav?.classList.remove("open");
        dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
      }
    });
  });

  /* Reset mobile state on resize */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      nav?.classList.remove("open");
      dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
    }
  });
});