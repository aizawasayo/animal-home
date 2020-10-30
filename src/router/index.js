import Vue from 'vue'
import VueRouter from 'vue-router'
// 有子路由的都需要 Layout，来添加一个嵌套路由出口
import Layout from '@views/layout/index'
import {
  getToken
} from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

Vue.use(VueRouter)

/* Router Modules */
import archiveRouter from './modules/archive'
import communityRouter from './modules/community'
import detailRouter from './modules/detail'

const routes = [{
    path: '/',
    component: () => import('@views/home'), // home.vue 里的 name 也是 'Home'
    name: 'Home', // 此处举例说明：路由 name 命名时候尽量保证唯一性，并且和其对应的组件名称一致，以便于应用keep-alive
    meta: {
      title: '动森之家'
    }
  },
  {
    path: '/guide',
    component: () => import( /* webpackChunkName: "guide" */ '@views/guide'),
    name: 'Guide',
    meta: {
      title: '攻略'
    }
  },
  archiveRouter,
  communityRouter,
  detailRouter,
  {
    path: '/design',
    component: Layout,
    children: [{
        path: '/',
        component: () => import('@views/design'),
        name: 'Design',
        meta: {
          title: '设计分享'
        }
      },
      {
        path: 'add',
        component: () => import('@views/design/add'),
        name: 'DesignAdd',
        meta: {
          title: '发布我的设计',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@views/login'),
    name:'Login'
  },
  {
    path: '/user',
    component: Layout,
    meta: {
      title: '用户中心',
      // requiresAuth: true
    },
    children: [{
        path: '/',
        component: () => import('@views/user'),
        name: 'UserCenter',
        meta: {
          title: '用户中心',
          requiresAuth: true
        },
      },
      {
        path: 'edit',
        component: () => import('@views/user/edit'),
        name: 'UserEdit',
        meta: {
          title: '修改个人信息',
          requiresAuth: true
        },
      },
      {
        path: 'register',
        component: () => import('@views/user/register'),
        name: 'Register',
        meta: {
          title: '注册新用户',
        },
      },
      {
        path: 'password',
        component: () => import('@views/user/password'),
        name: 'PswEdit',
        meta: {
          title: '修改密码',
          requiresAuth: true
        },
      },
    ]
  },
  {
    path: '/404',
    component: () => import('@views/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => 
new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition || { x: 0, y: 0 }
  },
})
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes,
//   scrollBehavior: (to, from, savedPosition) => {
//     if (savedPosition) {
//       return savedPosition
//     } else {
//       return {
//         y: 0
//       }
//     }
//   },
// })
const router = createRouter()

// 逻辑梳理：1.已登录未登录 2.to路由是否需要登录
// 已登录：可以任意访问任何路由，除了login
// 未登录：需要权限的路由则跳转去登录页面，不需要的直接放行
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) { // 已登录
    await store.dispatch('user/getInfo')
    if(to.path === '/login'){
      next(from.fullPath)
      NProgress.done()
    }else{
      next()
      NProgress.done()
    }
  } else { // 未登录
    if (to.matched.some(route => route.meta && route.meta.requiresAuth)) { // 需要登录才能访问
      alert('访问该页面需要先登录！')
        // this.$root.$dialogLoader.showSnackbar('请先登录！', {
        //   color: 'error'
        // })
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 'to.fullPath'是跳转到登录之前页面的路径
      })
      NProgress.done()
    } else { // 不需要登录即可访问
      next()
      NProgress.done()
    }
  }
  

})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router