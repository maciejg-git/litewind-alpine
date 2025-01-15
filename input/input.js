document.addEventListener("alpine:init", () => {
  Alpine.data("input", (dataExtend = {}) => {
    let isFunction = (f) => typeof f === "function";

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
          ["@mousedown.prevent"]() {
            this.$refs.input.focus();
          },
        });
        Alpine.effect(() => {
          if (this._value.length) this.isDirty = true;
        });
      },
      clear() {
        this._value = "";
      },
      input: {
        ":value"() {
          return this._value
        },
        "@input"() {
          this._value = this.$event.target.value
        },
        "x-ref": "input",
        ":placeholder"() {
          return this.placeholder;
        },
        "@focus"() {
          this.isTouched = true;
        },
        "@blur"() {
          if (isFunction(this.touch)) this.touch();
        },
        ...bind.input,
      },
      loader: {
        "x-show"() {
          return this.useLoader && this.isLoading;
        },
        ...bind.loader,
      },
      clearButton: {
        "x-show"() {
          return this.clearable;
        },
        ...bind.clearButton,
      },
      ...dataExtend,
    };
  });
});
