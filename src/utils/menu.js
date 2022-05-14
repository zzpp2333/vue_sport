import Home from '@/components/Home'

export const formatMenu = (menus) => {
    // 使用过滤器迭代菜单 并对菜单进行格式化后返回
    const route = menus.filter(item => {
        // 没有component属性则为父目录 返回Home.vue
        item.component = (item.component == null) ? Home : loadView(item.component);
        item.meta = {title : item.title};
        
        if(item.subList && item.subList.length > 0){
            item.children = formatMenu(item.subList);
        }
        return true;
    });
    return route;
}

// 路由懒加载 返回路由组件
const loadView = (view) => {
    return (resolve) => require([`@/components/${view}.vue`], resolve);
}