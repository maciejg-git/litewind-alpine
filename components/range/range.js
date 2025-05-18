export default function (Alpine) {
  Alpine.data("range", () => {
    return {
      _value: 0,
      _onMousemove: null,
      _lastX: 0,
      _valueX: 0,
      _currentX: 0,

      init() {
        this._onMousemove = this.handleMousmove.bind(this)

        Alpine.bind(this.$el, {
          "@mousedown.prevent"() {
            this.handleMousedown()
          },
          "@mouseup.window"() {
            this.handleMouseup()
          }
        })
      },
      handleMousedown() {
        this.$refs.slider.focus()
        this._value = this.$event.offsetX / this.$el.clientWidth
        window.addEventListener("mousemove", this._onMousemove)
        this._lastX = this.$event.pageX
        this._valueX = this.$event.offsetX
      },
      handleMouseup() {
        window.removeEventListener("mousemove", this._onMousemove)
        this._lastX = 0
        this._currentX = 0
        this._valueX = 0
      },
      handleMousmove(event) {
        let movementX = event.pageX - this._lastX
        this._currentX = this._currentX + movementX
        this._lastX = event.pageX
        this._value = (this._currentX + this._valueX) / this.$el.clientWidth
        this._value = this._value <= 0 ? 0 : this._value >= 1 ? 1 : this._value
      },
      trackFill: {
        ":style"() {
          return {
            width: (this._value * 100) + "%"
          }
        }
      },
      slider: {
        ":style"() {
          return {
            left: (this._value * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "slider",
      }
    }
  })
}
