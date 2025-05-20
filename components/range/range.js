export default function (Alpine) {
  let clamp = (value, min, max) => value <= min ? min : value >= max ? max : value

  let getStep = (value, steps) => Math.round(value * steps) * (1 / steps)

  Alpine.data("range", () => {
    return {
      _slider1: {
        value: 0,
        name: "slider1",
      },
      _slider2: {
        value: 0,
        name: "slider2",
      },
      _currentSlider: null,
      _onMousemove: null,
      _lastX: 0,
      _valueX: 0,
      _currentX: 0,
      _min: 0,
      _max: 100,
      _range: 0,
      _step: 1,
      _steps: 0,
      _fixedMin: false,
      _maxValue: 0,

      init() {
        this._onMousemove = this.handleMousmove.bind(this)

        this.$nextTick(() => {
          this._min = parseFloat(
            Alpine.bound(this.$el, "data-min") ?? this._min
          )
          this._max = parseFloat(
            Alpine.bound(this.$el, "data-max") ?? this._max
          )
          this._step = parseFloat(
            Alpine.bound(this.$el, "data-step") ?? this._step
          )
          this._fixedMin = JSON.parse(
            Alpine.bound(this.$el, "data-fixed-min") ?? this._fixedMin
          )

          this._range = this._max - this._min
          this._steps = this._range / this._step
          this._maxValue = (Math.floor(this._steps) * this._step) / this._range
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
        this._currentSlider = this.getClosestSlider(value)
        this.$refs[this._currentSlider.name].focus()
        this._currentSlider.value = getStep(value, this._steps)
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
        value = getStep(value, this._steps)
        this._currentSlider.value = clamp(value, 0, this._maxValue)
      },
      getClosestSlider(value) {
        if (this._fixedMin) {
          return this._slider2
        }
        let dist1 = Math.abs(value - this._slider1.value)
        let dist2 = Math.abs(value - this._slider2.value)
        if (dist1 < dist2) {
          return this._slider1
        } else {
          return this._slider2
        }
      },
      getValue1() {
        return (this._slider1.value * this._range) + this._min
      },
      getValue2() {
        return (this._slider2.value * this._range) + this._min
      },
      getSteps() {
        return Math.floor(this._steps)
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
