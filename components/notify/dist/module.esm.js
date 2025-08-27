// components/notify/notify.js
function notify_default(Alpine) {
  Alpine.data("notify", () => {
    let aria = {
      role: "status"
    };
    return {
      _notifications: [],
      _notifyId: 1e3,
      _buffer: [],
      _notificationsSticky: [],
      // props
      _order: "default",
      _maxNotifications: 0,
      _delay: 1e4,
      _dismissable: true,
      _static: false,
      _variant: "info",
      _options: {},
      init() {
        this.$nextTick(() => {
          this._order = Alpine.bound(this.$el, "data-order") ?? this._order;
          this._maxNotifications = parseInt(
            Alpine.bound(this.$el, "data-max-notifications") ?? this._maxNotifications
          );
          this._delay = parseInt(
            Alpine.bound(this.$el, "data-delay") ?? this._delay
          );
          this._dismissable = JSON.parse(
            Alpine.bound(this.$el, "data-dismissable") ?? this._dismissable
          );
          this._static = JSON.parse(
            Alpine.bound(this.$el, "data-static") ?? this._static
          );
          this._variant = Alpine.bound(this.$el, "data-variant") ?? this._variant;
          this._options = Alpine.bound(this.$el, "data-options") ?? this._options;
        });
        Alpine.bind(this.$el, {
          "@show-notify.window"() {
            let id = this.$event.detail.id || null;
            let rootId = this.$root.id || null;
            if (id === null && rootId === null || id === rootId) {
              this.push(this.$event.detail);
            }
          }
        });
        Alpine.bind(this.$el, {
          "@mouseenter"() {
            this.handleContainerMouseEnter();
          },
          "@mouseleave"() {
            this.handleContainerMouseLeave();
          }
        });
      },
      getNotifications() {
        if (this._order === "default") {
          return [...this._notifications, ...this._notificationsSticky];
        }
        if (this._order === "reversed") {
          return [
            ...this._notificationsSticky.toReversed(),
            ...this._notifications.toReversed()
          ];
        }
      },
      handleContainerMouseEnter() {
        this._notifications.forEach((notification) => {
          notification.pauseTimer();
        });
      },
      handleContainerMouseLeave() {
        this._notifications.forEach((notification) => {
          notification.restartTimer();
        });
      },
      remove(notification) {
        if (notification.sticky) {
          this.removeStickyById(notification.notifyId);
        } else {
          this.removeById(notification.notifyId);
        }
      },
      removeById(id) {
        let index = this._notifications.findIndex((i) => id === i.notifyId);
        this._notifications.splice(index, 1);
        if (this._buffer.length) {
          let notify = this._buffer.shift();
          notify.restartTimer();
          this._notifications.push(notify);
        }
      },
      removeStickyById(id) {
        let index = this._notificationsSticky.findIndex(
          (i) => id === i.notifyId
        );
        this._notificationsSticky.splice(index, 1);
      },
      close() {
        this.notify.isVisible.value = false;
      },
      push(notify) {
        let newNotify = {
          header: notify?.header || "",
          text: notify?.text || "",
          delay: notify?.delay ?? this._delay,
          dismissable: notify?.dismissable ?? this._dismissable,
          static: notify?.static ?? this._static,
          sticky: notify?.sticky ?? false,
          variant: notify?.variant ?? this._variant,
          options: notify?.options ?? this._options ?? null,
          notifyId: this._notifyId,
          // the isVisible is used only to trigger transitions
          isVisible: Alpine.reactive({ value: false }),
          timer: null
        };
        newNotify.restartTimer = function() {
          if (this.static) return null;
          this.timer = setTimeout(
            () => this.isVisible.value = false,
            this.delay
          );
        };
        newNotify.pauseTimer = function() {
          if (this.timer) {
            clearTimeout(this.timer);
          }
        };
        this._notifyId++;
        if (newNotify.sticky) {
          newNotify.restartTimer();
          this._notificationsSticky.push(newNotify);
          return;
        }
        if (this._maxNotifications > 0 && this._notifications.length >= this._maxNotifications) {
          this._buffer.push(newNotify);
          return;
        }
        newNotify.restartTimer();
        this._notifications.push(newNotify);
      },
      notification: {
        // notifications start hidden and are displayed in the nextTick to allow transitions
        "x-show"() {
          return this.notify.isVisible.value;
        },
        "x-init"() {
          this.$nextTick(() => this.notify.isVisible.value = true);
          this.$watch("notify.isVisible.value", (value) => {
            if (value) return;
            Alpine.bind(this.$el, {
              "@transitionend"() {
                this.remove(this.notify);
              },
              "@transitioncancel"() {
                this.remove(this.notify);
              }
            });
          });
        },
        ...aria.notification
      }
    };
  });
}

// components/notify/builds/module.js
var module_default = notify_default;
export {
  module_default as default
};
