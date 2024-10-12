import { useFloating } from "../floating.js"

document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, opts = {}) => {
    return {
      isOpen: false, 
      floating: null,
      items: [],
      _value: '',
      selected: [],
      _items: [],
      multiple: props.multiple ?? false,
      _model: null,

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"), this.$refs.menu, { ...opts, resize: true })
        })
        Alpine.effect(() => {
          if (!this.items.length) {
            this._items = []
            return
          }
          if (typeof this.items[0] === "string") {
            this._items = this.items.map((i) => {
              return {
                text: i,
                value: i,
                origin: null,
                _selected: false,
              }
            })
          }
          if (typeof this.items[0] === "object") {
            this._items = this.items.map((i) => {
              return {
                text: i.text,
                value: i.value,
                origin: i,
                _selected: false,
              }
            })
          }
        })
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
        });
      },
      getItems() {
        return this._items
      },
      open() {
        this.floating.startAutoUpdate()
        this.isOpen = true
      },
      close() {
        this.floating.destroy()
        this.isOpen = false
      },
      getSelected() {
        return this.selected[0]?.text
      },
      select() {
        if (!props.multiple) {
          if (this.selected.length) {
            this.selected[0]._selected = false
          }
          this.selected[0] = this.item
          this.item._selected = true
          this._model = this.selected
          return
        }
      },
      trigger: {
        'x-ref': 'trigger',
        ['@mousedown']() {
          this.isOpen ? this.close() : this.open()
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
          this.select()
          this.close()
        }
      }
    }
  })
})
