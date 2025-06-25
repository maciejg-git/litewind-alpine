// components/pagination/pagination.js
function pagination_default(Alpine) {
  Alpine.data("pagination", () => {
    let aria = {
      main: {
        "aria-label": "Pagination"
      },
      pageButton: {
        ":aria-current"() {
          return this.isSelected() ? "page" : false;
        }
      },
      prevButton: {
        "aria-label": "Previous"
      },
      nextButton: {
        "aria-label": "Next"
      }
    };
    let clamp = (v, f, t) => v < f ? f : v >= t ? t : v;
    let getNumberRange = (from, count) => {
      return Array.from({ length: count }, (_, i) => i + from);
    };
    return {
      _currentPage: 1,
      // props
      _itemsCount: 0,
      _itemsPerPage: 10,
      _maxPages: 7,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._itemsCount = parseInt(
              Alpine.bound(this.$el, "data-items-count") ?? this._itemsCount
            );
          });
          Alpine.effect(() => {
            this._itemsPerPage = parseInt(
              Alpine.bound(this.$el, "data-items-per-page") ?? this._itemsPerPage
            );
          });
          Alpine.effect(() => {
            this._maxPages = parseInt(
              Alpine.bound(this.$el, "data-max-pages") ?? this._maxPages
            );
          });
        });
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_currentPage"
        });
        Alpine.bind(this.$el, aria.main);
      },
      getPagesCount() {
        if (this._itemsPerPage <= 0 || this._itemsCount <= 0) return 1;
        return Math.ceil(this._itemsCount / this._itemsPerPage);
      },
      getMaxPagesCount() {
        return Math.min(this.getPagesCount(), Math.max(this._maxPages, 3));
      },
      getPages() {
        let maxPages = this.getMaxPagesCount();
        let first = this._currentPage - Math.ceil(maxPages / 2) + 1;
        let pagesCount = this.getPagesCount();
        first = clamp(first, 1, pagesCount - maxPages + 1);
        let p = getNumberRange(first, maxPages);
        if (maxPages >= 5) {
          if (p[0] != 1) {
            p[0] = 1;
            p[1] = "...";
          }
          if (p[p.length - 1] != pagesCount) {
            p[p.length - 1] = pagesCount;
            p[p.length - 2] = "...";
          }
        }
        return p;
      },
      isSelected() {
        return this._currentPage === this.page;
      },
      handleClickPrev() {
        let p = this._currentPage - 1;
        this._currentPage = p <= 1 ? 1 : p;
      },
      handleClickNext() {
        let p = this._currentPage + 1;
        let pagesCount = this.getPagesCount();
        this._currentPage = p >= pagesCount ? pagesCount : p;
      },
      handleClickPage() {
        if (this.page === "...") return;
        this._currentPage = this.page;
      },
      prevButton: {
        "@click"() {
          this.handleClickPrev();
        },
        ...aria.prevButton
      },
      nextButton: {
        "@click"() {
          this.handleClickNext();
        },
        ...aria.nextButton
      },
      pageButton: {
        "@click"() {
          this.handleClickPage();
        },
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.isSelected()) {
            c = classes["class-selected"]?.textContent || "";
          } else {
            c = classes["class-default"]?.textContent || "";
          }
          return c;
        },
        ...aria.pageButton
      }
    };
  });
}

// components/pagination/builds/module.js
var module_default = pagination_default;
export {
  module_default as default
};
