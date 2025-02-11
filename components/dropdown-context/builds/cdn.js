import dropdownContext from "../dropdown-context.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(dropdownContext)
})
