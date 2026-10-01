/*
 * Custom Table: sıralama, arama ve sayfalama
 *
 * Kullanım:
 * <div class="custom-table" data-page-size="10">
 *   <div class="table-headline">
 *     <a class="button dark" data-table-reset>Filtreyi Sıfırla</a>
 *     <div class="table-search"><input data-table-search placeholder="Arayın..."></div>
 *   </div>
 *   <div class="content-custom-table-list">
 *     <ul>
 *       <li class="nb"> ...başlıklar (.item)... </li>   -> ilk li başlık satırıdır
 *       <li> ...satırlar (.item)... </li>
 *     </ul>
 *   </div>
 *   <div class="pagination"></div>
 * </div>
 *
 * Sıralanmasını istemediğiniz başlık hücresine data-sortable="false" ekleyin.
 */
(function () {
  var MONTHS = {
    ocak: 0,
    şubat: 1,
    mart: 2,
    nisan: 3,
    mayıs: 4,
    haziran: 5,
    temmuz: 6,
    ağustos: 7,
    eylül: 8,
    ekim: 9,
    kasım: 10,
    aralık: 11,
  };

  var SORT_ICON =
    '<i class="sort-icon">' +
    '<svg viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">' +
    '<path class="up" d="M5 0L10 6H0L5 0Z" />' +
    '<path class="down" d="M5 16L0 10H10L5 16Z" />' +
    "</svg>" +
    "</i>";

  var PREV_ICON =
    '<svg viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M23 10.4285H1" stroke-linecap="round" stroke-linejoin="round" />' +
    '<path d="M10.4285 19.857L0.999895 10.4285" stroke-linecap="round" stroke-linejoin="round" />' +
    '<path d="M10.4285 1L0.999895 10.4286" stroke-linecap="round" stroke-linejoin="round" />' +
    "</svg>";

  var NEXT_ICON =
    '<svg viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M1 10.9999H23" stroke-linecap="round" stroke-linejoin="round" />' +
    '<path d="M13.5715 20.4284L23.0001 10.9999" stroke-linecap="round" stroke-linejoin="round" />' +
    '<path d="M13.5715 1.57129L23.0001 10.9999" stroke-linecap="round" stroke-linejoin="round" />' +
    "</svg>";

  function normalize(text) {
    return text.replace(/\s+/g, " ").trim().toLocaleLowerCase("tr");
  }

  // "05.10.2026", "05/10/2026", "17 Temmuz 23", "8 Haziran 2026"
  function parseDate(text) {
    var m = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|\d{4})$/);
    if (m) {
      return new Date(toFullYear(m[3]), +m[2] - 1, +m[1]).getTime();
    }

    m = normalize(text).match(/^(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{2}|\d{4})$/);
    if (m && MONTHS[m[2]] !== undefined) {
      return new Date(toFullYear(m[3]), MONTHS[m[2]], +m[1]).getTime();
    }

    return null;
  }

  function toFullYear(year) {
    return year.length === 2 ? 2000 + +year : +year;
  }

  // "636.0", "44%", "%44", "0,1698", "1.005.098.683,94 TL"
  function parseNumber(text) {
    var value = text.replace(/\s+/g, "");
    if (!/^[%]?[-+]?[\d.,]+(%|TL|₺)?$/i.test(value)) return null;

    value = value.replace(/%|TL|₺/gi, "");

    var lastComma = value.lastIndexOf(",");
    var lastDot = value.lastIndexOf(".");

    if (lastComma > -1 && lastDot > -1) {
      // Hangisi sondaysa ondalık ayracı odur
      value =
        lastComma > lastDot
          ? value.replace(/\./g, "").replace(",", ".")
          : value.replace(/,/g, "");
    } else if (lastComma > -1) {
      value = value.replace(",", ".");
    } else if ((value.match(/\./g) || []).length > 1) {
      // Birden fazla nokta varsa binlik ayracıdır
      value = value.replace(/\./g, "");
    }

    var number = parseFloat(value);
    return isNaN(number) ? null : number;
  }

  function detectColumnType(rows, index) {
    var isDate = true;
    var isNumber = true;
    var hasValue = false;

    rows.forEach(function (row) {
      var text = row.cells[index];
      if (!text) return;
      hasValue = true;
      if (parseDate(text) === null) isDate = false;
      if (parseNumber(text) === null) isNumber = false;
    });

    if (!hasValue) return "text";
    if (isDate) return "date";
    if (isNumber) return "number";
    return "text";
  }

  function CustomTable(root) {
    this.root = root;
    this.list = root.querySelector(".content-custom-table-list ul");
    if (!this.list) return;

    this.pagination = root.querySelector(".pagination");
    this.searchInput = root.querySelector("[data-table-search], .table-search input");
    this.resetButton = root.querySelector("[data-table-reset]");
    this.pageSize = parseInt(root.getAttribute("data-page-size"), 10) || 10;

    var items = Array.prototype.slice.call(this.list.children);
    this.headerRow = items.shift();
    this.headerCells = Array.prototype.slice.call(this.headerRow.querySelectorAll(":scope > .item, :scope > span"));

    this.rows = items.map(function (li, i) {
      var cells = Array.prototype.slice
        .call(li.querySelectorAll(":scope > .item, :scope > span"))
        .map(function (cell) {
          return cell.textContent.replace(/\s+/g, " ").trim();
        });

      return {
        el: li,
        index: i,
        cells: cells,
        search: normalize(cells.join(" ")),
      };
    });

    this.columnTypes = this.headerCells.map(
      function (_, i) {
        return detectColumnType(this.rows, i);
      }.bind(this),
    );

    this.query = "";
    this.sortIndex = null;
    this.sortDir = "asc";
    this.page = 1;

    this.emptyRow = document.createElement("li");
    this.emptyRow.className = "empty";
    this.emptyRow.textContent = root.getAttribute("data-empty-text") || "Sonuç bulunamadı.";

    this.bindHeader();
    this.bindSearch();
    this.bindReset();
    this.bindPagination();
    this.render();
  }

  CustomTable.prototype.bindHeader = function () {
    var self = this;

    this.headerCells.forEach(function (cell, i) {
      if (cell.getAttribute("data-sortable") === "false") return;

      cell.classList.add("sortable");
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.insertAdjacentHTML("beforeend", SORT_ICON);

      function toggle() {
        if (self.sortIndex === i) {
          self.sortDir = self.sortDir === "asc" ? "desc" : "asc";
        } else {
          self.sortIndex = i;
          self.sortDir = "asc";
        }
        self.page = 1;
        self.render();
      }

      cell.addEventListener("click", toggle);
      cell.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  };

  CustomTable.prototype.bindSearch = function () {
    if (!this.searchInput) return;
    var self = this;

    this.searchInput.addEventListener("input", function () {
      self.query = normalize(self.searchInput.value);
      self.page = 1;
      self.render();
    });
  };

  CustomTable.prototype.bindReset = function () {
    if (!this.resetButton) return;
    var self = this;

    this.resetButton.addEventListener("click", function (e) {
      e.preventDefault();
      self.query = "";
      self.sortIndex = null;
      self.sortDir = "asc";
      self.page = 1;
      if (self.searchInput) self.searchInput.value = "";
      self.render();
    });
  };

  CustomTable.prototype.bindPagination = function () {
    if (!this.pagination) return;
    var self = this;

    this.pagination.addEventListener("click", function (e) {
      var target = e.target.closest("[data-page]");
      if (!target) return;
      e.preventDefault();

      var page = parseInt(target.getAttribute("data-page"), 10);
      if (!page || page === self.page || page < 1 || page > self.totalPages) return;

      self.page = page;
      self.render();
    });
  };

  CustomTable.prototype.compare = function (a, b) {
    var i = this.sortIndex;
    var type = this.columnTypes[i];
    var va = a.cells[i] || "";
    var vb = b.cells[i] || "";
    var result;

    if (type === "date") {
      result = parseDate(va) - parseDate(vb);
    } else if (type === "number") {
      result = parseNumber(va) - parseNumber(vb);
    } else {
      result = va.localeCompare(vb, "tr", { numeric: true, sensitivity: "base" });
    }

    if (result === 0) result = a.index - b.index;
    return this.sortDir === "asc" ? result : -result;
  };

  CustomTable.prototype.render = function () {
    var self = this;

    var rows = this.rows.filter(function (row) {
      return !self.query || row.search.indexOf(self.query) > -1;
    });

    if (this.sortIndex !== null) {
      rows.sort(this.compare.bind(this));
    }

    this.totalPages = Math.max(1, Math.ceil(rows.length / this.pageSize));
    this.page = Math.min(this.page, this.totalPages);

    var start = (this.page - 1) * this.pageSize;
    var visible = rows.slice(start, start + this.pageSize);

    var fragment = document.createDocumentFragment();
    fragment.appendChild(this.headerRow);
    visible.forEach(function (row) {
      fragment.appendChild(row.el);
    });
    if (!visible.length) fragment.appendChild(this.emptyRow);

    this.list.innerHTML = "";
    this.list.appendChild(fragment);

    this.headerCells.forEach(function (cell, i) {
      cell.classList.toggle("asc", self.sortIndex === i && self.sortDir === "asc");
      cell.classList.toggle("desc", self.sortIndex === i && self.sortDir === "desc");
    });

    this.renderPagination();
  };

  // 1 … 4 5 6 … 23
  CustomTable.prototype.getPageNumbers = function () {
    var total = this.totalPages;
    var current = this.page;
    var pages = [];

    if (total <= 7) {
      for (var i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    var from = Math.max(2, current - 1);
    var to = Math.min(total - 1, current + 1);

    if (current <= 3) {
      from = 2;
      to = 5;
    } else if (current >= total - 2) {
      from = total - 4;
      to = total - 1;
    }

    pages.push(1);
    if (from > 2) pages.push("…");
    for (var p = from; p <= to; p++) pages.push(p);
    if (to < total - 1) pages.push("…");
    pages.push(total);

    return pages;
  };

  CustomTable.prototype.renderPagination = function () {
    if (!this.pagination) return;

    if (this.totalPages <= 1) {
      this.pagination.innerHTML = "";
      this.pagination.classList.add("hidden");
      return;
    }

    this.pagination.classList.remove("hidden");

    var current = this.page;
    var total = this.totalPages;

    var numbers = this.getPageNumbers()
      .map(function (p) {
        if (p === "…") return '<li class="dots"><span>…</span></li>';
        return (
          '<li class="' + (p === current ? "active" : "") + '">' +
          '<a data-page="' + p + '">' + p + "</a>" +
          "</li>"
        );
      })
      .join("");

    this.pagination.innerHTML =
      '<a class="button border small prev' + (current === 1 ? " disabled" : "") + '" data-page="' + (current - 1) + '">' +
      PREV_ICON +
      "Geri" +
      "</a>" +
      "<ul>" + numbers + "</ul>" +
      '<span class="page-info">' + current + " / " + total + "</span>" +
      '<a class="button border small next' + (current === total ? " disabled" : "") + '" data-page="' + (current + 1) + '">' +
      "İleri" +
      NEXT_ICON +
      "</a>";
  };

  function init() {
    document.querySelectorAll(".custom-table").forEach(function (root) {
      if (root.customTable) return;
      root.customTable = new CustomTable(root);
    });
  }

  window.initCustomTables = init;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
