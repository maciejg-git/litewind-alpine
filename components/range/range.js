export default function (Alpine) {
  let aria = {
    sliderMin: {
      role: "slider",
      ":aria-valuemin"() {
        return this._min
      },
      ":aria-valuemax"() {
        return this._max
      },
      ":aria-valuenow"() {
        return this.getValueMin()
      }
    },
    sliderMax: {
      role: "slider",
      ":aria-valuemin"() {
        return this._min
      },
      ":aria-valuemax"() {
        return this._max
      },
      ":aria-valuenow"() {
        return this.getValueMax()
      }
    }
  }

  let clamp = (value, min, max) => value <= min ? min : value >= max ? max : value

  let getStep = (value, steps) => Math.round(value * steps) * (1 / steps)

  Alpine.data("range", () => {
    return {
      _sliderMin: {
        value: 0,
        name: "sliderMin",
      },
      _sliderMax: {
        value: 0,
        name: "sliderMax",
      },
      _currentSlider: null,
      _onMousemove: null,
      _throttledOnMouseMove: null,
      _range: 0,
      _steps: 0,
      _maxValue: 0,
      _model: [],
      _stepPrecision: 0,
      // props
      _min: 0,
      _max: 100,
      _step: 1,
      _fixedMin: false,
      _showSteps: false,
      _showLabels: false,

      init() {
        this._onMousemove = this.handleMousmove.bind(this)
        this._throttledOnMouseMove = Alpine.throttle(this._onMousemove, 50)

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
          let step = this._step.toString().split(".")
          this._stepPrecision = step[1] && step[1].length || 0

          this.$watch("_model", this.onModelUpdate.bind(this))
          this.onModelUpdate()
        })

        Alpine.bind(this.$el, {
          "x-modelable": "_model",
          "@mousedown.prevent"() {
            this.handleMousedown()
          },
          "@mouseup.window"() {
            this.handleMouseup()
          }
        })
      },
      handleMousedown() {
        window.addEventListener("mousemove", this._throttledOnMouseMove)

        if (this.$event.target === this.$refs.sliderMin) {
          this._currentSlider = this._sliderMin
          this.$refs.sliderMin.focus()
          return
        }
        if (this.$event.target === this.$refs.sliderMax) {
          this._currentSlider = this._sliderMax
          this.$refs.sliderMax.focus()
          return
        }

        let { x, width } = this.$el.getBoundingClientRect()
        let value = (this.$event.clientX - x) / width

        this._currentSlider = (this._fixedMin && this._sliderMax) || this.getClosestSlider(value)
        this.$refs[this._currentSlider.name].focus()
        this._currentSlider.value = getStep(value, this._steps)

        this.updateModel()
      },
      handleMouseup() {
        window.removeEventListener("mousemove", this._throttledOnMouseMove)
      },
      handleMousmove(event) {
        let { x, width } = this.$el.getBoundingClientRect()
        let value = (event.clientX - x) / width
        value = getStep(value, this._steps)
        value = clamp(value, 0, this._maxValue)

        if (value > this._sliderMax.value && this._currentSlider === this._sliderMin) {
          this._currentSlider = this._sliderMax
          this._sliderMin.value = this._sliderMax.value
          this.$refs.sliderMax.focus()
        }

        if (value < this._sliderMin.value && this._currentSlider === this._sliderMax) {
          this._currentSlider = this._sliderMin
          this._sliderMax.value = this._sliderMin.value
          this.$refs.sliderMin.focus()
        }

        this._currentSlider.value = value
        this.updateModel()
      },
      getClosestSlider(value) {
        let dist1 = Math.abs(value - this._sliderMin.value)
        let dist2 = Math.abs(value - this._sliderMax.value)
        return dist1 < dist2 ? this._sliderMin : this._sliderMax
      },
      getValueMin() {
        return (this._sliderMin.value * this._range) + this._min
      },
      getValueMax() {
        return (this._sliderMax.value * this._range) + this._min
      },
      getSteps() {
        return Math.floor(this._steps) + 1
      },
      updateModel() {
        let min = this.getValueMin().toFixed(this._stepPrecision)
        let max = this.getValueMax().toFixed(this._stepPrecision)
        this._model[0] = parseFloat(min)
        this._model[1] = parseFloat(max)
      },
      onModelUpdate() {
        if (this._model.length !== 2) {
          return
        }
        let minOffset = this._min / this._range
        let min = (this._model[0] / this._range) - minOffset
        let max = (this._model[1] / this._range) - minOffset
        this._sliderMin.value = getStep(min, this._steps)
        this._sliderMax.value = getStep(max, this._steps)
      },
      trackFill: {
        ":style"() {
          return {
            left: (this._sliderMin.value * 100) + "%",
            width: ((this._sliderMax.value - this._sliderMin.value) * 100) + "%"
          }
        }
      },
      sliderMin: {
        "x-show"() {
          return !this._fixedMin
        },
        ":style"() {
          return {
            left: (this._sliderMin.value * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "sliderMin",
        ...aria.sliderMin,
      },
      sliderMax: {
        ":style"() {
          return {
            left: (this._sliderMax.value * 100) + "%",
            transform: "translateX(-50%)",
          }
        },
        "x-ref": "sliderMax",
        ...aria.sliderMax,
      },
      labelMin: {
        "x-show"() {
          return this._showLabels
        },
        "x-text"() {
          return this.getValueMin().toFixed(this._stepPrecision)
        }
      },
      labelMax: {
        "x-show"() {
          return this._showLabels
        },
        "x-text"() {
          return this.getValueMax().toFixed(this._stepPrecision)
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

          let classes = this.$el.attributes
          let c = ""
          if (step >= this._sliderMin.value && step <= this._sliderMax.value) {
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
