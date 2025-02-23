// components/datepicker/datepicker.js
function datepicker_default(Alpine) {
  Alpine.data("datepicker", (dataExtend = {}) => {
    let getNumberRange = (from, count) => {
      return Array.from({ length: count }, (_, i) => i + from);
    };
    let getCountDaysInMonth = (y, m) => 32 - new Date(y, m, 32).getDate();
    let prevMonth = (m, y) => {
      return m - 1 < 0 ? { m: 11, y: y - 1 } : { m: m - 1, y };
    };
    let nextMonth = (m, y) => {
      return m + 1 > 11 ? { m: 0, y: y + 1 } : { m: m + 1, y };
    };
    let getFirstDay = (m, y, mondayFirstWeekday) => {
      let d = new Date(m, y).getDay();
      return mondayFirstWeekday ? (6 + d) % 7 : d;
    };
    let isValidLocale = (locale) => {
      try {
        Intl.getCanonicalLocales(locale);
        return 1;
      } catch (err) {
        console.warn(err);
      }
    };
    let rangeSelectionStates = {
      UNSELECTED: 0,
      FROM_SELECTED: 1,
      TO_SELECTED: 2
    };
    let bind = {};
    [
      "prevYearButton",
      "prevMonthButton",
      "nextMonthButton",
      "nextYearButton",
      "day"
    ].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
    return {
      today: /* @__PURE__ */ new Date(),
      month: null,
      year: null,
      names: {
        months: null,
        weekdays: null
      },
      locale: "en-GB",
      mondayFirstWeekday: true,
      adjacentMonthsDays: true,
      range: false,
      _model: "",
      selectedSingle: null,
      selectedRange: [],
      rangeState: 0,
      mouseOverDate: null,
      init() {
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();
        this.$nextTick(() => {
          Alpine.effect(() => {
            let locale = Alpine.bound(this.$el, "data-locale") ?? this.locale;
            this.locale = isValidLocale(locale) ? locale : this.locale;
            this.names.months = this.getMonthNames();
            this.names.weekdays = this.getWeekdayNames();
          });
          Alpine.effect(() => {
            this.mondayFirstWeekday = JSON.parse(
              Alpine.bound(this.$el, "data-monday-first-weekday") ?? this.mondayFirstWeekday
            );
          });
          Alpine.effect(() => {
            this.adjacentMonthsDays = JSON.parse(
              Alpine.bound(this.$el, "data-adjacent-months-days") ?? this.adjacentMonthsDays
            );
          });
          Alpine.effect(() => {
            this.range = JSON.parse(
              Alpine.bound(this.$el, "data-range") ?? this.range
            );
            this.reset();
          });
        });
        Alpine.effect(() => {
          let dateRegexp = /^\d{4}-\d{2}-\d{2}$/;
          if (this.range) {
            if (this._model?.length === 2) {
              if (this._model.every((d) => dateRegexp.test(d))) {
                this.selectedRange = this._model.map((d) => new Date(d));
                this.rangeState = rangeSelectionStates.TO_SELECTED;
              }
              return;
            }
            if (this._model?.length === 0) {
              this.selectedRange = [];
              this.rangeState = rangeSelectionStates.UNSELECTED;
            }
            return;
          }
          if (this._model === "" || this._model === null) {
            this.selectedSingle = null;
          }
          if (dateRegexp.test(this._model)) {
            this.selectedSingle = new Date(this._model);
          }
        });
        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model"
        });
      },
      getMonthNames() {
        return Array.from(
          { length: 12 },
          (v, i) => new Date(0, i, 1).toLocaleString(this.locale, {
            month: "short"
          })
        );
      },
      getWeekdayNames() {
        return Array.from(
          { length: 7 },
          (v, i) => new Date(2021, 1, this.mondayFirstWeekday ? i + 1 : i).toLocaleString(
            this.locale,
            {
              weekday: "short"
            }
          )
        );
      },
      dateToModel(date) {
        return date.toISOString().substring(0, 10);
      },
      todayFormatted() {
        return this.today.toLocaleDateString(this.locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      },
      setNextMonth() {
        ({ m: this.month, y: this.year } = nextMonth(this.month, this.year));
      },
      setPrevMonth() {
        ({ m: this.month, y: this.year } = prevMonth(this.month, this.year));
      },
      setNextYear() {
        this.year++;
      },
      setPrevYear() {
        this.year--;
      },
      weekdays() {
        return this.names.weekdays;
      },
      days() {
        let day = getFirstDay(this.year, this.month, this.mondayFirstWeekday);
        let daysInMonth = getCountDaysInMonth(this.year, this.month);
        let days = getNumberRange(1, daysInMonth);
        days = days.map((i) => new Date(Date.UTC(this.year, this.month, i)));
        let { m, y } = prevMonth(this.month, this.year);
        let daysCountPrev = getCountDaysInMonth(y, m);
        let prevMonthDays = getNumberRange(daysCountPrev - day + 1, day);
        if (!this.adjacentMonthsDays) {
          prevMonthDays = prevMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        } else {
          prevMonthDays = prevMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        }
        ({ m, y } = nextMonth(this.month, this.year));
        let daysCountNext = 42 - daysInMonth - day;
        let nextMonthDays = null;
        if (!this.adjacentMonthsDays) {
          nextMonthDays = [];
        } else {
          nextMonthDays = getNumberRange(1, daysCountNext);
          nextMonthDays = nextMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        }
        return [...prevMonthDays, ...days, ...nextMonthDays];
      },
      currentDate() {
        if (!this.names.months) return "";
        return `${this.names.months[this.month]} ${this.year}`;
      },
      reset() {
        this.selectedSingle = "";
        this.selectedRange = [];
        this._model = "";
        this.rangeState = rangeSelectionStates.UNSELECTED;
        this.mouseOverDate = null;
      },
      addRange() {
        if (this.rangeState === rangeSelectionStates.TO_SELECTED) {
          this.selectedRange = [];
          this.rangeState = rangeSelectionStates.UNSELECTED;
        }
        this.selectedRange[this.rangeState] = this.d;
        this.rangeState++;
        if (this.rangeState === rangeSelectionStates.TO_SELECTED) {
          if (this.selectedRange[0] > this.selectedRange[1]) {
            this.selectedRange.reverse();
          }
        }
      },
      getDayKey() {
        return this.d.toISOString() + this.isAdjacent();
      },
      getDayText() {
        return this.d.getDate();
      },
      isToday() {
        return this.today.getDate() === this.d.getUTCDate() && this.today.getMonth() === this.d.getUTCMonth() && this.today.getFullYear() === this.d.getUTCFullYear();
      },
      isAdjacent() {
        return this.d.getMonth() !== this.month;
      },
      isSelected() {
        return this.selectedSingle && this.selectedSingle.getTime() == this.d.getTime();
      },
      isSelectedRange() {
        if (this.range && this.rangeState === rangeSelectionStates.TO_SELECTED) {
          return this.selectedRange[0] <= this.d && this.d <= this.selectedRange[1];
        }
        return false;
      },
      isPartiallySelected() {
        if (this.range && this.rangeState === rangeSelectionStates.FROM_SELECTED) {
          return this.mouseOverDate >= this.d && this.d >= this.selectedRange[0] || this.mouseOverDate <= this.d && this.d <= this.selectedRange[0];
        }
        return false;
      },
      handleDayClick() {
        if (this.isAdjacent()) {
          this.month = this.d.getMonth();
          this.year = this.d.getFullYear();
        }
        if (this.range) {
          this.addRange();
          this._model = this.selectedRange.map((d) => this.dateToModel(d));
          return;
        }
        this.selectedSingle = this.d;
        this._model = this.dateToModel(this.selectedSingle);
        if (!this.range || this.rangeState === rangeSelectionStates.TO_SELECTED) {
          this.$dispatch("datepicker-selection-complete");
        }
      },
      prevMonthButton: {
        "@click"() {
          this.setPrevMonth();
        },
        ...bind.prevMonthButton
      },
      nextMonthButton: {
        "@click"() {
          this.setNextMonth();
        },
        ...bind.nextMonthButton
      },
      prevYearButton: {
        "@click"() {
          this.setPrevYear();
        },
        ...bind.prevYearButton
      },
      nextYearButton: {
        "@click"() {
          this.setNextYear();
        },
        ...bind.nextYearButton
      },
      day: {
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.isAdjacent()) {
            if (!this.adjacentMonthsDays) {
              this.$el.style.visibility = "hidden";
              return;
            }
            return classes["class-adjacent"]?.textContent || "";
          }
          if (this.isSelected()) {
            c += (classes["class-selected"]?.textContent || "") + " ";
          } else if (this.isSelectedRange()) {
            c += (classes["class-selected-range"]?.textContent || "") + " ";
          } else if (this.isPartiallySelected()) {
            c += (classes["class-partially-selected"]?.textContent || "") + " ";
          } else if (typeof this.isDisabled === "function" && this.isDisabled(this.d)) {
            c += (classes["class-disabled"]?.textContent || "") + " ";
          } else {
            c += (classes["class-default"]?.textContent || "") + " ";
          }
          if (this.isToday()) {
            c += (classes["class-today"]?.textContent || "") + " ";
          }
          return c;
        },
        "@click"() {
          this.handleDayClick();
        },
        "@mouseenter"() {
          this.mouseOverDate = this.d;
        },
        ...bind.day
      },
      ...dataExtend
    };
  });
}

// components/datepicker/builds/module.js
var module_default = datepicker_default;
export {
  module_default as default
};
