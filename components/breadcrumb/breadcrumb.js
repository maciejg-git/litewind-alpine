export default function (Alpine) {
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
      },
    };
  });
}
