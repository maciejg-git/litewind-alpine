import { useFloating } from "../floating.js"

document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, opts = {}) => {
    return {
      isOpen: false, 
      floating: null,
      selectData: [],
      _value: '',

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(this.$refs.trigger, this.$refs.menu, opts)
        })
        this.selectData = [
          "spanish",
          "french",
          "portuguese",
          "german",
          "japanese",
          "korean",
          "italian",
          "polish",
          "greek",
          "swedish",
        ]
      },
      open() {
        this.floating.startAutoUpdate()
        this.isOpen = true
      },
      close() {
        this.floating.destroy()
        this.isOpen = false
      },
      trigger: {
        'x-ref': 'trigger',
        ['@focusin']() {
          this.open()
        },
        ['@focusout']() {
          this.close()
        }
      },
      menu: {
        'x-ref': 'menu',
        ['x-show']() {
          return this.isOpen
        }
      }
    }
  })
})
