import tabs from "../tabs.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(tabs)
})
