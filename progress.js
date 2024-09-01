document.addEventListener('alpine:init', () => {
  Alpine.data('progress', (defaults = {}) => ({
    value: 0,

    init() {
      Alpine.bind(this.$el, {
        ['x-modelable']: 'value'
      })
    },
    progressBar: {
      [':style']() {
        return `width: ${this.value}%`
      }
    }
  }))
})
