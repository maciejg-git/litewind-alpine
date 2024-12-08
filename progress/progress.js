document.addEventListener("alpine:init", () => {
  Alpine.data("progress", (props = {}) => {
    return {
      value: 0,
      interactive: props?.interactive ?? false,

      init() {
        Alpine.bind(this.$el, {
          "x-modelable": "value",
          "@click"() {
            if (!this.interactive) return
            let ev = this.$event
            let x = (ev.x - ev.target.offsetLeft) / ev.target.clientWidth
            this.value = x * 100
          }
        });
      },
      progressBar: {
        ":style"() {
          return `width: ${this.value}%`;
        },
      },
    };
  });
});
