import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入Login文件并配置路由
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'
import UserRight from '../components/admin/UserRight.vue'
import FoodCalories from '../components/food/FoodCalories.vue'
import GoodList from '../components/admin/GoodList.vue'
import store from '@/store'
import ajax from '@/plugins/ajax'
import { formatMenu } from '@/utils/menu'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    // redirect: "/welcome",  //home页面重定向到子组件welcome
    // children: [
    //   {path:"/welcome", component: Welcome,},
    //   {path:"/user", component: UserList,},
    //   {path:"/rights", component: UserRight,},
    //   {path: "/goods", component: GoodList,},
    //   {path:"/calories", component: FoodCalories,},
    // ]
  }
]

const router = new VueRouter({
  // mode: "history",  
  // 没有# 但history模式下,只是动态的通过js操作window.history来改变浏览器地址栏里的路径,并没有发起http请求
  // 因此刷新页面会404
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject){
  if(onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// 挂载路由导航守卫 对用户要跳转的路由做一次检查 符合条件放行 不符合就强制访问登录页面
router.beforeEach((to, from, next)=>{ //全局前置守卫
  // to: 将要访问
  // from: 从哪发出的请求
  // next: 函数(可选) next(url) 重定向到url上 next() 放行 继续访问to
  if(to.path=='/login') return next();
  // 获取user 
  const token = window.sessionStorage.getItem("token"); //取出当前用户
  if(!token) return next('/login'); //token为空 则返回登陆页面 否则有可能看到前一个登出用户的内容
  
  // if(!store.state.roles || store.state.roles.length < 1) { // 判断vuex中是否存在用户基本信息
    // 向后端发送请求 获取用户的基本信息
  ajax.get('/getUserInfo').then((res) => {
    console.log('用户基本信息', res);
    const user = res.data.data;
    store.commit('setName', user.username);
    store.commit('setId', user.id);
    store.commit('setRole', user.role);
    if(user.roleList.length > 0){
      //添加角色 菜单 权限等信息
      const menuList = formatMenu(user.roleList[0].menus);
      router.addRoutes(menuList);
      store.commit('setMenus', menuList);
      store.commit('setRoleList', user.roleList);
      store.commit('setPermissions', user.roleList[0].permissions);
    }
  });
  // }
  if(to.path == '/login'){
    return next('/home'); // 如果已经登陆 则不访问login页面 访问主页面
  }else{
    next(); //符合要求
  }
  
  // 确保 next 在任何给定的导航守卫中都被严格调用一次。
})

export default router
