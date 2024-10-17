import { useFloating } from "../floating.js"

document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, opts = {}) => {
    return {
      isOpen: false, 
      floating: null,
      items: [],
      _value: '',
      selected: new Map(),
      _items: [],
      multiple: props.multiple ?? false,
      _model: null,
      itemText: props.itemText ?? "text",
      itemValue: props.itemValue ?? "value",
      inputDataProps: ["clearable", "placeholder", "useLoader", "isLoading"],
      inputData: {},

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"), this.$refs.menu, { ...opts, resize: true })
        })
        Alpine.effect(() => this.transformItems())
        this.inputDataProps.forEach((name) => {
          if (props[name]) this.inputData[name] = props[name] 
        })
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
        });
      },
      transformItems() {
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
            }
          })
        }
        if (typeof this.items[0] === "object") {
          this._items = this.items.map((i) => {
            return {
              text: i[this.itemText],
              value: i[this.itemValue],
              origin: i,
            }
          })
        }
      },
      getItems() {
        return this._items
      },
      open() {
        this.floating.startAutoUpdate()
        this.isOpen = true
        this.scrollToFirstSelected()
      },
      scrollToFirstSelected() {
        let selectedElement = this.$refs.menu.querySelector("[data-selected]")
        if (selectedElement) {
          this.$nextTick(() => selectedElement.scrollIntoView())
        }
      },
      close() {
        this.floating.destroy()
        this.isOpen = false
      },
      getSelected() {
        return [...this.selected].map(([k ,v]) => v)
      },
      getSelectedText() {
        return [...this.selected].map(([k ,v]) => v.text)
      },
      select() {
        if (!this.multiple) {
          let item = this.selected.size && this.selected.values().next().value
          if (item.value === this.item.value) {
            return
          }
          this.selected.set(this.item.value, this.item)
          if (item) {
            this.selected.delete(item.value)
          }
          return
        }
        if (this.selected.has(this.item.value)) {
          this.selected.delete(this.item.value)
        } else {
          this.selected.set(this.item.value, this.item)
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
          if (!this.multiple) this.close()
        },
        [":class"]() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.selected.has(this.item.value)) {
            c = classes["class:selected"]?.textContent || "";
          }

          return c;
        },
        [":data-selected"]() {
          return this.selected.has(this.item.value)
        }
      }
    }
  })
})
