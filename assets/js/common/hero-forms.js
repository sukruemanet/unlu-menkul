// Every desktop and drawer view uses the same form node; the code below only
// moves that node between its two slots.
document.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-lead-brand]");
  if (!form || event.defaultPrevented) return;

  const endpoint = window.heroLeadEndpoints?.[form.dataset.leadBrand];
  if (endpoint) {
    form.action = endpoint;
    form.method = "post";
    return;
  }

  // No lead API is configured in this static project. Do not send contact
  // details to the current page as URL query parameters.
  event.preventDefault();
  const status = form.querySelector(".hero-form-status");
  status.textContent = "Form gönderimi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
  status.hidden = false;
});

document.addEventListener("DOMContentLoaded", () => {
  const mobile = window.matchMedia("(max-width: 1024px)");
  const forms = Array.from(document.querySelectorAll("[data-hero-form]"))
    .map((slot) => {
      const form = document.getElementById(slot.dataset.heroForm);
      return form ? { form, slot, desktop: form.parentElement } : null;
    })
    .filter(Boolean);

  function placeForms() {
    forms.forEach(({ form, slot, desktop }) => {
      const drawer = slot.closest(".hero-form-drawer");
      if (!mobile.matches && drawer.classList.contains("active")) {
        drawer.querySelector(".drawwer-menu-close").click();
      }
      (mobile.matches ? slot : desktop).appendChild(form);
    });

    requestAnimationFrame(() => {
      document.querySelector(".hero-swiper")?.swiper?.update();
    });
  }

  mobile.addEventListener("change", placeForms);
  placeForms();
});
