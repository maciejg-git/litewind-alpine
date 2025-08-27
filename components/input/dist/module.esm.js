// components/input/input.js
function input_default(Alpine) {
  Alpine.data("input", () => {
    return {
      _value: "",
      validateValue: "_value",
      // props
      _useLoader: false,
      _isLoading: false,
      _placeholder: "",
      _clearable: false,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._clearable = JSON.parse(
              Alpine.bound(this.$el, "data-clearable") ?? this._clearable
            );
          });
          Alpine.effect(() => {
            this._useLoader = JSON.parse(
              Alpine.bound(this.$el, "data-use-loader") ?? this._useLoader
            );
          });
          Alpine.effect(() => {
            this._isLoading = JSON.parse(
              Alpine.bound(this.$el, "data-is-loading") ?? false
            );
          });
          Alpine.effect(() => {
            this._placeholder = Alpine.bound(this.$el, "data-placeholder") ?? "";
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
        // the _externalValue allows components that use input component to update its value
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
          return this._placeholder;
        },
        "@blur"() {
          if (typeof this.touch === "function") this.touch();
        }
      },
      loader: {
        "x-show"() {
          return this._useLoader && this._isLoading;
        }
      },
      clearButton: {
        "x-show"() {
          return this._clearable;
        }
      }
    };
  });
}

// components/input/builds/module.js
var module_default = input_default;
export {
  module_default as default
};
