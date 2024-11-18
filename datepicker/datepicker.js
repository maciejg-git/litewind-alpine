document.addEventListener("alpine:init", () => {
  Alpine.data("datepicker", (props = {}) => {
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

    let isFunction = (f) => typeof f === "function";

    let rangeSelectionStates = {
      UNSELECTED: 0,
      FROM_SELECTED: 1,
      TO_SELECTED: 2,
    };

    return {
      today: new Date(),
      month: null,
      year: null,
      names: {
        months: null,
        weekdays: null,
      },
      locale: "en-GB",
      mondayFirstWeekday: true,
      adjacentMonthsDays: true,
      range: false,
      _model: null,
      selectedSingle: null,
      selectedRange: [],
      rangeState: 0,
      mouseOverDate: null,
      modelSeparator: "-",

      init() {
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();

        Alpine.effect(() => {
          this.locale = isFunction(props.locale)
            ? props.locale()
            : props.locale ?? this.locale;
          this.names.months = this.getMonthNames();
          this.names.weekdays = this.getWeekdayNames();
        });
        Alpine.effect(() => {
          this.mondayFirstWeekday = isFunction(props.mondayFirstWeekday)
            ? props.mondayFirstWeekday()
            : props.mondayFirstWeekday ?? this.mondayFirstWeekday;
        });
        Alpine.effect(() => {
          this.adjacentMonthsDays = isFunction(props.adjacentMonthsDays)
            ? props.adjacentMonthsDays()
            : props.adjacentMonthsDays ?? this.adjacentMonthsDays;
        });
        Alpine.effect(() => {
          this.range = isFunction(props.range)
            ? props.range()
            : props.range ?? this.range;
          this.reset()
        });

        Alpine.effect(() => {
          let dateRegexp = /^\d{4}-\d{2}-\d{2}$/;

          if (this.range && this._model?.length === 2) {
            if (this._model.every((d) => dateRegexp.test(d))) {
              this.selectedRange = this._model.map((d) => new Date(d));
              this.rangeState = rangeSelectionStates.TO_SELECTED
            }
            return
          }
          if (dateRegexp.test(this._model)) {
            this.selectedSingle = new Date(this._model)
          }
        });

        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
        });
      },
      getMonthNames() {
        return Array.from({ length: 12 }, (v, i) =>
          new Date(0, i, 1).toLocaleString(this.locale, {
            month: "short",
          })
        );
      },
      getWeekdayNames() {
        return Array.from({ length: 7 }, (v, i) =>
          new Date(2021, 1, this.mondayFirstWeekday ? i + 1 : i).toLocaleString(
            this.locale,
            {
              weekday: "short",
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
          day: "numeric",
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
          prevMonthDays = prevMonthDays.map((i) => "");
        } else {
          prevMonthDays = prevMonthDays.map((i) => new Date(y, m, i));
        }

        ({ m, y } = nextMonth(this.month, this.year));

        let daysCountNext = 42 - daysInMonth - day;

        let nextMonthDays = null;

        if (!this.adjacentMonthsDays) {
          nextMonthDays = [];
        } else {
          nextMonthDays = getNumberRange(1, daysCountNext);
          nextMonthDays = nextMonthDays.map((i) => new Date(y, m, i));
        }

        return [...prevMonthDays, ...days, ...nextMonthDays];
      },
      currentDate() {
        return `${this.names.months[this.month]} ${this.year}`;
      },
      reset() {
        this.selectedSingle = "";
        this.selectedRange = [];
        this._model = null;
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
      isToday() {
        return (
          this.today.getDate() === this.d.getUTCDate() &&
          this.today.getMonth() === this.d.getUTCMonth() &&
          this.today.getFullYear() === this.d.getUTCFullYear()
        );
      },
      isAdjacent() {
        return this.d.getMonth() !== this.month;
      },
      isSelected() {
        return (
          this.selectedSingle &&
          this.selectedSingle.getTime() == this.d.getTime()
        );
      },
      isSelectedRange() {
        if (
          this.range &&
          this.rangeState === rangeSelectionStates.TO_SELECTED
        ) {
          return (
            this.selectedRange[0] <= this.d && this.d <= this.selectedRange[1]
          );
        }
        return false;
      },
      isPartiallySelected() {
        if (
          this.range &&
          this.rangeState === rangeSelectionStates.FROM_SELECTED
        ) {
          return (
            (this.mouseOverDate >= this.d && this.d >= this.selectedRange[0]) ||
            (this.mouseOverDate <= this.d && this.d <= this.selectedRange[0])
          );
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
          this.$dispatch("datepicker-selection-complete")
        }
      },
      prevMonthButton: {
        ["@click"]() {
          this.setPrevMonth();
        },
      },
      nextMonthButton: {
        ["@click"]() {
          this.setNextMonth();
        },
      },
      prevYearButton: {
        ["@click"]() {
          this.setPrevYear();
        },
      },
      nextYearButton: {
        ["@click"]() {
          this.setNextYear();
        },
      },
      day: {
        [":class"]() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.isAdjacent()) {
            return classes["class-adjacent"]?.textContent || "";
          }

          if (this.isSelected()) {
            c += (classes["class-selected"]?.textContent || "") + " ";
          } else if (this.isSelectedRange()) {
            c += (classes["class-selected-range"]?.textContent || "") + " ";
          } else if (this.isPartiallySelected()) {
            c += (classes["class-partially-selected"]?.textContent || "") + " ";
          } else {
            c += (classes["class-default"]?.textContent || "") + " ";
          }

          if (this.isToday()) {
            c += (classes["class-today"]?.textContent || "") + " ";
          }

          return c;
        },
        ["@click"]() {
          this.handleDayClick();
        },
        ["@mouseenter"]() {
          this.mouseOverDate = this.d;
        },
      },
    };
  });
});
