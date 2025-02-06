(() => {
  // ../tabs.js
  function tabs_default(Alpine2) {
    Alpine2.data("tabs", (dataExtend = {}) => {
      let aria = {
        tabBar: {
          role: "tablist"
        },
        label: {
          role: "tab",
          [":aria-selected"]() {
            return this.isSelected();
          }
        },
        content: {
          role: "tabpanel"
        }
      };
      let bind = {};
      ["label", "content"].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        selectedTab: "",
        init() {
          this.selectedTab = Alpine2.bound(this.$el, "data-selected-tab") ?? this.selectedTab;
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this.selectedTab = Alpine2.bound(this.$el, "data-selected-tab") ?? this.selectedTab;
            });
          });
        },
        selectTab() {
          let target = this.$event.target;
          let tab = target.dataset.tab;
          this.selectedTab = tab;
        },
        isSelected() {
          let tab = this.$el.dataset.tab;
          return this.selectedTab === tab;
        },
        tabBar: {
          ...aria.tabBar
        },
        label: {
          "@click"() {
            this.selectTab();
          },
          "x-effect"() {
            this.$el.dataset.selected = this.isSelected();
          },
          ":class"() {
            let classes = this.$el.attributes;
            let c = "";
            if (this.isSelected()) {
              c = classes["class-selected"]?.textContent || "";
            } else {
              c = classes["class-default"]?.textContent || "";
            }
            return c;
          },
          ...aria.label,
          ...bind.label
        },
        content: {
          "x-show"() {
            return this.isSelected();
          },
          ...aria.content,
          ...bind.content
        },
        ...dataExtend
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(tabs_default);
  });
})();
