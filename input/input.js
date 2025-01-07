document.addEventListener("alpine:init", () => {
  Alpine.data("input", (props = {}, dataExtend = {}) => {
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
        "x-model": "_value",
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
