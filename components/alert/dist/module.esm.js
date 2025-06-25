// components/alert/alert.js
function alert_default(Alpine) {
  Alpine.data("alert", () => {
    let aria = {
      main: {
        ":role"() {
          return this._role;
        }
      }
    };
    return {
      _isVisible: true,
      // props
      _variant: "info",
      _closable: false,
      _role: "status",
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._variant = Alpine.bound(this.$el, "data-variant") ?? this._variant;
          });
          this._closable = JSON.parse(
            Alpine.bound(this.$el, "data-closable") ?? this._closable
          );
          this._role = Alpine.bound(this.$el, "data-role") ?? this._role;
          Alpine.bind(this.$el, {
            ":class"() {
              let classes = this.$el.attributes;
              let c = "";
              if (this._variant === "info") {
                c = classes["class-info"]?.textContent || "";
              } else if (this._variant === "warn") {
                c = classes["class-warn"]?.textContent || "";
              } else if (this._variant === "danger") {
                c = classes["class-danger"]?.textContent || "";
              } else if (this._variant === "success") {
                c = classes["class-success"]?.textContent || "";
              }
              return c;
            }
          });
        });
        Alpine.bind(this.$el, {
          "x-show"() {
            return this._isVisible;
          }
        });
        Alpine.bind(this.$el, aria.main);
      },
      open() {
        this._isVisible = true;
      },
      close() {
        this._isVisible = false;
      },
      closeButton: {
        "x-show"() {
          return this._closable;
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
