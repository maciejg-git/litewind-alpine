document.addEventListener("alpine:init", () => {
  Alpine.data("progress", (props = {}) => {
    return {
      _value: 0,
      interactive: props?.interactive ?? false,

      init() {
        Alpine.bind(this.$el, {
          "x-modelable": "_value",
          "@click"() {
            if (!this.interactive) return
            let ev = this.$event
            let x = (ev.x - ev.target.offsetLeft) / ev.target.clientWidth
            this.$dispatch("progress-clicked", x)
          }
        });
      },
      progressBar: {
        ":style"() {
          return `width: ${this._value}%`;
        },
      },
    };
  });
});
