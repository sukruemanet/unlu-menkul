document.addEventListener("DOMContentLoaded", () => {
  const messages = {
    required: "Bu alan zorunludur.",
    email: "Geçerli bir e-posta adresi giriniz.",
    select: "Lütfen bir seçim yapınız.",
    tel: "Geçerli bir telefon numarası giriniz.",
    identity: "Geçerli bir TC Kimlik Numarası giriniz.",
    checkbox: "Lütfen bu alanı onaylayınız.",
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getKind(field) {
    if (field.type === "checkbox") return "checkbox";
    if (field.tagName === "SELECT") return "select";
    if (field.tagName === "TEXTAREA") return "text";
    const hint = `${field.id} ${field.name} ${field.placeholder}`.toLowerCase();
    if (hint.includes("kimlik") || field.id === "id-number") return "identity";
    if (["email", "mail"].includes(field.type) || hint.includes("mail") || hint.includes("posta")) return "email";
    if (field.type === "tel") return "tel";
    return "text";
  }

  function getError(field) {
    const kind = getKind(field);
    if (kind === "checkbox" && field.dataset.optional === "true") return "";
    if (kind === "select") return field.selectedIndex > 0 ? "" : messages.select;
    if (kind === "checkbox") return field.checked ? "" : messages.checkbox;

    const value = field.value.trim();
    if (!value) return messages.required;

    const digits = value.replace(/\D/g, "").length;
    if (kind === "email" && !emailPattern.test(value)) return messages.email;
    if (kind === "identity" && digits !== 11) return messages.identity;
    if (kind === "tel") {
      const iti = window.itiInstances?.get(field);
      const isTurkey = !iti || iti.getSelectedCountryData().iso2 === "tr";
      if (isTurkey ? digits !== 10 && digits !== 11 : digits < 6) return messages.tel;
    }
    return "";
  }

  function getContainer(field) {
    if (field.type === "checkbox") {
      return field.closest(".checkbox-check-item") || field.closest(".checkbox-item") || field.parentElement;
    }
    return field.closest(".form-item, .item") || field.parentElement;
  }

  function setError(field, container, message) {
    const isCheckbox = field.type === "checkbox";
    const placeAfter = isCheckbox
      ? container.classList.contains("checkbox-item")
      : Boolean(container.querySelector(":scope > button"));
    let text = placeAfter
      ? container.nextElementSibling?.classList.contains("validation-text") && container.nextElementSibling
      : container.querySelector(":scope > .validation-text");

    container.classList.toggle(isCheckbox ? "check-error" : "value-error", Boolean(message));
    if (!message) {
      text?.remove();
      return;
    }
    if (!text) {
      text = document.createElement("div");
      text.className = "validation-text";
      placeAfter ? container.after(text) : container.appendChild(text);
    }
    text.textContent = message;
  }

  document.querySelectorAll("form:not(.form-search)").forEach((form) => {
    const fields = Array.from(
      form.querySelectorAll(
        'input:not([type="radio"]):not([type="hidden"]):not([type="submit"]):not(.iti__search-input), select, textarea'
      )
    )
      .filter((field) => !field.disabled)
      .map((field) => ({ field, container: getContainer(field) }));

    if (!fields.length) return;
    form.noValidate = true;

    form.addEventListener("submit", (event) => {
      let firstInvalid = null;
      fields.forEach(({ field, container }) => {
        const message = getError(field);
        setError(field, container, message);
        if (message && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        event.preventDefault();
        event.stopImmediatePropagation();
        firstInvalid.focus();
      }
    });

    fields.forEach(({ field, container }) => {
      const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
      field.addEventListener(eventName, () => {
        if (container.matches(".value-error, .check-error")) setError(field, container, getError(field));
      });
    });
  });
});
