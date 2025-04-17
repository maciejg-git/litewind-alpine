(() => {
  // components/autocomplete/autocomplete.js
  function autocomplete_default(Alpine2) {
    Alpine2.data("autocomplete", () => {
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
      return {
        isOpen: false,
        floating: null,
        _value: "",
        _externalValue: "",
        selected: /* @__PURE__ */ new Map(),
        _items: [],
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
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.items = Alpine2.bound(this.$el, "data-items") ?? this.items;
              this.transformItems();
            });
            this.multiple = JSON.parse(
              Alpine2.bound(this.$el, "data-multiple") ?? this.multiple
            );
            this.itemText = Alpine2.bound(this.$el, "data-item-text") ?? this.itemText;
            this.itemValue = Alpine2.bound(this.$el, "data-item-value") ?? this.itemValue;
            this.floating = useFloating(
              this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
              this.$refs.menu,
              { resize: true }
            );
          });
          this.selectEl = this.$el;
          this.inputEl = this.$el.querySelector("[x-bind='input']");
          Alpine2.bind(this.$el, {
            ["x-modelable"]: "_model",
            ["@keydown.prevent.down"]() {
              if (!this.isOpen) {
                this.open();
              }
              if (this.highlightedIndex >= this._items.length - 1) {
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
              }
            },
            "@update:value"() {
              this._externalValue = this.$event.detail;
            }
          });
          Alpine2.bind(this.$el, aria.main);
          this.$watch("_model", () => {
            this.selected.clear();
            this._model.forEach((value) => {
              let item = this._items.find((i) => i.value === value);
              if (item) this.selected.set(item.value, item);
            });
          });
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
        getItems() {
          return this._items.filter((item) => {
            return item.text.indexOf(this._externalValue) !== -1;
          });
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
          if (!this.multiple) {
            let item = this.selected.size && this.selected.values().next().value;
            if (item.value === this.item.value) {
              return this.item;
            }
            this.selected.set(this.item.value, this.item);
            if (item) {
              this.selected.delete(item.value);
            }
            return this.item;
          } else {
            if (this.selected.has(this.item.value)) {
              this.selected.delete(this.item.value);
            } else {
              this.selected.set(this.item.value, this.item);
            }
          }
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
            if (!this.isOpen) {
              this.open();
            }
          },
          // FIXME: getFirstSelected, hideInput, showInput
          "@focusin"() {
            this.isFocused = true;
            let item = this.selected.size && this.selected.values().next().value;
            this.inputEl.style.opacity = 1;
            this.inputEl.style.position = "relative";
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
            this.inputEl.style.position = "absolute";
          },
          ":data-clearable"() {
            return Alpine2.bound(this.selectEl, "data-clearable");
          },
          ":data-use-loader"() {
            return Alpine2.bound(this.selectEl, "data-use-loader");
          },
          ":data-is-loading"() {
            return Alpine2.bound(this.selectEl, "data-is-loading");
          },
          ":data-placeholder"() {
            return Alpine2.bound(this.selectEl, "data-placeholder");
          },
          ...aria.trigger
        },
        menu: {
          "x-ref": "menu",
          "x-show"() {
            return this.isOpen;
          },
          "@mousedown.prevent"() {
          },
          "@focusout"() {
            if (this.$refs.menu.contains(this.$event.relatedTarget)) {
              return;
            }
            this.close();
            this.$root.querySelector("[x-bind='input']").focus();
          },
          "@scroll"() {
            if (this.$el.offsetHeight + this.$el.scrollTop + 100 >= this.$el.scrollHeight) {
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
        }
      };
    });
  }

  // components/autocomplete/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(autocomplete_default);
  });
})();
