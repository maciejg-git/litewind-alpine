import modal from "../modal.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(modal)
})
