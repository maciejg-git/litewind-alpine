import useValidation from "./use-validation.js";

export default function (Alpine) {
  Alpine.data("form", () => {
    return {
      formName: "",
      inputs: {},
      valid: false,

      init() {
        this.formName = Alpine.bound(this.$el, "data-form-name");
      },
      addInput(input) {
        this.inputs[input.name] = input;
      },
      removeInput(input) {
        delete this.inputs[input];
      },
      validateForm() {
        this.valid = true;

        for (let input in this.inputs) {
          this.inputs[input].formValidate();
          let { status } = this.inputs[input];
          this.valid = this.valid && (status.valid || status.optional);
        }
      },
    };
  });

  Alpine.directive(
    "validation",
    (el, { value, expression }, { Alpine, evaluateLater, cleanup }) => {
      let validateValue = Alpine.$data(el).validateValue;

      if (!validateValue) {
        return;
      }

      let exp = JSON.parse(expression);
      let inputName = value ?? Alpine.bound(el, "name") ?? "";
      let getValue = evaluateLater(validateValue);

      if (Alpine.$data(el).formName === undefined) {
        return;
      }

      let validation = useValidation(
        {
          ...exp,
        },
        (res) => {
          Alpine.$data(el).inputs[inputName].status = res.status;
          Alpine.$data(el).inputs[inputName].messages = res.messages;
          Alpine.$data(el).inputs[inputName].state = res.state;
        },
      );

      Alpine.$data(el).addInput({
        name: inputName,
        status: {},
        messages: {},
        state: "",
        formValidate: validation.formValidate,
        reset: validation.reset,
      });

      let getter = () => {
        let value;
        getValue((v) => (value = v));
        return value;
      };

      // initial update of the validation
      validation.updateValue(getter());

      // update validation on each value update
      let watchValue = Alpine.watch(getter, (value) => {
        validation.updateValue(value);
      });

      Alpine.addScopeToNode(el, {
        touch: validation.touch,
        reset: validation.reset,
        validation: Alpine.$data(el).inputs[inputName],
      });

      cleanup(watchValue);
      cleanup(() => Alpine.$data(el).removeInput(inputName));
    },
  );

  Alpine.magic("validation", (el, { Alpine }) => (input) => {
    return Alpine.$data(el).inputs[input];
  });
}
