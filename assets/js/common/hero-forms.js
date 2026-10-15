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
