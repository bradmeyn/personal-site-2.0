// const nav = document.querySelector(".nav");
// const ham = document.querySelector(".hamburger");
// const body = document.querySelector("body");
// const content = document.querySelector(".content");
// const links = document.querySelectorAll(".nav__item");

// //click on hamburger opens navbar, adds blur to content & locks screen
// ham.addEventListener("click", () => {
//   nav.style.transition = "all 0.4s ease-in-out";
//   ham.classList.toggle("active");
//   body.classList.toggle("blurry");
//   body.classList.toggle("scroll-lock");
// });

// //close navbar, remove blur & unlock scroll on resize
// window.addEventListener("resize", () => {
//   if (window.innerWidth > 760) {
//     ham.classList.remove("active");
//     body.classList.remove("blurry");
//     body.classList.remove("scroll-lock");
//   }
// });

// //close navbar, remove blur & unlock scroll when content is clicked
// content.addEventListener("click", () => {
//   ham.classList.remove("active");
//   body.classList.remove("blurry");
//   body.classList.remove("scroll-lock");
// });

// links.forEach((link) => {
//   link.addEventListener("click", () => {
//     if (window.innerWidth < 768) {
//       body.classList.toggle("scroll-lock");
//       ham.classList.toggle("active");
//       body.classList.toggle("blurry");
//     }
//   });
// });

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

console.log(fadeElements);
// Start observing each element
fadeElements.forEach((element) => {
  observer.observe(element);
});
