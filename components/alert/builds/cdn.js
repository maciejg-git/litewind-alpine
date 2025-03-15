import alert from "../alert.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(alert)
})
