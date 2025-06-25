(() => {
  // components/progress/progress.js
  function progress_default(Alpine2) {
    Alpine2.data("progress", () => {
      let aria = {
        main: {
          role: "progressbar",
          ":aria-valuenow"() {
            return this._value;
          }
        }
      };
      return {
        _value: 0,
        // props
        _interactive: false,
        init() {
          this._interactive = JSON.parse(
            Alpine2.bound(this.$el, "data-interactive") ?? this._interactive
          );
          Alpine2.bind(this.$el, {
            "x-modelable": "_value",
            "@click"() {
              if (!this._interactive) return;
              let ev = this.$event;
              let x = (ev.x - ev.target.offsetLeft) / ev.target.clientWidth;
              this.$dispatch("progress-clicked", x);
            }
          });
          Alpine2.bind(this.$el, aria.main);
        },
        progressBar: {
          ":style"() {
            return `width: ${this._value}%`;
          }
        }
      };
    });
  }

  // components/progress/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(progress_default);
  });
})();
