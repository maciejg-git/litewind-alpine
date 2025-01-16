document.addEventListener("alpine:init", () => {
  Alpine.data("collapse", () => {
    return {
      isOpen: false,

      trigger: {
        "@click"() {
          this.isOpen = !this.isOpen
        }
      },
      content: {
        "x-show"() {
          return this.isOpen
        },
      }
    }
  })
})
