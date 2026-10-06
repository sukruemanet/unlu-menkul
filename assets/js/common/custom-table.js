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

  var TOGGLE_ICON =
    '<i class="row-toggle">' +
    '<svg viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M13.25 1.25L7.25 7.25L1.25 1.25" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />' +
    "</svg>" +
    "</i>";

  var RESPONSIVE_BREAKPOINT = 1024;

  function normalize(text) {
    return text.replace(/\s+/g, " ").trim().toLocaleLowerCase("tr");
  }

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

  function parseNumber(text) {
    var value = text.replace(/\s+/g, "");
    if (!/^[%]?[-+]?[\d.,]+(%|TL|₺)?$/i.test(value)) return null;

    value = value.replace(/%|TL|₺/gi, "");

    var lastComma = value.lastIndexOf(",");
    var lastDot = value.lastIndexOf(".");

    if (lastComma > -1 && lastDot > -1) {
      value =
        lastComma > lastDot
          ? value.replace(/\./g, "").replace(",", ".")
          : value.replace(/,/g, "");
    } else if (lastComma > -1) {
      value = value.replace(",", ".");
    } else if ((value.match(/\./g) || []).length > 1) {
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
    this.searchInput = root.querySelector(
      "[data-table-search], .table-search input",
    );
    this.resetButton = root.querySelector("[data-table-reset]");
    this.pageSize = parseInt(root.getAttribute("data-page-size"), 10) || 10;
    this.colWidth = parseInt(root.getAttribute("data-col-width"), 10) || 100;
    this.hiddenFrom = null;

    var items = Array.prototype.slice.call(this.list.children);
    this.headerRow = items.shift();
    this.headerCells = Array.prototype.slice.call(
      this.headerRow.querySelectorAll(":scope > .item, :scope > span"),
    );

    this.rows = items.map(function (li, i) {
      var cellEls = Array.prototype.slice.call(
        li.querySelectorAll(":scope > .item, :scope > span"),
      );
      var cells = cellEls.map(function (cell) {
        return cell.textContent.replace(/\s+/g, " ").trim();
      });

      li.setAttribute("data-row", i);
      if (cellEls[0]) cellEls[0].insertAdjacentHTML("afterbegin", TOGGLE_ICON);

      return {
        el: li,
        index: i,
        cellEls: cellEls,
        cells: cells,
        search: normalize(cells.join(" ")),
        open: false,
        details: null,
      };
    });

    this.headerLabels = this.headerCells.map(function (cell) {
      return cell.textContent.replace(/\s+/g, " ").trim();
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
    this.emptyRow.textContent =
      root.getAttribute("data-empty-text") || "Sonuç bulunamadı.";

    this.bindHeader();
    this.bindSearch();
    this.bindReset();
    this.bindPagination();
    this.bindRows();
    this.bindResize();
    this.updateColumns();
    this.render();
  }

  CustomTable.prototype.updateColumns = function () {
    var total = this.headerCells.length;
    var hiddenFrom = null;

    if (this.list.clientWidth === 0) return false;

    var responsive = window.innerWidth <= RESPONSIVE_BREAKPOINT;

    if (responsive) {
      var fit = Math.max(1, Math.floor(this.list.clientWidth / this.colWidth));
      if (fit < total) hiddenFrom = fit;
    }

    if (
      hiddenFrom === this.hiddenFrom &&
      responsive === this.root.classList.contains("is-responsive")
    ) {
      return false;
    }
    this.hiddenFrom = hiddenFrom;

    this.root.classList.toggle("is-responsive", responsive);
    this.root.classList.toggle("has-hidden-cols", hiddenFrom !== null);

    var toggleCells = function (cells) {
      cells.forEach(function (cell, i) {
        cell.classList.toggle(
          "col-hidden",
          hiddenFrom !== null && i >= hiddenFrom,
        );
      });
    };

    toggleCells(this.headerCells);
    this.rows.forEach(function (row) {
      toggleCells(row.cellEls);
      row.details = null;
      if (hiddenFrom === null) row.open = false;
    });

    return true;
  };

  CustomTable.prototype.bindResize = function () {
    var self = this;
    var frame;

    window.addEventListener("resize", function () {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        if (self.updateColumns()) self.render();
      });
    });
  };

  CustomTable.prototype.bindRows = function () {
    var self = this;

    this.list.addEventListener("click", function (e) {
      if (self.hiddenFrom === null) return;

      var li = e.target.closest("li[data-row]");
      if (!li || !self.list.contains(li)) return;

      var row = self.rows[+li.getAttribute("data-row")];
      row.open = !row.open;
      self.render();
    });
  };

  CustomTable.prototype.getDetails = function (row) {
    if (row.details) return row.details;

    var li = document.createElement("li");
    li.className = "details";

    var html = "";
    for (var i = this.hiddenFrom; i < this.headerLabels.length; i++) {
      html +=
        '<div class="detail-item">' +
        "<strong>" +
        this.headerLabels[i] +
        "</strong>" +
        "<span>" +
        (row.cellEls[i] ? row.cellEls[i].innerHTML : "") +
        "</span>" +
        "</div>";
    }

    li.innerHTML = html;
    row.details = li;
    return li;
  };

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
      if (!page || page === self.page || page < 1 || page > self.totalPages)
        return;

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
      result = va.localeCompare(vb, "tr", {
        numeric: true,
        sensitivity: "base",
      });
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
      var isOpen = row.open && self.hiddenFrom !== null;
      row.el.classList.toggle("open", isOpen);
      fragment.appendChild(row.el);
      if (isOpen) fragment.appendChild(self.getDetails(row));
    });
    if (!visible.length) fragment.appendChild(this.emptyRow);

    this.list.innerHTML = "";
    this.list.appendChild(fragment);

    this.headerCells.forEach(function (cell, i) {
      cell.classList.toggle(
        "asc",
        self.sortIndex === i && self.sortDir === "asc",
      );
      cell.classList.toggle(
        "desc",
        self.sortIndex === i && self.sortDir === "desc",
      );
    });

    this.renderPagination();
  };

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
          '<li class="' +
          (p === current ? "active" : "") +
          '">' +
          '<a data-page="' +
          p +
          '">' +
          p +
          "</a>" +
          "</li>"
        );
      })
      .join("");

    this.pagination.innerHTML =
      '<a class="button border small prev' +
      (current === 1 ? " disabled" : "") +
      '" data-page="' +
      (current - 1) +
      '">' +
      PREV_ICON +
      "Geri" +
      "</a>" +
      "<ul>" +
      numbers +
      "</ul>" +
      '<span class="page-info">' +
      current +
      " / " +
      total +
      "</span>" +
      '<a class="button border small next' +
      (current === total ? " disabled" : "") +
      '" data-page="' +
      (current + 1) +
      '">' +
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

  function refresh(scope) {
    (scope || document).querySelectorAll(".custom-table").forEach(function (root) {
      var table = root.customTable;
      if (table && table.list && table.updateColumns()) table.render();
    });
  }

  window.initCustomTables = init;
  window.refreshCustomTables = refresh;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
