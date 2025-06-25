(() => {
  // components/tabs/tabs.js
  function tabs_default(Alpine2) {
    Alpine2.data("tabs", () => {
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
      return {
        _selectedTab: "",
        _transition: "",
        init() {
          this._selectedTab = Alpine2.bound(this.$el, "data-selected-tab") ?? this._selectedTab;
          this.$nextTick(() => {
            Alpine2.effect(() => {
              this._selectedTab = Alpine2.bound(this.$el, "data-selected-tab") ?? this._selectedTab;
            });
            this._transition = Alpine2.bound(this.$el, "data-transition") ?? this._transition;
            if (this._transition) {
              let tabs = this.$el.querySelectorAll("[data-tab]");
              tabs.forEach((tab) => {
                Alpine2.bind(tab, {
                  "x-alt-transition": this._transition
                });
              });
            }
          });
        },
        selectTab() {
          let target = this.$event.target;
          let tab = target.dataset.tab;
          this._selectedTab = tab;
        },
        isSelected() {
          let tab = this.$el.dataset.tab;
          return this._selectedTab === tab;
        },
        tabBar: {
          ...aria.tabBar
        },
        label: {
          "@click"() {
            this.selectTab();
          },
          "@focusin"() {
            this.$el.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
          ...aria.label
        },
        content: {
          "x-show"() {
            return this.isSelected();
          },
          ...aria.content
        }
      };
    });
  }

  // components/tabs/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(tabs_default);
  });
})();
