export default function (Alpine) {
  Alpine.data("range", () => {
    return {
      _valueMin: 0,
      _valueMax: 0,
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
        this.$refs.sliderMax.focus()
        this._valueMax = this.$event.offsetX / this.$el.clientWidth
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
        this._valueMax = (this._currentX + this._valueX) / this.$el.clientWidth
        this._valueMax = this._valueMax <= 0 ? 0 : this._valueMax >= 1 ? 1 : this._valueMax
      },
      trackFill: {
        ":style"() {
          return {
            width: (this._valueMax * 100) + "%"
          }
        }
      },
      sliderMin: {
        ":style"() {
          return {
            left: (this._valueMin * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "sliderMax",
      },
      sliderMax: {
        ":style"() {
          return {
            left: (this._valueMax * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "sliderMax",
      }
    }
  })
}
