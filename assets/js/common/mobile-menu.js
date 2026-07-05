$(document).ready(function () {
  const $backBtn = $("#backBtn");
  const $menuTitle = $("#menuTitle");
  const navigationHistory = [];

  function showMenu(menuId) {
    const $targetMenu = $(`.menu-level[data-menu-id="${menuId}"]`);

    if ($targetMenu.length) {
      // Mevcut aktif menÃ¼yÃ¼ gizle
      const $currentMenu = $(".menu-level.active");

      // History'e ekle
      if ($currentMenu.length) {
        navigationHistory.push({
          id: $currentMenu.data("menu-id"),
          title: $currentMenu.data("title"),
        });
      }

      // MenÃ¼ deÄŸiÅŸtir
      $(".menu-level").removeClass("active");
      $targetMenu.addClass("active");

      // BaÅŸlÄ±ÄŸÄ± gÃ¼ncelle
      $menuTitle.text($targetMenu.data("title"));

      // Back button gÃ¶ster
      $backBtn.addClass("active");
    }
  }

  // Alt menÃ¼ye geÃ§iÅŸ
  $(".has-submenu").on("click", function (e) {
    e.preventDefault();
    const targetMenuId = $(this).data("target");
    showMenu(targetMenuId);
  });

  // Geri butonu
  $backBtn.on("click", function () {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory.pop();
      const $prevMenu = $(`.menu-level[data-menu-id="${previous.id}"]`);

      // MenÃ¼ deÄŸiÅŸtir
      $(".menu-level").removeClass("active");
      $prevMenu.addClass("active");

      // BaÅŸlÄ±ÄŸÄ± gÃ¼ncelle
      $menuTitle.text(previous.title);

      // Ana menÃ¼deyse back button gizle
      if (navigationHistory.length === 0) {
        $backBtn.removeClass("active");
      }
    }
  });

  // Normal menu item tÄ±klamalarÄ±
  $(".menu-item").on("click", function (e) {
    e.preventDefault();
    const itemName = $(this).find(".label").text();
    alert(`${itemName} sayfasÄ±na yÃ¶nlendiriliyorsunuz...`);
  });
});
