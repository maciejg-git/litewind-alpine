export default function (Alpine) {
  const correctPlacement = ["top", "bottom", "right", "left"]
    .map((i) => [i, i + "-start", i + "-end"])
    .flat();

  let transitions = ["fade", "scale-fade", ""];

  window.Alpine.directive(
    "tooltip",
    (el, { value, modifiers, expression }, { evaluate, evaluateLater }) => {
      let floating = null;

      let clearHideTimers = (el) => {
        clearTimeout(el._v_tooltip.timerOut);
        clearTimeout(el._v_tooltip.timerRemove);
      };

      let clearShowTimer = (el) => {
        clearTimeout(el._v_tooltip.timer);
      };

      function show(ev) {
        let el = ev.target;
        let tooltip = el._v_tooltip;

        clearHideTimers(el);

        if (tooltip.isVisible) {
          addTransition(tooltip, false)
          return;
        }

        if (typeof el._v_tooltip.func === "function") {
          el._v_tooltip.func((v) => {
            if (el._v_tooltip.html) {
              el._v_tooltip.tooltip.innerHTML = v;
            } else {
              el._v_tooltip.tooltip.innerText = v;
            }
          });
        }

        tooltip.timer = setTimeout(() => {
          document.body.appendChild(tooltip.wrapper);

          requestAnimationFrame(() => {
            addTransition(tooltip, false);
          });

          tooltip.destroyFloating = floating.startAutoUpdate(el);
          tooltip.isVisible = true;
        }, tooltip.delay);
      }

      function hide(ev) {
        let el = ev.target;
        let tooltip = el._v_tooltip;

        clearShowTimer(el);

        if (!tooltip.isVisible) return;

        tooltip.timerOut = setTimeout(() => {
          addTransition(tooltip, true);

          tooltip.timerRemove = setTimeout(
            () => {
              tooltip.wrapper.remove();
              floating.destroy();
              tooltip.destroyFloating = null;
              tooltip.isVisible = false;
            },

            tooltip.transition === "" ? 0 : 200,
          );
        }, tooltip.delay);
      }

      function createTooltipElement() {
        let el = document.createElement("div");

        Object.assign(el.style, {
          position: "absolute",
          top: 0,
          left: 0,
        });

        el.innerHTML = "<div class='tooltip'></div>";

        return el;
      }

      let addTransition = (m, v) => {
        if (m.transition === "") {
          return
        }

        m.tooltip.style.transition = "opacity 0.2s ease, transform 0.2s"

        if (m.transition === "fade" || m.transition === "scale-fade") {
          m.tooltip.style.opacity = v ? 0 : 1
        }

        if (m.transition === "scale-fade") {
          m.tooltip.style.transform = v ? "scale(0.8)": "scale(1)"
        }
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
        func: false,
      };

      let getOptions = (modifiers) => {
        let mod = modifiers.map((i) => {
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
          if (i === "html") {
            return ["html", true];
          }
          if (i === "fade" || i === "scale-fade") {
            return ["transition", i]
          }
        });

        return {
          ...defaults,
          ...Object.fromEntries(mod),
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
        ...options,
      };

      if (options.html) {
        el._v_tooltip.tooltip.innerHTML = !options.func ? expression : "";
      } else {
        el._v_tooltip.tooltip.innerText = !options.func ? expression : "";
      }

      addTransition(el._v_tooltip, true)

      floating = useFloating(el, el._v_tooltip.wrapper, el._v_tooltip);

      el.addEventListener("mouseenter", show);
      el.addEventListener("mouseleave", hide);
    },
  );
}
