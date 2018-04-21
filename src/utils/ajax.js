import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/cookie'
import { relogin, reback } from '@/utils'

const ajax = axios.create({
  // 开发调试不限定超时时间
  timeout: process.env.NODE_ENV === 'production' ? 20000 : 0,
  baseURL: process.env.BASE_URL
})

ajax.interceptors.request.use(config => {
  if (store.getters.token || getToken()) {
    config.headers['Zjy-Token'] = store.getters.token || getToken()

    // 相当恶心的IE缓存
    if (document.documentMode) {
      if (config.params) {
        Object.assign(config.params, {
          _t: new Date().getTime()
        })
      } else {
        config.params = {
          _t: new Date().getTime()
        }
      }
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

ajax.interceptors.response.use(response => {
  const resp = response.data

  // 定义失效或其它信息
  switch (resp.code) {
    // case 0: alert(resp.message); break
    case 30002: relogin(); break
    case 30001: reback(); break
    default: return resp
  }
},
error => {
  console.log(error)
  // 线上环境如果请求超时则跳转到500
  // process.env.NODE_ENV === 'production'
  //   ?  router.push({path: '/500'})
  //   : ''
  router.push({path: '/500'})
  return Promise.reject(error)
})

export default ajax
