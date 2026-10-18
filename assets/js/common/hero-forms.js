// Each brand has one field definition. Every desktop and drawer view uses the
// same form node; the code below only moves that node between its two slots.
const heroFormCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın",
  "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
  "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkâri", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş",
  "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli",
  "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu",
  "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

const heroFormAmounts = [
  ["undecided", "Henüz karar vermedim"],
  ["under-1m", "1.000.000 TL altı"],
  ["1m-5m", "1.000.000 – 5.000.000 TL"],
  ["over-5m", "5.000.000 TL üzeri"]
];

function heroFormSelect(id, name, label, options) {
  return `<div class="item">
    <label class="select-label" for="${id}">${label}*</label>
    <div class="selectbox-item"><div class="select-item">
      <select name="${name}" id="${id}" required>
        <option value="">Seçiniz</option>
        ${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}
      </select>
    </div></div>
  </div>`;
}

function renderHeroForm(container) {
  const brand = container.dataset.heroBrand;
  if (brand !== "daha" && brand !== "piapiri") return;
  const form = container.querySelector("form");
  if (!form) return;
  const prefix = container.id;
  const brandFields = brand === "daha"
    ? heroFormSelect(`${prefix}-city`, "city", "Yaşadığınız İl", heroFormCities.map((city) => [city, city])) +
      heroFormSelect(`${prefix}-amount`, "investment_amount", "Yatırım Yapmayı Düşündüğünüz Tutar", heroFormAmounts)
    : "";
  const nameField = '<div class="item"><input type="text" name="full_name" autocomplete="name" placeholder="Adınız Soyadınız" required></div>';
  const emailField = '<div class="item"><input type="email" name="email" autocomplete="email" placeholder="E-posta Adresiniz" required></div>';
  const phoneField = '<div class="item"><input type="tel" name="phone" autocomplete="tel-national" placeholder="Telefon Numaranız" required></div>';
  const contactFields = nameField + emailField + phoneField;

  form.dataset.leadBrand = brand;
  form.innerHTML = `
    <div class="form-items">
      ${contactFields}
      ${brandFields}
    </div>
    <div class="item"><div class="form-item full column"><div class="checkbox-items">
      <div class="checkbox-check-item"><div class="checkbox-item">
        <input type="checkbox" name="marketing_consent" id="${prefix}-marketing-consent" data-optional="true">
        <label for="${prefix}-marketing-consent">ÜNLÜ&amp;Co tarafından elektronik iletişim adreslerime ticari elektronik ileti gönderilmesine izin veriyorum.</label>
      </div></div>
      <div class="checkbox-check-item"><div class="checkbox-item">
        <input type="checkbox" name="kvkk_consent" id="${prefix}-kvkk-consent" checked required>
        <label for="${prefix}-kvkk-consent"><a href="kvkk.html" target="_blank" rel="noopener noreferrer">KVKK Aydınlatma Metni</a>’ni okudum, bilgilendirildim, ileti almak ve aramak istiyorum.</label>
      </div></div>
    </div></div></div>
    <div class="item"><button type="submit" class="button dark">Bilgi Alın</button></div>
    <p class="hero-form-status" role="alert" hidden></p>`;

}

document.querySelectorAll(".secondary-form[data-hero-brand]").forEach(renderHeroForm);

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
