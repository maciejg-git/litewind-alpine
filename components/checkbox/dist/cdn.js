(() => {
  // components/checkbox/checkbox.js
  function checkbox_default(Alpine2) {
    Alpine2.data("checkbox", () => {
      return {
        _value: false,
        validateValue: "_value",
        init() {
          Alpine2.bind(this.$el, {
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

  // components/checkbox/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(checkbox_default);
  });
})();
