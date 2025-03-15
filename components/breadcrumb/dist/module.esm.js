// components/breadcrumb/breadcrumb.js
function breadcrumb_default(Alpine) {
  Alpine.data("breadcrumb", () => {
    return {
      // props
      items: [],
      divider: "/",
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.items = Alpine.bound(this.$el, "data-items") ?? this.items;
          });
        });
        this.divider = Alpine.bound(this.$el, "data-divider") ?? this.divider;
      }
    };
  });
}

// components/breadcrumb/builds/module.js
var module_default = breadcrumb_default;
export {
  module_default as default
};
