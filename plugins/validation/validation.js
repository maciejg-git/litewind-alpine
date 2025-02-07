import useValidation from "./use-validation.js"

export default function (Alpine) {
  Alpine.store("validation", {
    default: {}
  })

  Alpine.data("form", () => {
    return {
      formName: "",

      init() {
        this.formName = Alpine.bound(this.$el, "data-form-name")
        Alpine.store("validation")[this.formName] = {}
      }
    }
  })

  Alpine.directive("validation", (el, {value, expression}, {Alpine, effect, evaluate, evaluateLater, cleanup}) => {
    let exp = JSON.parse(expression)
    let inputName = value ?? Alpine.bound(el, "name") ?? ""
    let formName = Alpine.$data(el).formName ?? "default"
    let validateValue = Alpine.$data(el).validateValue
    let getValue = evaluateLater(validateValue)

    Alpine.store("validation")[formName][inputName] = {
      status: {},
      messages: {},
      state: "",
    }

    let validation = useValidation({
      ...exp,
      validation: Alpine.store("validation")[formName][inputName]
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
      validation: Alpine.store("validation")[formName][inputName]
    })

    cleanup(watchValue)
  })

  Alpine.magic("validation", (el, {Alpine}) => ( form, input ) => {
    return Alpine.store("validation")[form][input]
  })
}
