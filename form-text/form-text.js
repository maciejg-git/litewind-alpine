document.addEventListener("alpine:init", () => {
  Alpine.data("formText", () => {
    return {
      input: "",
      validation: null,

      init() {
        this.$nextTick(() => {
          this.input = Alpine.bound(this.$el, "data-input") ?? this.input
          this.validation = Alpine.store("validation").inputs[this.input]
        })
      },
      getMessages() {
        if (this.validation?.state === "invalid") {
          if (this.validation.messages.required) {
            return { required: this.validation.messages.required }
          }
          return this.validation.messages
        }
      },
      message: {
        ":class"() {
          let classes = this.$el.attributes
          let c = ""
          if (this.validation.state === "valid") {
            c = classes["class-valid"]?.textContent || ""
          } else if (this.validation.state === "invalid") {
            c = classes["class-invalid"]?.textContent || ""
          }

          return c
        }
      }
    }
  })
})
