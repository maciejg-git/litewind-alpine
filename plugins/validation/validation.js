import useValidation from "./use-validation.js"

export default function (Alpine) {
  Alpine.data("form", () => {
    return {
      formName: "",
      inputs: {},

      init() {
        this.formName = Alpine.bound(this.$el, "data-form-name")
      },
      addInput(input) {
        this.inputs[input.name] = input
      }
    }
  })

  Alpine.directive("validation", (el, {value, expression}, {Alpine, effect, evaluate, evaluateLater, cleanup}) => {
    let validateValue = Alpine.$data(el).validateValue

    if (!validateValue) {
      return
    }

    let exp = JSON.parse(expression)
    let inputName = value ?? Alpine.bound(el, "name") ?? ""
    let getValue = evaluateLater(validateValue)

    if (Alpine.$data(el).formName === undefined) {
      return
    }

    Alpine.$data(el).addInput({
      name: inputName,
      status: {},
      messages: {},
      state: "",
    })

    let validation = useValidation({
      ...exp,
      validation: Alpine.$data(el).inputs[inputName]
    })

    let getter = () => {
      let value
      getValue((v) => value = v)
      return value
    }

    validation.updateValue(getter())

    let watchValue = Alpine.watch(getter, (value) => {
      validation.updateValue(value)
    })

    Alpine.addScopeToNode(el, {
      touch: validation.touch,
      validation: Alpine.$data(el).inputs[inputName]
    })

    cleanup(watchValue)
  })

  Alpine.magic("validation", (el, {Alpine}) => ( input ) => {
    return Alpine.$data(el).inputs[input]
  })
}
