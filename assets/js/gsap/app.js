function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

gsap.registerPlugin(ScrollTrigger);

let lenis;

if (!isMobileDevice()) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      }
    });
  });

  const track = document.createElement("div");
  track.className = "lenis-scrollbar";
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  track.appendChild(thumb);
  document.body.appendChild(track);

  let hideTimer = null;
  let isDragging = false;
  let startY = 0;
  let startScroll = 0;
  let smoothTarget = 0;
  let smoothTween = null;

  function getScrollInfo() {
    const doc = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight,
    );
    const viewport = window.innerHeight;
    return { scrollHeight, viewport };
  }

  function updateThumb() {
    const { scrollHeight, viewport } = getScrollInfo();
    const trackRect = track.getBoundingClientRect();
    const trackHeight = trackRect.height;
    const thumbH = Math.max(
      40,
      Math.round(trackHeight * (viewport / scrollHeight)),
    );
    thumb.style.height = thumbH + "px";
    const maxScroll = scrollHeight - viewport;
    const y = lenis.scroll;
    const progress = maxScroll > 0 ? y / maxScroll : 0;
    const travel = trackHeight - thumbH;
    const translateY = Math.round(travel * progress);
    thumb.style.transform = `translateY(${translateY}px)`;
  }

  function showTrackTemporarily() {
    track.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!isDragging) track.classList.remove("show");
    }, 800);
  }

  lenis.on("scroll", () => {
    updateThumb();
    showTrackTemporarily();
  });

  window.addEventListener("resize", updateThumb);
  updateThumb();

  thumb.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
    startScroll = lenis.scroll;
    smoothTarget = startScroll;
    track.classList.add("show");
    document.body.classList.add("no-select");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const { scrollHeight, viewport } = getScrollInfo();
    const trackRect = track.getBoundingClientRect();
    const thumbH = thumb.offsetHeight;
    const travel = trackRect.height - thumbH;
    const deltaY = e.clientY - startY;
    const progressDelta = deltaY / travel;
    smoothTarget = startScroll + progressDelta * (scrollHeight - viewport);
    if (smoothTween) smoothTween.kill();
    smoothTween = gsap.to(
      {},
      {
        duration: 0.15,
        ease: "power2.out",
        onUpdate: () => {
          lenis.scrollTo(smoothTarget, {
            duration: 0.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        },
        overwrite: true,
      },
    );
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      document.body.classList.remove("no-select");
      if (smoothTween) {
        smoothTween.kill();
        smoothTween = null;
      }
      hideTimer = setTimeout(() => track.classList.remove("show"), 700);
    }
  });
} else {
  document.body.classList.add("no-lenis");
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function disableScroll() {
  if (lenis) lenis.stop();
  document.body.classList.add("no-scroll");
}

function enableScroll() {
  if (lenis) lenis.start();
  document.body.classList.remove("no-scroll");
}

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

//Star Codes

mm.add("(min-width: 1024px)", () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".start-content .scroll-down i svg", { y: -100 });

  gsap.fromTo(
    ".start-content i svg",
    { y: -100 },
    {
      y: 100,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      onRepeat: () => {
        gsap.set("start-content .scroll-down i svg", { y: -100 });
      },
    },
  );

  //Image Parallax
  var winScrollTop = 0;
  $.fn.is_on_screen = function () {
    var win = $(window);
    var viewport = {
      top: win.scrollTop(),
      left: win.scrollLeft(),
    };
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.bottom = bounds.top + this.outerHeight();

    return !(viewport.bottom < bounds.top || viewport.top > bounds.bottom);
  };

  function parallax() {
    var scrolled = $(window).scrollTop();
    $(".parallax-item ").each(function () {
      if ($(this).is_on_screen()) {
        var firstTop = $(this).offset().top;
        var $span = $(this).find("img");
        var moveTop = (firstTop - winScrollTop) * 0.3; // speed
        $span.css("transform", "translate3d(0, " + -moveTop + "px, 0)");
        $span.css("will-change", "transform");
      }
    });
  }

  $(window).scroll(function (e) {
    winScrollTop = $(this).scrollTop();
    parallax();
  });

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".fade-up-items").forEach((section) => {
    gsap.from(section.querySelectorAll(".item"), {
      y: 80,
      opacity: 0,
      ease: "power2.out",
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
        once: true,
        markers: false,
      },
    });
  });

  //Scroll Mask Image Animation
  gsap.set(".mask", { rotation: 0.1 });

  gsap.utils.toArray(".mask").forEach((maskEl) => {
    const cardImage = maskEl.querySelector(".card-image");

    if (!cardImage) return; // güvenlik kontrolü

    const tl = gsap
      .timeline({
        defaults: { ease: "power2.out" },
        paused: true,
      })
      .from(cardImage, { scale: 0.5, duration: 1 })
      .to(
        maskEl,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        },
        0,
      )
      .to(maskEl, { scale: 1, duration: 1 }, "<");

    ScrollTrigger.create({
      trigger: maskEl,
      animation: tl,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".inverster-list li", {
    y: 50,
    autoAlpha: 0,
    stagger: 0.3,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".investor-relations",
      start: "top top",
      end: "+=500",
      scrub: true,
    },
  });

  //Start Sticky Pin
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("start-content");
    const overlay = document.getElementById("overlay");

    if (container && overlay) {
      gsap.set(container, { visibility: "visible" });

      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.5,
      });
    }
  });

  document.querySelectorAll(".slide-items").forEach((slideItems) => {
    const tl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "power3.inOut",
      },
    });

    tl.from(slideItems.querySelectorAll(".slide-item"), {
      x: innerWidth,
      stagger: {
        amount: 0.5,
      },
    }).to(
      slideItems.querySelectorAll(".slide-item"),
      {
        y: innerHeight * 0,
        stagger: {
          amount: 0.5,
          from: 2,
        },
      },
      "-=1.5",
    );

    ScrollTrigger.create({
      trigger: slideItems,
      start: "top center",
      animation: tl,
      // markers: true, // Debug için aktif edilebilir
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".scroll-animate", {
    scale: 1.4,
    ease: "cubic-bezier(0.65, 0, 0.35, 1)",
    scrollTrigger: {
      trigger: ".detail-headline",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.set(".overlay", {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    pointerEvents: "none",
    zIndex: 10,
  });

  gsap.to(".overlay", {
    backgroundColor: "rgba(0, 0, 0, 1)",
    ease: "none",
    scrollTrigger: {
      trigger: ".start-content, .detail-top",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  const scrollTitles = document.querySelectorAll(".title-animated");

  scrollTitles.forEach((title) => {
    const split = new SplitText(title, {
      type: "words",
      wordsClass: "word",
    });

    gsap.set(split.words, {
      display: "inline-block",
      y: "100%",
      autoAlpha: 0,
    });

    gsap.to(split.words, {
      scrollTrigger: {
        trigger: title,
        start: "top 90%",
        end: "bottom 20%",
        once: true,
        onEnter: () => gsap.to(title, { autoAlpha: 1, duration: 0.1 }),
      },
      y: "0%",
      autoAlpha: 1,
      ease: "power4.out",
      duration: 1.2,
      stagger: 0.04,
    });
  });

  ScrollTrigger.refresh();

  gsap.registerPlugin(ScrollTrigger);

  //Image Scale
  const imageScale = gsap.utils.toArray(".image-scale img");
  imageScale.forEach((box, i) => {
    const anim = gsap.fromTo(box, { scale: 1.6 }, { duration: 1.2, scale: 1 });
    ScrollTrigger.create({
      trigger: box,
      animation: anim,
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    });
  });
});
