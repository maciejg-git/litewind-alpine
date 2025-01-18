document.addEventListener("alpine:init", () => {
  Alpine.data("collapse", () => {
    return {
      isOpen: false,
      id: null,

      init() {
        this.id = this.$id("collapse")
        if (this.isAccordion) {
          this.$watch("isOpen", () => {
            this.updateAccordion(this)
          })
        }
      },
      open() {
        this.isOpen = true
      },
      close() {
        this.isOpen = false
      },
      toggle() {
        this.isOpen = !this.isOpen
      },
      destroy() {
        if (this.isAccordion) {
          this.removeCollapseFromAccordion(this)
        }
      },
      trigger: {
        "@click"() {
          this.toggle()
        }
      },
      content: {
        "x-show"() {
          return this.isOpen
        },
      }
    }
  })

  Alpine.data("accordion", () => {
    return {
      active: null,
      isAccordion: true,

      updateAccordion(collapse) {
        if (collapse.isOpen) {
          if (this.active) {
            this.active.close()
          }
          this.active = collapse
          return
        }
        if (this.active.id === collapse.id) {
          this.active = null
        }
      },
      removeCollapseFromAccordion(collapse) {
        if (this.active.id === collapse.id) {
          this.active.close()
          this.active = null
        }
      }
    }
  })
})
