// components/alert/alert.js
function alert_default(Alpine) {
  Alpine.data("alert", () => {
    return {
      isVisible: true,
      variant: "info",
      closable: false,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.variant = Alpine.bound(this.$el, "data-variant") ?? this.variant;
          });
          this.closable = Alpine.bound(this.$el, "data-closable") ?? this.closable;
          Alpine.bind(this.$el, {
            ":class"() {
              let classes = this.$el.attributes;
              let c = "";
              if (this.variant === "info") {
                c = classes["class-info"]?.textContent || "";
              } else if (this.variant === "warn") {
                c = classes["class-warn"]?.textContent || "";
              } else if (this.variant === "danger") {
                c = classes["class-danger"]?.textContent || "";
              } else if (this.variant === "success") {
                c = classes["class-success"]?.textContent || "";
              }
              return c;
            }
          });
        });
        Alpine.bind(this.$el, {
          "x-show"() {
            return this.isVisible;
          }
        });
      },
      open() {
        this.isVisible = true;
      },
      close() {
        this.isVisible = false;
      },
      closeButton: {
        "x-show"() {
          return this.closable;
        },
        "@click"() {
          this.close();
        }
      }
    };
  });
}

// components/alert/builds/module.js
var module_default = alert_default;
export {
  module_default as default
};
