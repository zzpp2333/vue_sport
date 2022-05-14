import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//统一管理
export default new Vuex.Store({
    state: {
        token: sessionStorage.getItem('token'),
        //如果初始化没有则赋值为空
        id: sessionStorage.getItem('id') || '1',
        name: sessionStorage.getItem('name') || '',
        role: sessionStorage.getItem('role') || '',
        menus: [],
        permissions: [],
    },
    //同步执行
    mutations: {
        setToken(state, data){
            state.token = data;
            sessionStorage.setItem('token', data);
        },
        //数据库中对应的id
        setId(state, data) {
            state.id = data;
            sessionStorage.setItem('id', data);
        },
        //用户名
        setName(state, data) {
            state.userName = data;
            sessionStorage.setItem('name', data);
        },
        setRole(state, data) {
            state.role = data;
            sessionStorage.setItem('role', data);
        },
        setMenus(state, data) {
            state.menus = data;
        },
        setPermissions(state, data) {
            state.permissions = data;
        },
    },
    //异步执行
    actions: {

    },
    modules: {

    }
});
