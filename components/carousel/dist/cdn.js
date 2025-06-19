(() => {
  // components/carousel/carousel.js
  function carousel_default(Alpine2) {
    Alpine2.data("carousel", () => {
      return {
        _currentIndex: 0,
        _direction: false,
        _timer: null,
        // props
        _items: [],
        _autoPlay: false,
        _autoPlayDelay: 5e3,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this._items = Alpine2.bound(this.$el, "data-items") ?? this._items;
            });
            let autoPlayDelay = Alpine2.bound(this.$el, "data-auto-play") ?? false;
            this._autoPlayDelay = autoPlayDelay === true ? this._autoPlayDelay : autoPlayDelay === false ? 0 : parseInt(autoPlayDelay);
            this._autoPlay = !!this._autoPlayDelay;
            if (this._autoPlay) {
              this.startAutoPlay();
            }
            this.$watch("_items", () => {
              this._currentIndex = 0;
              if (this._autoPlay) {
                this.restartAutoPlay();
              }
            });
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
        restartAutoPlay() {
          this.stopAutoPlay();
          this.startAutoPlay();
        },
        item: {
          "x-show"() {
            return this.index === this._currentIndex;
          },
          ":data-direction"() {
            return this._direction;
          }
        },
        prevButton: {
          "@click"() {
            this.showPrev();
            if (this._autoPlay) {
              this.restartAutoPlay();
            }
          }
        },
        nextButton: {
          "@click"() {
            this.showNext();
            if (this._autoPlay) {
              this.restartAutoPlay();
            }
          }
        },
        indicator: {
          "@click"() {
            let currentIndex = this._currentIndex;
            this.setCurrent();
            if (currentIndex !== this._currentIndex && this._autoPlay) {
              this.restartAutoPlay();
            }
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
          }
        }
      };
    });
  }

  // components/carousel/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(carousel_default);
  });
})();
