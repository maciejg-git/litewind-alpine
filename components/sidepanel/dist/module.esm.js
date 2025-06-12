// components/sidepanel/sidepanel.js
function sidepanel_default(Alpine) {
  Alpine.data("sidepanel", () => {
    return {
      isOpen: false,
      // props
      isModal: false,
      _isLeft: false,
      init() {
        this.$nextTick(() => {
          this.isModal = JSON.parse(
            Alpine.bound(this.$el, "data-modal") ?? this.isModal
          );
          this._isLeft = JSON.parse(
            Alpine.bound(this.$el, "data-left") ?? this._isLeft
          );
        });
        Alpine.bind(this.$el, {
          "x-show"() {
            return this.isOpen;
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
        this.isOpen = true;
      },
      close() {
        this.isOpen = false;
      },
      toggle() {
        this.isOpen = !this.open;
      },
      sidepanel: {
        "x-show"() {
          return this.isOpen;
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
          return this.isOpen;
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
