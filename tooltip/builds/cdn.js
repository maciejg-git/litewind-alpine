import tooltip from "../tooltip.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(tooltip)
})
