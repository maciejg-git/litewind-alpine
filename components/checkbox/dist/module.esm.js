// components/checkbox/checkbox.js
function checkbox_default(Alpine) {
  Alpine.data("checkbox", () => {
    return {
      _value: false,
      validateValue: "_value",
      init() {
        Alpine.bind(this.$el, {
          "x-modelable": "_value"
        });
      },
      input: {
        ":value"() {
          return this._value;
        },
        "@input"() {
          this._value = this.$event.target.checked;
        },
        "x-ref": "input"
      }
    };
  });
}

// components/checkbox/builds/module.js
var module_default = checkbox_default;
export {
  module_default as default
};
