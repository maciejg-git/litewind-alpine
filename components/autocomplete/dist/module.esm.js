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
          return this.isOpen;
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
          return this.selected.has(this.item.value) ? "true" : "false";
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
      isOpen: false,
      floating: null,
      _value: "",
      _externalValue: "",
      selected: /* @__PURE__ */ new Map(),
      _items: [],
      _filteredItems: [],
      _model: null,
      highlightedIndex: -1,
      selectEl: null,
      isFocused: false,
      inputEl: null,
      // props
      items: [],
      multiple: false,
      itemText: "text",
      itemValue: "value",
      noFilter: false,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.items = Alpine.bound(this.$el, "data-items") ?? this.items;
            this.transformItems();
          });
          this.multiple = JSON.parse(
            Alpine.bound(this.$el, "data-multiple") ?? this.multiple
          );
          this.itemText = Alpine.bound(this.$el, "data-item-text") ?? this.itemText;
          this.itemValue = Alpine.bound(this.$el, "data-item-value") ?? this.itemValue;
          this.noFilter = JSON.parse(
            Alpine.bound(this.$el, "data-no-filter") ?? this.noFilter
          );
          this.floating = useFloating(
            this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            { resize: true }
          );
        });
        this.selectEl = this.$el;
        this.inputEl = this.$el.querySelector("[x-bind='input']");
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
          async ["@keydown.prevent.down"]() {
            if (!this.isOpen) {
              this.open();
              await this.$nextTick();
            }
            if (this.highlightedIndex >= this.getItems().length - 1) {
              return;
            }
            this.highlightedIndex++;
            let el = this.$refs.menu.querySelector(
              `[data-index="${this.highlightedIndex}"]`
            );
            el.focus({ preventScroll: true });
            if (isElementOverflowingBottom(el) || isElementOveflowingTop(el)) {
              scrollToElement(el);
            }
          },
          ["@keydown.prevent.up"]() {
            if (this.highlightedIndex <= 0) {
              return;
            }
            this.highlightedIndex--;
            let el = this.$refs.menu.querySelector(
              `[data-index="${this.highlightedIndex}"]`
            );
            el.focus({ preventScroll: true });
            if (isElementOveflowingTop(el) || isElementOverflowingBottom(el)) {
              scrollToElement(el);
            }
          },
          ["@keydown.prevent.escape"]() {
            if (this.isOpen) {
              this.close();
            }
          },
          ["@keydown.backspace"]() {
            if (this.multiple && this.selected.size && this._externalValue === "") {
              let lastSelected = this.getLastSelected();
              this.selected.delete(lastSelected);
              this.updateModel();
            }
          },
          "@update:value"() {
            this._externalValue = this.$event.detail;
            if (!this.isOpen) {
              this.open();
            }
          }
        });
        this.$watch("_externalValue", () => {
          if (this.noFilter) {
            return;
          }
          this._filteredItems = this.filterItems();
        });
        this.$watch("_model", () => {
          let selectedCopy = new Map(this.selected);
          this.selected.clear();
          this._model.forEach((value) => {
            let item = this._items.find((i) => i.value === value) || selectedCopy.get(value);
            if (item) this.selected.set(item.value, item);
          });
        });
        Alpine.bind(this.$el, aria.main);
      },
      transformItems() {
        if (!this.items.length) {
          this._items = [];
          return;
        }
        if (typeof this.items[0] === "string") {
          this._items = this.items.map((i) => {
            return {
              text: i,
              value: i,
              origin: null
            };
          });
        }
        if (typeof this.items[0] === "object") {
          this._items = this.items.map((i) => {
            return {
              text: i[this.itemText],
              value: i[this.itemValue],
              origin: i
            };
          });
        }
      },
      getLastSelected() {
        return Array.from(this.selected.keys()).pop();
      },
      filterItems() {
        return this._items.filter((item) => {
          return item.text.indexOf(this._externalValue) !== -1;
        });
      },
      getItems() {
        if (this.noFilter) {
          return this._items;
        }
        if (this._externalValue === "") {
          return this._items;
        }
        return this._filteredItems;
      },
      open() {
        this.floating.startAutoUpdate();
        this.isOpen = true;
        if (this.selected.size) this.scrollToFirstSelected();
        else this.$refs.menu.scrollTo(0, 0);
        this.highlightedIndex = -1;
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
        this.floating.destroy();
        this.isOpen = false;
      },
      getSelected() {
        return [...this.selected].map(([k, v]) => v);
      },
      getSelectedValues() {
        return [...this.selected].map(([k, v]) => v.value);
      },
      select() {
        if (this.multiple) {
          if (this.selected.has(this.item.value)) {
            this.selected.delete(this.item.value);
          } else {
            this.selected.set(this.item.value, this.item);
          }
          this.updateModel();
        } else {
          let item = this.selected.size && this.selected.values().next().value;
          if (item.value === this.item.value) {
            return this.item;
          }
          this.selected.set(this.item.value, this.item);
          if (item) {
            this.selected.delete(item.value);
          }
          this.updateModel();
          return this.item;
        }
      },
      unselect() {
        this.selected.delete(this.selectedItem.value);
      },
      clearSelection() {
        this.selected.clear();
        this.updateModel();
      },
      updateModel() {
        this._model = this.getSelectedValues();
      },
      isItemSelected() {
        return this.selected.has(this.item.value);
      },
      trigger: {
        "x-ref": "trigger",
        "@mousedown"() {
          let { target } = this.$event;
          if (target.getAttribute("x-bind") === "clearButton") {
            return;
          }
          if (!this.isOpen) {
            this.open();
          }
        },
        // FIXME: getFirstSelected, hideInput, showInput
        "@focusin"() {
          this.isFocused = true;
          let item = this.selected.size && this.selected.values().next().value;
          this.inputEl.style.opacity = 1;
          if (this.multiple) {
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
          this.isFocused = false;
          this.inputEl.style.opacity = 0;
        },
        ":data-clearable"() {
          return Alpine.bound(this.selectEl, "data-clearable");
        },
        ":data-use-loader"() {
          return Alpine.bound(this.selectEl, "data-use-loader");
        },
        ":data-is-loading"() {
          return Alpine.bound(this.selectEl, "data-is-loading");
        },
        ":data-placeholder"() {
          return Alpine.bound(this.selectEl, "data-placeholder");
        },
        ...aria.trigger
      },
      menu: {
        "x-ref": "menu",
        "x-show"() {
          return this.isOpen;
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
          let item = this.select();
          if (!this.multiple) {
            this._externalValue = item.text;
          }
          if (!this.multiple) this.close();
        },
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.selected.has(this.item.value)) {
            c += (classes["class-selected"]?.textContent || "") + " ";
          } else {
            c += (classes["class-default"]?.textContent || "") + " ";
          }
          return c;
        },
        ":data-selected"() {
          return this.selected.has(this.item.value);
        },
        ":data-index"() {
          return this.index;
        },
        ...aria.option
      },
      selectedItems: {
        "x-show"() {
          return this.multiple || !this.isFocused;
        },
        ":style"() {
          if (this.multiple) {
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
        "@mousedown"() {
          if (this.isOpen) {
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
