(() => {
  // components/carousel/carousel.js
  function carousel_default(Alpine2) {
    Alpine2.data("carousel", () => {
      let _timer = null;
      return {
        _currentIndex: 0,
        _direction: false,
        // props
        _items: [],
        _autoPlay: false,
        _autoPlayDelay: 0,
        _noFirstAndLastButton: false,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this._items = Alpine2.bound(this.$el, "data-items") ?? this._items;
            });
            this._noFirstAndLastButton = JSON.parse(
              Alpine2.bound(this.$el, "data-no-first-and-last-button") ?? this._noFirstAndLastButton
            );
            this._autoPlayDelay = parseInt(
              Alpine2.bound(this.$el, "data-auto-play") ?? 0
            );
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
          this._direction = this._currentIndex < this.index;
          this._currentIndex = this.index;
        },
        startAutoPlay() {
          _timer = setInterval(() => {
            this.showNext();
          }, this._autoPlayDelay);
        },
        stopAutoPlay() {
          clearInterval(_timer);
        },
        restartAutoPlay() {
          this.stopAutoPlay();
          this.startAutoPlay();
        },
        item: {
          "x-show"() {
            return this.index === this._currentIndex;
          },
          ":data-next"() {
            return this._direction;
          },
          ":data-prev"() {
            return !this._direction;
          }
        },
        prevButton: {
          "x-show"() {
            return !this._noFirstAndLastButton || this._currentIndex != 0;
          },
          "@click"() {
            this.showPrev();
            if (this._autoPlay) {
              this.restartAutoPlay();
            }
          }
        },
        nextButton: {
          "x-show"() {
            return !this._noFirstAndLastButton || this._currentIndex != this._items.length - 1;
          },
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
