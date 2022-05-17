import Vue from 'vue';
import store from '@/store'

// 使用directive自定义指令 第一个参数定义指令名 第二个参数实现方法
Vue.directive('hasRole', {
    inserted(el, binding){
        // 获取指令传递得到参数
        const { value } = binding;
        const roles = store.state.roleList;
        const admin = 'ROLE_SUPERADMIN';
        // console.log('roleList', roles);
        if (value && value instanceof Array && value.length > 0){
            // some: 用于检测数组中的元素是否满足指定的条件 并不会改变原来的数组 返回true false
            const hasRole = roles.some(item => {
                // include: 判断字符串是否包含某个指定的子字符串
                return item.name === admin || value.includes(item.name);
            });
            // 如果没有该角色
            if(!hasRole){
                el.parentNode.removeChild(el); // 把对应的元素删除
            }
        }else{
            throw new Error(`请设置${value}角色标签`);
        }

    }
});

Vue.directive('hasPermission', {
    inserted(el, binding) {
        const { value } = binding;
        // console.log(value);
        //用户权限
        const permission = store.state.permissions;
        // console.log('permission', permission);
        // 判断permission是否存在 是否为数组 长度是否大于0
        if (value && value instanceof Array && value.length > 0) {
            //迭代查找元素
            const hasPermission = permission.some(item => {
                // console.log(item.permission);
                return value.includes(item.permission);
            });
            //不存在该权限
            if (!hasPermission) {
                el.parentNode.removeChild(el);
            }
        } else {
            throw new Error(`请设置${value}标签值`)
        }
    }
});