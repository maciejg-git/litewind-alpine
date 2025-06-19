// plugins/transition/transition.js
function transition_default(Alpine) {
  window.Alpine.directive(
    "alt-transition",
    (el, { value, modifiers, expression }, { evaluate }) => {
      let t;
      let mods = {
        json: modifiers.includes("json")
      };
      if (mods.json) {
        t = JSON.parse(expression);
      } else {
        t = evaluate(expression);
      }
      let transition = {};
      if (t.enter[1]) transition["x-transition:enter"] = t.enter[1];
      if (t.enter[0]) transition["x-transition:enter-start"] = t.enter[0];
      if (t.enter[2]) transition["x-transition:enter-end"] = t.enter[2];
      if (t.leave[1]) transition["x-transition:leave"] = t.leave[1];
      if (t.leave[0]) transition["x-transition:leave-start"] = t.leave[0];
      if (t.leave[2]) transition["x-transition:leave-end"] = t.leave[2];
      Alpine.bind(el, transition);
    }
  );
  window.Alpine.directive(
    "vue-transition",
    (el, { value, expression }, { evaluate }) => {
      let transition = {
        ["x-transition:enter"]: `${expression}-enter-active`,
        ["x-transition:enter-start"]: `${expression}-enter-from`,
        ["x-transition:enter-end"]: `${expression}-enter-to`,
        ["x-transition:leave"]: `${expression}-leave-active`,
        ["x-transition:leave-start"]: `${expression}-leave-from`,
        ["x-transition:leave-end"]: `${expression}-leave-to`
      };
      Alpine.bind(el, transition);
    }
  );
}

// plugins/transition/builds/module.js
var module_default = transition_default;
export {
  module_default as default
};
