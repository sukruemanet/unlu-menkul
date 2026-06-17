// JS (tekli açılır akordeon)
const wrapper = document.querySelector('.accordion-wrapper');
if (wrapper) {
  const items = [...wrapper.querySelectorAll('.accordion-item')];

  const getParts = (item) => {
    const header = item.querySelector('.accordion-info');
    const content =
      item.querySelector('.accordion-content') ||
      item.querySelector('.accoridon-content'); // yazım hatası desteği
    return { header, content };
  };

  const openItem = (target) => {
    items.forEach((it) => {
      const { header, content } = getParts(it);
      const isTarget = it === target;
      it.classList.toggle('active', isTarget);
      header?.setAttribute('aria-expanded', String(isTarget));
      content?.classList.toggle('accordion-content', true); // normalize
      if (!isTarget) {
        content && (content.style.maxHeight = null);
      } else {
        content && (content.style.maxHeight = content.scrollHeight + 'px');
      }
    });
  };

  items.forEach((item) => {
    const { header, content } = getParts(item);
    if (!header || !content) return;

    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-controls', 'acc-' + Math.random().toString(36).slice(2));
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        openItem(item);
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  // Sayfa yüklenince already-active varsa yüksekliğini ayarla
  const initiallyActive = wrapper.querySelector('.accordion-item.active');
  if (initiallyActive) openItem(initiallyActive);
}