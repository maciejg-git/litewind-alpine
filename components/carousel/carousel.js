export default function (Alpine) {
  Alpine.data("carousel", () => {
    return {
      _currentIndex: 0,
      _direction: false,
      _timer: null,
      // props
      _items: [],
      _autoPlay: false,
      _autoPlayDelay: 5000,

      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._items = Alpine.bound(this.$el, "data-items") ?? this._items;
            this._currentIndex = 0;
            if (this._autoPlay) {
              this.stopAutoPlay();
              this.startAutoPlay();
            }
          });
          let autoPlayDelay = Alpine.bound(this.$el, "data-auto-play") ?? false;
          this._autoPlayDelay =
            autoPlayDelay === true
              ? this._autoPlayDelay
              : autoPlayDelay === false
                ? 0
                : parseInt(autoPlayDelay);
          this._autoPlay = !!this._autoPlayDelay;
          if (this._autoPlay) {
            this.startAutoPlay();
          }
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
      startAutoPlay() {
        this._timer = setInterval(() => {
          this.showNext();
        }, this._autoPlayDelay);
      },
      stopAutoPlay() {
        clearInterval(this._timer);
      },
      item: {
        "x-show"() {
          return this.index === this._currentIndex;
        },
        ":data-direction"() {
          return this._direction;
        },
      },
      indicator: {
        "@click"() {
          this.setCurrent();
        },
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.index === this._currentIndex) {
            c = classes["class-current"]?.textContent || "";
          } else {
            c = classes["class-default"]?.textContent || "";
          }

          return c;
        },
      },
    };
  });
}
