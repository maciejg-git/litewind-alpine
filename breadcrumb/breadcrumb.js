document.addEventListener("alpine:init", () => {
  Alpine.data("breadcrumb", () => {
    return {
      items: [],
      divider: "/",

      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.items = Alpine.bound(this.$el, "data-items") ?? this.items
          })
        })
        this.divider = Alpine.bound(this.$el, "data-divider") ?? this.divider
      }
    }
  })
})
