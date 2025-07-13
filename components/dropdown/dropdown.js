export default function (Alpine) {
  Alpine.data("dropdown", () => {
    let aria = {
      main: {
        "x-id"() {
          return ["dropdown-aria"]
        }
      },
      trigger: {
        ":aria-expanded"() {
          return this.isOpen
        },
        ":aria-controls"() {
          return this.$id("dropdown-aria")
        },
        ":aria-haspopup"() {
          return this._role
        }
      },
      menu: {
        ":id"() {
          return this.$id("dropdown-aria")
        },
        ":role"() {
          return this._role
        }
      },
      menuItem: {
        role: "menuitem",
        tabindex: -1,
      },
    }

    let ariaRoles = ["menu", "listbox", "dialog"]

    let floatingUIoptions = [
      "placement",
      "offsetX",
      "offsetY",
      "flip",
      "autoPlacement",
      "inline",
    ];

    let _floating = null 
    let _hideTimeout = null

    return {
      _isOpen: false,
      _menuItemsElements: null,
      _focusedMenuItemIndex: -1,
      // props
      _triggerEv: "click",
      _autoClose: true,
      _placement: "bottom-start",
      _offsetX: 0,
      _offsetY: 0,
      _flip: false,
      _autoPlacement: false,
      _role: "",

      init() {
        this.$nextTick(() => {
          this._triggerEv =
            Alpine.bound(this.$el, "data-trigger-event") ?? this._triggerEv;
          this._autoClose = JSON.parse(
            Alpine.bound(this.$el, "data-auto-close") ?? this._autoClose,
          );
          this._placement =
            Alpine.bound(this.$el, "data-placement") ?? this._placement;
          this._offsetX = parseInt(
            Alpine.bound(this.$el, "data-offset-x") ?? this._offsetX,
          );
          this._offsetY = parseInt(
            Alpine.bound(this.$el, "data-offset-y") ?? this._offsetY,
          );
          this._flip = JSON.parse(
            Alpine.bound(this.$el, "data-flip") ?? this._flip,
          );
          this._autoPlacement = JSON.parse(
            Alpine.bound(this.$el, "data-auto-placement") ?? this._autoPlacement,
          );
          let role = Alpine.bound(this.$el, "data-role")
          this._role = ariaRoles.includes(role) ? role : null

          let options = floatingUIoptions.reduce((acc, v) => {
            return { ...acc, [v]: this[v]}
          })

          // the x-bind='trigger' is necessary for components that use
          // other components as triggers
          _floating = useFloating(
            this.$refs.trigger ||
              this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            options
          );

          let t = {};
          if (this._triggerEv === "click") {
            t["@click"] = function () {
              this.toggle();
            };
          }
          if (this._triggerEv === "hover") {
            t["@mouseenter"] = function () {
              this.open();
            };
            t["@mouseleave"] = function () {
              this.close();
            };
          }
          Alpine.bind(
            this.$refs.trigger ||
              this.$root.querySelector("[x-bind='trigger']"),
            t,
          );
        });

        Alpine.bind(this.$el, {
          ["@keydown.escape.prevent"]() {
            this.close();
          },
          ["@keydown.down.prevent"]() {
            if (!this._isOpen) {
              this.open()
            }
            if (!this._menuItemsElements.length) {
              return
            }
            this.$nextTick(() => {
              if (this._focusedMenuItemIndex < this._menuItemsElements.length - 1) {
                this._focusedMenuItemIndex++
              }
              let el = this._menuItemsElements[this._focusedMenuItemIndex]
              el.focus()
            })
          },
          ["@keydown.up.prevent"]() {
            if (!this._isOpen) {
              this.open()
            }
            if (!this._menuItemsElements.length) {
              return
            }
            if (this._focusedMenuItemIndex === -1) {
              this._focusedMenuItemIndex = this._menuItemsElements.length
            }
            this.$nextTick(() => {
              if (this._focusedMenuItemIndex > 0) {
                this._focusedMenuItemIndex--
              }
              let el = this._menuItemsElements[this._focusedMenuItemIndex]
              el.focus()
            })
          }
        });

        Alpine.bind(this.$el, aria.main)
      },
      scheduleHide() {
        return setTimeout(() => {
          _floating.destroy();
          this._isOpen = false;
        }, 100);
      },
      open() {
        if (this._triggerEv === "hover") {
          clearTimeout(_hideTimeout);
        }
        _floating.startAutoUpdate();
        this._isOpen = true;
        this._menuItemsElements = this.$refs.menu.querySelectorAll("[role='menuitem']")
      },
      close() {
        if (!this._isOpen) return;
        if (this._triggerEv === "hover") {
          _hideTimeout = this.scheduleHide();
          return;
        }
        _floating.destroy();
        this._isOpen = false;
        this._focusedMenuItemIndex = -1
      },
      preventHiding() {
        if (this._triggerEv === "hover") {
          clearTimeout(_hideTimeout);
        }
      },
      allowHiding() {
        if (this._triggerEv === "hover") {
          _hideTimeout = this.scheduleHide();
        }
      },
      toggle() {
        this._isOpen ? this.close() : this.open();
      },
      trigger: {
        "x-ref": "trigger",
        ...aria.trigger,
      },
      menu: {
        "x-show"() {
          return this._isOpen;
        },
        "x-ref": "menu",
        "@mouseenter"() {
          this.preventHiding();
        },
        "@mouseleave"() {
          this.allowHiding();
        },
        "@click.outside"() {
          this.close();
        },
        "@click"() {
          if (this.$event.target === this.$refs.menu) {
            return
          }
          if (this._autoClose && this.$el.contains(this.$event.target)) {
            this.close();
          }
        },
        ...aria.menu,
      },
      menuItem: {
        ...aria.menuItem,
      },
    };
  });
}  
