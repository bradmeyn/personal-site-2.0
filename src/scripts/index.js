const fadeInSection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("in view");
      entry.target.classList.add("fade-in"); // Add the fadeInAnimation class when in view
      observer.unobserve(entry.target); // Stop observing once the animation is applied
    }
  });
};

// Create an Intersection Observer instance
const observer = new IntersectionObserver(fadeInSection, {
  root: null, // Use the viewport as the root
  rootMargin: "0px", // No margin
  threshold: 0.5, // Trigger the animation when 50% of the element is visible
});

// Get all elements with the 'fade-in' class
const fadeElements = document.querySelectorAll(".animated--fade-in");

// Start observing each element
fadeElements.forEach((element) => {
  observer.observe(element);
});

function toggleMenu() {
  document.body.classList.toggle("navbar--active");
}

function deactivateMenu() {
  document.body.classList.remove("navbar--active");
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the header after the DOM is fully loaded
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav__link");

  hamburger?.addEventListener("click", toggleMenu);

  // Close navbar when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", deactivateMenu);
  });

  // Close navbar when clicking outside
  document.addEventListener("click", (e) => {
    const isClickInsideNav =
      nav?.contains(e.target) || hamburger?.contains(e.target);

    if (!isClickInsideNav) {
      deactivateMenu();
    }
  });

  // // Background color change on scroll
  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 0) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    }
  });

  // Close mobile menu on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      hamburger?.classList.remove("hamburger--active");
      nav?.classList.remove("navbar--active");
    }
  });
});
