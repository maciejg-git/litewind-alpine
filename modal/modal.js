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
      isStatic: false,

      init() {
        Alpine.effect(() => {
          this.isStatic = isFunction(props.isStatic)
            ? props.isStatic()
            : props.isStatic ?? this.isStatic;
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
        ["x-show"]() {
          return this.isOpen;
        },
        ["@open-modal.window"]() {
          let id = this.$event.detail.id || this.$event.detail;
          if (id === this.$root.id) {
            this.open();
          }
        },
        ["@click"]() {
          if (this.isStatic) return;
          this.close();
        },
      },
      content: {
        ["x-show"]() {
          return this.isOpen;
        },
        ["@click.stop"]() {},
      },
      backdrop: {
        ["x-show"]() {
          return this.isOpen;
        },
      },
    };
  });
});
