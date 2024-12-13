document.addEventListener("alpine:init", () => {
  Alpine.data("modal", (props = {}) => {
    let isFunction = (f) => typeof f === "function";

    let aria = {
      content: {
        role: "dialog",
        ["aria-modal"]: "true",
      },
    };

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
      open() {
        document.body.style.overflow = "hidden";
        this.isOpen = true;
      },
      close() {
        document.body.style.overflow = "";
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
        }
      },
      positioner: {},
      content: {
        "x-show"() {
          return this.isOpen;
        },
        "@click.stop"() {},
      },
      backdrop: {
        "x-show"() {
          return this.isOpen;
        },
      },
    };
  });
});
