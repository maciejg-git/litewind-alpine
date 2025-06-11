export default function (Alpine) {
  Alpine.data("carousel", () => {
    return {
      _items: [],
      _currentIndex: 0,
      init() {
        this.$nextTick(() => {
          this._items = Alpine.bound(this.$el, "data-items") ?? this._items
        })
      },
      getItems() {
        return this._items
      },
      showNext() {
        this._currentIndex++
        if (this._currentIndex >= this._items.length) {
          this._currentIndex = 0
        }
      },
      showPrev() {
        this._currentIndex--
        if (this._currentIndex < 0) {
          this._currentIndex = this._items.length - 1
        }
      },
      setCurrent() {
        this._currentIndex = this.index
      },
      item: {
        "x-show"() {
          return this.index === this._currentIndex
        }
      }
    }
  })
}
