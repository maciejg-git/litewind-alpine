(() => {
  // ../breadcrumb.js
  function breadcrumb_default(Alpine2) {
    Alpine2.data("breadcrumb", () => {
      return {
        items: [],
        divider: "/",
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.items = Alpine2.bound(this.$el, "data-items") ?? this.items;
            });
          });
          this.divider = Alpine2.bound(this.$el, "data-divider") ?? this.divider;
        }
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(breadcrumb_default);
  });
})();
