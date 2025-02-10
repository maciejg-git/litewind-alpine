(() => {
  // ../class-plugin.js
  function class_plugin_default(Alpine2) {
    window.Alpine.directive(
      "class",
      (el, { value, modifiers, expression }, { effect, evaluateLater }) => {
        let camelValue = value && value.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
        let mod = {
          not: modifiers.includes("not"),
          only: modifiers.includes("only"),
          else: modifiers.includes("else")
        };
        let getValue = camelValue && evaluateLater(camelValue);
        let classes = expression.split(" ");
        if (!Alpine2.$data(el)._xClasses) {
          Alpine2.addScopeToNode(el, { _xClasses: [], _xClassesEnable: false });
        }
        Alpine2.$data(el)._xClasses.push({ getValue, mod, classes });
        Alpine2.nextTick(() => {
          if (!Alpine2.$data(el)._xClassesEnable) {
            Alpine2.$data(el)._xClassesEnable = true;
            effect(() => {
              let onlyClass = [];
              let valueClass = [];
              let elseClass = [];
              let elseModClass = [];
              Alpine2.$data(el)._xClasses.forEach((i) => {
                i.getValue && i.getValue((v) => {
                  if (i.mod.not ? !v : v) {
                    if (i.mod.only) {
                      onlyClass.push(i.classes);
                      return;
                    }
                    if (i.mod.else) {
                      if (!elseClass.length) {
                        elseClass.push(i.classes);
                      }
                      return;
                    }
                    valueClass.push(i.classes);
                  }
                });
                if (!i.getValue && i.mod.else) {
                  elseModClass.push(i.classes);
                }
              });
              el.classList.remove(...classes);
              classes = [];
              if (onlyClass.length) {
                classes = onlyClass.flat();
              } else {
                if (elseClass.length) {
                  classes = elseClass.flat();
                } else if (elseModClass.length) {
                  classes = elseModClass.flat();
                }
                if (valueClass.length) {
                  classes.push(...valueClass.flat());
                }
              }
              el.classList.add(...classes);
            });
          }
        });
      }
    );
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(class_plugin_default);
  });
})();
