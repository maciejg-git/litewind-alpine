(() => {
  // ../tooltip.js
  function tooltip_default(Alpine2) {
    const correctPlacement = ["top", "bottom", "right", "left"].map((i) => [i, i + "-start", i + "-end"]).flat();
    let transitions = ["fade", "scale-fade", ""];
    window.Alpine.directive(
      "tooltip",
      (el, { value, modifiers, expression }, { evaluate, evaluateLater }) => {
        let floating = null;
        let clearHideTimers = (el2) => {
          clearTimeout(el2._v_tooltip.timerOut);
          clearTimeout(el2._v_tooltip.timerRemove);
        };
        let clearShowTimer = (el2) => {
          clearTimeout(el2._v_tooltip.timer);
        };
        function show(ev) {
          let el2 = ev.target;
          let tooltip = el2._v_tooltip;
          clearHideTimers(el2);
          if (tooltip.isVisible) return;
          if (typeof el2._v_tooltip.func === "function") {
            el2._v_tooltip.func((v) => {
              el2._v_tooltip.tooltip.innerText = v;
            });
          }
          tooltip.timer = setTimeout(() => {
            document.body.appendChild(tooltip.wrapper);
            tooltip.destroyFloating = floating.startAutoUpdate(el2);
            tooltip.isVisible = true;
          }, tooltip.delay);
        }
        function hide(ev) {
          let el2 = ev.target;
          let tooltip = el2._v_tooltip;
          clearShowTimer(el2);
          if (!tooltip.isVisible) return;
          tooltip.timerOut = setTimeout(() => {
            tooltip.timerRemove = setTimeout(
              () => {
                tooltip.wrapper.remove();
                floating.destroy();
                tooltip.destroyFloating = null;
                tooltip.isVisible = false;
              },
              tooltip.transition === "" ? 0 : 200
            );
          }, tooltip.delay);
        }
        function createTooltipElement() {
          let el2 = document.createElement("div");
          Object.assign(el2.style, {
            position: "absolute",
            top: 0,
            left: 0
          });
          el2.innerHTML = "<div class='tooltip'></div>";
          return el2;
        }
        let defaults = {
          placement: "bottom",
          delay: 50,
          offsetX: 0,
          offsetY: 0,
          inline: false,
          flip: true,
          autoPlacement: false,
          transition: "fade",
          func: false
        };
        let getOptions = (modifiers2) => {
          let mod = modifiers2.map((i) => {
            let m = i.split(":");
            if (m.length === 2) {
              if (m[0] === "offset-x") {
                m[0] = "offsetX";
              } else if (m[0] === "offset-y") {
                m[0] = "offsetY";
              }
              m[1] = parseInt(m[1]);
              return m;
            }
            if (correctPlacement.includes(i)) {
              return ["placement", i];
            }
            if (i === "flip") {
              return ["flip", true];
            }
            if (i === "auto-placement") {
              return ["autoPlacement", true];
            }
            if (i === "func") {
              return ["func", true];
            }
          });
          return {
            ...defaults,
            ...Object.fromEntries(mod)
          };
        };
        let wrapper = createTooltipElement();
        let options = getOptions(modifiers);
        if (options.func) {
          options.func = evaluateLater(expression);
        }
        el._v_tooltip = {
          wrapper,
          tooltip: wrapper.firstChild,
          timer: null,
          timerOut: null,
          timerRemove: null,
          isVisible: false,
          destroyFloating: null,
          ...options
        };
        el._v_tooltip.tooltip.innerText = !options.func ? expression : "";
        floating = useFloating(el, el._v_tooltip.wrapper, el._v_tooltip);
        el.addEventListener("mouseenter", show);
        el.addEventListener("mouseleave", hide);
      }
    );
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(tooltip_default);
  });
})();
