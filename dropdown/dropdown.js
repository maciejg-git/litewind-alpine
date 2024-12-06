document.addEventListener("alpine:init", () => {
  Alpine.data("dropdown", (props = {}, opts = {}) => {
    let isFunction = (f) => typeof f === "function";

    return {
      isShow: false,
      floating: null,
      triggerEv: props.triggerEv ?? "click",
      autoClose: props.autoClose ?? true,
      hideTimeout: null,

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(
            this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            opts
          );
        });

        Alpine.bind(this.$el, {
          ["@keydown.escape.prevent"]() {
            this.close();
          },
        });
      },
      scheduleHide() {
        return setTimeout(() => {
          this.floating.destroy();
          this.isShow = false;
        }, 100);
      },
      open() {
        if (this.triggerEv === "hover") {
          clearTimeout(this.hideTimeout);
        }
        this.floating.startAutoUpdate();
        this.isShow = true;
      },
      close() {
        if (!this.isShow) return;
        if (this.triggerEv === "hover") {
          this.hideTimeout = this.scheduleHide();
          return;
        }
        this.floating.destroy();
        this.isShow = false;
      },
      preventHiding() {
        if (this.triggerEv === "hover") {
          clearTimeout(this.hideTimeout);
        }
      },
      allowHiding() {
        if (this.triggerEv === "hover") {
          this.hideTimeout = this.scheduleHide();
        }
      },
      toggle() {
        this.isShow ? this.close() : this.open();
      },
      trigger() {
        let t = {};
        if (this.triggerEv === "click") {
          t["@click"] = function () {
            this.toggle();
          };
        }
        if (this.triggerEv === "hover") {
          t["@mouseenter"] = function () {
            this.open();
          };
          t["@mouseleave"] = function () {
            this.close();
          };
        }
        return {
          ...t,
          "x-ref": "trigger",
        };
      },
      menu: {
        "x-show"() {
          return this.isShow;
        },
        "x-ref": "menu",
        "@mouseenter"() {
          this.preventHiding();
        },
        "@mouseleave"() {
          this.allowHiding();
        },
        "@click.outside"() {
          this.close();
        },
        "@click"() {
          if (this.autoClose && this.$el.contains(this.$event.target)) {
            this.close()
          }
        }
      },
    };
  });
});
