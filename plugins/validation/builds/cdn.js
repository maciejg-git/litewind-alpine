import validation from "../validation.js"
import { validationMessages, globalValidators } from "../validators.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(validation)
  if (!window.Litewind) {
    window.Litewind = {}
  }
  window.Litewind.validationMessages = validationMessages
  window.Litewind.globalValidators = globalValidators
})
