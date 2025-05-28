(() => {
  // components/template/template.js
  function template_default(Alpine2) {
    Alpine2.data("template", () => {
      return {};
    });
  }

  // components/template/builds/cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(template_default);
  });
})();
