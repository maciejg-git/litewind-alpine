// components/breadcrumb/breadcrumb.js
function breadcrumb_default(Alpine) {
  Alpine.data("breadcrumb", () => {
    return {
      // props
      _items: [],
      _divider: "/",
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._items = Alpine.bound(this.$el, "data-items") ?? this._items;
          });
        });
        this._divider = Alpine.bound(this.$el, "data-divider") ?? this._divider;
      }
    };
  });
}

// components/breadcrumb/builds/module.js
var module_default = breadcrumb_default;
export {
  module_default as default
};
