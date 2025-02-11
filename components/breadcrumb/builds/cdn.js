import breadcrumb from "../breadcrumb.js"

document.addEventListener("alpine:init", () => {
  Alpine.plugin(breadcrumb)
})
