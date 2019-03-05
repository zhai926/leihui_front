import Vue from 'vue'
import Router from 'vue-router'
 
import Login from '@/components/auth/login'
import Main from '@/components/common/main'
// import Register from '@/components/auth/register'
// user 管理
import userList from '@/components/user/list'
// import Add from '@/components/user/add'

// 首页管理
// banner
import brand from '@/components/index/brand/main'
import brandList from '@/components/index/brand/children/list'
import brandAdd from '@/components/index/brand/children/add'
import brandEdit from '@/components/index/brand/children/Edit'
// 推荐新闻
import indexNews from '@/components/index/indexNews/main'
import indexNewsList from '@/components/index/indexNews/children/list'
import indexNewsAdd from '@/components/index/indexNews/children/add'


// import upload from '@/components/product/upload'
// 新闻管理
import news from '@/components/news/news/main'
import newsList from '@/components/news/news/children/list'
import addNews from  '@/components/news/news/children/add'
import editNews from  '@/components/news/news/children/edit'
// 新闻分类
import newsClass from '@/components/news/newsClass/main'
import newsClassList from '@/components/news/newsClass/children/list'
import newsClassAdd from '@/components/news/newsClass/children/add'







import { getStore } from '@/config/storage'
import store from '@/store/index'


Vue.use(Router)

const router = new Router({
  // mode:'history',
   history: false,
    hashbang: true,
  base:__dirname,
  scrollBehavior (to, from, savedPosition) { //这个可以简单的实现路由改变是滚动条回到顶部
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
  },
  routes: [
    {  path: '/', redirect: '/login' ,hidden:true },
    {  path: '/index', redirect: '/index/userList' ,hidden:true },
    {  path: '/login',name: '乐慧学校登录',component: Login,hidden:true },
    {
      path: '/index', name: '用户管理', component: Main, iconCls:'fa-user ',
      meta: { requireAuth:true },//该字段用来验证这个路由时许需要登陆的 
       children:[
          { path:'userList',iconCls:'fa-users ', component:userList,name:'系统管理员管理',meta:{page:0, requireAuth:true}}
        ]
    },
    {
      path: '/index', name: '首页管理', component: Main, iconCls:'fa-th-list',
      meta: {  requireAuth:true  },
       children:[
          {
            path:'brand', iconCls:'fa-image ',component:brand,name:'首页banner管理',meta:{page:1, requireAuth:true},
            // children:[
              // {path:'list',component:brandList,name:'列表'},
              // {path:'add',component:brandAdd,name:'新增'},
              // {path:'edit',component:brandEdit,name:'编辑'},
              // {path:'',redirect:'',hidden:true}
            // ]
      },
      { path:'indexNews',iconCls:'fa-bomb ', component:indexNews,name:'推荐新闻管理',meta:{page:2, requireAuth:true} },
      
      ]
    },
   {
      path: '/index', name: '新闻管理', iconCls:'fa-paw', component: Main, meta: { requireAuth:true },
       children:[
          {path:'newsClass',iconCls:'fa-navicon',component:newsClass,name:'新闻分类管理',meta:{page:3, requireAuth:true}},
          {path:'news',iconCls:'fa-bolt',component:news,name:'新闻详情管理',meta:{page:4, requireAuth:true},
          children:[
                {path:'list',component:newsList,name:'新闻列表',meta: { requireAuth:true }},
                {path:'add',component:addNews,name:'新闻新增', meta: { requireAuth:true }},
                {path:'edit',component:editNews,name:'新闻编辑', meta: { requireAuth:true }},
                // {path:'',redirect:'',hidden:true}
              ]
      }
      ]
     }
  ]
  
})
// 刷新也main时，重新赋值登录信息

if(getStore('userInfo')){
  console.log(getStore('userInfo'))
  store.commit('REMEBER_USER', getStore('userInfo'))
    
}

router.beforeEach((to,from,next) => {
  if(to.meta.requireAuth) {
    if(store.state.user.username){
      next()
    }else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }else {
     next()
  }
})
//通过afterEach做的页面名称的改变
router.afterEach(( to,from ) => {
   let titles = []
   let matched = to.name
  // title动态添加
  document.title = '乐慧护理培训学校'+matched
  const decode = decodeURIComponent
  // 打印路由
  if(process.env.NODE_ENV === 'development'){
      console.info(`[路由日志] ${decode(from.path || '')} => ${decode(to.path)}`)
  }
  
})


export default router