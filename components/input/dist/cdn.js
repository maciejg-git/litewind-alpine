(() => {
  // ../input.js
  function input_default(Alpine2) {
    Alpine2.data("input", (dataExtend = {}) => {
      let bind = {};
      ["input", "loader", "clearButton"].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        _value: "",
        useLoader: false,
        isLoading: false,
        placeholder: "",
        clearable: false,
        isDirty: false,
        isTouched: false,
        validateValue: "_value",
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
            ["@mousedown.prevent"]() {
              this.$refs.input.focus();
            }
          });
          Alpine2.effect(() => {
            if (this._value.length) this.isDirty = true;
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
          "@focus"() {
            this.isTouched = true;
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

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(input_default);
  });
})();
