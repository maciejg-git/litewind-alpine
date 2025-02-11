(() => {
  // ../sidepanel.js
  function sidepanel_default(Alpine2) {
    Alpine2.data("sidepanel", (dataExtend = {}) => {
      let bind = {};
      [].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        isOpen: false,
        isModal: false,
        init() {
          this.$nextTick(() => {
            this.isModal = JSON.parse(Alpine2.bound(this.$el, "data-modal") ?? this.isModal);
          });
          Alpine2.bind(this.$el, {
            "x-show"() {
              return this.isOpen;
            },
            "@open-sidepanel.window"() {
              let id = this.$event.detail.id || this.$event.detail;
              if (id === this.$root.id) {
                this.open();
              }
            }
          });
        },
        open() {
          this.isOpen = true;
        },
        close() {
          this.isOpen = false;
        },
        toggle() {
          this.isOpen = !this.open;
        },
        sidepanel: {
          "x-show"() {
            return this.isOpen;
          }
        },
        backdrop: {
          "x-show"() {
            return this.isOpen;
          },
          "@click"() {
            this.close();
          }
        }
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(sidepanel_default);
  });
})();
