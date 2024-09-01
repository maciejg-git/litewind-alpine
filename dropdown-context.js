import { useFloating } from "./floating.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("dropdownContext", (defaults = {}, opts = {}) => ({
    isShow: false,
    floating: null,
    data: null,

    init() {
      this.$nextTick(() => {
        this.floating = useFloating(null, this.$refs.menu, opts);
      });
    },
    open() {
      this.floating.startAutoUpdate();
      this.isShow = true;
    },
    close() {
      this.floating.destroy();
      this.isShow = false;
    },
    menu: {
      ["x-show"]() {
        return this.isShow;
      },
      ["@open-contextmenu.window"]() {
        if (this.$event.detail.id !== this.$root.id) {
          return;
        }
        let mouseEvent = this.$event.detail.$event;
        this.floating.updateVirtualElement(mouseEvent);
        this.data = this.$event.detail.data;
        this.open();
      },
      ["x-ref"]: "menu",
      ["@click.outside"]() {
        this.close();
      },
    },
  }));
});
