// ../dropdown.js
function dropdown_default(Alpine) {
  Alpine.data("dropdown", (dataExtend = {}) => {
    let aria = {
      main: {
        "x-id"() {
          return ["dropdown-aria"];
        }
      },
      trigger: {
        ":aria-expanded"() {
          return this.isShow;
        },
        ":aria-controls"() {
          return this.$id("dropdown-aria");
        },
        ":aria-haspopup"() {
          return this.role;
        }
      },
      menu: {
        ":id"() {
          return this.$id("dropdown-aria");
        },
        ":role"() {
          return this.role;
        }
      },
      menuItem: {
        role: "menuitem"
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
    let bind = {};
    ["trigger", "menu"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
    return {
      isShow: false,
      floating: null,
      triggerEv: "click",
      autoClose: true,
      hideTimeout: null,
      placement: "bottom-start",
      offsetX: 0,
      offsetY: 0,
      flip: false,
      autoPlacement: false,
      role: "",
      init() {
        this.$nextTick(() => {
          this.triggerEv = Alpine.bound(this.$el, "data-trigger-event") ?? this.triggerEv;
          this.autoClose = JSON.parse(
            Alpine.bound(this.$el, "data-auto-close") ?? this.autoClose
          );
          this.placement = Alpine.bound(this.$el, "data-placement") ?? this.placement;
          this.offsetX = parseInt(
            Alpine.bound(this.$el, "data-offset-x") ?? this.offsetX
          );
          this.offsetY = parseInt(
            Alpine.bound(this.$el, "data-offset-y") ?? this.offsetY
          );
          this.flip = JSON.parse(
            Alpine.bound(this.$el, "data-flip") ?? this.flip
          );
          this.autoPlacement = JSON.parse(
            Alpine.bound(this.$el, "data-auto-placement") ?? this.autoPlacement
          );
          let role = Alpine.bound(this.$el, "data-role");
          this.role = ariaRoles.includes(role) ? role : null;
          let options = floatingUIoptions.reduce((acc, v) => {
            return { ...acc, [v]: this[v] };
          });
          this.floating = useFloating(
            this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
            this.$refs.menu,
            options
          );
          let t = {};
          if (this.triggerEv === "click") {
            t["@click"] = function() {
              this.toggle();
            };
          }
          if (this.triggerEv === "hover") {
            t["@mouseenter"] = function() {
              this.open();
            };
            t["@mouseleave"] = function() {
              this.close();
            };
          }
          Alpine.bind(
            this.$refs.trigger || this.$root.querySelector("[x-bind='trigger']"),
            t
          );
        });
        Alpine.bind(this.$el, {
          ["@keydown.escape.prevent"]() {
            this.close();
          }
        });
        Alpine.bind(this.$el, aria.main);
      },
      scheduleHide() {
        return setTimeout(() => {
          this.floating.destroy();
          this.isShow = false;
        }, 100);
      },
      open() {
        if (this.triggerEv === "hover") {
          clearTimeout(this.hideTimeout);
        }
        this.floating.startAutoUpdate();
        this.isShow = true;
      },
      close() {
        if (!this.isShow) return;
        if (this.triggerEv === "hover") {
          this.hideTimeout = this.scheduleHide();
          return;
        }
        this.floating.destroy();
        this.isShow = false;
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
        this.isShow ? this.close() : this.open();
      },
      trigger: {
        "x-ref": "trigger",
        ...bind.trigger,
        ...aria.trigger
      },
      menu: {
        "x-show"() {
          return this.isShow;
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
        ...bind.menu,
        ...aria.menu
      },
      menuItem: {
        ...aria.menuItem
      },
      ...dataExtend
    };
  });
}

// module.js
var module_default = dropdown_default;
export {
  module_default as default
};
