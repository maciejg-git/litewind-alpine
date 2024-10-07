import { useFloating } from "../floating.js"

document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, opts = {}) => {
    return {
      isOpen: false, 
      floating: null,
      selectData: [],
      _value: '',
      selected: [],

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(this.$refs.trigger, this.$refs.menu, { ...opts, resize: true })
        })
      },
      open() {
        this.floating.startAutoUpdate()
        this.isOpen = true
      },
      close() {
        this.floating.destroy()
        this.isOpen = false
      },
      select(value) {
        this.selected[0] = value
      },
      trigger: {
        'x-ref': 'trigger',
        ['@focusin']() {
          this.open()
        },
        ['@focusout']() {
          if (this.$refs.menu.contains(this.$event.relatedTarget)) {
            return
          }
          this.close()
        }
      },
      menu: {
        'x-ref': 'menu',
        ['x-show']() {
          return this.isOpen
        },
        '@mousedown.prevent'() {},
      },
      option: {
        '@click'() {
          this.select(this.menuItem)
        }
      }
    }
  })
})
