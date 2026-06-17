gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 768) {
    let typeSplit = new SplitType("[text-split]", {
      types: "words, chars",
    });

    gsap.set("[text-split]", { opacity: 1 });

    document.querySelectorAll("[letters-fade-in]").forEach((element) => {
      const chars = element.querySelectorAll(".char");
      if (chars.length === 0) return;

      gsap.from(chars, {
        opacity: 0,
        duration: 1.2,
        ease: "power1.out",
        stagger: 0.05,
        delay: 0.5,
      });
    });

    function createScrollTrigger(triggerElement, timeline) {
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top bottom",
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        },
      });

      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 70%",
        onEnter: () => timeline.play(),
      });
    }

    $("[letters-fade]").each(function () {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: { amount: 0.8 },
      });
      createScrollTrigger($(this), tl);
    });
  }
});