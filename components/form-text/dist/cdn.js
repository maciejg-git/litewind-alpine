(() => {
  // ../form-text.js
  function form_text_default(Alpine2) {
    Alpine2.data("formText", () => {
      let aria = {
        message: {
          role: "alert",
          "aria-live": "polite"
        }
      };
      return {
        input: "",
        validation: null,
        form: "default",
        init() {
          this.$nextTick(() => {
            this.input = Alpine2.bound(this.$el, "data-input") ?? this.input;
            this.form = Alpine2.$data(this.$el).formName ?? this.form;
            this.validation = Alpine2.store("validation")[this.form][this.input];
          });
        },
        getMessages() {
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
          ...aria.message
        }
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(form_text_default);
  });
})();
