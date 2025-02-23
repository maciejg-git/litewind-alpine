// components/modal/modal.js
function modal_default(Alpine) {
  Alpine.data("modal", (dataExtend = {}) => {
    let aria = {
      main: {
        role: "dialog",
        "aria-modal": true
      }
    };
    let bind = {};
    ["container", "positioner", "content", "backdrop"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
    return {
      isOpen: false,
      static: false,
      closable: true,
      options: {},
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.static = JSON.parse(
              Alpine.bound(this.$el, "data-static") ?? this.static
            );
          });
          Alpine.effect(() => {
            this.closable = JSON.parse(
              Alpine.bound(this.$el, "data-closable") ?? this.closable
            );
          });
        });
        Alpine.bind(this.$el, aria.main);
      },
      getScrollBarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
      },
      removeScrollbar() {
        let scrollbarWidth = this.getScrollBarWidth();
        if (scrollbarWidth > 0) {
          document.body.style.overflowY = "hidden";
          document.body.style.paddingRight = scrollbarWidth + "px";
        }
      },
      resetScrollbar() {
        document.body.style.overflowY = null;
        document.body.style.paddingRight = null;
      },
      open() {
        this.removeScrollbar();
        this.isOpen = true;
      },
      close() {
        this.resetScrollbar();
        this.isOpen = false;
      },
      closeNotStatic() {
        if (this.static) return;
        this.close();
      },
      container: {
        "x-show"() {
          return this.isOpen;
        },
        "@open-modal.window"() {
          let id = this.$event.detail.id || this.$event.detail;
          if (id === this.$root.id) {
            this.options = this.$event.detail.options || {};
            this.open();
          }
        },
        "@keydown.escape"() {
          if (this.static) return;
          this.close();
        },
        ...bind.container
      },
      positioner: {
        ...bind.positioner
      },
      content: {
        "x-show"() {
          return this.isOpen;
        },
        "@click.stop"() {
        },
        ...bind.content
      },
      backdrop: {
        "x-show"() {
          return this.isOpen;
        },
        ...bind.backdrop
      },
      ...dataExtend
    };
  });
}

// components/modal/builds/module.js
var module_default = modal_default;
export {
  module_default as default
};
