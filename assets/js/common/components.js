
//Modalbox
document.addEventListener('DOMContentLoaded', () => {
  let isLocked = false

  const setScrollLock = (locked) => {
    if (locked === isLocked) return
    isLocked = locked

    document.body.classList.toggle('no-scroll', locked)

    if (typeof lenis === 'undefined' || !lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }

  const syncBodyScrollLock = () => {
    setScrollLock(!!document.querySelector('.modal-box.active'))
  }

  const openModal = (modal) => {
    if (!modal) return
    modal.classList.add('active')
    syncBodyScrollLock()
  }

  const closeModal = (modal) => {
    if (!modal) return
    modal.classList.remove('active')
    syncBodyScrollLock()
  }

  syncBodyScrollLock()

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-target]')
    if (opener) {
      const modal = document.getElementById(opener.getAttribute('data-modal-target'))
      if (modal) {
        e.preventDefault()
        openModal(modal)
        return
      }
    }

    const closer = e.target.closest('.close-modal-box')
    if (closer) {
      closeModal(closer.closest('.modal-box'))
      return
    }

    const activeModal = document.querySelector('.modal-box.active')
    if (activeModal && !e.target.closest('.modal-content')) {
      closeModal(activeModal)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    closeModal(document.querySelector('.modal-box.active'))
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