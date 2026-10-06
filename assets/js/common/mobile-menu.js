$(document).ready(function () {
  const $backBtn = $("#backBtn");
  const $menuTitle = $("#menuTitle");
  const navigationHistory = [];

  function showMenu(menuId) {
    const $targetMenu = $(`.menu-level[data-menu-id="${menuId}"]`);

    if ($targetMenu.length) {
      const $currentMenu = $(".menu-level.active");

      if ($currentMenu.length) {
        navigationHistory.push({
          id: $currentMenu.data("menu-id"),
          title: $currentMenu.data("title"),
        });
      }

      $(".menu-level").removeClass("active");
      $targetMenu.addClass("active");

      $menuTitle.text($targetMenu.data("title"));

      $backBtn.addClass("active");
    }
  }

  $(".has-submenu").on("click", function (e) {
    e.preventDefault();
    const targetMenuId = $(this).data("target");
    showMenu(targetMenuId);
  });

  $backBtn.on("click", function () {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory.pop();
      const $prevMenu = $(`.menu-level[data-menu-id="${previous.id}"]`);

      $(".menu-level").removeClass("active");
      $prevMenu.addClass("active");

      $menuTitle.text(previous.title);

      if (navigationHistory.length === 0) {
        $backBtn.removeClass("active");
      }
    }
  });

  $(".menu-item").on("click", function (e) {
    e.preventDefault();
    const itemName = $(this).find(".label").text();
    alert(`${itemName} sayfasÄ±na yÃ¶nlendiriliyorsunuz...`);
  });
});
