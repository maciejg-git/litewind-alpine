(() => {
  // ../notify.js
  function notify_default(Alpine2) {
    Alpine2.data("notify", (dataExtend = {}) => {
      let aria = {
        role: "status"
      };
      let bind = {};
      ["notification"].forEach((i) => {
        if (dataExtend[i]) {
          bind[i] = dataExtend[i];
          delete dataExtend[i];
        }
      });
      return {
        notifications: [],
        notifyId: 1e3,
        order: "default",
        maxNotifications: 0,
        stickyAt: "end",
        buffer: [],
        notificationsSticky: [],
        delay: 1e4,
        dismissable: true,
        static: false,
        variant: "info",
        options: {},
        init() {
          this.$nextTick(() => {
            this.order = Alpine2.bound(this.$el, "data-order") ?? this.order;
            this.stickyAt = Alpine2.bound(this.$el, "data-sticky-at") ?? this.stickyAt;
            this.maxNotifications = parseInt(
              Alpine2.bound(this.$el, "data-max-notifications") ?? this.maxNotifications
            );
            this.delay = parseInt(
              Alpine2.bound(this.$el, "data-delay") ?? this.delay
            );
            this.dismissable = JSON.parse(
              Alpine2.bound(this.$el, "data-dismissable") ?? this.dismissable
            );
            this.static = JSON.parse(
              Alpine2.bound(this.$el, "data-static") ?? this.static
            );
            this.variant = Alpine2.bound(this.$el, "data-variant") ?? this.variant;
            this.options = Alpine2.bound(this.$el, "data-options") ?? this.options;
          });
          Alpine2.bind(this.$el, {
            "@show-notify.window"() {
              let id = this.$event.detail.id || null;
              let rootId = this.$root.id || null;
              if (id === null && rootId === null || id === rootId) {
                this.push(this.$event.detail);
              }
            }
          });
          Alpine2.bind(this.$el, {
            "@mouseenter"() {
              this.handleContainerMouseEnter();
            },
            "@mouseleave"() {
              this.handleContainerMouseLeave();
            }
          });
        },
        getNotifications() {
          if (this.order === "default" && this.stickyAt === "end") {
            return [...this.notifications, ...this.notificationsSticky];
          }
          if (this.order === "default" && this.stickyAt === "start") {
            return [...this.notificationsSticky, ...this.notifications];
          }
          if (this.order === "reversed" && this.stickyAt === "end") {
            return [
              ...this.notifications.toReversed(),
              ...this.notificationsSticky.toReversed()
            ];
          }
          if (this.order === "reversed" && this.stickyAt === "start") {
            return [
              ...this.notificationsSticky.toReversed(),
              ...this.notifications.toReversed()
            ];
          }
        },
        handleContainerMouseEnter() {
          this.notifications.forEach((notification) => {
            notification.pauseTimer();
          });
        },
        handleContainerMouseLeave() {
          this.notifications.forEach((notification) => {
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
          let index = this.notifications.findIndex((i) => id === i.notifyId);
          this.notifications.splice(index, 1);
          if (this.buffer.length) {
            let notify = this.buffer.shift();
            notify.restartTimer();
            this.notifications.push(notify);
          }
        },
        removeStickyById(id) {
          let index = this.notificationsSticky.findIndex(
            (i) => id === i.notifyId
          );
          this.notificationsSticky.splice(index, 1);
        },
        close() {
          this.notify.isVisible.value = false;
        },
        push(notify) {
          let newNotify = {
            header: notify?.header || "",
            text: notify?.text || "",
            delay: notify?.delay ?? this.delay,
            dismissable: notify?.dismissable ?? this.dismissable,
            static: notify?.static ?? this.static,
            sticky: notify?.sticky ?? false,
            variant: notify?.variant ?? this.variant,
            options: notify?.options ?? this.options ?? null,
            notifyId: this.notifyId,
            isVisible: Alpine2.reactive({ value: false }),
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
          this.notifyId++;
          if (newNotify.sticky) {
            newNotify.restartTimer();
            this.notificationsSticky.push(newNotify);
            return;
          }
          if (this.maxNotifications > 0 && this.notifications.length >= this.maxNotifications) {
            this.buffer.push(newNotify);
            return;
          }
          newNotify.restartTimer();
          this.notifications.push(newNotify);
        },
        notification: {
          "x-show"() {
            return this.notify.isVisible.value;
          },
          "x-init"() {
            this.$nextTick(() => this.notify.isVisible.value = true);
            this.$watch("notify.isVisible.value", (value) => {
              if (value) return;
              Alpine2.bind(this.$el, {
                "@transitionend"() {
                  this.remove(this.notify);
                },
                "@transitioncancel"() {
                  this.remove(this.notify);
                }
              });
            });
          },
          ...bind.notification,
          ...aria.notification
        },
        ...dataExtend
      };
    });
  }

  // cdn.js
  document.addEventListener("alpine:init", () => {
    Alpine.plugin(notify_default);
  });
})();
