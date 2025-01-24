document.addEventListener("alpine:init", () => {
  Alpine.data("sidepanel", (dataExtend = {}) => {
    let bind = {};
    [].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i]
        delete dataExtend[i]
      }
    })

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
      },
      sidepanel: {
        "x-show"() {
          return this.isOpen
        }
      },
      backdrop: {
        "x-show"() {
          return this.isOpen
        },
        "@click"() {
          this.close()
        }
      }
    }
  })
})
