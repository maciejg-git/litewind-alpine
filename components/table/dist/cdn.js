(() => {
  // components/table/table.js
  function table_default(Alpine2) {
    Alpine2.data("table", () => {
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
      let highlight = (string, match, classes) => {
        classes = classes || "match";
        return (string + "").replace(
          new RegExp(
            `(${match.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&")})`,
            "i"
          ),
          `<span class='${classes}'>$1</span>`
        );
      };
      let definitionDefaults = {
        sortable: false,
        filterable: true,
        visible: true
      };
      let _invalidateSort = false;
      return {
        _sortKey: "",
        _sortAsc: 1,
        _sortedTableData: [],
        // props
        _tableData: [],
        _definition: [],
        _filter: "",
        _page: 1,
        _itemsPerPage: 0,
        _locale: "en-GB",
        _primaryKey: "",
        _onFilter: null,
        _isLoading: false,
        init() {
          this.$nextTick(() => {
            Alpine2.effect(() => {
              let data = Alpine2.bound(this.$el, "data-items") ?? [];
              this._tableData = [...data];
              _invalidateSort = true;
              this._sortKey = "";
              this._sortAsc = 1;
            });
            Alpine2.effect(() => {
              this._definition = this.getDefinition();
            });
            Alpine2.effect(() => {
              this._filter = Alpine2.bound(this.$el, "data-filter") ?? this._filter;
              this._page = 1;
            });
            Alpine2.effect(() => {
              this._itemsPerPage = parseInt(
                Alpine2.bound(this.$el, "data-items-per-page") ?? this._itemsPerPage
              );
              this._page = 1;
            });
            Alpine2.effect(() => {
              this._locale = Alpine2.bound(this.$el, "data-locale") ?? this._locale;
            });
            Alpine2.effect(() => {
              this._onFilter = Alpine2.bound(this.$el, "data-on-filter") ?? this._onFilter;
            });
            Alpine2.effect(() => {
              this._page = parseInt(
                Alpine2.bound(this.$el, "data-page") ?? this._page
              );
            });
            Alpine2.effect(() => {
              this._isLoading = JSON.parse(
                Alpine2.bound(this.$el, "data-is-loading") ?? this._isLoading
              );
            });
            this._primaryKey = Alpine2.bound(this.$el, "data-primary-key") ?? this._primaryKey;
            this.$watch("_sortKey", () => {
              _invalidateSort = true;
            });
            this.$watch("_sortAsc", () => {
              _invalidateSort = true;
            });
            Alpine2.bind(this.$el, {
              ":class"() {
                let classes = this.$el.attributes;
                let c = "";
                if (this._isLoading) {
                  c = classes["class-loading"]?.textContent || "";
                }
                return c;
              }
            });
          });
        },
        // generate definition array from the first record of items array
        generateDefinitionFromData() {
          if (!this._tableData || !this._tableData.length) return [];
          return Object.keys(this._tableData[0]).map((item) => {
            return { key: item };
          });
        },
        // validate definition provided by user
        getUserDefinition() {
          let definition = Alpine2.bound(this.$el, "data-definition");
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
          if (!this._sortKey) return this._tableData;
          if (!_invalidateSort) {
            return this._sortedTableData;
          }
          _invalidateSort = false;
          let compare2 = new Intl.Collator(this._locale).compare;
          this._sortedTableData = [...this._tableData].sort(
            (a, b) => itemCompare(a[this._sortKey], b[this._sortKey], this._sortAsc, compare2)
          );
          return this._sortedTableData;
        },
        getFilterableKeys() {
          return this._definition.filter((k) => k.filterable !== false && k.visible !== false).map((k) => k.key);
        },
        getDataFiltered() {
          if (!this._filter) return this.getDataSorted();
          let filter = new RegExp(
            this._filter.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"),
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
          if (typeof this._onFilter === "function") {
            this._onFilter(filteredData);
          }
          this.$nextTick(() => {
            this.$dispatch("update:items", filteredData);
          });
          if (!this._itemsPerPage) return filteredData;
          return filteredData.slice(
            (this._page - 1) * this._itemsPerPage,
            this._page * this._itemsPerPage
          );
        },
        getCellContent() {
          return this.row[this.col.key];
        },
        getHighlightedCellContent() {
          return highlight(this.row[this.col.key], this._filter);
        },
        isSortable() {
          return this.col.sortable;
        },
        isSorted() {
          return this._sortKey === this.col.key;
        },
        isSortedAsc() {
          return this.isSorted() && this._sortAsc === 1;
        },
        isSortedDesc() {
          return this.isSorted() && this._sortAsc === -1;
        },
        header: {
          "@click"() {
            if (!this.isSortable()) return;
            this._sortAsc = this._sortKey === this.col.key ? -this._sortAsc : 1;
            this._sortKey = this.col.key;
          },
          ":class"() {
            return this.isSortable() ? "cursor-pointer" : "";
          }
        }
      };
    });
  }

  // components/table/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(table_default);
  });
})();
