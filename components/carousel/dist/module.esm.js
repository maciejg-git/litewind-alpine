// components/carousel/carousel.js
function carousel_default(Alpine) {
  Alpine.data("carousel", () => {
    return {
      _items: [],
      _currentIndex: 0,
      _direction: false,
      init() {
        this.$nextTick(() => {
          this._items = Alpine.bound(this.$el, "data-items") ?? this._items;
        });
      },
      getItems() {
        return this._items;
      },
      showNext() {
        this._currentIndex++;
        if (this._currentIndex >= this._items.length) {
          this._currentIndex = 0;
        }
        this._direction = true;
      },
      showPrev() {
        this._currentIndex--;
        if (this._currentIndex < 0) {
          this._currentIndex = this._items.length - 1;
        }
        this._direction = false;
      },
      setCurrent() {
        this._currentIndex = this.index;
      },
      item: {
        "x-show"() {
          return this.index === this._currentIndex;
        },
        ":data-direction"() {
          return this._direction;
        }
      },
      indicator: {
        "@click"() {
          this.setCurrent();
        }
      }
    };
  });
}

// components/carousel/builds/module.js
var module_default = carousel_default;
export {
  module_default as default
};
