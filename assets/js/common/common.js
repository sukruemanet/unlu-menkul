//Video Hover Play
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-card").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;

    card.addEventListener("mouseenter", () => {
      video.muted = true;
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          card.classList.add("active");
        })
        .catch((err) => {
          console.log("Video play engellendi:", err);
        });
    });

    card.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
      card.classList.remove("active");
    });
  });
});

//Office Info Box
document.addEventListener("DOMContentLoaded", () => {
  const officeItems = document.querySelectorAll(".offices-menu li");

  const clearActive = () => {
    officeItems.forEach((el) => {
      el.classList.remove("active");
      const info = el.querySelector(".offices-info");
      if (info) info.classList.remove("active");
      const btn = el.querySelector(".office-button");
      if (btn) btn.classList.remove("active");
    });
  };

  officeItems.forEach((item) => {
    const button = item.querySelector(".office-button");
    if (!button) return;

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      if (item.classList.contains("active")) {
        clearActive();
        return;
      }

      clearActive();
      item.classList.add("active");
      button.classList.add("active");

      const currentInfo = item.querySelector(".offices-info");
      if (currentInfo) currentInfo.classList.add("active");
    });
  });

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const activeItem = document.querySelector(`.offices-menu li#${hash}`);
    if (activeItem) {
      clearActive();
      activeItem.classList.add("active");
      const btn = activeItem.querySelector(".office-button");
      if (btn) btn.classList.add("active");
      const currentInfo = activeItem.querySelector(".offices-info");
      if (currentInfo) currentInfo.classList.add("active");
    }
  }

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".offices-info") &&
      !e.target.closest(".offices-menu .office-button")
    ) {
      clearActive();
    }
  });

  document.querySelectorAll(".office-info-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentLi = closeBtn.closest("li");
      if (parentLi) {
        parentLi.classList.remove("active");
        const info = parentLi.querySelector(".offices-info");
        if (info) info.classList.remove("active");
        const btn = parentLi.querySelector(".office-button");
        if (btn) btn.classList.remove("active");
      }
    });
  });
});
