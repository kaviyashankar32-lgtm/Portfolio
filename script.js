const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.setProperty("--level", `${entry.target.dataset.level}%`);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  document.querySelectorAll(".skill-fill").forEach((bar) => skillObserver.observe(bar));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach((section) => navObserver.observe(section));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    bar.style.setProperty("--level", `${bar.dataset.level}%`);
    bar.classList.add("is-visible");
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  name: (value) => value.trim() ? "" : "Please enter your name.",
  email: (value) => {
    if (!value.trim()) return "Please enter your email address.";
    return emailPattern.test(value.trim()) ? "" : "Please enter a valid email address.";
  },
  message: (value) => value.trim() ? "" : "Please add a short message."
};

Object.keys(validators).forEach((fieldName) => {
  const field = contactForm.elements[fieldName];
  field.addEventListener("input", () => {
    field.removeAttribute("aria-invalid");
    document.querySelector(`#${fieldName}-error`).textContent = "";
    formFeedback.textContent = "";
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";

  let firstInvalidField;
  Object.entries(validators).forEach(([fieldName, validate]) => {
    const field = contactForm.elements[fieldName];
    const error = validate(field.value);
    const errorElement = document.querySelector(`#${fieldName}-error`);
    errorElement.textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    if (error && !firstInvalidField) firstInvalidField = field;
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    return;
  }

  formFeedback.textContent = "Thanks for your note! This demo form is ready to connect to a submission service.";
  contactForm.reset();
  Object.keys(validators).forEach((fieldName) => {
    contactForm.elements[fieldName].removeAttribute("aria-invalid");
  });
});
