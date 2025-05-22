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
      _range: 0,
      _steps: 0,
      _maxValue: 0,
      // props
      _min: 0,
      _max: 100,
      _step: 1,
      _fixedMin: false,
      _showSteps: false,
      _showLabels: false,

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
          this._showSteps = JSON.parse(
            Alpine.bound(this.$el, "data-show-steps") ?? this._showSteps
          )
          this._showLabels = JSON.parse(
            Alpine.bound(this.$el, "data-show-labels") ?? this._showLabels
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
        this._currentX = 0
      },
      handleMouseup() {
        window.removeEventListener("mousemove", this._onMousemove)
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
        return dist1 < dist2 ? this._slider1 : this._slider2
      },
      getValue1() {
        return (this._slider1.value * this._range) + this._min
      },
      getValue2() {
        return (this._slider2.value * this._range) + this._min
      },
      getSteps() {
        return Math.floor(this._steps) + 1
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
      },
      label1: {
        "x-show"() {
          return this._showLabels
        },
        "x-text"() {
          return this.getValue1()
        }
      },
      label2: {
        "x-show"() {
          return this._showLabels
        },
        "x-text"() {
          return this.getValue2()
        }
      },
      step: {
        ":style"() {
          return {
            left: (((this._step / this._range) * 100) * this.index) + "%",
            transform: "translateX(-50%)",
          }
        },
        ":class"() {
          let step = (this._step / this._range) * this.index
          let min = Math.min(this._slider1.value, this._slider2.value)
          let max = Math.max(this._slider1.value, this._slider2.value)

          let classes = this.$el.attributes
          let c = ""
          if (step >= min && step <= max) {
            c = (classes["class-filled"]?.textContent || "")
          } else {
            c = (classes["class-default"]?.textContent || "")
          }

          return c
        }
      }
    }
  })
}
