document.addEventListener("alpine:init", () => {
  Alpine.data("modal", (props = {}, dataExtend = {} ) => {
    let isFunction = (f) => typeof f === "function";

    let aria = {
      content: {
        role: "dialog",
        ["aria-modal"]: "true",
      },
    };

    let bind = {};
    ["container", "positioner", "content", "backdrop"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i]
        delete dataExtend[i]
      }
    })

    return {
      isOpen: false,
      static: false,
      closable: true,
      options: {},

      init() {
        Alpine.effect(() => {
          this.static = isFunction(props.static)
            ? props.static()
            : props.static ?? this.static;
        });
        Alpine.effect(() => {
          this.closable = isFunction(props.closable)
            ? props.closable()
            : props.closable ?? this.closable;
        });
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
        this.removeScrollbar()
        this.isOpen = true;
      },
      close() {
        this.resetScrollbar()
        this.isOpen = false;
      },
      container: {
        "x-show"() {
          return this.isOpen;
        },
        "@open-modal.window"() {
          let id = this.$event.detail.id || this.$event.detail;
          if (id === this.$root.id) {
            this.options = this.$event.detail.options || {}
            this.open();
          }
        },
        "@click"() {
          if (this.static) return;
          this.close();
        },
        "@keydown.escape"() {
          if (this.static) return
          this.close()
        },
        ...bind.container,
      },
      positioner: {
        ...bind.positioner,
      },
      content: {
        "x-show"() {
          return this.isOpen;
        },
        "@click.stop"() {},
        ...bind.content,
      },
      backdrop: {
        "x-show"() {
          return this.isOpen;
        },
        ...bind.backdrop,
      },
      ...dataExtend,
    };
  });
});
