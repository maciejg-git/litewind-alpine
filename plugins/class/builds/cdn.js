import classPlugin from "../class-plugin.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(classPlugin)
})
