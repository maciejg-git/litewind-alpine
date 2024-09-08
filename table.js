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

let definitionDefaults = {
  sortable: false,
  filterable: true,
  visible: true,
};

document.addEventListener("alpine:init", () => {
  Alpine.data("table", (props, defaults = {}) => ({
    tableData: [],
    definition: [],
    sortKey: "",
    sortAsc: 1,
    filter: "",
    page: 1,
    itemsPerPage: 0,
    locale: props.locale ?? "en-GB",

    init() {
      Alpine.effect(() => {
        this.tableData = [...props.data];
        this.definition = this.getDefinition();
      });
      Alpine.effect(() => {
        this.filter = props.filter;
        this.page = 1;
      });
      Alpine.effect(() => {
        this.page = props.page;
      });
      Alpine.effect(() => {
        this.itemsPerPage = props.itemsPerPage;
        this.page = 1;
      });
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

      return this.getDataSorted().filter((item) => {
        return filterableKeys.some((key) => {
          return (item[key] + "").search(filter) !== -1;
        });
      });
    },
    getDataPaginated() {
      if (!this.itemsPerPage) return this.getDataFiltered();

      return this.getDataFiltered().slice(
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
    header: {
      ["@click"]() {
        if (!this.isSortable()) return;
        this.sortAsc = this.sortKey === this.col.key ? -this.sortAsc : 1;
        this.sortKey = this.col.key;
      },
    },
  }));
});
