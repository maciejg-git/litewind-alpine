(() => {
  // components/textarea/textarea.js
  function textarea_default(Alpine2) {
    Alpine2.data("textarea", () => {
      return {
        _value: "",
        validateValue: "_value",
        // props
        placeholder: "",
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.placeholder = Alpine2.bound(this.$el, "data-placeholder") ?? this.placeholder;
            });
            Alpine2.bind(this.$el, {
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
          Alpine2.bind(this.$el, {
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

  // components/textarea/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(textarea_default);
  });
})();
