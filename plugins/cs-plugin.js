document.addEventListener("alpine:init", () => {
  window.Alpine.directive(
    "cs",
    (el, { value, modifiers, expression }, { effect, evaluateLater }) => {
      let camelValue = value && value
        .toLowerCase()
        .replace(/-(\w)/g, (match, char) => char.toUpperCase());

      let mod = {
        not: modifiers.includes("not"),
        only: modifiers.includes("only"),
        else: modifiers.includes("else")
      }

      let getValue = camelValue && evaluateLater(camelValue);

      let classes = expression.split(" ");

      if (!Alpine.$data(el)._csClasses) {
        Alpine.addScopeToNode(el, { _csClasses: [], _csEnable: false })
      }
      Alpine.$data(el)._csClasses.push({
        getValue,
        mod,
        classes,
      })

      Alpine.nextTick(() => {
        if (!Alpine.$data(el)._csEnable) {
          Alpine.$data(el)._csEnable = true
          Alpine.effect(() => {
            let only = []
            let value = []
            let e = []
            let eMod = []
            Alpine.$data(el)._csClasses.forEach((i) => {
              i.getValue && i.getValue((v) => {
                if (i.mod.not ? !v : v) {
                  if (i.mod.only) {
                    only.push(i.classes)
                    return
                  }
                  if (i.mod.else) {
                    if (!e.length) {
                      e.push(i.classes)
                    }
                    return
                  }
                  value.push(i.classes)
                }
              })
              if (!i.getValue && i.mod.else) {
                eMod.push(i.classes)
              }
            })
            el.classList.remove(...classes)
            classes = []
            if (only.length) {
              classes = only.flat()
            } else {
              if (e.length) {
                classes = e.flat()
              } else if (eMod.length) {
                classes = eMod.flat()
              }
              if (value.length) {
                classes.push(...value.flat())
              }
            } 
            el.classList.add(...classes)
          })
        }
      })

      // effect(() => {
      //   getValue((v) => {
      //     if (mod.not ? !v : v) {
      //       el.classList.add(...classes);
      //     } else {
      //       el.classList.remove(...classes);
      //     }
      //   });
      // });
    },
  );
});
