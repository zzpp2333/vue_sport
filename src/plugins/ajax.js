import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui';
import router from '@/router';

// 创建ajax实例 并设置请求超时时间
const ajax = axios.create({
//   baseURL: "http://localhost:9000",
  timeout: 100000,
  withCredentials: true
})

// 请求拦截器
ajax.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if(token){
        // 给请求头加上token
        config.headers['Authorization'] = token;
    }
    // console.log('请求拦截器', config);
    return config;
}, (err) => {
    console.log('请求异常', err);
});

// 响应拦截器
ajax.interceptors.response.use((res) => {
    console.log('响应拦截器', res.data);
    if(!res.data.flag){
        Message.error(res.data.message);
    }
    return res;
}, (err) => {
    if(err.response){
        // console.log(err.response);
        //== 用来比较或者判断两者是否相等，比较时可以自动转换数据类型 0=='0'
        // === 用来较为严格的比较，除判断数据是否相等 ，还会判断两者数据类型是否相同 如不相同也不会转换数据类型返回（false） 0!=='0'
        if(err.response.status === 400){
            Message.error(err.response.data.message);
        }else if(err.response.status === 401){
            Message.error('您未登录, 请登录后操作');
            sessionStorage.clear();
            // 跳转到登录
            router.replace('/login');
        }else if(err.response.status === 403){
            Message.error(err.response.data.message);
        }else if(err.response.status === 404){
            Message.error('后端接口未找到');
        }else if(err.response.status === 405){
            Message.warning('请求方法错误-->需要"' + err.response.headers.allow + '"请求');
        }else if(err.response.status === 500){
            Message.error('后端异常-->' + err.response.data.message);
        }else{
            Message.error('未知错误');
        }
    }else if(err.request){
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
    }else{
        console.log('响应异常', err.message);
    }
    console.log(err.config);
});

Vue.prototype.$ajax = ajax;

// 暴露ajax
export default ajax;