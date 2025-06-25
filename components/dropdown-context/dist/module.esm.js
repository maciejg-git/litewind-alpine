// components/dropdown-context/dropdown-context.js
function dropdown_context_default(Alpine) {
  Alpine.data("dropdownContext", () => {
    let aria = {
      menu: {
        ":role"() {
          return this._role;
        },
        tabindex: 0
      },
      menuItem: {
        role: "menuitem",
        tabindex: -1
      }
    };
    let ariaRoles = ["menu", "listbox", "dialog"];
    let floatingUIoptions = [
      "placement",
      "offsetX",
      "offsetY",
      "flip",
      "autoPlacement",
      "inline"
    ];
    return {
      _isOpen: false,
      _floating: null,
      contextData: {},
      _menuItems: null,
      _focusedMenuItemIndex: -1,
      // props
      _autoClose: true,
      _placement: "bottom-start",
      _offsetX: 0,
      _offsetY: 0,
      _flip: false,
      _autoPlacement: false,
      _role: "",
      init() {
        this.$nextTick(() => {
          this._autoClose = JSON.parse(
            Alpine.bound(this.$el, "data-auto-close") ?? this._autoClose
          );
          this._placement = Alpine.bound(this.$el, "data-placement") ?? this._placement;
          this._offsetX = parseInt(
            Alpine.bound(this.$el, "data-offset-x") ?? this._offsetX
          );
          this._offsetY = parseInt(
            Alpine.bound(this.$el, "data-offset-y") ?? this._offsetY
          );
          this._flip = JSON.parse(
            Alpine.bound(this.$el, "data-flip") ?? this._flip
          );
          this._autoPlacement = JSON.parse(
            Alpine.bound(this.$el, "data-auto-placement") ?? this._autoPlacement
          );
          let role = Alpine.bound(this.$el, "data-role");
          this._role = ariaRoles.includes(role) ? role : null;
          let options = floatingUIoptions.reduce((acc, v) => {
            return { ...acc, [v]: this[v] };
          });
          this._floating = useFloating(null, this.$refs.menu, options);
        });
        Alpine.bind(this.$el, {
          ["@keydown.escape.window.prevent"]() {
            this.close();
          },
          ["@keydown.down.prevent"]() {
            if (!this._menuItems.length) {
              return;
            }
            this.$nextTick(() => {
              if (this._focusedMenuItemIndex < this._menuItems.length - 1) {
                this._focusedMenuItemIndex++;
              }
              let el = this._menuItems[this._focusedMenuItemIndex];
              el.focus();
            });
          },
          ["@keydown.up.prevent"]() {
            if (!this._menuItems.length) {
              return;
            }
            if (this._focusedMenuItemIndex === -1) {
              this._focusedMenuItemIndex = this._menuItems.length;
            }
            this.$nextTick(() => {
              if (this._focusedMenuItemIndex > 0) {
                this._focusedMenuItemIndex--;
              }
              let el = this._menuItems[this._focusedMenuItemIndex];
              el.focus();
            });
          }
        });
      },
      open() {
        this._floating.startAutoUpdate();
        this._isOpen = true;
        this._menuItems = this.$refs.menu.querySelectorAll("[role='menuitem']");
        this.$nextTick(() => this.$refs.menu.focus());
      },
      close() {
        this._floating.destroy();
        this._isOpen = false;
        this._focusedMenuItemIndex = -1;
      },
      menu: {
        "x-show"() {
          return this._isOpen;
        },
        "@open-contextmenu.window"() {
          if (this.$event.detail.id !== this.$root.id) {
            return;
          }
          let mouseEvent = this.$event.detail.$event;
          this._floating.updateVirtualElement(mouseEvent);
          this.contextData = this.$event.detail.data;
          this.open();
        },
        "x-ref": "menu",
        "@click.outside"() {
          this.close();
        },
        "@click"() {
          if (this._autoClose && this.$el.contains(this.$event.target)) {
            this.close();
          }
        },
        ...aria.menu
      },
      menuItem: {
        ...aria.menuItem
      }
    };
  });
}

// components/dropdown-context/builds/module.js
var module_default = dropdown_context_default;
export {
  module_default as default
};
