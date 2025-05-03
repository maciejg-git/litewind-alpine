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
          return this.role
        }
      },
      menu: {
        ":id"() {
          return this.$id("dropdown-aria")
        },
        ":role"() {
          return this.role
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

    return {
      isOpen: false,
      floating: null,
      hideTimeout: null,
      menuItemsElements: null,
      focusedMenuItemIndex: -1,
      // props
      triggerEv: "click",
      autoClose: true,
      placement: "bottom-start",
      offsetX: 0,
      offsetY: 0,
      flip: false,
      autoPlacement: false,
      role: "",

      init() {
        this.$nextTick(() => {
          this.triggerEv =
            Alpine.bound(this.$el, "data-trigger-event") ?? this.triggerEv;
          this.autoClose = JSON.parse(
            Alpine.bound(this.$el, "data-auto-close") ?? this.autoClose,
          );
          this.placement =
            Alpine.bound(this.$el, "data-placement") ?? this.placement;
          this.offsetX = parseInt(
            Alpine.bound(this.$el, "data-offset-x") ?? this.offsetX,
          );
          this.offsetY = parseInt(
            Alpine.bound(this.$el, "data-offset-y") ?? this.offsetY,
          );
          this.flip = JSON.parse(
            Alpine.bound(this.$el, "data-flip") ?? this.flip,
          );
          this.autoPlacement = JSON.parse(
            Alpine.bound(this.$el, "data-auto-placement") ?? this.autoPlacement,
          );
          let role = Alpine.bound(this.$el, "data-role")
          this.role = ariaRoles.includes(role) ? role : null

          let options = floatingUIoptions.reduce((acc, v) => {
            return { ...acc, [v]: this[v]}
          })

          // the x-bind='trigger' is necessary for components that use
          // other components as triggers
          this.floating = useFloating(
            this.$refs.trigger ||
              this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            options
          );

          let t = {};
          if (this.triggerEv === "click") {
            t["@click"] = function () {
              this.toggle();
            };
          }
          if (this.triggerEv === "hover") {
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
            if (!this.isOpen) {
              this.open()
            }
            if (!this.menuItemsElements.length) {
              return
            }
            this.$nextTick(() => {
              if (this.focusedMenuItemIndex < this.menuItemsElements.length - 1) {
                this.focusedMenuItemIndex++
              }
              let el = this.menuItemsElements[this.focusedMenuItemIndex]
              el.focus()
            })
          },
          ["@keydown.up.prevent"]() {
            if (!this.isOpen) {
              this.open()
            }
            if (!this.menuItemsElements.length) {
              return
            }
            if (this.focusedMenuItemIndex === -1) {
              this.focusedMenuItemIndex = this.menuItemsElements.length
            }
            this.$nextTick(() => {
              if (this.focusedMenuItemIndex > 0) {
                this.focusedMenuItemIndex--
              }
              let el = this.menuItemsElements[this.focusedMenuItemIndex]
              el.focus()
            })
          }
        });

        Alpine.bind(this.$el, aria.main)
      },
      scheduleHide() {
        return setTimeout(() => {
          this.floating.destroy();
          this.isOpen = false;
        }, 100);
      },
      open() {
        if (this.triggerEv === "hover") {
          clearTimeout(this.hideTimeout);
        }
        this.floating.startAutoUpdate();
        this.isOpen = true;
        this.menuItemsElements = this.$refs.menu.querySelectorAll("[role='menuitem']")
      },
      close() {
        if (!this.isOpen) return;
        if (this.triggerEv === "hover") {
          this.hideTimeout = this.scheduleHide();
          return;
        }
        this.floating.destroy();
        this.isOpen = false;
        this.focusedMenuItemIndex = -1
      },
      preventHiding() {
        if (this.triggerEv === "hover") {
          clearTimeout(this.hideTimeout);
        }
      },
      allowHiding() {
        if (this.triggerEv === "hover") {
          this.hideTimeout = this.scheduleHide();
        }
      },
      toggle() {
        this.isOpen ? this.close() : this.open();
      },
      trigger: {
        "x-ref": "trigger",
        ...aria.trigger,
      },
      menu: {
        "x-show"() {
          return this.isOpen;
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
          if (this.autoClose && this.$el.contains(this.$event.target)) {
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
