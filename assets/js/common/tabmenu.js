$(document).ready(function () {
  $("ul.tabs li").click(function () {
    var tab_id = $(this).attr("data-tab");

    var $parentUl = $(this).closest("ul.tabs");
    $parentUl.find("li").removeClass("current");
    $(this).addClass("current");

    var $tabContainer = $parentUl.closest(".tab-menu-content");
    var $tabContents = $tabContainer.find(".tab-content").filter(function () {
      return $(this).closest(".tab-menu-content").is($tabContainer);
    });
    $tabContents.removeClass("current");
    $tabContents.filter("#" + tab_id).addClass("current");

    if (window.refreshCustomTables) {
      window.refreshCustomTables(document.getElementById(tab_id));
    }

    gsap.fromTo(
      "#" + tab_id,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
    );
  });
});
