<template>
    <div> 权限管理
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                <!-- 搜索 & 添加 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getPermissionList()">
                        <el-button slot="append" icon="el-icon-search" @click="searchPermissionList()" @keyup.native.enter="searchPermissionList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddDialog">添加权限</el-button>
                </el-col>
            </el-row>
            <el-table :data="permissionList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="权限名" prop="name"></el-table-column>
                <el-table-column label="权限标签" prop="permission"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}}为每一行封存的数据 -->
                        <el-switch v-model="scope.row.state" @change="permissionStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletePermission(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新增或编辑权限区域 -->
            <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" @close="dialogClose()">
                <el-form :model="permissionForm" :rules="permFormRules" ref="permFormRef" label-width="70px">
                    <el-form-item label="权限名" prop="name">
                        <el-input v-model="permissionForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="state">
                        <el-radio-group v-model="permissionForm.state" class="state-class">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group> 
                    </el-form-item>
                    <el-form-item label="权限标签" prop="permission">
                        <el-input v-model="permissionForm.permission" 
                        @keyup.native="permissionForm.permission=permissionForm.permission.replace(/[^a-zA-Z_]/g,'')"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisibleConfirm">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分页组件 size-change每页最大的数量 current-change当前页面变化数 layout功能组件 -->
            <div>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageStart"
                :page-sizes="[1, 2, 5, 100]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 查询信息实体
            queryInfo:{
                query:"", // 查询信息
                pageStart: 1, // 当前页
                pageSize: 5,  //每页偏移
            },
            permissionList:[], // 权限列表
            total: 0, // 总记录数 初始为0
            dialogVisible: false, // 对话框 隐藏/显示 状态
            // 添加用户的信息
            permissionForm: {
                state: true, // 默认为true(启用状态)
            },
            title: "",
            // 添加表单验证
            permFormRules: {
                name: [
                    { required: true, message: '请输入权限名', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
                ],
                permission: [
                    { required: true, message: '请输入权限标签, 权限标识只能包含字母或下划线', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 ~ 20 个字符', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ],
            },
        }
    },
    created(){
        this.getPermissionList();
    },
    methods:{
        getPermissionList(){
            this.$ajax.post("/permission/allPermission", this.queryInfo).then((res) => {
                console.log(res);
                if(!res.data.flag) return this.$message.error(res.data.message);
                this.permissionList =  res.data.rows; // 用户列表数据封装
                this.total = res.data.total; // 总用户数封装
            });
        },
        searchPermissionList(){
            this.queryInfo.pageStart = 1; 
            // 如果当前pageStart不为1 那么直接调用getUserList 查询到的结果为limit pageStart 也就是说pageStart之前的数据都差不到
            this.getPermissionList();
        },
        handleSizeChange(newSize){
            // 处理页面变化
            this.queryInfo.pageSize = newSize;
            this.getPermissionList();
        },
        handleCurrentChange(newPage){
            // pageStart发生变化
            this.queryInfo.pageStart = newPage;
            this.getPermissionList();
        },
        showAddDialog(){
            this.title = '添加权限';
            this.permissionForm = {};
            this.dialogVisible = true;
        },
        showEditDialog(row){
            this.title = '编辑权限';
            this.permissionForm = row;
            this.dialogVisible = true;
        },
        dialogVisibleConfirm(){
            // 新增/修改 共用一个确定 使用id区别 @click="dialogVisibleConfirm" 点击确定执行相应的操作
            if(this.permissionForm.id === null || this.permissionForm.id === undefined){
                this.addPermission();
            }else{
                this.updatePermission();
            }
        },
        dialogClose(){
            this.$refs.permFormRef.resetFields();
        },
        addPermission(){
            this.$refs.permFormRef.validate(valid => {
                if(!valid){
                    return this.$message.error("请输入有效信息");
                }
                this.$ajax.post("/permission/addPermission", this.permissionForm).then((res) => {
                    if(!res.data.flag){
                        return this.$message.error(res.data.message);
                    }
                    this.$message.success(res.data.message);
                    this.dialogVisible = false;
                    this.getPermissionList();
                });
            });
        },
        updatePermission(){
            this.$refs.permFormRef.validate(valid => {
                if(!valid){
                    return this.$message.error("请输入有效信息");
                }
                this.$ajax.post('/permission/updatePermission', this.permissionForm).then((res) => {
                    if (!res.data.flag) {
                        return this.$message.error(res.data.message);
                    }
                    this.$message.success(res.data.message);
                    this.dialogVisible = false;
                    this.getPermissionList();
                });
            });
        },
        deletePermission(id){
            this.$confirm('此操作将永久删除该权限信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //delete请求遵循restful风格
                this.$ajax.delete(`/permission/deletePermission/${id}`).then((res) => {
                    if (!res.data.flag) return this.$message.error(res.data.message);
                    this.$message.success(res.data.message);
                    this.getPermissionList();
                });
            }).catch(() => {
                // 成功删除为confirm 取消为 cancel
                return this.$message.info("操作已取消");
            });
        },
        permissionStateChanged(row){
            this.$ajax.post('/permission/updatePermission', row).then((res) => {
                console.log('row', row);
                if (!res.data.flag) {
                    return this.$message.error(res.data.message);
                }
                this.$message.success(res.data.message);
                this.getPermissionList();
            });
        },
    }
}
</script>

<style lang="less" scoped>

</style>