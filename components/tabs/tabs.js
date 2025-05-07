export default function (Alpine) {
  Alpine.data("tabs", () => {
    let aria = {
      tabBar: {
        role: "tablist",
      },
      label: {
        role: "tab",
        [":aria-selected"]() {
          return this.isSelected();
        },
      },
      content: {
        role: "tabpanel",
      },
    };

    return {
      selectedTab: "",

      init() {
        this.selectedTab =
          Alpine.bound(this.$el, "data-selected-tab") ?? this.selectedTab;
        this.$nextTick(() => {
          Alpine.effect(() => {
            this.selectedTab =
              Alpine.bound(this.$el, "data-selected-tab") ?? this.selectedTab;
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
        ...aria.tabBar,
      },
      label: {
        "@click"() {
          this.selectTab();
        },
        "@focusin"() {
          this.$el.scrollIntoView({ behavior: "smooth" })
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
      },
      content: {
        "x-show"() {
          return this.isSelected();
        },
        ...aria.content,
      },
    };
  });
}  
