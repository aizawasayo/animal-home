import Vue from 'vue'
import Comment from '@/components/comment'

// 评论组件
// Vue.component('Comment', Comment)
Vue.component('Comment', () => import('@/components/comment'))

// 下面为异步组件，这个动态导入会返回一个 `Promise` 对象。
// 面包屑导航
Vue.component('bread-crumbs',() => import('@/components/core/BreadCrumbs'))

// 页面主标题
Vue.component('list-header', () => import('@/components/core/ListHeader'),)
