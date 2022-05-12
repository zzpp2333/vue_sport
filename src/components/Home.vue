<template>
<!-- 引入布局 -->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.jpg" alt />
                <span>个人运动平台</span>
            </div>
            <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 伸缩按钮 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏 只保持一个菜单展开 -->
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"
                :default-active="activePath">
                    <!-- 一级菜单 主菜单以及次菜单在easyproject数据库的mainmenu submenu中 -->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObject[item.id]"></i>
                            <span>{{item.title}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="itm.path" v-for="itm in item.subList" :key="itm.id" @click="saveNavState(itm.path)">
                            <template slot="title">
                                <i :class="iconsObject[itm.id]"></i>
                                <span>{{itm.title}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体内容 根据侧边栏点击 展示不同内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
</template>

<script>
export default {
    data(){
        return {
            // 菜单列表
            menuList: [],
            // 控制伸缩
            isCollapse: false,
            iconsObject:{
                '100': 'iconfont icon-guanliyuan',
                '200': 'iconfont icon-shouye',
                '101': 'iconfont icon-denglu',
                '102': 'iconfont icon-mima',
                '103': 'iconfont icon-shouye',
                '104': 'iconfont icon-shangpin',
                '201': 'iconfont icon-shu',
                '202': 'iconfont icon-qialuli',
                '203': 'iconfont icon-shiwu',
            },
            activePath: '/welcome', // 默认路径
        }
    },
    // onload事件 页面一加载 就在数据库中查询mainmenu和submenu
    created(){
        this.getMenuList();
        // 取出保存的activePath
        this.activePath = window.sessionStorage.getItem("activePath"); 
    },
    methods:{
        
        logout(){
            // 清除session
            window.sessionStorage.clear();
            // 回到首页/登录页
            this.$router.push("/login");
        },
        // 获取导航菜单列表
        async getMenuList(){
            const {data: res} = await this.$http.get("menus");
            console.log(res);
            if(res.flag != 200) return this.$message.error("获取列表失败");
            this.menuList = res.menus; // 数据回填至menuList
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        // 保存路径
        saveNavState(activePath){
            // 存放在session中 点击侧边栏二级菜单后保存对应的路径
            window.sessionStorage.setItem("activePath", activePath);
            this.activePath = activePath;
        },
    },
}
</script>
<style lang="less" scoped>
// 布局器样式
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between; //左右贴边
    padding-left: 0%; //左边界
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
img{
    width: 55px;
    height: 55px;
}
// |||按钮样式
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>