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

  if (store.getters.accessed.length === 0) {
    store.dispatch('getAccessed').then(response => {
      store.dispatch('setRoutes', response.appPerms).then(() => {
        router.addRoutes(store.getters.routes)

        store.dispatch('setUser', response.baseInfo)

        if (store.getters.user.usertypeId === 3) {
          store.dispatch('setApproves')
          store.dispatch('setSchedules')
        }

        next({ ...to, replace: true })
        NProgress.done()
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
      next({path: '/500'})
      // next({ path: '/401' })
    })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
