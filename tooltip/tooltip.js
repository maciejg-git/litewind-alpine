import { useFloating } from "../floating.js"

document.addEventListener("alpine:init", () => {
  const correctPlacement = ["top", "bottom", "right", "left"]
    .map((i) => [i, i + "-start", i + "-end"])
    .flat();
  
  let transitions = ["fade", "scale-fade", ""];
  
  window.Alpine.directive("tooltip", (el, { value, modifiers, expression }, { evaluate }) => {
    let floating = null

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

      // getTooltipFnContent(el);

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

          tooltip.transition === "" ? 0 : 200
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

      el.innerHTML =
        "<div class='rounded-md z-50 max-w-sm text-gray-100 bg-neutral-700'><div class='font-semibold p-1 px-3'></div></div>";

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
    };

    let validateOptions = (options) => {
      options.transition = transitions.includes(options.transition)
        ? options.transition
        : defaults.transition;
      options.placement = correctPlacement.includes(options.placement)
        ? options.placement
        : defaults.placement;

      return options
    };
    
    let getOptions = (value) => {
      if (typeof value === "object") {
        return {
          ...defaults,
          ...validateOptions(value),
        };
      }
      if (typeof value === "string" || typeof value === "function") {
        return {
          ...defaults,
          text: value,
        };
      }
      return {
        ...defaults,
      };
    };

    let wrapper = createTooltipElement();

    let exp = modifiers.includes('custom') ? evaluate(expression) : expression

    let options = getOptions(exp);

    let t = {
      wrapper,
      tooltip: wrapper.firstChild,
      timer: null,
      timerOut: null,
      timerRemove: null,
      isVisible: false,
      destroyFloating: null,
      ...options,
    };

    t.tooltip.firstChild.innerText = expression;

    el._v_tooltip = t;

    floating = useFloating(el, el._v_tooltip.wrapper, el._v_tooltip)

    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
  });
});
