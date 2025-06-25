// components/modal/modal.js
function modal_default(Alpine) {
  Alpine.data("modal", () => {
    let aria = {
      main: {
        role: "dialog",
        "aria-modal": true
      }
    };
    return {
      _isOpen: false,
      options: {},
      // props
      _static: false,
      _closable: true,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._static = JSON.parse(
              Alpine.bound(this.$el, "data-static") ?? this._static
            );
          });
          Alpine.effect(() => {
            this._closable = JSON.parse(
              Alpine.bound(this.$el, "data-closable") ?? this._closable
            );
          });
        });
        Alpine.bind(this.$el, aria.main);
      },
      // following functions remove scrollbar from the body when the modal is open
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
        this._isOpen = true;
      },
      close() {
        this.resetScrollbar();
        this._isOpen = false;
      },
      closeNotStatic() {
        if (this._static) return;
        this.close();
      },
      container: {
        "x-show"() {
          return this._isOpen;
        },
        "@open-modal.window"() {
          let id = this.$event.detail.id || this.$event.detail;
          if (id === this.$root.id) {
            this.options = this.$event.detail.options || {};
            this.open();
          }
        },
        "@keydown.escape"() {
          if (this._static) return;
          this.close();
        }
      },
      positioner: {},
      content: {
        "x-show"() {
          return this._isOpen;
        },
        "@click.stop"() {
        }
      },
      backdrop: {
        "x-show"() {
          return this._isOpen;
        }
      }
    };
  });
}

// components/modal/builds/module.js
var module_default = modal_default;
export {
  module_default as default
};
