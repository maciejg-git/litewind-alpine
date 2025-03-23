// components/input/input.js
function input_default(Alpine) {
  Alpine.data("input", (dataExtend = {}) => {
    let bind = {};
    ["input", "loader", "clearButton"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
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
              Alpine.bound(this.$el, "data-clearable") ?? this.clearable
            );
          });
          Alpine.effect(() => {
            this.useLoader = JSON.parse(
              Alpine.bound(this.$el, "data-use-loader") ?? this.useLoader
            );
          });
          Alpine.effect(() => {
            this.isLoading = JSON.parse(
              Alpine.bound(this.$el, "data-is-loading") ?? false
            );
          });
          Alpine.effect(() => {
            this.placeholder = Alpine.bound(this.$el, "data-placeholder") ?? "";
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
        ":value"() {
          return this._value;
        },
        "@input"() {
          this._value = this.$event.target.value;
        },
        "x-ref": "input",
        ":placeholder"() {
          return this.placeholder;
        },
        "@blur"() {
          if (typeof this.touch === "function") this.touch();
        },
        ...bind.input
      },
      loader: {
        "x-show"() {
          return this.useLoader && this.isLoading;
        },
        ...bind.loader
      },
      clearButton: {
        "x-show"() {
          return this.clearable;
        },
        ...bind.clearButton
      },
      ...dataExtend
    };
  });
}

// components/input/builds/module.js
var module_default = input_default;
export {
  module_default as default
};
