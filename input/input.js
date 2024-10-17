document.addEventListener("alpine:init", () => {
  Alpine.data("input", (props = {}) => {
    let isFunction = (f) => typeof f === "function";

    return {
      _value: "",
      useLoader: false,
      isLoading: false,
      placeholder: "",
      clearable: false,

      init() {
        Alpine.effect(() => {
          this.placeholder = isFunction(props.placeholder)
            ? props.placeholder()
            : props.placeholder ?? this.placeholder;
        });
        Alpine.effect(() => {
          this.useLoader = isFunction(props.useLoader) ? props.useLoader() : props.useLoader ?? this.useLoader
        })
        Alpine.effect(() => {
          this.isLoading = isFunction(props.isLoading) ? props.isLoading() : props.isLoading ?? this.isLoading
        })
        Alpine.effect(() => {
          this.clearable = isFunction(props.clearable) ? props.clearable() : props.clearable ?? this.clearable
        })
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
      loader: {
        ["x-show"]() {
          return this.useLoader && this.isLoading
        }
      },
      clearButton: {
        ["x-show"]() {
          return this.clearable
        }
      }
    };
  });
});
