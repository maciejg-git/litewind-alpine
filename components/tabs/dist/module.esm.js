// components/tabs/tabs.js
function tabs_default(Alpine) {
  Alpine.data("tabs", () => {
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
        this._selectedTab = Alpine.bound(this.$el, "data-selected-tab") ?? this._selectedTab;
        this.$nextTick(() => {
          Alpine.effect(() => {
            this._selectedTab = Alpine.bound(this.$el, "data-selected-tab") ?? this._selectedTab;
          });
          this._transition = Alpine.bound(this.$el, "data-transition") ?? this._transition;
          if (this._transition) {
            let tabs = this.$el.querySelectorAll("[data-tab]");
            tabs.forEach((tab) => {
              Alpine.bind(tab, {
                "x-alt-transition": this._transition
              });
            });
          }
        });
      },
      selectTab(tab) {
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
          this.selectTab(this.$el.dataset.tab);
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

// components/tabs/builds/module.js
var module_default = tabs_default;
export {
  module_default as default
};
