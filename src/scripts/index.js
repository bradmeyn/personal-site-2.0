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
