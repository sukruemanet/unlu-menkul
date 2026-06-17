document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const mainMenu = document.querySelector(".main-menu-content");
  const menuTriggers = document.querySelectorAll("[data-menu-trigger]");
  const menuContainers = document.querySelectorAll(
    ".main-menu-content .menu-container"
  );

  let activeMenu = null;
  let isOpen = false;
  let hoverTimeout;
  let fadeTl;

  gsap.set(menuContainers, { autoAlpha: 0, display: "none" });

  const mainMenuTl = gsap.timeline({ paused: true });
  mainMenuTl.fromTo(
    mainMenu,
    { y: "-100%" },
    { y: "0%", duration: 0.4, ease: "power3.out" }
  );

  menuTriggers.forEach((trigger) => {
    const menuId = trigger.dataset.menuTrigger;
    const relatedMenu = document.getElementById(menuId);
    if (!relatedMenu) return;

    trigger.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimeout);

      menuTriggers.forEach((t) => t.classList.remove("active"));
      trigger.classList.add("active");

      if (activeMenu === relatedMenu) return;
      if (fadeTl && fadeTl.isActive()) fadeTl.kill();

      fadeTl = gsap.timeline();

      if (activeMenu) {
        fadeTl.to(activeMenu, {
          autoAlpha: 0,
          duration: 0.15,
          onComplete: () => {
            activeMenu.style.display = "none";
            relatedMenu.style.display = "flex";
            gsap.set(relatedMenu, { autoAlpha: 0 });
            fadeTl.to(relatedMenu, {
              autoAlpha: 1,
              duration: 0.2,
              ease: "power2.out",
            });
            activeMenu = relatedMenu;
          },
        });
      } else {
        relatedMenu.style.display = "flex";
        fadeTl.to(relatedMenu, {
          autoAlpha: 1,
          duration: 0.25,
          delay: 0.1,
          ease: "power2.out",
        });
        if (!isOpen) {
          mainMenu.style.display = "block";
          mainMenuTl.play(0);
          isOpen = true;
        }
        activeMenu = relatedMenu;
      }
    });

    trigger.addEventListener("mouseleave", () => {
      hoverTimeout = setTimeout(() => {
        if (
          !trigger.matches(":hover") &&
          !mainMenu.matches(":hover") &&
          !(header && header.matches(":hover"))
        ) {
          closeMainMenu();
        }
      }, 150);
    });
  });

  [mainMenu, header].forEach((el) => {
    el.addEventListener("mouseenter", () => clearTimeout(hoverTimeout));
    el.addEventListener("mouseleave", () => {
      hoverTimeout = setTimeout(() => {
        const anyHovered =
          [...menuTriggers].some((t) => t.matches(":hover")) ||
          mainMenu.matches(":hover") ||
          (header && header.matches(":hover"));
        if (!anyHovered) closeMainMenu();
      }, 150);
    });
  });

  function closeMainMenu() {
    if (!activeMenu) return;
    if (fadeTl && fadeTl.isActive()) fadeTl.kill();

    menuTriggers.forEach((t) => t.classList.remove("active"));

    gsap.to(activeMenu, {
      autoAlpha: 0,
      duration: 0.2,
      onComplete: () => {
        activeMenu.style.display = "none";
        mainMenuTl.reverse().eventCallback("onReverseComplete", () => {
          mainMenu.style.display = "none";
          isOpen = false;
        });
        activeMenu = null;
      },
    });
  }
});
