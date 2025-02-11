import notify from "../notify.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(notify)
})
