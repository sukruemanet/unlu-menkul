
//Modalbox
document.addEventListener('DOMContentLoaded', () => {
  const syncBodyScrollLock = () => {
    const isAnyActive = !!document.querySelector('.modal-box.active')
    document.body.classList.toggle('no-scroll', isAnyActive)
  }

  syncBodyScrollLock()

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('.ofdirectors-item')
    if (opener) {
      const modalId = opener.getAttribute('data-modal-target')
      const modal = document.getElementById(modalId)
      if (modal) modal.classList.add('active')
      syncBodyScrollLock()
      return
    }

    const closer = e.target.closest('.close-modal-box')
    if (closer) {
      const modal = closer.closest('.modal-box')
      if (modal) modal.classList.remove('active')
      syncBodyScrollLock()
      return
    }

    const activeModal = document.querySelector('.modal-box.active')
    if (activeModal && !e.target.closest('.modal-content')) {
      activeModal.classList.remove('active')
      syncBodyScrollLock()
    }
  })

  const observer = new MutationObserver(() => syncBodyScrollLock())
  document.querySelectorAll('.modal-box').forEach(m =>
    observer.observe(m, { attributes: true, attributeFilter: ['class'] })
  )
})

//Checked
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.permissions .item input[type="checkbox"]');

  toggles.forEach(input => {
    const parentItem = input.closest('.item');

    if (input.checked) {
      parentItem.classList.add('active');
    }

    input.addEventListener('change', () => {
      if (input.checked) {
        parentItem.classList.add('active');
      } else {
        parentItem.classList.remove('active');
      }
    });
  });
});

//Close Cookies Modal
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.close-cookies-box');
  const cookiesBox = document.querySelector('.cookies-box');

  if (closeBtn && cookiesBox) {
    closeBtn.addEventListener('click', () => {
      cookiesBox.classList.remove('active');
    });
  }
});