(() => {
  // components/input/input.js
  function input_default(Alpine2) {
    Alpine2.data("input", () => {
      return {
        _value: "",
        validateValue: "_value",
        // props
        useLoader: false,
        isLoading: false,
        placeholder: "",
        clearable: false,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.clearable = JSON.parse(
                Alpine2.bound(this.$el, "data-clearable") ?? this.clearable
              );
            });
            Alpine2.effect(() => {
              this.useLoader = JSON.parse(
                Alpine2.bound(this.$el, "data-use-loader") ?? this.useLoader
              );
            });
            Alpine2.effect(() => {
              this.isLoading = JSON.parse(
                Alpine2.bound(this.$el, "data-is-loading") ?? false
              );
            });
            Alpine2.effect(() => {
              this.placeholder = Alpine2.bound(this.$el, "data-placeholder") ?? "";
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
            ["@mousedown"]() {
              this.$refs.input.focus();
              if (this.$event.target !== this.$refs.input) {
                this.$event.preventDefault();
              }
            }
          });
        },
        clear() {
          this._value = "";
        },
        input: {
          // the _externalValue allows components that use input to update its value
          ":value"() {
            return this._externalValue ?? this._value;
          },
          // the update:value events allows updating _externalValue in the components
          // that use input
          "@input"() {
            this._value = this.$event.target.value;
            this.$dispatch("update:value", this._value);
          },
          "x-ref": "input",
          ":placeholder"() {
            return this.placeholder;
          },
          "@blur"() {
            if (typeof this.touch === "function") this.touch();
          }
        },
        loader: {
          "x-show"() {
            return this.useLoader && this.isLoading;
          }
        },
        clearButton: {
          "x-show"() {
            return this.clearable;
          }
        }
      };
    });
  }

  // components/input/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(input_default);
  });
})();
