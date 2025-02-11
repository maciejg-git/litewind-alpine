import progress from "../progress.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(progress)
})
