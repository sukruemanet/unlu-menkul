$(document).ready(function () {
  $("ul.tabs li").click(function () {
    var tab_id = $(this).attr("data-tab");

    // Sadece bu li'nin bulunduğu ul'deki kardeş li'leri etkile
    var $parentUl = $(this).closest("ul.tabs");
    $parentUl.find("li").removeClass("current");
    $(this).addClass("current");

    // Sadece bu ul'ün içinde bulunduğu tab-menu-content'teki tab-content'leri etkile
    var $tabContainer = $parentUl.closest(".tab-menu-content");
    $tabContainer.find(".tab-content").removeClass("current");
    $tabContainer.find("#" + tab_id).addClass("current");

    // Animasyon
    gsap.fromTo(
      "#" + tab_id,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  });
});
