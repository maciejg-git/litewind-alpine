document.addEventListener("alpine:init", () => {
  Alpine.data("dropdownContext", (dataExtend = {}) => {
    let floatingUIoptions = [
      "placement",
      "offsetX",
      "offsetY",
      "flip",
      "autoPlacement",
      "inline",
    ];

    let bind = {};
    ["menu"].forEach((i) => {
      if (dataExtend[i]) {
        bind[i] = dataExtend[i];
        delete dataExtend[i];
      }
    });

    return {
      isShow: false,
      floating: null,
      contextData: {},
      autoClose: true,
      placement: "bottom-start",
      offsetX: 0,
      offsetY: 0,
      flip: false,
      autoPlacement: false,

      init() {
        this.$nextTick(() => {
          this.autoClose = JSON.parse(
            Alpine.bound(this.$el, "data-auto-close") ?? this.autoClose,
          );
          this.placement =
            Alpine.bound(this.$el, "data-placement") ?? this.placement;
          this.offsetX = parseInt(
            Alpine.bound(this.$el, "data-offset-x") ?? this.offsetX,
          );
          this.offsetY = parseInt(
            Alpine.bound(this.$el, "data-offset-y") ?? this.offsetY,
          );
          this.flip = JSON.parse(
            Alpine.bound(this.$el, "data-flip") ?? this.flip,
          );
          this.autoPlacement = JSON.parse(
            Alpine.bound(this.$el, "data-auto-placement") ?? this.autoPlacement,
          );

          let options = floatingUIoptions.reduce((acc, v) => {
            return { ...acc, [v]: this[v] };
          });

          this.floating = useFloating(null, this.$refs.menu, options);
        });

        Alpine.bind(this.$el, {
          ["@keydown.escape.window.prevent"]() {
            this.close();
          },
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
        "x-show"() {
          return this.isShow;
        },
        "@open-contextmenu.window"() {
          if (this.$event.detail.id !== this.$root.id) {
            return;
          }
          let mouseEvent = this.$event.detail.$event;
          this.floating.updateVirtualElement(mouseEvent);
          this.contextData = this.$event.detail.data;
          this.open();
        },
        "x-ref": "menu",
        "@click.outside"() {
          this.close();
        },
        "@click"() {
          if (this.autoClose && this.$el.contains(this.$event.target)) {
            this.close();
          }
        },
        ...bind.menu,
      },
      ...dataExtend,
    };
  });
});
