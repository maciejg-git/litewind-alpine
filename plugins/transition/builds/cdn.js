import transition from "../transition.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(transition)
})
