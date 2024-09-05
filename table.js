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

document.addEventListener('alpine:init', () => {
  Alpine.data('table', (defaults = {}) => ({
    tableData: [],
    dataSorted: [],
    dataFiltered: [],
    dataPaginated: [],
    keys: [],
    sortKey: "last_name",
    sortAsc: 1,
    filter: "",
    props: {
      locale: defaults.locale ?? "en-GB"
    },

    init() {
      this.tableData = [{"id":1,"first_name":"Anthony","last_name":"Linbohm","city":"Makui","department":"Business Development","title":"Quality Engineer"},
{"id":2,"first_name":"Richard","last_name":"Moult","city":"Xihu","department":"Legal","title":"Budget/Accounting Analyst IV"},
{"id":3,"first_name":"Chance","last_name":"Dallas","city":"Moncton","department":"Support","title":"Product Engineer"},
{"id":4,"first_name":"Rozamond","last_name":"Abbatucci","city":"Chico","department":"Legal","title":"Software Consultant"},] 
      this.keys = Object.keys(this.tableData[0])
    },
    getDataSorted() {
      if (!this.sortKey) return this.tableData

      let compare = new Intl.Collator(this.locale).compare;

      return this.tableData.sort((a, b) => itemCompare(a[this.sortKey], b[this.sortKey], this.sortAsc, compare));
    },
    getDataFiltered() {
      if (!this.filter) return this.getDataSorted()

      let filter = new RegExp(this.filter.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "i");

      return this.getDataSorted().filter((item) => {
        return this.keys.some((key) => {
          return (item[key] + "").search(filter) !== -1
        })
      })
    },
    header: {
      ['@click']() {
        this.sortAsc = this.sortKey === this.key ? -this.sortAsc : 1
        this.sortKey = this.key
      }
    }
  }))
})
