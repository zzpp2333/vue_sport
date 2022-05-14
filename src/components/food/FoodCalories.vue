<template>
    <div>食物卡路里
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 食物卡路里的表格 可以按类查看/搜索 -->
        <el-tabs type="border-card">
            <el-tab-pane label="分类管理">分类管理</el-tab-pane>
            <el-tab-pane label="食物管理">食物管理</el-tab-pane>
        </el-tabs>
    </div>
    
</template>

<script>
export default {
    
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 17px;
}
</style>