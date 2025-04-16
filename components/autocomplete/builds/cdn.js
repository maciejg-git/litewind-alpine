import autocomplete from "../autocomplete.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(autocomplete)
})
