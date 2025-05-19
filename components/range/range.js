export default function (Alpine) {
  Alpine.data("range", () => {
    return {
      _slider1: {
        value: 0,
      },
      _slider2: {
        value: 0,
      },
      _currentSlider: null,
      _onMousemove: null,
      _lastX: 0,
      _valueX: 0,
      _currentX: 0,
      _min: 0,
      _max: 100,
      _step: 1,
      _steps: 0,
      _fixedMin: false,

      init() {
        this._onMousemove = this.handleMousmove.bind(this)

        this.$nextTick(() => {
          this._min = parseInt(
            Alpine.bound(this.$el, "data-min") ?? this._min
          )
          this._max = parseInt(
            Alpine.bound(this.$el, "data-max") ?? this._max
          )
          this._step = parseInt(
            Alpine.bound(this.$el, "data-step") ?? this._step
          )
          this._steps = (this._max - this._min) / this._step
          this._fixedMin = JSON.parse(
            Alpine.bound(this.$el, "data-fixed-min") ?? this._fixedMin
          )
        })

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
        let value = this.$event.offsetX / this.$el.clientWidth
        let dist1 = Math.abs(value - this._slider1.value)
        let dist2 = Math.abs(value - this._slider2.value)
        if (!this._fixedMin && dist1 < dist2) {
          this._currentSlider = this._slider1
          this.$refs.slider1.focus()
        } else {
          this._currentSlider = this._slider2
          this.$refs.slider2.focus()
        }
        this._currentSlider.value = value
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
        let value = (this._currentX + this._valueX) / this.$el.clientWidth
        value = Math.round(value * this._steps) * (1 / this._steps)
        this._currentSlider.value = value <= 0 ? 0 : value >= 1 ? 1 : value
      },
      trackFill: {
        ":style"() {
          let min = Math.min(this._slider1.value, this._slider2.value)
          let max = Math.max(this._slider1.value, this._slider2.value)
          return {
            left: (min * 100) + "%",
            width: ((max - min) * 100) + "%"
          }
        }
      },
      slider1: {
        "x-show"() {
          return !this._fixedMin
        },
        ":style"() {
          return {
            left: (this._slider1.value * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "slider1",
      },
      slider2: {
        ":style"() {
          return {
            left: (this._slider2.value * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "slider2",
      }
    }
  })
}
