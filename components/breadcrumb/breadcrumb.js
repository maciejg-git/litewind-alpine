export default function (Alpine) {
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
      },
    };
  });
}
