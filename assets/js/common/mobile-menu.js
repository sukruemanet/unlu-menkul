$(document).ready(function () {
  const $backBtn = $("#backBtn");
  const $menuTitle = $("#menuTitle");
  const navigationHistory = [];

  function showMenu(menuId) {
    const $targetMenu = $(`.menu-level[data-menu-id="${menuId}"]`);

    if ($targetMenu.length) {
      // Mevcut aktif menüyü gizle
      const $currentMenu = $(".menu-level.active");

      // History'e ekle
      if ($currentMenu.length) {
        navigationHistory.push({
          id: $currentMenu.data("menu-id"),
          title: $currentMenu.data("title"),
        });
      }

      // Menü değiştir
      $(".menu-level").removeClass("active");
      $targetMenu.addClass("active");

      // Başlığı güncelle
      $menuTitle.text($targetMenu.data("title"));

      // Back button göster
      $backBtn.addClass("active");
    }
  }

  // Alt menüye geçiş
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

      // Menü değiştir
      $(".menu-level").removeClass("active");
      $prevMenu.addClass("active");

      // Başlığı güncelle
      $menuTitle.text(previous.title);

      // Ana menüdeyse back button gizle
      if (navigationHistory.length === 0) {
        $backBtn.removeClass("active");
      }
    }
  });

  // Normal menu item tıklamaları
  $(".menu-item").on("click", function (e) {
    e.preventDefault();
    const itemName = $(this).find(".label").text();
    alert(`${itemName} sayfasına yönlendiriliyorsunuz...`);
  });
});
