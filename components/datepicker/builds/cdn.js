import datepicker from "../datepicker.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(datepicker)
})
