<template>
    <div>食物卡路里
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 食物卡路里的表格 可以按类查看/搜索 -->
        <el-tabs type="border-card">
            <el-tab-pane label="分类管理">
                <food-type :active="0"/>
            </el-tab-pane>
            <el-tab-pane label="食物管理">食物管理
                <food-management :active="1"/>
            </el-tab-pane>
        </el-tabs>
    </div>
    
</template>

<script>
import FoodType from "./FoodType";
import FoodManagement from "./FoodManagement";

export default {
    components:{
        FoodType, 
        FoodManagement,
    },
    data(){
        return{
            active: 0,
        }
    }
}
</script>

<style lang="less" scoped>

</style>