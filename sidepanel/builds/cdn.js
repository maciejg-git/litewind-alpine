import sidepanel from "../sidepanel.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(sidepanel)
})
