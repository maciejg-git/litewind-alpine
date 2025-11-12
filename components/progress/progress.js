export default function (Alpine) {
  Alpine.data("progress", () => {
    let aria = {
      main: {
        role: "progressbar",
        ":aria-valuenow"() {
          return this._value
        }
      }
    }

    return {
      _value: 0,
      // props
      _interactive: false,

      init() {
        Alpine.bind(this.$el, {
          "x-modelable": "_value",
        });

        Alpine.bind(this.$el, aria.main)
      },
      progressBar: {
        ":style"() {
          return `width: ${this._value}%`;
        },
      },
    };
  });
}  
