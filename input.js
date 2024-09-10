let isFunction = (f) => typeof f === "function"

document.addEventListener('alpine:init', () => {
  Alpine.data('input', (props = {}) => ({
    _value: '',
    isLoaderVisible: false,
    isLoading: false,
    placeholder: '',

    init() {
      Alpine.effect(() => {
        this.placeholder = isFunction(props.placeholder) ? props.placeholder() : props.placeholder ?? this.placeholder
      })
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
