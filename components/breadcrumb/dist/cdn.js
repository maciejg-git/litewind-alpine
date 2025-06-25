(() => {
  // components/breadcrumb/breadcrumb.js
  function breadcrumb_default(Alpine2) {
    Alpine2.data("breadcrumb", () => {
      return {
        // props
        _items: [],
        _divider: "/",
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this._items = Alpine2.bound(this.$el, "data-items") ?? this._items;
            });
          });
          this._divider = Alpine2.bound(this.$el, "data-divider") ?? this._divider;
        }
      };
    });
  }

  // components/breadcrumb/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(breadcrumb_default);
  });
})();
