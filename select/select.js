document.addEventListener('alpine:init', () => {
  Alpine.data('select', (props = {}, dataExtend = {}) => {
    let isFunction = (f) => typeof f === "function";

    let isElementOverflowingBottom = (el) => {
      return el.offsetTop + el.clientHeight > el.parentElement.scrollTop + el.parentElement.clientHeight
    }

    let isElementOveflowingTop = (el) => {
      return el.offsetTop < el.parentElement.scrollTop
    }

    let scrollToElement = (el) => {
      el.parentElement.scrollTo(0, el.offsetTop - el.parentElement.clientHeight / 2 + el.clientHeight / 2)
    }

    let bind = {};
    ["trigger", "menu", "option"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i]
        delete dataExtend[i]
      }
    })

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
      highlightedIndex: -1,

      init() {
        this.$nextTick(() => {
          this.floating = useFloating(this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"), this.$refs.menu, { resize: true })
        })
        Alpine.effect(() => {
          this.items = isFunction(props.items) ? props.items() : (props.items || this.items)
          this.transformItems()
        })
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
          ["@keydown.prevent.down"]() {
            if (!this.isOpen) {
              this.open()
            }
            if (this.highlightedIndex >= this._items.length - 1) {
              return
            }
            this.highlightedIndex++
            let el = this.$refs.menu.querySelector(`[data-index="${this.highlightedIndex}"]`)
            el.focus({ preventScroll: true })
            if (isElementOverflowingBottom(el) || isElementOveflowingTop(el)) { 
              scrollToElement(el)
            }
          },
          ["@keydown.prevent.up"]() {
            if (this.highlightedIndex <= 0) {
              return
            }
            this.highlightedIndex--
            let el = this.$refs.menu.querySelector(`[data-index="${this.highlightedIndex}"]`)
            el.focus({ preventScroll: true })
            if (isElementOveflowingTop(el) || isElementOverflowingBottom(el)) { 
              scrollToElement(el)
            }
          },
          ["@keydown.prevent.escape"]() {
            if (this.isOpen) {
              this.close()
            }
          }
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
        this.highlightedIndex = -1
        this.$dispatch("open-selectmenu")
      },
      scrollToFirstSelected() {
        let selectedElement = this.$refs.menu.querySelector("[data-selected]")
        if (selectedElement) {
          this.$nextTick(() => selectedElement.scrollIntoView({ block: "nearest" }))
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
        '@mousedown'() {
          this.isOpen ? this.close() : this.open()
        },
        '@focusout'() {
          if (this.$refs.menu.contains(this.$event.relatedTarget)) {
            return
          }
          this.close()
        },
        ...bind.trigger,
      },
      menu: {
        'x-ref': 'menu',
        'x-show'() {
          return this.isOpen
        },
        '@mousedown.prevent'() {},
        '@focusout'() {
          if (this.$refs.menu.contains(this.$event.relatedTarget)) {
            return
          }
          this.close()
          this.$root.querySelector("[x-bind='input']").focus()
        },
        "@scroll"() {
          if (this.$el.offsetHeight + this.$el.scrollTop + 100 >= this.$el.scrollHeight) {
            this.$dispatch("scroll-to-bottom")
          }
        },
        ...bind.menu,
      },
      option: {
        '@click'() {
          this.select()
          if (!this.multiple) this.close()
        },
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.selected.has(this.item.value)) {
            c += (classes["class-selected"]?.textContent || "") + " ";
          }
          if (+this.$el.dataset.index === this.highlightedIndex) {
            c += (classes["class-highlight"]?.textContent || "") + " "
          }

          return c;
        },
        ":data-selected"() {
          return this.selected.has(this.item.value)
        },
        ":data-index"() {
          return this.index
        },
        ...bind.option,
      },
      ...dataExtend,
    }
  })
})
