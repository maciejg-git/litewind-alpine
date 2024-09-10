import { useFloating } from "./floating.js"

let isFunction = (f) => typeof f === "function"

document.addEventListener('alpine:init', () => {
  Alpine.data('dropdown', (props = {}, opts = {}) => ({
    isShow: false,
    floating: null,
    triggerEv: 'click',
    hideTimeout: null,

    init() {
      this.$nextTick(() => {
        this.floating = useFloating(this.$refs.trigger, this.$refs.menu, opts)
      })
      Alpine.effect(() => {
        this.triggerEv = isFunction(props.triggerEv) ? props.triggerEv() : props.triggerEv ?? this.triggerEv
      })
      Alpine.bind(this.$el, {
        ['@keydown.escape.prevent']() {
          this.close()
        }
      })
    },
    scheduleHide() {
      return setTimeout(() => {
        this.floating.destroy()
        this.isShow = false
      }, 100)
    },
    open() {
      if (this.triggerEv === 'hover') {
        clearTimeout(this.hideTimeout)
      }
      this.floating.startAutoUpdate()
      this.isShow = true
    },
    close() {
      if (!this.isShow) return
      if (this.triggerEv === 'hover') {
        this.hideTimeout = this.scheduleHide()
        return
      }
      this.floating.destroy()
      this.isShow = false
    },
    preventHiding() {
      if (this.triggerEv === 'hover') {
        clearTimeout(this.hideTimeout)
      }
    },
    allowHiding() {
      if (this.triggerEv === 'hover') {
        this.hideTimeout = this.scheduleHide()
      }
    },
    toggle() {
      this.isShow ? this.close() : this.open()
    },
    trigger() {
      let t = {}
      if (this.triggerEv === "click") {
        t['@click'] = function() {
          this.toggle()
        }
      }
      if (this.triggerEv === "hover") {
        t['@mouseenter'] = function() {
          this.open()
        }
        t['@mouseleave'] = function() {
          this.close()
        }
      }
      return {
        ...t,
        ['x-ref']: 'trigger'
      }
    },
    menu: {
      ['x-show']() {
        return this.isShow
      },
      ['x-ref']: 'menu',
      ['@mouseenter']() {
        this.preventHiding()
      },
      ['@mouseleave']() {
        this.allowHiding()
      },
      ['@click.outside']() {
        this.close()
      }
    }
  }))
})
