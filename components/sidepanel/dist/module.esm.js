// components/sidepanel/sidepanel.js
function sidepanel_default(Alpine) {
  Alpine.data("sidepanel", (dataExtend = {}) => {
    let bind = {};
    ["backdrop", "sidepanel"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
    return {
      isOpen: false,
      // props
      isModal: false,
      init() {
        this.$nextTick(() => {
          this.isModal = JSON.parse(
            Alpine.bound(this.$el, "data-modal") ?? this.isModal
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
        ...bind.sidepanel
      },
      backdrop: {
        "x-show"() {
          return this.isOpen;
        },
        "@click"() {
          this.close();
        },
        ...bind.backdrop
      }
    };
  });
}

// components/sidepanel/builds/module.js
var module_default = sidepanel_default;
export {
  module_default as default
};
