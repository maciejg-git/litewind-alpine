// components/autocomplete/autocomplete.js
function autocomplete_default(Alpine) {
  Alpine.data("autocomplete", () => {
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
    let highlight = (string, match, classes) => {
      classes = classes || "match";
      return (string + "").replace(
        new RegExp(
          `(${match.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")})`,
          "i"
        ),
        `<span class='${classes}'>$1</span>`
      );
    };
    return {
      _isOpen: false,
      _floating: null,
      _value: "",
      _externalValue: "",
      _selected: /* @__PURE__ */ new Map(),
      _selectItems: [],
      _filteredItems: [],
      _model: null,
      _highlightedIndex: -1,
      _selectEl: null,
      _isFocused: false,
      _inputEl: null,
      // props
      _items: [],
      _multiple: false,
      _itemText: "text",
      _itemValue: "value",
      _noFilter: false,
      _noEmptyOpen: false,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._items = Alpine.bound(this.$el, "data-items") ?? this._items;
            this.transformItems();
            this._highlightedIndex = -1;
          });
          this._multiple = JSON.parse(
            Alpine.bound(this.$el, "data-multiple") ?? this._multiple
          );
          this._itemText = Alpine.bound(this.$el, "data-item-text") ?? this._itemText;
          this._itemValue = Alpine.bound(this.$el, "data-item-value") ?? this._itemValue;
          this._noFilter = JSON.parse(
            Alpine.bound(this.$el, "data-no-filter") ?? this._noFilter
          );
          this._noEmptyOpen = JSON.parse(
            Alpine.bound(this.$el, "data-no-empty-open") ?? this._noEmptyOpen
          );
          this._floating = useFloating(
            this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            { resize: true }
          );
        });
        this._selectEl = this.$el;
        this._inputEl = this.$el.querySelector("[x-bind='input']");
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
          async ["@keydown.prevent.down"]() {
            if (this.canOpenEmptyMenu()) {
              this.open();
              await this.$nextTick();
            }
            if (this._highlightedIndex >= this.getItems().length - 1) {
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
          },
          ["@keydown.backspace"]() {
            if (this._multiple && this._selected.size && this._externalValue === "") {
              let lastSelected = this.getLastSelected();
              this._selected.delete(lastSelected);
              this.updateModel();
            }
          },
          "@update:value"() {
            this._externalValue = this.$event.detail;
            if (this.canOpenEmptyMenu()) {
              this.open();
            }
          }
        });
        this.$watch("_externalValue", () => {
          if (this._noFilter) {
            return;
          }
          this._filteredItems = this.filterItems();
        });
        this.$watch("_items", () => {
          this.open();
        });
        this.$watch("_model", () => {
          let selectedCopy = new Map(this._selected);
          this._selected.clear();
          this._model.forEach((value) => {
            let item = this._selectItems.find((i) => i.value === value) || selectedCopy.get(value);
            if (item) this._selected.set(item.value, item);
          });
        });
        Alpine.bind(this.$el, aria.main);
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
      getLastSelected() {
        return Array.from(this._selected.keys()).pop();
      },
      filterItems() {
        return this._selectItems.filter((item) => {
          return item.text.indexOf(this._externalValue) !== -1;
        });
      },
      getItems() {
        if (this._noFilter) {
          return this._selectItems;
        }
        if (this._externalValue === "") {
          return this._selectItems;
        }
        return this._filteredItems;
      },
      canOpenEmptyMenu() {
        return !this._noEmptyOpen || this.getItems().length;
      },
      open() {
        if (this._isOpen || !this._isFocused) {
          return;
        }
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
          this.updateModel();
        } else {
          let item = this._selected.size && this._selected.values().next().value;
          if (item.value === this.item.value) {
            return this.item;
          }
          this._selected.set(this.item.value, this.item);
          if (item) {
            this._selected.delete(item.value);
          }
          this.updateModel();
          return this.item;
        }
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
      getHighlightedItemText() {
        return highlight(this.item.text, this._externalValue);
      },
      trigger: {
        "x-ref": "trigger",
        "@mousedown"() {
          let { target } = this.$event;
          if (target.getAttribute("x-bind") === "clearButton") {
            return;
          }
          if (this.canOpenEmptyMenu()) {
            this.open();
          }
        },
        // FIXME: getFirstSelected, hideInput, showInput
        "@focusin"() {
          this._isFocused = true;
          let item = this._selected.size && this._selected.values().next().value;
          this._inputEl.style.opacity = 1;
          if (this._multiple) {
            this._externalValue = "";
            return;
          }
          if (item) {
            this._externalValue = item.text;
          }
        },
        "@focusout"() {
          if (this.$refs.menu.contains(this.$event.relatedTarget)) {
            return;
          }
          this.close();
          this._isFocused = false;
          this._inputEl.style.opacity = 0;
        },
        ":data-clearable"() {
          return Alpine.bound(this._selectEl, "data-clearable");
        },
        ":data-use-loader"() {
          return Alpine.bound(this._selectEl, "data-use-loader");
        },
        ":data-is-loading"() {
          return Alpine.bound(this._selectEl, "data-is-loading");
        },
        ":data-placeholder"() {
          return Alpine.bound(this._selectEl, "data-placeholder");
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
          if (this.$event.relatedTarget === this._inputEl) {
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
          let item = this.select();
          if (!this._multiple) {
            this._externalValue = item.text;
          }
          if (!this._multiple) this.close();
        },
        "@keydown.prevent.enter"() {
          let item = this.select();
          if (!this._multiple) {
            this._externalValue = item.text;
          }
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
      },
      selectedItems: {
        "x-show"() {
          return this._multiple || !this._isFocused;
        },
        ":style"() {
          if (this._multiple) {
            return {
              display: "contents"
            };
          } else {
            return {
              position: "absolute"
            };
          }
        }
      },
      indicator: {
        "@mousedown.prevent"() {
          if (this._isOpen) {
            this.close();
            this.$event.stopPropagation();
          }
        }
      }
    };
  });
}

// components/autocomplete/builds/module.js
var module_default = autocomplete_default;
export {
  module_default as default
};
