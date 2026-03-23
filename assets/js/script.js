'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// ========================= 
// SIDEBAR (all pages)
// =========================
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// =========================
// FILTER / SELECT (projects & blog pages)
// =========================
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// =========================
// CONTACT FORM (contact page only)
// =========================
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form && form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      if (formStatus) formStatus.textContent = "Please fill out all required fields.";
      contactForm.reportValidity();
      return;
    }

    const originalBtnText = formBtn?.querySelector("span")?.textContent || "Send Message";
    formBtn?.setAttribute("disabled", "");
    if (formBtn?.querySelector("span")) formBtn.querySelector("span").textContent = "Sending...";
    if (formStatus) formStatus.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        if (formStatus) formStatus.textContent = "✅ Message sent! I'll get back to you soon.";
        contactForm.reset();
        formBtn?.setAttribute("disabled", "");
      } else {
        if (formStatus) formStatus.textContent = "❌ Something went wrong. Please try again.";
        formBtn?.removeAttribute("disabled");
      }
    } catch (err) {
      if (formStatus) formStatus.textContent = "❌ Network error. Please try again.";
      formBtn?.removeAttribute("disabled");
    } finally {
      if (formBtn?.querySelector("span")) formBtn.querySelector("span").textContent = originalBtnText;
    }
  });
}