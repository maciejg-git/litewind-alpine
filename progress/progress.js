document.addEventListener("alpine:init", () => {
  Alpine.data("progress", (props = {}, dataExtend = {}) => {
    let bind = {};
    ["progressBar"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });

    return {
      _value: 0,
      interactive: false,

      init() {
        this.interactive = JSON.parse(
          Alpine.bound(this.$el, "data-interactive") ?? this.interactive,
        );
        Alpine.bind(this.$el, {
          "x-modelable": "_value",
          "@click"() {
            if (!this.interactive) return;
            let ev = this.$event;
            let x = (ev.x - ev.target.offsetLeft) / ev.target.clientWidth;
            this.$dispatch("progress-clicked", x);
          },
        });
      },
      progressBar: {
        ":style"() {
          return `width: ${this._value}%`;
        },
        ...bind.progressBar,
      },
      ...dataExtend,
    };
  });
});
