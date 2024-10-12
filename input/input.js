document.addEventListener("alpine:init", () => {
  Alpine.data("input", (props = {}) => {
    let isFunction = (f) => typeof f === "function";

    return {
      _value: "",
      isLoaderVisible: false,
      isLoading: false,
      placeholder: "",

      init() {
        Alpine.effect(() => {
          this.placeholder = isFunction(props.placeholder)
            ? props.placeholder()
            : props.placeholder ?? this.placeholder;
        });
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_value",
          ["@mousedown.prevent"]() {
            this.$refs.input.focus()
          }
        });
      },
      clear() {
        this._value = "";
      },
      input: {
        ["x-model"]: "_value",
        ["x-ref"]: "input",
        [":placeholder"]() {
          return this.placeholder;
        },
      },
    };
  });
});
