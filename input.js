document.addEventListener('alpine:init', () => {
  Alpine.data('input', (defaults = {}) => ({
    _value: '',
    isLoaderVisible: false,
    isLoading: false,
    placeholder: defaults.placeholder ?? '',

    init() {
      Alpine.bind(this.$el, {
        ['x-modelable']: '_value',
      })
    },
    clear() {
      this._value = ''
    },
    input: {
      ['x-model']: '_value',
      [':placeholder']() {
        return this.placeholder
      }
    },
  }))
})
