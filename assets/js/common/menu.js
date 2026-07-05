function disableScroll() {
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
}

let activeMenu = null;
let activeTl = null;
let activeTrigger = null;
const timelines = new Map();
const closeBtn = document.querySelector(".close-mobile-menu-item");

function updateCloseBtnState() {
  if (!closeBtn) return;
  if (activeMenu || isSearchOpen()) closeBtn.classList.add("active");
  else closeBtn.classList.remove("active");
}

function makeMenuTimeline(menuEl) {
  const q = gsap.utils.selector(menuEl);
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(
    menuEl,
    { autoAlpha: 0, visibility: "hidden", pointerEvents: "none" },
    {
      autoAlpha: 1,
      visibility: "visible",
      pointerEvents: "auto",
      duration: 0.2,
    },
    0
  );

  tl.fromTo(
    q(".menu-content"),
    { y: 140, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      ease: "power3.out",
      stagger: { amount: 0.5 },
    },
    0.1
  );

  tl.fromTo(
    q(".menu-images figure img"),
    { scale: 1.6, autoAlpha: 0 },
    {
      scale: 1,
      autoAlpha: 1,
      duration: 1.2,
      ease: "cubic-bezier(0.77,0,0.175,1)",
      stagger: { amount: 0.6 },
      immediateRender: false,
      willChange: "transform, opacity",
    },
    0.2
  );

  return tl;
}

function animateContentOnce(menuEl) {
  if (menuEl.dataset.contentAnimated === "1") return;
  const q = gsap.utils.selector(menuEl);
  gsap.fromTo(
    q(".category-menu-content"),
    { y: -100 },
    { y: 0, duration: 0.2, ease: "power3.out" }
  );
  menuEl.dataset.contentAnimated = "1";
}

function getTimeline(menuEl) {
  if (!timelines.has(menuEl)) timelines.set(menuEl, makeMenuTimeline(menuEl));
  return timelines.get(menuEl);
}

function openMenu(triggerEl, menuEl) {
  if (!menuEl || !triggerEl) return;
  if (isSearchOpen()) closeSearch();

  if (activeMenu === menuEl) {
    closeActiveMenu();
    return;
  }

  if (activeTl) activeTl.reverse();

  const tl = getTimeline(menuEl);

  activeMenu = menuEl;
  activeTl = tl;
  activeTrigger = triggerEl;

  menuEl.classList.add("open");
  triggerEl.classList.add("active");

  disableScroll();
  animateContentOnce(menuEl);
  tl.play(0);

  tl.eventCallback("onReverseComplete", () => {
    menuEl.classList.remove("open");
    menuEl.style.pointerEvents = "none";
    if (activeTrigger) activeTrigger.classList.remove("active");
    activeMenu = null;
    activeTl = null;
    activeTrigger = null;
    enableScroll();
    updateCloseBtnState();
  });

  updateCloseBtnState();

  document.addEventListener("keydown", onEscOnce, { once: true });
  menuEl.addEventListener("click", onBackdropOnce, { once: true });
}

function closeActiveMenu() {
  if (!activeTl) return;
  activeTl.reverse();
}

function onEscOnce(e) {
  if (e.key === "Escape") {
    closeActiveMenu();
    if (isSearchOpen()) closeSearch();
  }
}

function onBackdropOnce(e) {
  if (e.target.classList.contains("category-menu")) closeActiveMenu();
}

document.querySelectorAll("[data-menu-trigger]").forEach((triggerEl) => {
  const targetId = triggerEl.getAttribute("data-menu-trigger");
  const menuEl = document.getElementById(targetId);
  triggerEl.addEventListener("click", () => openMenu(triggerEl, menuEl));
});

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    closeActiveMenu();
    closeSearch();
  });
}

const searchTrigger = document.querySelectorAll("[data-search-trigger]");
const searchContent = document.getElementById("search-content");
const searchClose = document.querySelectorAll(".close-search");

function isSearchOpen() {
  return searchContent && searchContent.classList.contains("open");
}

function openSearch(triggerEl) {
  if (!searchContent || !triggerEl) return;

  closeActiveMenu();

  searchContent.classList.add("open");
  triggerEl.classList.add("active");

  gsap.fromTo(
    searchContent,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.2,
      onComplete: () => {
        const input = searchContent.querySelector("input");
        if (input) input.focus();
      },
    }
  );

  disableScroll();
  updateCloseBtnState();
  document.addEventListener("keydown", onEscOnce, { once: true });
}

function closeSearch() {
  if (!isSearchOpen()) return;

  searchContent.classList.remove("open");
  searchTrigger.forEach((t) => t.classList.remove("active"));

  const searchNowElements = document.querySelectorAll(".search-now");
  searchNowElements.forEach((el) => el.classList.remove("active"));

  enableScroll();
  updateCloseBtnState();
}

const searchNowElements = document.querySelectorAll(".search-now");
searchNowElements.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeActiveMenu();
    openSearch(element);
  });
});

searchTrigger.forEach((trigger) =>
  trigger.addEventListener("click", () => openSearch(trigger))
);

searchClose.forEach((btn) => btn.addEventListener("click", closeSearch));

const hamburgerButton = document.querySelector(
  "[data-menu-trigger='hamburger-menu']"
);
const hamburgerLines = document.querySelectorAll(".hamburger-menu span");

function openHamburger() {
  if (!hamburgerButton) return;

  if (isSearchOpen()) closeSearch();
  closeActiveMenu();

  hamburgerButton.classList.add("active");

  gsap.to(hamburgerLines[0], {
    y: 8,
    rotate: 45,
    backgroundColor: "#fff",
    duration: 0.3,
  });
  gsap.to(hamburgerLines[1], {
    y: -8,
    rotate: -45,
    backgroundColor: "#fff",
    duration: 0.3,
  });

  disableScroll();
  updateCloseBtnState();
  document.addEventListener("keydown", onEscOnce, { once: true });
}

function closeHamburger() {
  if (hamburgerButton) hamburgerButton.classList.remove("active");

  gsap.to(hamburgerLines[0], {
    y: 0,
    rotate: 0,
    clearProps: "all",
    duration: 0.3,
  });
  gsap.to(hamburgerLines[1], {
    y: 0,
    rotate: 0,
    clearProps: "all",
    duration: 0.3,
  });

  if (!isSearchOpen()) enableScroll();
  updateCloseBtnState();
}
