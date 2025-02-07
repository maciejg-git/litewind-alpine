import validation from "../validation.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(validation)
})
