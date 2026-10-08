document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('#phone, .phone-input, .secondary-form input[type="tel"]');
  window.itiInstances = window.itiInstances || new Map();

  inputs.forEach((input) => {
    if (window.intlTelInput.getInstance(input)) return;

    const iti = window.intlTelInput(input, {
      initialCountry: 'tr',
      separateDialCode: true,
      nationalMode: true,
      // The mask owns formatting; do not run two formatters on the same input.
      formatAsYouType: false,
      autoPlaceholder: 'off',
    });

    const originalPlaceholder = input.placeholder;
    const normalizeTurkishNumber = (value) => {
      let digits = value.replace(/\D/g, '');
      if (digits.length === 12 && digits.startsWith('90')) digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
      return digits;
    };

    const applyCountryMask = () => {
      const field = window.jQuery(input);
      field.unmask();
      if (iti.getSelectedCountryData().iso2 === 'tr') {
        input.value = normalizeTurkishNumber(input.value);
        field.mask('000 000 00 00', { placeholder: '5XX XXX XX XX' });
      } else {
        input.placeholder = originalPlaceholder;
      }
    };

    input.addEventListener('countrychange', applyCountryMask);
    input.addEventListener('paste', (event) => {
      if (iti.getSelectedCountryData().iso2 !== 'tr') return;
      const text = event.clipboardData && event.clipboardData.getData('text');
      if (!text) return;
      const digits = text.replace(/\D/g, '');
      // Accept full national/international numbers without masking the prefix as digits.
      if ((digits.length === 12 && digits.startsWith('90')) ||
          (digits.length === 11 && digits.startsWith('0'))) {
        event.preventDefault();
        window.jQuery(input).val(normalizeTurkishNumber(text)).trigger('input').trigger('keyup');
      }
    });
    input.addEventListener('open:countrydropdown', () => {
      document.querySelectorAll('.iti__dropdown-content, .iti__country-list, .iti__search-input, .iti--container')
        .forEach((element) => {
          element.setAttribute('data-lenis-prevent-wheel', '');
          element.setAttribute('data-lenis-prevent-touch', '');
        });
    });

    applyCountryMask();
    window.itiInstances.set(input, iti);
    if (input.id === 'phone') window.iti = iti;
  });
});
