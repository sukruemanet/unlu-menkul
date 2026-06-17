


//Modal Form
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".get-information").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".modal-form").classList.add("active");
      disableScroll();
    });
  });

  document.querySelectorAll(".modal-cancel").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(".modal-form").classList.remove("active");
      enableScroll();
    });
  });
});

$(document).ready(function () {
  $(".product-tabs li").on("click", function () {
    $(this).closest(".product-tabs").find("li").removeClass("active");
    $(this).addClass("active");
  });

  //Differences
  $(document).on('click', '.item', function (e) {
  if ($(e.target).closest('.differences-detail-box').length) return;
  $('.differences-detail-box.active').removeClass('active');
  $(this).find('.differences-detail-box').addClass('active');
  
});

//Filter
$('.filter-open').on('click', function (e) {
  e.preventDefault();
  $('.filter-mobile').addClass('active');
  $('body').addClass('no-scroll');
});

$('.close-filter').on('click', function (e) {
  e.preventDefault();
  $('.filter-mobile').removeClass('active');
  $('body').removeClass('no-scroll');
});

//Change Brand
$('.change-brand').on('click', function (e) {
  e.preventDefault();
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $('body').addClass('no-scroll');
  } else {
    $('body').removeClass('no-scroll');
  }
});


//Click Input Change Color
$('.form-search input').on('focus', function () {
  $('.detail-headline').addClass('active');
});

$('.form-search input').on('blur', function () {
  $('.detail-headline').removeClass('active');
});

//Wish List Remove
  $(document).ready(function () {
  const modal = document.querySelector(".modal-dialog");
  const list = document.querySelector(".wish-list-cards");
  if (!modal || !list) return;

  list.addEventListener("click", (e) => {
    const del = e.target.closest(".wish-list-delete");
    if (!del) return;
    e.preventDefault();
    const item = del.closest(".item");
    if (!item || !item.id) return;
    modal.dataset.target = item.id;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest(".modal-cancel") || e.target.closest(".button.border")) {
      modal.classList.remove("active");
      delete modal.dataset.target;
      document.body.style.overflow = "";
      return;
    }
    if (e.target.closest(".button.danger")) {
      const id = modal.dataset.target;
      if (id) {
        const el = document.getElementById(id);
        if (el) el.remove();
      }
      modal.classList.remove("active");
      delete modal.dataset.target;
      document.body.style.overflow = "";
    }
  });
});


$(document).on('click', '.differences-detail-close', function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).closest('.differences-detail-box').removeClass('active');
});

$(document).on('click', function (e) {
  if (!$(e.target).closest('.item').length) {
    $('.differences-detail-box.active').removeClass('active');
  }
});

//Find Products
function closeAll(except = null) {
  document.querySelectorAll('.select-dropdown-items.active').forEach(el => {
    if (!except || el !== except) el.classList.remove('active');
  });
}

function updateViewProducts() {
  const hasActive = document.querySelectorAll('.user-select-item.active').length > 0;
  const viewProducts = document.querySelector('.view-products');
  if (viewProducts) {
    if (hasActive) {
      viewProducts.classList.add('active');
    } else {
      viewProducts.classList.remove('active');
    }
  }
}

document.querySelectorAll('.select-button').forEach(button => {
  const dropdown = button.querySelector('.select-dropdown-items');
  const userSelect = button.querySelector('.user-select-item');
  const textBox = userSelect ? userSelect.querySelector('.text') : null;
  const colorBox = userSelect ? userSelect.querySelector('.color') : null;
  const deleteBtn = userSelect ? userSelect.querySelector('.delete-select') : null;

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('active');
    closeAll();
    if (!isOpen) dropdown.classList.add('active');
  });

  dropdown.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) {
      const text = li.textContent.trim();
      const liColor = li.querySelector('.color');

      if (textBox) textBox.textContent = text;
      if (colorBox && liColor) {
        colorBox.style.backgroundColor = liColor.style.backgroundColor;
      }

      userSelect.classList.add('active');
      closeAll();
      updateViewProducts();
    }
    e.stopPropagation();
  });

  if (deleteBtn) {
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (textBox) textBox.textContent = '';
      if (colorBox) colorBox.style.backgroundColor = 'transparent';
      userSelect.classList.remove('active');
      updateViewProducts();
    });
  }
});

document.addEventListener('click', () => closeAll());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAll();
});


//Wish List
const addBtn = document.querySelector(".add-wish-list");
const wishCount = document.querySelector(".wish-list span");

let saved = localStorage.getItem("wishCount");
wishCount.textContent = saved ? saved : 0;

addBtn.addEventListener("click", () => {
  let current = parseInt(wishCount.textContent);
  wishCount.classList.remove("animate");
  void wishCount.offsetWidth;
  wishCount.classList.add("animate");
  setTimeout(() => {
    let newValue = current + 1;
    wishCount.textContent = newValue;
    localStorage.setItem("wishCount", newValue);
    wishCount.classList.remove("animate");
  }, 400);
});
});


