document.addEventListener("alpine:init", () => {
  Alpine.data("notify", (props = {}) => {
    let defaultOptions = {
      delay: 10000,
      static: false,
      dismissable: true,
      variant: "info",
    }

    return {
      notifications: [],
      notifyId: 1000,
      order: props?.order ?? "new-on-bottom",

      init() {
        Alpine.bind(this.$el, {
          '@add-notify.window'() {
            let id = this.$event.detail.id || null
            let rootId = this.$root.id || null
            if (id === null && rootId === null || id === rootId) {
              this.push(this.$event.detail)
            }
          }
        })
      },
      getNotifications() {
        if (this.order === "new-on-bottom") {
          return this.notifications
        }
        if (this.order === "new-on-top") {
          return this.notifications.toReversed()
        }
      },
      removeById(id) {
        let index = this.notifications.findIndex((i) => id === i.notifyId)
        this.notifications.splice(index, 1)
      },
      push(notify) {
        let container = this

        let newNotify = {
          header: notify?.header || "",
          text: notify?.text || "",
          delay: notify?.delay ?? props.delay ?? defaultOptions.delay,
          dismissable: notify?.dismissable ?? props.dismissable ?? defaultOptions.dismissable,
          static: notify?.static ?? props.static ?? defaultOptions.static,
          variant: notify?.variant ?? props.variant ?? defaultOptions.variant,
          notifyId: this.notifyId,
          timer: null,
        }

        newNotify.restartTimer = function() {
          if (this.static) return null
          this.timer = setTimeout(() => container.removeById(this.notifyId), this.delay)
        }

        newNotify.restartTimer()

        this.notifyId++

        this.notifications.push(newNotify)
      }
    }
  })
})
