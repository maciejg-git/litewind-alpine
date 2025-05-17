import template from "../template.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(template)
})
