document.addEventListener('alpine:init', () => {
  window.Alpine.directive('alt-transition', (el, { value, expression }, { evaluate }) => {
    let t = typeof expression === 'string' ? evaluate(expression) : expression
    let transition = {
      ['x-transition:enter']: t.enter[1],
      ['x-transition:enter-start']: t.enter[0],
      ['x-transition:enter-end']: t.enter[2],
      ['x-transition:leave']: t.leave[1],
      ['x-transition:leave-start']: t.leave[0],
      ['x-transition:leave-end']: t.leave[2],
    }

    Alpine.bind(el, transition)
  })
  window.Alpine.directive('vue-transition', (el, { value, expression }, { evaluate }) => {
    let transition = {
      ['x-transition:enter']: `${expression}-enter-active`,
      ['x-transition:enter-start']: `${expression}-enter-from`,
      ['x-transition:enter-end']: `${expression}-enter-to`,
      ['x-transition:leave']: `${expression}-leave-active`,
      ['x-transition:leave-start']: `${expression}-leave-from`,
      ['x-transition:leave-end']: `${expression}-leave-to`,
    }

    Alpine.bind(el, transition)
  })
})
