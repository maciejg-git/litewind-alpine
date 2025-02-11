(() => {
  // ../collapse.js
  function collapse_default(Alpine2) {
    Alpine2.data("collapse", (dataExtend = {}) => {
      let aria = {
        main: {
          "x-id"() {
            return ["collapse-aria"];
          }
        },
        trigger: {
          ":aria-expanded"() {
            return this.isOpen;
          },
          ":aria-controls"() {
            return this.$id("collapse-aria");
          }
        },
        content: {
          ":id"() {
            return this.$id("collapse-aria");
          }
        }
      };
      let bind = {};
      ["trigger", "content"].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        isOpen: false,
        id: null,
        init() {
          this.id = this.$id("collapse");
          if (this.isAccordion) {
            this.$watch("isOpen", () => {
              this.updateAccordion(this);
            });
          }
          Alpine2.bind(this.$el, aria.main);
        },
        open() {
          this.isOpen = true;
        },
        close() {
          this.isOpen = false;
        },
        toggle() {
          this.isOpen = !this.isOpen;
        },
        destroy() {
          if (this.isAccordion) {
            this.removeCollapseFromAccordion(this);
          }
        },
        trigger: {
          "@click"() {
            this.toggle();
          },
          ...bind.trigger,
          ...aria.trigger
        },
        content: {
          "x-show"() {
            return this.isOpen;
          },
          ...bind.content,
          ...aria.content
        },
        ...dataExtend
      };
    });
    Alpine2.data("accordion", () => {
      return {
        active: null,
        isAccordion: true,
        updateAccordion(collapse) {
          if (collapse.isOpen) {
            if (this.active) {
              this.active.close();
            }
            this.active = collapse;
            return;
          }
          if (this.active.id === collapse.id) {
            this.active = null;
          }
        },
        removeCollapseFromAccordion(collapse) {
          if (this.active.id === collapse.id) {
            this.active.close();
            this.active = null;
          }
        }
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(collapse_default);
  });
})();
