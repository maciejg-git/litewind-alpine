(() => {
  // components/alert/alert.js
  function alert_default(Alpine2) {
    Alpine2.data("alert", () => {
      return {
        isVisible: true,
        variant: "info",
        closable: false,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.variant = Alpine2.bound(this.$el, "data-variant") ?? this.variant;
            });
            this.closable = Alpine2.bound(this.$el, "data-closable") ?? this.closable;
            Alpine2.bind(this.$el, {
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
          Alpine2.bind(this.$el, {
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

  // components/alert/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(alert_default);
  });
})();
