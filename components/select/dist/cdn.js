(() => {
  // components/select/select.js
  function select_default(Alpine2) {
    Alpine2.data("select", () => {
      let aria = {
        main: {
          "x-id"() {
            return ["select-aria"];
          }
        },
        trigger: {
          role: "combobox",
          ":aria-expanded"() {
            return this._isOpen;
          },
          ":aria-controls"() {
            return this.$id("select-aria");
          }
        },
        menu: {
          ":id"() {
            return this.$id("select-aria");
          },
          role: "listbox"
        },
        option: {
          role: "option",
          ":aria-selected"() {
            return this._selected.has(this.item.value) ? "true" : "false";
          }
        }
      };
      let isElementOverflowingBottom = (el) => {
        return el.offsetTop + el.clientHeight > el.parentElement.scrollTop + el.parentElement.clientHeight;
      };
      let isElementOveflowingTop = (el) => {
        return el.offsetTop < el.parentElement.scrollTop;
      };
      let scrollToElement = (el) => {
        el.parentElement.scrollTo(
          0,
          el.offsetTop - el.parentElement.clientHeight / 2 + el.clientHeight / 2
        );
      };
      return {
        _isOpen: false,
        _floating: null,
        _value: "",
        _selected: /* @__PURE__ */ new Map(),
        _selectItems: [],
        _model: null,
        _highlightedIndex: -1,
        _selectEl: null,
        // props
        _items: [],
        _multiple: false,
        _itemText: "text",
        _itemValue: "value",
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this._items = Alpine2.bound(this.$el, "data-items") ?? this._items;
              this.transformItems();
            });
            this._multiple = JSON.parse(
              Alpine2.bound(this.$el, "data-multiple") ?? this._multiple
            );
            this._itemText = Alpine2.bound(this.$el, "data-item-text") ?? this._itemText;
            this._itemValue = Alpine2.bound(this.$el, "data-item-value") ?? this._itemValue;
            this._floating = useFloating(
              this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
              this.$refs.menu,
              { resize: true }
            );
          });
          this._selectEl = this.$el;
          this.inputEl = this.$el.querySelector("[x-bind='input']");
          Alpine2.bind(this.$el, {
            ["x-modelable"]: "_model",
            async ["@keydown.prevent.down"]() {
              if (!this._isOpen) {
                this.open();
                await this.$nextTick();
              }
              if (this._highlightedIndex >= this._selectItems.length - 1) {
                return;
              }
              this._highlightedIndex++;
              let el = this.$refs.menu.querySelector(
                `[data-index="${this._highlightedIndex}"]`
              );
              el.focus({ preventScroll: true });
              if (isElementOverflowingBottom(el) || isElementOveflowingTop(el)) {
                scrollToElement(el);
              }
            },
            ["@keydown.prevent.up"]() {
              if (this._highlightedIndex <= 0) {
                return;
              }
              this._highlightedIndex--;
              let el = this.$refs.menu.querySelector(
                `[data-index="${this._highlightedIndex}"]`
              );
              el.focus({ preventScroll: true });
              if (isElementOveflowingTop(el) || isElementOverflowingBottom(el)) {
                scrollToElement(el);
              }
            },
            ["@keydown.prevent.escape"]() {
              if (this._isOpen) {
                this.close();
              }
            }
          });
          this.$watch("_model", () => {
            let selectedCopy = new Map(this._selected);
            this._selected.clear();
            this._model.forEach((value) => {
              let item = this._selectItems.find((i) => i.value === value) || selectedCopy.get(value);
              if (item) this._selected.set(item.value, item);
            });
          });
          Alpine2.bind(this.$el, aria.main);
        },
        transformItems() {
          if (!this._items.length) {
            this._selectItems = [];
            return;
          }
          if (typeof this._items[0] === "string") {
            this._selectItems = this._items.map((i) => {
              return {
                text: i,
                value: i,
                origin: null
              };
            });
          }
          if (typeof this._items[0] === "object") {
            this._selectItems = this._items.map((i) => {
              return {
                text: i[this._itemText],
                value: i[this._itemValue],
                origin: i
              };
            });
          }
        },
        getItems() {
          return this._selectItems;
        },
        open() {
          this._floating.startAutoUpdate();
          this._isOpen = true;
          if (this._selected.size) this.scrollToFirstSelected();
          else this.$refs.menu.scrollTo(0, 0);
          this._highlightedIndex = -1;
          this.$dispatch("open-selectmenu");
        },
        scrollToFirstSelected() {
          let selectedElement = this.$refs.menu.querySelector("[data-selected]");
          if (selectedElement) {
            this.$nextTick(
              () => selectedElement.scrollIntoView({ block: "nearest" })
            );
          }
        },
        close() {
          this._floating.destroy();
          this._isOpen = false;
        },
        getSelected() {
          return [...this._selected].map(([k, v]) => v);
        },
        getSelectedValues() {
          return [...this._selected].map(([k, v]) => v.value);
        },
        select() {
          if (this._multiple) {
            if (this._selected.has(this.item.value)) {
              this._selected.delete(this.item.value);
            } else {
              this._selected.set(this.item.value, this.item);
            }
          } else {
            let item = this._selected.size && this._selected.values().next().value;
            if (item.value === this.item.value) {
              return;
            }
            this._selected.set(this.item.value, this.item);
            if (item) {
              this._selected.delete(item.value);
            }
          }
          this.updateModel();
        },
        unselect() {
          this._selected.delete(this.selectedItem.value);
        },
        clearSelection() {
          this._selected.clear();
          this.updateModel();
        },
        updateModel() {
          this._model = this.getSelectedValues();
        },
        isItemSelected() {
          return this._selected.has(this.item.value);
        },
        trigger: {
          "x-ref": "trigger",
          "@mousedown"() {
            let { target } = this.$event;
            if (target.getAttribute("x-bind") === "clearButton") {
              return;
            }
            this._isOpen ? this.close() : this.open();
          },
          "@focusout"() {
            if (this.$refs.menu.contains(this.$event.relatedTarget)) {
              return;
            }
            this.close();
          },
          ":data-clearable"() {
            return Alpine2.bound(this._selectEl, "data-clearable");
          },
          ":data-use-loader"() {
            return Alpine2.bound(this._selectEl, "data-use-loader");
          },
          ":data-is-loading"() {
            return Alpine2.bound(this._selectEl, "data-is-loading");
          },
          ":data-placeholder"() {
            return Alpine2.bound(this._selectEl, "data-placeholder");
          },
          ...aria.trigger
        },
        menu: {
          "x-ref": "menu",
          "x-show"() {
            return this._isOpen;
          },
          // prevent focusing option buttons on mousedown
          "@mousedown.prevent"() {
          },
          // handle focus of option buttons and input element when navigating
          // with keyboard
          "@focusout"() {
            if (this.$refs.menu.contains(this.$event.relatedTarget)) {
              return;
            }
            if (this.$event.relatedTarget === this.inputEl) {
              return;
            }
            this.close();
            this.$root.querySelector("[x-bind='input']").focus();
          },
          "@scroll.debounce"() {
            if (this.$el.offsetHeight + this.$el.scrollTop >= this.$el.scrollHeight) {
              this.$dispatch("scroll-to-bottom");
            }
          },
          ...aria.menu
        },
        option: {
          "@click"() {
            this.select();
            if (!this._multiple) this.close();
          },
          "@keydown.prevent.enter"() {
            this.select();
            this.close();
          },
          ":class"() {
            let classes = this.$el.attributes;
            let c = "";
            if (this._selected.has(this.item.value)) {
              c += (classes["class-selected"]?.textContent || "") + " ";
            } else {
              c += (classes["class-default"]?.textContent || "") + " ";
            }
            return c;
          },
          ":data-selected"() {
            return this._selected.has(this.item.value);
          },
          ":data-index"() {
            return this.index;
          },
          ...aria.option
        }
      };
    });
  }

  // components/select/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(select_default);
  });
})();
