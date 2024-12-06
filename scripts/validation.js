document.addEventListener('alpine:init', () => {
  Alpine.directive('validation', (el, { expression }, {evaluate, evaluateLater, Alpine, effect}) => {
    let validation = evaluate(expression)
    let getValue = evaluateLater("_value")
    effect(() => {
      getValue((value) => {
      console.log(value)

      })
    })
    let data = Alpine.$data(el)
    data.onFocus = () => {
      console.log('focus')
    }
    console.log(data)
  })
})
