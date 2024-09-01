document.addEventListener('alpine:init', () => {
  Alpine.data('input', (defaults = {}) => ({
    _value: '',

    init() {
      Alpine.bind(this.$el, {
        ['x-modelable']: '_value',
      })
    },
    input: {
      ['x-model']: '_value',
    }
  }))
})
