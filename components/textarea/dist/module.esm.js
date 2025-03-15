// components/textarea/textarea.js
function textarea_default(Alpine) {
  Alpine.data("textarea", () => {
    return {
      _value: "",
      validateValue: "_value",
      // props
      placeholder: "",
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.placeholder = Alpine.bound(this.$el, "data-placeholder") ?? this.placeholder;
          });
          Alpine.bind(this.$el, {
            ":class"() {
              let classes = this.$el.attributes;
              let c = "";
              if (this.validation?.state === "valid") {
                c = classes["class-valid"]?.textContent || "";
              } else if (this.validation?.state === "invalid") {
                c = classes["class-invalid"]?.textContent || "";
              } else {
                c = classes["class-default"]?.textContent || "";
              }
              return c;
            }
          });
        });
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_value",
          ["@mousedown.prevent"]() {
            this.$refs.textarea.focus();
          }
        });
      },
      textarea: {
        ":value"() {
          return this._value;
        },
        "@input"() {
          this._value = this.$event.target.value;
        },
        "x-ref": "textarea",
        ":placeholder"() {
          return this.placeholder;
        },
        "@blur"() {
          if (typeof this.touch === "function") this.touch();
        }
      }
    };
  });
}

// components/textarea/builds/module.js
var module_default = textarea_default;
export {
  module_default as default
};
