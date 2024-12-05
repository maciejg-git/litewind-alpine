document.addEventListener("alpine:init", () => {
  Alpine.data("table", (props, defaults = {}) => {
    let undefNullToStr = (v) => (v === undefined || v === null ? "" : v);

    let isDate = (d) => Object.prototype.toString.call(d) == "[object Date]";

    let compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

    let itemCompare = (a, b, direction, localeCompare) => {
      a = undefNullToStr(a);
      b = undefNullToStr(b);

      if (isDate(a) && isDate(b)) return compare(a, b) * direction;

      if (typeof a == "number" && typeof b == "number") {
        if (isNaN(a) && !isNaN(b)) return -1;
        if (!isNaN(a) && isNaN(b)) return 1;
        return compare(a, b) * direction;
      }

      return localeCompare(a, b) * direction;
    };

    let formatLabelCase = (value) =>
      value.replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      );

    let isFunction = (f) => typeof f === "function";

    let definitionDefaults = {
      sortable: false,
      filterable: true,
      visible: true,
    };

    return {
      tableData: [],
      definition: [],
      sortKey: "",
      sortAsc: 1,
      filter: "",
      page: 1,
      itemsPerPage: 0,
      locale: "en-GB",
      primaryKey: props.primaryKey ?? "",
      data: [],

      init() {
        Alpine.effect(() => {
          let data = isFunction(props.data) ? props.data() : props.data ?? [];
          this.tableData = [...data];
          this.definition = this.getDefinition();
        });
        Alpine.effect(() => {
          this.filter = isFunction(props.filter)
            ? props.filter()
            : props.filter ?? this.filter;
          this.page = 1;
        });
        Alpine.effect(() => {
          this.page = isFunction(props.page)
            ? props.page()
            : props.page ?? this.page;
        });
        Alpine.effect(() => {
          this.itemsPerPage = isFunction(props.itemsPerPage)
            ? props.itemsPerPage()
            : props.itemsPerPage ?? this.itemsPerPage;
          this.page = 1;
        });
        Alpine.effect(() => {
          this.locale = isFunction(props.locale)
            ? props.locale()
            : props.locale ?? this.locale;
        });
        Alpine.effect(() => {
          if (props.data) return
          this.tableData = [...this.data]
          this.definition = this.getDefinition();
        })
      },
      generateDefinitionFromData() {
        if (!this.tableData || !this.tableData.length) return [];

        return Object.keys(this.tableData[0]).map((item) => {
          return { key: item };
        });
      },
      getUserDefinition() {
        if (!Array.isArray(props.definition)) return false;
        return props.definition.every((i) => i.key) && props.definition;
      },
      getDefinition() {
        let definition =
          this.getUserDefinition() || this.generateDefinitionFromData();

        return definition.map((i) => {
          return {
            ...definitionDefaults,
            ...i,
            label: i.label || formatLabelCase(i.key),
          };
        });
      },
      getDataSorted() {
        if (!this.sortKey) return this.tableData;

        let compare = new Intl.Collator(this.locale).compare;

        return this.tableData.sort((a, b) =>
          itemCompare(a[this.sortKey], b[this.sortKey], this.sortAsc, compare)
        );
      },
      getFilterableKeys() {
        return this.definition
          .filter((k) => k.filterable !== false && k.visible !== false)
          .map((k) => k.key);
      },
      getDataFiltered() {
        if (!this.filter) return this.getDataSorted();

        let filter = new RegExp(
          this.filter.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
          "i"
        );

        let filterableKeys = this.getFilterableKeys();

        let filteredData = this.getDataSorted().filter((item) => {
          return filterableKeys.some((key) => {
            return (item[key] + "").search(filter) !== -1;
          });
        });

        return filteredData
      },
      getDataPaginated() {
        let filteredData = this.getDataFiltered()

        if (isFunction(props.onFilter)) {
          props.onFilter(filteredData)
        }

        if (!this.itemsPerPage) return filteredData;

        return filteredData.slice(
          (this.page - 1) * this.itemsPerPage,
          this.page * this.itemsPerPage
        );
      },
      isSortable() {
        return this.col.sortable;
      },
      isSorted() {
        return this.sortKey === this.col.key;
      },
      isSortedAsc() {
        return this.isSorted() && this.sortAsc === 1;
      },
      isSortedDesc() {
        return this.isSorted() && this.sortAsc === -1;
      },
      highlight(string, match, classes) {
        classes = classes || "match";

        return (string + "").replace(
          new RegExp(
            `(${match.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")})`,
            "i"
          ),
          `<span class='${classes}'>$1</span>`
        );
      },
      header: {
        "@click"() {
          if (!this.isSortable()) return;
          this.sortAsc = this.sortKey === this.col.key ? -this.sortAsc : 1;
          this.sortKey = this.col.key;
        },
        ":class"() {
          return this.isSortable() ? "cursor-pointer" : "";
        },
      },
    };
  });
});
