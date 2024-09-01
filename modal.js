document.addEventListener('alpine:init', () => {
  Alpine.data('modal', (defaults = {}) => ({
    isOpen: false,
    props: {
      isStatic: defaults.static ?? false,
    },

    open() {
      document.body.style.overflow = 'hidden'
      this.isOpen = true
    },
    close() {
      document.body.style.overflow = ''
      this.isOpen = false
    },
    container: {
      ['x-show']() {
        return this.isOpen
      },
      ['@open-modal.window']() {
        let id = this.$event.detail.id || this.$event.detail
        if (id === this.$root.id) {
          this.open()
        }
      },
      ['@click']() {
        if (this.props.isStatic) return
        this.close()
      }
    },
    content: {
      ['x-show']() {
        return this.isOpen
      },
      ['@click.stop']() {}
    },
    backdrop: {
      ['x-show']() {
        return this.isOpen
      },
    }
  }))
})
