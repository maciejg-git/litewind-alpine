export default function (Alpine) {
  Alpine.data("datepicker", () => {
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
        Intl.getCanonicalLocales(locale)
        return 1
      } catch(err) {
        console.warn(err)
      }
    }

    const UNSELECTED = 0
    const FROM_SELECTED = 1
    const TO_SELECTED = 2

    return {
      _today: new Date(),
      _month: null,
      _year: null,
      _names: {
        months: null,
        weekdays: null,
      },
      _model: "",
      _selectedSingle: null,
      _selectedRange: [],
      _rangeState: 0,
      _mouseOverDate: null,
      // props
      _locale: "en-GB",
      _mondayFirstWeekday: true,
      _adjacentMonthsDays: true,
      _range: false,

      init() {
        this._month = this._today.getMonth();
        this._year = this._today.getFullYear();

        this.$nextTick(() => {
          Alpine.effect(() => {
            let locale = Alpine.bound(this.$el, "data-locale") ?? this._locale
            this._locale = isValidLocale(locale) ? locale : this._locale
            this._names.months = this.getMonthNames();
            this._names.weekdays = this.getWeekdayNames();
          });
          Alpine.effect(() => {
            this._mondayFirstWeekday = JSON.parse(
              Alpine.bound(this.$el, "data-monday-first-weekday") ??
                this._mondayFirstWeekday,
            );
          });
          Alpine.effect(() => {
            this._adjacentMonthsDays = JSON.parse(
              Alpine.bound(this.$el, "data-adjacent-months-days") ??
                this._adjacentMonthsDays,
            );
          });
          Alpine.effect(() => {
            this._range = JSON.parse(
              Alpine.bound(this.$el, "data-range") ?? this._range,
            );
            this.reset();
          });
        });

        // update local selection after model changes
        Alpine.effect(() => {
          let dateRegexp = /^\d{4}-\d{2}-\d{2}$/;

          if (this._range) {
            if (this._model?.length === 2) {
              if (this._model.every((d) => dateRegexp.test(d))) {
                this._selectedRange = this._model.map((d) => new Date(d));
                this._rangeState = TO_SELECTED;
              }
              return;
            }
            if (this._model?.length === 0) {
              this._selectedRange = [];
              this._rangeState = UNSELECTED;
            }
            return;
          }
          if (this._model === "" || this._model === null) {
            this._selectedSingle = null;
          }
          if (dateRegexp.test(this._model)) {
            this._selectedSingle = new Date(this._model);
          }
        });

        Alpine.bind(this.$el, {
          ["x-modelable"]: "_model",
        });
      },
      getMonthNames() {
        return Array.from({ length: 12 }, (v, i) =>
          new Date(0, i, 1).toLocaleString(this._locale, {
            month: "short",
          }),
        );
      },
      getWeekdayNames() {
        return Array.from({ length: 7 }, (v, i) =>
          new Date(2021, 1, this._mondayFirstWeekday ? i + 1 : i).toLocaleString(
            this._locale,
            {
              weekday: "short",
            },
          ),
        );
      },
      dateToModel(date) {
        return date.toISOString().substring(0, 10);
      },
      todayFormatted() {
        return this._today.toLocaleDateString(this._locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
      setNextMonth() {
        ({ m: this._month, y: this._year } = nextMonth(this._month, this._year));
      },
      setPrevMonth() {
        ({ m: this._month, y: this._year } = prevMonth(this._month, this._year));
      },
      setNextYear() {
        this._year++;
      },
      setPrevYear() {
        this._year--;
      },
      weekdays() {
        return this._names.weekdays;
      },
      days() {
        let day = getFirstDay(this._year, this._month, this._mondayFirstWeekday);
        let daysInMonth = getCountDaysInMonth(this._year, this._month);

        let days = getNumberRange(1, daysInMonth);
        days = days.map((i) => new Date(Date.UTC(this._year, this._month, i)));

        let { m, y } = prevMonth(this._month, this._year);

        let daysCountPrev = getCountDaysInMonth(y, m);

        let prevMonthDays = getNumberRange(daysCountPrev - day + 1, day);
        if (!this._adjacentMonthsDays) {
          prevMonthDays = prevMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        } else {
          prevMonthDays = prevMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        }

        ({ m, y } = nextMonth(this._month, this._year));

        let daysCountNext = 42 - daysInMonth - day;

        let nextMonthDays = null;

        if (!this._adjacentMonthsDays) {
          nextMonthDays = [];
        } else {
          nextMonthDays = getNumberRange(1, daysCountNext);
          nextMonthDays = nextMonthDays.map((i) => new Date(Date.UTC(y, m, i)));
        }

        return [...prevMonthDays, ...days, ...nextMonthDays];
      },
      currentDate() {
        if (!this._names.months) return "";
        return `${this._names.months[this._month]} ${this._year}`;
      },
      reset() {
        this._selectedSingle = "";
        this._selectedRange = [];
        this._model = "";
        this._rangeState = UNSELECTED;
        this._mouseOverDate = null;
      },
      addRange() {
        if (this._rangeState === TO_SELECTED) {
          this._selectedRange = [];
          this._rangeState = UNSELECTED;
        }
        this._selectedRange[this._rangeState] = this.d;
        this._rangeState++;
        if (this._rangeState === TO_SELECTED) {
          if (this._selectedRange[0] > this._selectedRange[1]) {
            this._selectedRange.reverse();
          }
        }
      },
      getDayKey() {
        return this.d.toISOString() + this.isAdjacent();
      },
      getDayText() {
        return this.d.getDate()
      },
      isToday() {
        return (
          this._today.getDate() === this.d.getUTCDate() &&
          this._today.getMonth() === this.d.getUTCMonth() &&
          this._today.getFullYear() === this.d.getUTCFullYear()
        );
      },
      isAdjacent() {
        return this.d.getMonth() !== this._month;
      },
      isSelected() {
        return (
          this._selectedSingle &&
          this._selectedSingle.getTime() == this.d.getTime()
        );
      },
      isSelectedRange() {
        if (
          this._range &&
          this._rangeState === TO_SELECTED
        ) {
          return (
            this._selectedRange[0] <= this.d && this.d <= this._selectedRange[1]
          );
        }
        return false;
      },
      isPartiallySelected() {
        if (
          this._range &&
          this._rangeState === FROM_SELECTED
        ) {
          return (
            (this._mouseOverDate >= this.d && this.d >= this._selectedRange[0]) ||
            (this._mouseOverDate <= this.d && this.d <= this._selectedRange[0])
          );
        }
        return false;
      },
      handleDayClick() {
        if (this.isAdjacent()) {
          this._month = this.d.getMonth();
          this._year = this.d.getFullYear();
        }

        if (this._range) {
          this.addRange();
          if (this._rangeState === TO_SELECTED) {
            this._model = this._selectedRange.map((d) => this.dateToModel(d));
            this.$dispatch("datepicker-selection-complete");
          }
          return;
        }

        this._selectedSingle = this.d;
        this._model = this.dateToModel(this._selectedSingle);

        this.$dispatch("datepicker-selection-complete");
      },
      prevMonthButton: {
        "@click"() {
          this.setPrevMonth();
        },
      },
      nextMonthButton: {
        "@click"() {
          this.setNextMonth();
        },
      },
      prevYearButton: {
        "@click"() {
          this.setPrevYear();
        },
      },
      nextYearButton: {
        "@click"() {
          this.setNextYear();
        },
      },
      day: {
        ":class"() {
          let classes = this.$el.attributes;
          let c = "";
          if (this.isAdjacent()) {
            if (!this._adjacentMonthsDays) {
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
          this._mouseOverDate = this.d;
        },
      },
    };
  });
}  
