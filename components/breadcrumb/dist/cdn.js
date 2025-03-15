(() => {
  // components/breadcrumb/breadcrumb.js
  function breadcrumb_default(Alpine2) {
    Alpine2.data("breadcrumb", () => {
      return {
        // props
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

  // components/breadcrumb/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(breadcrumb_default);
  });
})();
