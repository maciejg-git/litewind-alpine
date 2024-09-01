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
    label: {
      ["@click"]() {
        this.selectTab();
      },
      ["x-effect"]() {
        this.$el.dataset.selected = this.isSelected();
      },
      ...label,
    },
    content: {
      ["x-show"]() {
        return this.isSelected();
      },
      ...content,
    },
  }));
});
