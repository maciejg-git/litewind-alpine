let clamp = (v, f, t) => (v < f ? f : v >= t ? t : v);

let getNumberRange = (from, count) => {
  return Array.from({ length: count }, (_, i) => i + from);
}

let isFunction = (f) => typeof f === "function"

document.addEventListener('alpine:init', () => {
  Alpine.data('pagination', (props = {}) => ({
    currentPage: 1,
    itemsCount: 0,
    itemsPerPage: 10,
    maxPages: 7,

    init() {
      Alpine.effect(() => {
        this.itemsCount = isFunction(props.itemsCount) ? props.itemsCount() : props.itemsCount ?? this.itemsCount
      })
      Alpine.effect(() => {
        this.itemsPerPage = isFunction(props.itemsPerPage) ? props.itemsPerPage() : props.itemsPerPage ?? this.itemsPerPage
      })
      Alpine.effect(() => {
        this.maxPages = isFunction(props.maxPages) ? props.maxPages() : props.maxPages ?? this.maxPages
      })
      Alpine.bind(this.$el, {
        ['x-modelable']: 'currentPage',
      })
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
      let pagesCount = this.getPagesCount()
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
      return this.currentPage === this.page
    },
    handleClickPrev() {
      let p = this.currentPage - 1
      this.currentPage = p <= 1 ? 1 : p
    },
    handleClickNext() {
      let p = this.currentPage + 1
      let pagesCount = this.getPagesCount()
      this.currentPage = p >= pagesCount ? pagesCount : p
    },
    handleClickPage() {
      if (this.page === '...') return
      this.currentPage = this.page
    },
    prevButton: {
      ['@click']() {
        this.handleClickPrev()
      }
    },
    nextButton: {
      ['@click']() {
        this.handleClickNext()
      }
    },
    pageButton: {
      ['@click']() {
        this.handleClickPage()
      },
      [':class']() {
        let classes = this.$el.attributes
        let c = ""
        if (this.isSelected()) {
          c = classes['class:selected']?.textContent || ''
        }

        return c
      }
    }
  }))
})
