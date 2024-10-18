import { useFloating } from "../floating.js"

document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, opts = {}) => {
    let isFunction = (f) => typeof f === "function";

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
        Alpine.effect(() => {
          this.items = isFunction(props.items) ? props.items() : props.items
          this.transformItems()
        })
        this.inputDataProps.forEach((name) => {
          if (props[name]) this.inputData[name] = props[name] 
        })
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
        });
        this.$watch("_model", () => {
          this.selected.clear()
          this._model.forEach((value) => {
            let item = this._items.find((i) => i.value === value)
            if (item) this.selected.set(item.value, item)
          })
        })
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
        if (this.selected.size) this.scrollToFirstSelected()
        else this.$refs.menu.scrollTo(0, 0)
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
      getSelectedValues() {
        return [...this.selected].map(([k ,v]) => v.value)
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
        } else {
          if (this.selected.has(this.item.value)) {
            this.selected.delete(this.item.value)
          } else {
            this.selected.set(this.item.value, this.item)
          }
        }
        this.updateModel()
      },
      updateModel() {
        this._model = this.getSelectedValues()
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
