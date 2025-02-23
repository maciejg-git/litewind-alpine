// components/progress/progress.js
function progress_default(Alpine) {
  Alpine.data("progress", (dataExtend = {}) => {
    let aria = {
      main: {
        role: "progressbar",
        ":aria-valuenow"() {
          return this._value;
        }
      }
    };
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
          Alpine.bound(this.$el, "data-interactive") ?? this.interactive
        );
        Alpine.bind(this.$el, {
          "x-modelable": "_value",
          "@click"() {
            if (!this.interactive) return;
            let ev = this.$event;
            let x = (ev.x - ev.target.offsetLeft) / ev.target.clientWidth;
            this.$dispatch("progress-clicked", x);
          }
        });
        Alpine.bind(this.$el, aria.main);
      },
      progressBar: {
        ":style"() {
          return `width: ${this._value}%`;
        },
        ...bind.progressBar
      },
      ...dataExtend
    };
  });
}

// components/progress/builds/module.js
var module_default = progress_default;
export {
  module_default as default
};
