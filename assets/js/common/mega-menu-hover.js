const megaNavItems = document.querySelectorAll(".nav-item.has-mega");
const megaMenuWrapper = document.getElementById("megaMenuWrapper");
const megaMenu = document.getElementById("megaMenu");
const megaMenuContent = document.querySelector(".mega-menu-content");
const megaMenuBlocks = document.querySelectorAll(".mega-menu-block");
const header = document.querySelector("header");

let isMenuOpen = false;
let currentMenu = null;
let leaveTimeout = null;
let closeTimeout = null;

function openMegaMenu(menuType) {
  // Timeout'ları temizle
  clearTimeout(leaveTimeout);
  clearTimeout(closeTimeout);

  // Tüm blokları gizle
  megaMenuBlocks.forEach((block) => {
    block.style.display = "none";
    block.classList.remove("loaded");
  });

  const activeBlock = document.querySelector(
    `.mega-menu-block[data-menu="${menuType}"]`
  );

  if (!activeBlock) return;

  // Wrapper'ı aktif yap
  megaMenuWrapper.classList.add("active");

  // Aktif bloğu göster
  activeBlock.style.display = "block";
  activeBlock.style.opacity = "0";

  // Yüksekliği hesapla
  requestAnimationFrame(() => {
    // Active block'un gerçek yüksekliğini al
    const blockHeight = activeBlock.scrollHeight;

    // Mega menu content'in padding'lerini al
    const contentStyles = window.getComputedStyle(megaMenuContent);
    const contentPaddingTop = parseFloat(contentStyles.paddingTop);
    const contentPaddingBottom = parseFloat(contentStyles.paddingBottom);

    // Mega menu'nun padding'lerini al
    const menuStyles = window.getComputedStyle(megaMenu);
    const menuPaddingTop = parseFloat(menuStyles.paddingTop);
    const menuPaddingBottom = parseFloat(menuStyles.paddingBottom);

    // Toplam yüksekliği hesapla
    const totalHeight =
      blockHeight +
      contentPaddingTop +
      contentPaddingBottom +
      menuPaddingTop +
      menuPaddingBottom;

    console.log("Block height:", blockHeight);
    console.log("Content padding:", contentPaddingTop + contentPaddingBottom);
    console.log("Menu padding:", menuPaddingTop + menuPaddingBottom);
    console.log("Total height:", totalHeight);

    // Yüksekliği uygula
    megaMenu.style.height = totalHeight + "px";

    // Opacity animasyonu
    setTimeout(() => {
      activeBlock.style.opacity = "1";
    }, 50);
  });

  isMenuOpen = true;
  currentMenu = menuType;

  // İçerik animasyonları
  setTimeout(() => {
    activeBlock.classList.add("loaded");

    const items = activeBlock.querySelectorAll(".mega-menu-item");
    const title = activeBlock.querySelector("span");

    if (title) title.classList.add("animate");

    items.forEach((item, index) => {
      setTimeout(() => item.classList.add("animate"), 80 * index);
    });

    const content = activeBlock.querySelector(".menu-content-items");
    const image = activeBlock.querySelector(".menu-image");

    if (content && image && typeof gsap !== "undefined") {
      gsap.fromTo(
        [content, image],
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
        }
      );
    }

    items.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        items.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }, 30);
}

function closeMenu() {
  megaMenu.style.height = "0px";

  setTimeout(() => {
    megaMenuWrapper.classList.remove("active");
    isMenuOpen = false;
    currentMenu = null;

    megaNavItems.forEach((item) => item.classList.remove("active"));

    megaMenuBlocks.forEach((block) => {
      block.style.display = "none";
    });
  }, 400);
}

function scheduleClose() {
  // Tüm timeout'ları temizle
  clearTimeout(leaveTimeout);
  clearTimeout(closeTimeout);

  // Yeni bir close timeout başlat
  closeTimeout = setTimeout(() => {
    closeMenu();
  }, 300);
}

megaNavItems.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    const menuType = this.getAttribute("data-menu");
    if (!menuType) return;

    // Timeout'ları temizle
    clearTimeout(leaveTimeout);
    clearTimeout(closeTimeout);

    megaNavItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");

    if (currentMenu !== menuType) {
      openMegaMenu(menuType);
    }
  });
});

megaMenuWrapper.addEventListener("click", function (e) {
  if (e.target === megaMenuWrapper) {
    closeMenu();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && isMenuOpen) {
    closeMenu();
  }
});

// Header'dan ayrılınca delay ile kapat
header.addEventListener("mouseleave", (e) => {
  // Eğer megaMenu'ya gidiyorsa kapama
  const relatedTarget = e.relatedTarget;
  if (
    relatedTarget &&
    (megaMenu.contains(relatedTarget) ||
      megaMenuWrapper.contains(relatedTarget))
  ) {
    return;
  }

  scheduleClose();
});

// Header'a geri dönünce timeout'ları iptal et
header.addEventListener("mouseenter", () => {
  clearTimeout(leaveTimeout);
  clearTimeout(closeTimeout);
});

// MegaMenu'ya girilince timeout'ları iptal et
megaMenu.addEventListener("mouseenter", () => {
  clearTimeout(leaveTimeout);
  clearTimeout(closeTimeout);
});

// MegaMenu'dan ayrılınca kapat
megaMenu.addEventListener("mouseleave", (e) => {
  // Eğer header'a geri dönüyorsa kapama
  const relatedTarget = e.relatedTarget;
  if (relatedTarget && header.contains(relatedTarget)) {
    return;
  }

  scheduleClose();
});
