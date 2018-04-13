import router from '@/router'
import store from '@/store'
import { getToken, setToken } from '@/utils/cookie'
import NProgress from '@/utils/nprogress'

const whiteList = ['/401', '/500']

router.beforeEach((to, from, next) => {
  NProgress.start()

  if (!getToken() && to.query.token ||
    to.query.token && to.query.token !== getToken()) {
    store.dispatch('setToken', to.query.token)
    setToken(to.query.token)
  }

  if (whiteList.indexOf(to.path) > -1) {
    NProgress.done()
    next()
    return
  }

  if (!getToken()) {
    window.location.href = process.env.SSO_URL
    return
  }

  const userType = to.query.userType

  if (store.getters.accessed.length === 0) {
    store.dispatch('getAccessed').then(response => {
      store.dispatch('setRoutes', response.appPerms).then(() => {
        router.addRoutes(store.getters.routes)
        // 应返回用户类型,否则刷新无
        Object.assign(response.baseInfo, {
          userType: userType
        })
        store.dispatch('setUser', response.baseInfo)
        store.dispatch('setApproves')
        store.dispatch('refresh')
        // if (true || userType === '3') { store.dispatch('refresh') }
        next({ ...to, replace: true })
        NProgress.done()
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      // next({path: '/500'})
      // next({ path: '/401' })
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
