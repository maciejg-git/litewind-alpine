// components/table/table.js
function table_default(Alpine) {
  Alpine.data("table", (dataExtend = {}) => {
    let undefNullToStr = (v) => v === void 0 || v === null ? "" : v;
    let isDate = (d) => Object.prototype.toString.call(d) == "[object Date]";
    let compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
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
    let formatLabelCase = (value) => value.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
    let definitionDefaults = {
      sortable: false,
      filterable: true,
      visible: true
    };
    let bind = {};
    ["header"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });
    return {
      sortKey: "",
      sortAsc: 1,
      data: [],
      // props
      tableData: [],
      definition: [],
      filter: "",
      page: 1,
      itemsPerPage: 0,
      locale: "en-GB",
      primaryKey: "",
      onFilter: null,
      init() {
        this.$nextTick(() => {
          Alpine.effect(() => {
            let data = Alpine.bound(this.$el, "data-items") ?? this.data;
            this.tableData = [...data];
            this.definition = this.getDefinition();
          });
          Alpine.effect(() => {
            this.filter = Alpine.bound(this.$el, "data-filter") ?? this.filter;
            this.page = 1;
          });
          Alpine.effect(() => {
            this.itemsPerPage = parseInt(
              Alpine.bound(this.$el, "data-items-per-page") ?? this.itemsPerPage
            );
            this.page = 1;
          });
          Alpine.effect(() => {
            this.locale = Alpine.bound(this.$el, "data-locale") ?? this.locale;
          });
          Alpine.effect(() => {
            this.onFilter = Alpine.bound(this.$el, "data-on-filter") ?? this.onFilter;
          });
          Alpine.effect(() => {
            this.page = parseInt(
              Alpine.bound(this.$el, "data-page") ?? this.page
            );
          });
          this.primaryKey = Alpine.bound(this.$el, "data-primary-key") ?? this.primaryKey;
        });
      },
      // generate definition array from the first record of items array
      generateDefinitionFromData() {
        if (!this.tableData || !this.tableData.length) return [];
        return Object.keys(this.tableData[0]).map((item) => {
          return { key: item };
        });
      },
      // validate definition provided by user
      getUserDefinition() {
        let definition = Alpine.bound(this.$el, "data-definition");
        if (!Array.isArray(definition)) return false;
        return definition.every((i) => i.key) && definition;
      },
      getDefinition() {
        let definition = this.getUserDefinition() || this.generateDefinitionFromData();
        return definition.map((i) => {
          return {
            ...definitionDefaults,
            ...i,
            label: i.label || formatLabelCase(i.key)
          };
        });
      },
      getDataSorted() {
        if (!this.sortKey) return this.tableData;
        let compare2 = new Intl.Collator(this.locale).compare;
        return this.tableData.sort(
          (a, b) => itemCompare(a[this.sortKey], b[this.sortKey], this.sortAsc, compare2)
        );
      },
      getFilterableKeys() {
        return this.definition.filter((k) => k.filterable !== false && k.visible !== false).map((k) => k.key);
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
        return filteredData;
      },
      getDataPaginated() {
        let filteredData = this.getDataFiltered();
        if (typeof this.onFilter === "function") {
          this.onFilter(filteredData);
        }
        this.$dispatch("update:items-filtered", filteredData);
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
        ...bind.header
      },
      ...dataExtend
    };
  });
}

// components/table/builds/module.js
var module_default = table_default;
export {
  module_default as default
};
