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

document.addEventListener("alpine:init", () => {
  Alpine.data("tabs", (tab, { label = {}, content = {} } = {}) => ({
    selectedTab: tab,

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
      ["@click"]() {
        this.selectTab();
      },
      ["x-effect"]() {
        this.$el.dataset.selected = this.isSelected();
      },
      [":class"]() {
        let classes = this.$el.attributes;
        let c = "";
        if (this.isSelected()) {
          c = classes["class:selected"]?.textContent || "";
        }

        return c;
      },
      ...aria.label,
      ...label,
    },
    content: {
      ["x-show"]() {
        return this.isSelected();
      },
      ...aria.content,
      ...content,
    },
  }));
});
