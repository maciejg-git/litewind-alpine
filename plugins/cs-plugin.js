document.addEventListener("alpine:init", () => {
  window.Alpine.directive(
    "cs",
    (el, { value, modifiers, expression }, { effect, evaluateLater }) => {
      let camelValue = value
        .toLowerCase()
        .replace(/-(\w)/g, (match, char) => char.toUpperCase());

      let mod = {
        not: modifiers.includes("not")
      }

      let getValue = evaluateLater(camelValue);

      let classes = expression.split(" ");

      effect(() => {
        getValue((v) => {
          if (mod.not ? !v : v) {
            el.classList.add(...classes);
          } else {
            el.classList.remove(...classes);
          }
        });
      });
    },
  );
});
