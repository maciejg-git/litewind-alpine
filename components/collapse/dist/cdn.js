(() => {
  // components/collapse/collapse.js
  function collapse_default(Alpine2) {
    Alpine2.data("collapse", () => {
      let aria = {
        main: {
          "x-id"() {
            return ["collapse-aria"];
          }
        },
        trigger: {
          ":aria-expanded"() {
            return this._isOpen;
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
      return {
        _isOpen: false,
        _id: null,
        init() {
          this._id = this.$id("collapse");
          if (this._isAccordion) {
            this.$watch("_isOpen", () => {
              this.updateAccordion(this);
            });
          }
          Alpine2.bind(this.$el, aria.main);
        },
        open() {
          this._isOpen = true;
        },
        close() {
          this._isOpen = false;
        },
        toggle() {
          this._isOpen = !this._isOpen;
        },
        destroy() {
          if (this._isAccordion) {
            this.removeCollapseFromAccordion(this);
          }
        },
        trigger: {
          "@click"() {
            this.toggle();
          },
          ...aria.trigger
        },
        content: {
          "x-show"() {
            return this._isOpen;
          },
          ...aria.content
        }
      };
    });
    Alpine2.data("accordion", () => {
      return {
        _active: null,
        _isAccordion: true,
        updateAccordion(collapse) {
          if (collapse._isOpen) {
            if (this._active) {
              this._active.close();
            }
            this._active = collapse;
            return;
          }
          if (this._active._id === collapse._id) {
            this._active = null;
          }
        },
        removeCollapseFromAccordion(collapse) {
          if (this._active._id === collapse._id) {
            this._active.close();
            this._active = null;
          }
        }
      };
    });
  }

  // components/collapse/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(collapse_default);
  });
})();
