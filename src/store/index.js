import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//统一管理
export default new Vuex.Store({
    state: {
        token: sessionStorage.getItem('token'),
        //如果初始化没有则赋值为空
        id: sessionStorage.getItem('id') || '1',
        userName: sessionStorage.getItem('name') || '',
        menus: JSON.parse(sessionStorage.getItem('menus') || '[]'),
        roles: JSON.parse(sessionStorage.getItem('roles') || '[]'),
        premissions: JSON.parse(sessionStorage.getItem('permissions') || '[]'),
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
        setUserName(state, data) {
            state.userName = data;
            sessionStorage.setItem('name', data);
        },
        setMenus(state, data) {
            state.menus = data;
            sessionStorage.setItem('menus', JSON.stringify(data));
        },
        setRoles(state, data) {
            state.roles = data;
            sessionStorage.setItem('roles', JSON.stringify(data));
        },
        setPremission(state, data) {
            state.premissions = data;
            sessionStorage.setItem('permissions', JSON.stringify(data));
        },
    },
    //异步执行
    actions: {

    },
    modules: {

    }
});
