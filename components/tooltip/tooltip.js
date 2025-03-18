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

        if (tooltip.isVisible) return;

        if (typeof el._v_tooltip.func === "function") {
          el._v_tooltip.func((v) => {
            el._v_tooltip.tooltip.innerText = v;
          });
        }

        tooltip.timer = setTimeout(() => {
          document.body.appendChild(tooltip.wrapper);

          // requestAnimationFrame(() => {
          //   addTransition(tooltip, false);
          // });

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
          // addTransition(tooltip, true);

          tooltip.timerRemove = setTimeout(
            () => {
              tooltip.wrapper.remove();
              floating.destroy();
              tooltip.destroyFloating = null;
              tooltip.isVisible = false;
            },

            // tooltip.transition === "" ? 0 : 200,
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

      el._v_tooltip.tooltip.innerText = !options.func ? expression : "";

      floating = useFloating(el, el._v_tooltip.wrapper, el._v_tooltip);

      el.addEventListener("mouseenter", show);
      el.addEventListener("mouseleave", hide);
    },
  );
}
