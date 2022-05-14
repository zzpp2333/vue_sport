<template>
<!-- 引入布局 -->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo.jpg" alt />
                <span>个人运动平台--({{name}})</span>
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
                    <el-submenu :index="parentMenu.path" v-for="(parentMenu, index) in menus" :key="index">
                        <template slot="title">
                            <!-- iconsObject[parentMenu.id] -->
                            <i :class="parentMenu.icon"></i> 
                            <span>{{parentMenu.title}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="childrenMenu.path" v-for="(childrenMenu, i) in parentMenu.subList" :key="i" @click="saveNavState(childrenMenu.path)">
                            <template slot="title">
                                <!-- iconsObject[childrenMenu.id] -->
                                <i :class="childrenMenu.icon"></i>
                                <span>{{childrenMenu.title}}</span>
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
import { mapState } from 'vuex';
export default {
    //计算属性
    computed: {
        // 引入计算属性
        ...mapState(['name', 'menus', 'role'])
    },
    data(){
        return {
            // menuList: [],
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
        // this.getMenuList();
        console.log('menus', this.menus);  // 计算属性 用this.menus获取
        // 取出保存的activePath
        this.activePath = window.sessionStorage.getItem("activePath"); 
    },
    methods:{
        
        logout(){
            // 清除session
            this.$confirm('您将退出系统, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get('/logout').then((res) => {
                    console.log(res);
                    window.sessionStorage.clear();
                    // 回到首页/登录页
                    this.$router.replace("/login");
                    this.$message.success(res.data.message);
                });
            }).catch(() => {});
        },
        // 获取导航菜单列表
        // async getMenuList(){
        //     const {data: res} = await this.$http.get("menus");
        //     console.log(res);
        //     if(res.flag != 200) return this.$message.error("获取列表失败");
        //     this.menuList = res.menus; // 数据回填至menuList
        // },
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