<template>
    <div> 用户列表 
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                <!-- 搜索 & 添加 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList()">
                        <el-button slot="append" icon="el-icon-search" @click="searchUserList()" @keyup.native.enter="searchUserList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表 border边框 stripe隔行变色-->
            <el-table :data="userList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="角色" prop="role"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}}为每一行封存的数据 -->
                        <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                    
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 权限 -->
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false"> <!-- 文字提示 enterable隐藏 -->
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showEditRoleDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
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
        <!-- 新增用户区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose()">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed()">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog title="分配用户权限" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClosed()">
            <el-form :model="editRoleForm" ref="editRoleFormRef" label-width="70px">
                <el-form-item label="权限分配">
                    <el-radio v-model="editRoleForm.role" border label="普通用户"></el-radio>
                    <el-radio v-model="editRoleForm.role" border label="普通管理员"></el-radio>
                    <el-radio v-model="editRoleForm.role" border label="超级管理员"></el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    created(){
        this.getUserList();
    },
    data(){
        return{
            // 查询信息实体
            queryInfo:{
                query:"", // 查询信息
                pageStart: 1, // 当前页
                pageSize: 5,  //每页偏移
            },
            userList:[], // 用户列表
            total: 0, // 总记录数 初始为0
            // 表单信息
            addDialogVisible: false, // 对话框 隐藏/显示 状态
            // 添加用户的信息
            addForm: {
                username: '',
                password: '',
                email: '',
                // role & state 默认为 普通用户 & 未启用
            },
            // 修改用户的信息
            editForm: {},
            editDialogVisible: false, //修改用户栏 隐藏/显示 状态
            // 添加表单验证
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 ~ 20 个字符', trigger: 'blur' },
                    {type: 'email', message: '请输入正确邮箱地址', trigger: 'blur'},
                ],
            },
            // 修改表单验证
            editFormRules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { min: 5, max: 20, message: '长度在 5 ~ 20 个字符', trigger: 'blur' },
                    {type: 'email', message: '请输入正确邮箱地址', trigger: 'blur'},
                ],
            },
            editRoleForm:{
                role: "",
                id: -1,
            },
            editRoleDialogVisible: false,
        }
    },
    methods:{
        async getUserList(){
            // 获取所有用户
           const {data:res} = await this.$ajax.get("/user/allUser", {params: this.queryInfo})
           this.userList =  res.data.rows; // 用户列表数据封装
           this.total = res.data.total; // 总用户数封装
        },
        searchUserList(){
            this.queryInfo.pageStart = 1; 
            // 如果当前pageStart不为1 那么直接调用getUserList 查询到的结果为limit pageStart 也就是说pageStart之前的数据都差不到
            this.getUserList();
        },
        handleSizeChange(newSize){
            // 处理页面变化
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage){
            // pageStart发生变化
            this.queryInfo.pageStart = newPage;
            this.getUserList();
        },
        // 修改用户状态
        async userStateChanged(userInfo){
            const {data:res} = await this.$ajax.put(`/user/userState?id=${userInfo.id}&state=${userInfo.state}`); //提交
            console.log('返回数据', res);
            if(!res.flag){
                userInfo.id = !userInfo.id;
                return this.$message.error("操作失败");
            }
            this.$message.success("操作成功");
        },
        // 监听添加用户
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$ajax.post('/user/addUser', this.addForm);
                if(!res.flag){
                    return this.$message.error("操作失败");
                }
                this.$message.success("操作成功");
                this.addDialogVisible = false;
                this.getUserList();
            });
        },
        async deleteUser(id){
            // 根据主键删除用户信息
            const confirmResult = await this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).catch(err => err);
            if(confirmResult != "confirm"){
                return this.$message.info("已取消删除");
            }
            const {data:res} = await this.$ajax.delete("/user/deleteUser?id="+id);
            if(!res.flag){
                return this.$message.error("删除失败");
            }
            this.$message.success("删除成功");
            this.getUserList();
        },
        // 显示修改对话框
        async showEditDialog(id){
            const {data:res} = await this.$ajax.get("/user/getUpdate?id="+id); //根据主键获取用户信息
            this.editForm = res.data; // 将查询出来的用户信息反填在表单中
            this.editDialogVisible = true; // 开启编辑对话框
        },
        // 关闭对话框
        editDialogClosed(){
            this.$refs.editFormRef.resetFields(); // 重置信息
        },
        // 确认修改
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error("请填写有效信息");
                }
                // 发起修改请求
                const {data:res} = await this.$ajax.put("/user/updateUser", this.editForm);
                if(!res.flag){
                    return this.$message.error(res.message);
                }
                this.$message.success(res.message);
                this.editDialogVisible = false; //隐藏修改对话框
                this.getUserList();
            });
        },
        async showEditRoleDialog(id){
            const {data:res} = await this.$ajax.get("/user/getUpdate?id="+id); //根据主键获取用户信息
            this.editRoleForm.role = res.data.role;
            this.editRoleForm.id = res.data.id;
            console.log(this.editRoleForm);
            this.editRoleDialogVisible = true;
        },
        editRoleDialogClosed(){
            this.$refs.editRoleFormRef.resetFields();
        },
        async editRole(){
            const {data:res} = await this.$ajax.put("/user/updateRole", this.editRoleForm);
            console.log(res);
            if(!res.flag){
                return this.$message.error(res.message);
            }
            this.$message.success(res.message);
            this.getUserList();
        },
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 17px;
}
</style>