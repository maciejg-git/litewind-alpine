// components/sidepanel/sidepanel.js
function sidepanel_default(Alpine) {
  Alpine.data("sidepanel", () => {
    return {
      _isOpen: false,
      // props
      _isModal: false,
      _isLeft: false,
      init() {
        this.$nextTick(() => {
          this._isModal = JSON.parse(
            Alpine.bound(this.$el, "data-modal") ?? this._isModal
          );
          this._isLeft = JSON.parse(
            Alpine.bound(this.$el, "data-left") ?? this._isLeft
          );
        });
        Alpine.bind(this.$el, {
          "x-show"() {
            return this._isOpen;
          },
          "@open-sidepanel.window"() {
            let id = this.$event.detail.id || this.$event.detail;
            if (id === this.$root.id) {
              this.open();
            }
          }
        });
      },
      open() {
        this._isOpen = true;
      },
      close() {
        this._isOpen = false;
      },
      toggle() {
        this._isOpen = !this.open;
      },
      sidepanel: {
        "x-show"() {
          return this._isOpen;
        },
        ":data-right"() {
          return !this._isLeft;
        },
        ":data-left"() {
          return this._isLeft;
        }
      },
      backdrop: {
        "x-show"() {
          return this._isOpen;
        },
        "@click"() {
          this.close();
        }
      }
    };
  });
}

// components/sidepanel/builds/module.js
var module_default = sidepanel_default;
export {
  module_default as default
};