//Wish List
document.addEventListener("DOMContentLoaded", function () {
  function updateWishCount() {
    const count = document.querySelectorAll(".wish-list-cards .item").length;
    const wishCountEl = document.querySelector(".wish-count");
    if (wishCountEl) {
      wishCountEl.textContent = count;
    }
  }

  updateWishCount();

  //Modal Open
  document.querySelectorAll(".wish-list-delete").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const item = this.closest(".item"); 
      const itemId = item.getAttribute("id");

      const modal = document.querySelector(".modal-dialog");
      modal.classList.add("active");
      modal.setAttribute("data-target", itemId); 
    });
  });

  // Modal Cancel
  document.querySelector(".modal-dialog .modal-cancel").addEventListener("click", function () {
    const modal = this.closest(".modal-dialog");
    modal.classList.remove("active");
    modal.removeAttribute("data-target");
  });

  // Modal Remove Product
  document.querySelector(".modal-dialog .button.danger").addEventListener("click", function () {
    const modal = this.closest(".modal-dialog");
    const targetId = modal.getAttribute("data-target");
    if (targetId) {
      const targetItem = document.getElementById(targetId);
      if (targetItem) targetItem.remove();
      updateWishCount();
    }
    modal.classList.remove("active");
    modal.removeAttribute("data-target");
  });
});


//Filter 
document.addEventListener("DOMContentLoaded", () => {
  // Dropdown aç/kapat
  document.querySelectorAll(".filter-item-select").forEach(item => {
    const dropdown = item.querySelector(".filter-dropdown-items");
    if (dropdown) {
      item.style.position = "relative";
      dropdown.style.position = "absolute";
      dropdown.style.left = "0";
      dropdown.style.top = "100%";
    }
  });

  document.querySelectorAll(".filter-item-select").forEach(select => {
    const trigger = select.querySelector(".filter-item");
    const dropdown = select.querySelector(".filter-dropdown-items");

    if (trigger && dropdown) {
      trigger.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        if (trigger.classList.contains("active")) {
          trigger.classList.remove("active");
          dropdown.classList.remove("active");
          return;
        }

        document.querySelectorAll(".filter-item.active").forEach(item => {
          item.classList.remove("active");
        });
        document.querySelectorAll(".filter-dropdown-items.active").forEach(dd => {
          dd.classList.remove("active");
        });

        trigger.classList.add("active");
        dropdown.classList.add("active");
      });
    }
  });

  // Filter seçilenleri göster
const resultsWrapper = document.querySelector(".filter-results-items");
const resultsContainer = resultsWrapper.querySelector(".items");
const checkboxes = document.querySelectorAll(".custom-list input[type='checkbox'], .color-list input[type='checkbox']");
const resetBtn = document.querySelector(".filter-reset");

function updateResultsVisibility() {
  resultsWrapper.style.display = resultsContainer.children.length > 0 ? "flex" : "none";
}

function formatId(id) {
  let text = id;

  if (text.startsWith("color-")) {
    text = text.replace("color-", "");
  } else if (text.startsWith("mobile-color-")) {
    text = text.replace("mobile-color-", "");
  }

  text = text.replace(/-/g, " ");

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getResultContent(checkbox) {
  const label = document.querySelector(`label[for="${checkbox.id}"]`);
  if (!label) return checkbox.id;

  const colorSpan = label.querySelector(".color");

  // Renk seçilmişse: renk span + yanındaki text
  if (colorSpan) {
    const style = colorSpan.getAttribute("style");
    const spanText = label.childNodes[label.childNodes.length - 1].textContent.trim();
    return `<span class="color" style="${style}"></span> ${spanText}`;
  }

  // Normal filtrelerde: sadece span dışındaki text
  const spanText = label.childNodes[label.childNodes.length - 1].textContent.trim();
  return spanText;
}

function addFilterResult(checkbox) {
  const existing = resultsContainer.querySelector(`[data-id="${checkbox.id}"]`);
  if (existing) return;

  const resultItem = document.createElement("div");
  resultItem.classList.add("filter-result");
  resultItem.setAttribute("data-id", checkbox.id);

  resultItem.innerHTML = `
    ${getResultContent(checkbox)}
    <div class="filter-select-delete">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.9997 5.5865L11.9495 0.636719L13.3637 2.05093L8.4139 7.0007L13.3637 11.9504L11.9495 13.3646L6.9997 8.4149L2.04996 13.3646L0.635742 11.9504L5.5855 7.0007L0.635742 2.05093L2.04996 0.636719L6.9997 5.5865Z"
          fill="black" />
      </svg>
    </div>
  `;

  resultItem.querySelector(".filter-select-delete").addEventListener("click", e => {
    e.preventDefault();
    checkbox.checked = false;
    resultItem.remove();
    updateResultsVisibility();
  });

  resultsContainer.appendChild(resultItem);
  updateResultsVisibility();
}

function removeFilterResult(checkboxId) {
  const item = resultsContainer.querySelector(`[data-id="${checkboxId}"]`);
  if (item) {
    item.remove();
    updateResultsVisibility();
  }
}

checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      addFilterResult(checkbox);
    } else {
      removeFilterResult(checkbox.id);
    }
  });
});

if (resetBtn) {
  resetBtn.addEventListener("click", e => {
    e.preventDefault();
    checkboxes.forEach(cb => {
      cb.checked = false;
    });
    resultsContainer.innerHTML = "";
    updateResultsVisibility();
  });
}

updateResultsVisibility();
});