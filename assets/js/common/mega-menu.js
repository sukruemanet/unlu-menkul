const megaNavItems = document.querySelectorAll(".nav-item.has-mega");

const megaMenuWrapper = document.getElementById("megaMenuWrapper");
const megaMenu = document.getElementById("megaMenu");
const megaMenuContent = document.querySelector(".mega-menu-content");

const megaMenuBlocks = document.querySelectorAll(".mega-menu-block");

let isMenuOpen = false;
let currentMenu = null;

function openMegaMenu(menuType) {
  megaMenuBlocks.forEach((block) => {
    block.style.display = "none";
    block.classList.remove("loaded");
  });

  const activeBlock = document.querySelector(
    `.mega-menu-block[data-menu="${menuType}"]`
  );

  if (!activeBlock) return;

  megaMenuWrapper.classList.add("active");

  activeBlock.style.display = "block";
  activeBlock.style.opacity = "0";

  requestAnimationFrame(() => {
    const blockHeight = activeBlock.scrollHeight;

    const contentStyles = window.getComputedStyle(megaMenuContent);
    const paddingTop = parseFloat(contentStyles.paddingTop);
    const paddingBottom = parseFloat(contentStyles.paddingBottom);

    const menuStyles = window.getComputedStyle(megaMenu);
    const menuPaddingTop = parseFloat(menuStyles.paddingTop);
    const menuPaddingBottom = parseFloat(menuStyles.paddingBottom);

    const totalHeight =
      blockHeight +
      paddingTop +
      paddingBottom +
      menuPaddingTop +
      menuPaddingBottom;

    megaMenu.style.height = totalHeight + "px";

    setTimeout(() => {
      activeBlock.style.opacity = "1";
    }, 60);
  });

  isMenuOpen = true;
  currentMenu = menuType;

  setTimeout(() => {
    activeBlock.classList.add("loaded");

    const items = activeBlock.querySelectorAll(".mega-menu-item");

    items.forEach((item, index) => {
      setTimeout(() => item.classList.add("animate"), 80 * index);
    });
  }, 40);
}

function closeMenu() {
  megaMenu.style.height = "0px";

  setTimeout(() => {
    megaMenuWrapper.classList.remove("active");
    isMenuOpen = false;
    currentMenu = null;

    megaNavItems.forEach((i) => i.classList.remove("active"));

    megaMenuBlocks.forEach((block) => {
      block.style.display = "none";
      block.style.opacity = "0";
    });
  }, 350);
}

megaNavItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "a") return;

    e.preventDefault();

    const menuType = this.getAttribute("data-menu");
    if (!menuType) return;

    if (currentMenu === menuType && isMenuOpen) {
      closeMenu();
      return;
    }

    megaNavItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");

    openMegaMenu(menuType);
  });
});

document.addEventListener("click", function (e) {
  const isClickInside =
    megaMenu.contains(e.target) ||
    [...megaNavItems].some((i) => i.contains(e.target));

  if (!isClickInside && isMenuOpen) {
    closeMenu();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && isMenuOpen) {
    closeMenu();
  }
});

const closeMegaMenuBtns = document.querySelectorAll(".close-mega-menu");

closeMegaMenuBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeMenu();
  });
});

$(document).ready(function () {
  const $header = $("header");
  let lastScrollY = 0;

  // Mobil cihaz kontrolü
  const isMobile = () => window.innerWidth <= 768;

  $(window).on("scroll", function () {
    const currentScrollY = $(this).scrollTop();

    // Sadece mobil OLMAYAN cihazlarda scroll'da menüyü kapat
    if (
      isMenuOpen &&
      !isMobile() &&
      Math.abs(currentScrollY - lastScrollY) > 5
    ) {
      closeMenu();
    }

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      $header.addClass("hidden");
    } else {
      $header.removeClass("hidden");
      if (currentScrollY > 50) {
        $header.addClass("background");
      } else {
        $header.removeClass("background");
      }
    }

    lastScrollY = currentScrollY;
  });
});

// $(document).on('click', '.search-now', function () {
//   $('body').addClass('no-scroll');
// });

// $(document).on('click', '.close-mega-menu', function () {
//   $('body').removeClass('no-scroll');
// });
