(() => {
  // components/pagination/pagination.js
  function pagination_default(Alpine2) {
    Alpine2.data("pagination", (dataExtend = {}) => {
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
      let bind = {};
      ["prevButton", "nextButton", "pageButton"].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        currentPage: 1,
        itemsCount: 0,
        itemsPerPage: 10,
        maxPages: 7,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.itemsCount = parseInt(
                Alpine2.bound(this.$el, "data-items-count") ?? this.itemsCount
              );
            });
            Alpine2.effect(() => {
              this.itemsPerPage = parseInt(
                Alpine2.bound(this.$el, "data-items-per-page") ?? this.itemsPerPage
              );
            });
            Alpine2.effect(() => {
              this.maxPages = parseInt(
                Alpine2.bound(this.$el, "data-max-pages") ?? this.maxPages
              );
            });
          });
          Alpine2.bind(this.$el, {
            ["x-modelable"]: "currentPage"
          });
          Alpine2.bind(this.$el, aria.main);
        },
        getPagesCount() {
          if (this.itemsPerPage <= 0 || this.itemsCount <= 0) return 1;
          return Math.ceil(this.itemsCount / this.itemsPerPage);
        },
        getMaxPagesCount() {
          return Math.min(this.getPagesCount(), Math.max(this.maxPages, 3));
        },
        getPages() {
          let maxPages = this.getMaxPagesCount();
          let first = this.currentPage - Math.ceil(maxPages / 2) + 1;
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
          return this.currentPage === this.page;
        },
        handleClickPrev() {
          let p = this.currentPage - 1;
          this.currentPage = p <= 1 ? 1 : p;
        },
        handleClickNext() {
          let p = this.currentPage + 1;
          let pagesCount = this.getPagesCount();
          this.currentPage = p >= pagesCount ? pagesCount : p;
        },
        handleClickPage() {
          if (this.page === "...") return;
          this.currentPage = this.page;
        },
        prevButton: {
          "@click"() {
            this.handleClickPrev();
          },
          ...bind.prevButton,
          ...aria.prevButton
        },
        nextButton: {
          "@click"() {
            this.handleClickNext();
          },
          ...bind.nextButton,
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
          ...bind.pageButton,
          ...aria.pageButton
        },
        ...dataExtend
      };
    });
  }

  // components/pagination/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(pagination_default);
  });
})();
