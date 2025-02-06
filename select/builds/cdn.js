import select from "../select.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(select)
})
