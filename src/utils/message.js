import { Message } from 'element-ui'

(function (msg) {
  if (window.MSG) return

  window.MSG = {}
  Object.assign(window.MSG, {
    success: (message, duration) => msg.success({
      message,
      duration: duration || 1000
    }),

    warning: (message, duration) => msg.warning({
      message,
      duration: duration || 1000
    })
  })
})(Message)
