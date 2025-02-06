(() => {
  // ../modal.js
  function modal_default(Alpine2) {
    Alpine2.data("modal", (dataExtend = {}) => {
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
            Alpine2.effect(() => {
              this.static = JSON.parse(
                Alpine2.bound(this.$el, "data-static") ?? this.static
              );
            });
            Alpine2.effect(() => {
              this.closable = JSON.parse(
                Alpine2.bound(this.$el, "data-closable") ?? this.closable
              );
            });
          });
          Alpine2.bind(this.$el, aria.main);
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

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(modal_default);
  });
})();
