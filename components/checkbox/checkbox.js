export default function (Alpine) {
  Alpine.data("checkbox", () => {
    return {
      _value: false,
      validateValue: "_value",

      init() {
        Alpine.bind(this.$el, {
          "x-modelable": "_value",
        })
      },
      input: {
        ":value"() {
          return this._value
        },
        "@input"() {
          this._value = this.$event.target.checked
        },
        "x-ref": "input",
      }
    }
  })
}
