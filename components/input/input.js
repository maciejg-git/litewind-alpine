export default function (Alpine) {
  Alpine.data("input", () => {
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
          Alpine.effect(() => {
            this.clearable = JSON.parse(
              Alpine.bound(this.$el, "data-clearable") ?? this.clearable,
            );
          });
          Alpine.effect(() => {
            this.useLoader = JSON.parse(
              Alpine.bound(this.$el, "data-use-loader") ?? this.useLoader,
            );
          });
          Alpine.effect(() => {
            this.isLoading = JSON.parse(
              Alpine.bound(this.$el, "data-is-loading") ?? false,
            );
          });
          Alpine.effect(() => {
            this.placeholder = Alpine.bound(this.$el, "data-placeholder") ?? "";
          });

          Alpine.bind(this.$el, {
            ":class"() {
              let classes = this.$el.attributes
              let c = ""
              if (this.validation?.state === "valid") {
                c = classes["class-valid"]?.textContent || ""
              } else if (this.validation?.state === "invalid") {
                c = classes["class-invalid"]?.textContent || ""
              } else {
                c = classes["class-default"]?.textContent || ""
              }

              return c
            }
          })
        });
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_value",
          ["@mousedown"]() {
            // click on elements inside wrapper (slots, icon, clear button) should focus input element
            this.$refs.input.focus();
            // prevent default on elements inside wrapper because mouse down on them will
            // focus out input element. Do not prevent default for input element to allow text selection.
            if (this.$event.target !== this.$refs.input) {
              this.$event.preventDefault()
            }
          },
        });
      },
      clear() {
        this._value = "";
      },
      input: {
        // the _externalValue allows components that use input to update its value
        ":value"() {
          return this._externalValue ?? this._value
        },
        // the update:value events allows updating _externalValue in the components
        // that use input
        "@input"() {
          this._value = this.$event.target.value
          this.$dispatch("update:value", this._value)
        },
        "x-ref": "input",
        ":placeholder"() {
          return this.placeholder;
        },
        "@blur"() {
          if (typeof this.touch === "function") this.touch();
        },
      },
      loader: {
        "x-show"() {
          return this.useLoader && this.isLoading;
        },
      },
      clearButton: {
        "x-show"() {
          return this.clearable;
        },
      },
    };
  });
}
