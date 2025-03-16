export default function (Alpine) {
  Alpine.data("alert", () => {
    let aria = {
      main: {
        ":role"() {
          return this.role
        }
      }
    }

    return {
      isVisible: true,
      // props
      variant: "info",
      closable: false,
      role: "status",

      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.variant =
              Alpine.bound(this.$el, "data-variant") ?? this.variant;
          });
          this.closable = JSON.parse(
            Alpine.bound(this.$el, "data-closable") ?? this.closable
          )
          this.role = Alpine.bound(this.$el, "data-role") ?? this.role

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
            },
          });
        });
        Alpine.bind(this.$el, {
          "x-show"() {
            return this.isVisible;
          },
        });
        Alpine.bind(this.$el, aria.main)
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
        },
      },
    };
  });
}
