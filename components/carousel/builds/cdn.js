import carousel from "../carousel.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(carousel)
})
