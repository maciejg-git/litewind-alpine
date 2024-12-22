document.addEventListener("alpine:init", () => {
  Alpine.data("sidepanel", (props = {}) => {
    return {
      isOpen: false,

      init() {
        Alpine.bind(this.$el, {
          "x-show"() {
            return this.isOpen
          },
          "@open-sidepanel.window"() {
            let id = this.$event.detail.id || this.$event.detail
            if (id === this.$root.id) {
              this.open()
            }
          }
        })
      },
      open() {
        this.isOpen = true
      },
      close() {
        this.isOpen = false
      },
      toggle() {
        this.isOpen = !this.open
      }
    }
  })
})
