export default function (Alpine) {
  Alpine.data("formText", () => {
    let aria = {
      message: {
        role: "alert",
        "aria-live": "polite",
      }
    }

    return {
      input: "",
      validation: null,
      form: "default",

      init() {
        this.$nextTick(() => {
          this.input = Alpine.bound(this.$el, "data-input") ?? this.input;
          this.form = Alpine.$data(this.$el).formName ?? this.form
          Alpine.effect(() => {
            this.validation = this.inputs?.[this.input] ?? null
          })
        });
      },
      getMessages() {
        if (!this.validation) {
          return {}
        }
        if (this.validation?.state === "invalid") {
          if (this.validation.messages.required) {
            return { required: this.validation.messages.required };
          }
          return this.validation.messages;
        }
      },
      message: {
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.validation.state === "valid") {
            c = classes["class-valid"]?.textContent || "";
          } else if (this.validation.state === "invalid") {
            c = classes["class-invalid"]?.textContent || "";
          }

          return c;
        },
        ...aria.message,
      },
    };
  });
}  
