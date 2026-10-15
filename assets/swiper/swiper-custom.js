// Hero Slider
var heroSwiper = new Swiper(".hero-swiper", {
  allowTouchMove: true,
  simulateTouch: true,
  grabCursor: true,
  touchEventsTarget: "container",
  noSwipingSelector: "input, textarea, select, button",

  autoHeight: false,
  breakpoints: {
    1025: { autoHeight: true },
  },
  speed: 1000,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },

  navigation: {
    nextEl: ".hero-next",
    prevEl: ".hero-prev",
  },
  pagination: {
    el: ".hero-pagination",
    clickable: true,
  },

  // autoplay: {
  //   delay: 5000,
  //   disableOnInteraction: false,
  // },
});

// Animate one shared line between the hero pagination bullets.
function initHeroPaginationLine(swiper) {
  const pagination = swiper?.pagination?.el;
  if (!pagination || typeof gsap === "undefined") return;

  const line = document.createElement("span");
  line.className = "hero-pagination-line";
  line.setAttribute("aria-hidden", "true");
  pagination.appendChild(line);
  pagination.classList.add("has-moving-line");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function placeLine(animate = false) {
    const active = pagination.querySelector(".swiper-pagination-bullet-active");
    if (!active) return;

    const target = { x: active.offsetLeft, width: active.offsetWidth };
    gsap.killTweensOf(line);
    if (animate && !reducedMotion.matches) {
      gsap.to(line, { ...target, duration: 0.32, ease: "power3.inOut" });
    } else {
      gsap.set(line, target);
    }
  }

  const onPaginationUpdate = () => {
    // Swiper may rebuild its bullets when pagination is updated.
    if (line.parentElement !== pagination) pagination.appendChild(line);
    placeLine(true);
  };
  const onResize = () => placeLine();
  const observer = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(onResize)
    : null;

  placeLine();
  swiper.on("paginationUpdate", onPaginationUpdate);
  swiper.on("resize", onResize);
  observer?.observe(pagination);
  reducedMotion.addEventListener("change", onResize);

  swiper.once("destroy", () => {
    observer?.disconnect();
    reducedMotion.removeEventListener("change", onResize);
    swiper.off("paginationUpdate", onPaginationUpdate);
    swiper.off("resize", onResize);
    gsap.killTweensOf(line);
    pagination.classList.remove("has-moving-line");
    line.remove();
  });
}

initHeroPaginationLine(heroSwiper);

//Widget Slider
var widgetSwiper = new Swiper(".widget-swiper", {
  slidesPerView: 1,
  centeredSlides: true,
  loop: true,
  speed: 500,
  effect: "creative",
  creativeEffect: {
    prev: {
      translate: ["-20%", 0, -1],
      opacity: 0,
      scale: 0.9,
    },
    next: {
      translate: ["300%", 0, 0],
    },
  },
  pagination: {
    el: ".widget-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".widget-next",
    prevEl: ".widget-prev",
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
});

//Blog Slider
var swiper = new Swiper(".blog-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".blog-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".research-next",
    prevEl: ".research-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//Research Slider
var swiper = new Swiper(".research-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".research-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".research-next",
    prevEl: ".research-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

// About page awards: independent controls, with the next card visible.
document.querySelectorAll(".awards-slider").forEach((section) => {
  new Swiper(section.querySelector(".awards-swiper"), {
    slidesPerView: 1.15,
    spaceBetween: 16,
    watchOverflow: true,
    pagination: {
      el: section.querySelector(".awards-pagination"),
      type: "progressbar",
    },
    navigation: {
      nextEl: section.querySelector(".awards-next"),
      prevEl: section.querySelector(".awards-prev"),
    },
    breakpoints: {
      768: { slidesPerView: 2.2, spaceBetween: 20 },
      1025: { slidesPerView: 3.2, spaceBetween: 30 },
    },
  });
});

//News Slider
var swiper = new Swiper(".news-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".news-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".news-next",
    prevEl: ".news-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//Videos Slider
var swiper = new Swiper(".videos-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".videos-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".videos-next",
    prevEl: ".videos-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//What Are We Doing Slider
var swiper = new Swiper(".what-are-we-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".what-are-we-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".what-are-we-next",
    prevEl: ".what-are-we-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//Highlightsg Slider
var swiper = new Swiper(".highlights-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 10,
  pagination: {
    el: ".highlights-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".highlights-next",
    prevEl: ".highlights-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//text Slider
var swiper = new Swiper(".text-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 20,
  pagination: {
    el: ".text-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".text-next",
    prevEl: ".text-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//Reference Slider
var swiper = new Swiper(".reference-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 20,
  pagination: {
    el: ".reference-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".reference-next",
    prevEl: ".reference-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.4,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 4.2,
      spaceBetween: 30,
    },
  },
});

//Gallery Slider
var swiper = new Swiper(".gallery-swiper", {
  slidesPerView: 1.2,
  spaceBetween: 20,
  pagination: {
    el: ".gallery-pagination",
    type: "progressbar",
  },
  navigation: {
    nextEl: ".gallery-next",
    prevEl: ".gallery-prev",
  },
  breakpoints: {
    648: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1.2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 3.2,
      spaceBetween: 30,
    },
    1368: {
      slidesPerView: 2.2,

      spaceBetween: 30,
    },
    1536: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    1920: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
  },
});

//ID Active Content
const investmentTab = document.getElementById("investment-service");
const assetManagementTab = document.getElementById("asset-management-services");
const investmentSlider = document.querySelector(
  ".what-are-we-slider#investment-services",
);
const assetManagementSlider = document.querySelector(
  ".what-are-we-slider#asset-management-services",
);
const allTabs = document.querySelectorAll(".slider-tab-menu ul li");

function switchSlider(targetSlider, clickedTab) {
  allTabs.forEach((tab) => tab.classList.remove("active-menu"));
  clickedTab.parentElement.classList.add("active-menu");

  const currentActive = document.querySelector(".what-are-we-slider.active");
  if (currentActive === targetSlider) return;

  if (currentActive) {
    gsap.to(currentActive, {
      opacity: 0,
      scale: 0.95,
      // filter: "blur(8px)",
      duration: 0.8,
      ease: "power4.inOut",
      onComplete: () => {
        currentActive.classList.remove("active");
        showSlider(targetSlider);
      },
    });
  } else {
    showSlider(targetSlider);
  }
}

function showSlider(slider) {
  gsap.set(slider, {
    opacity: 0,
    scale: 1.05,
    // filter: "blur(8px)"
  });
  slider.classList.add("active");

  gsap.to(slider, {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    duration: 1,
    ease: "power4.out",
    clearProps: "transform,filter",
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const investmentTab = document.getElementById("investment-service");
  const assetManagementTab = document.getElementById(
    "asset-management-services",
  );

  if (investmentTab) {
    investmentTab.addEventListener("click", (e) => {
      e.preventDefault();
      switchSlider(investmentSlider, e.currentTarget);
    });
  }

  if (assetManagementTab) {
    assetManagementTab.addEventListener("click", (e) => {
      e.preventDefault();
      switchSlider(assetManagementSlider, e.currentTarget);
    });
  }
});
