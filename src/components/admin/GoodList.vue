<template>
    <div> 商品列表
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 商品列表主体 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                <!-- 搜索 & 添加 -->
                    <el-input placeholder="请输入搜索内容" v-hasPermission="['GOODS_QUERY']" v-model="queryInfo.query" clearable @clear="getGoodList()">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoodList()" @keyup.native.enter="searchGoodList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" v-hasPermission="['GOODS_ADD']" @click="showAddDialog">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表 border边框 stripe隔行变色-->
            <el-table :data="goodList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品" prop="goodName"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="库存" prop="inStock"></el-table-column>
                <el-table-column label="创建者" prop="createUserId"></el-table-column>
                <el-table-column label="图片地址" prop="imgUrl"></el-table-column>
                <el-table-column label="适配机型" prop="modelType"></el-table-column>
                <el-table-column label="控制方式" prop="controlModel"></el-table-column>
                <el-table-column label="主要功能" prop="mainFunction"></el-table-column>
                <el-table-column label="无线功能" prop="wifiFunction"></el-table-column>
                <el-table-column label="电池规格" prop="battery"></el-table-column>
                <el-table-column label="特色功能" prop="characteristic"></el-table-column>
                <el-table-column label="外观尺寸" prop="size"></el-table-column>
                <el-table-column label="其他功能" prop="other"></el-table-column>
                <el-table-column label="备注" prop="remark"></el-table-column>
                    
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" v-hasPermission="['GOODS_UPDATE']" @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" v-hasPermission="['GOODS_DELETE']" @click="deleteGood(scope.row.id)"></el-button>
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
        <!-- 新增商品区域 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" @close="dialogClose()">
            <el-form :model="goodForm" :rules="goodFormRules" ref="goodFormRef" label-width="70px">
                <el-form-item label="商品名" prop="goodName">
                    <el-input v-model="goodForm.goodName"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input-number v-model.number="goodForm.price"></el-input-number>
                </el-form-item>
                <el-form-item label="库存" prop="inStock">
                    <!-- v-model.number 表示浏览器输入的为数字类型 -->
                    <el-input-number v-model.number="goodForm.inStock"></el-input-number>
                </el-form-item>
                <!-- createUserId 为当前登录用户的id 不可更改 -->
                <el-form-item label="创建者" prop="createUserId">
                    <el-input v-model="goodForm.createUserId" disabled></el-input>
                </el-form-item>
                <el-form-item label="图片地址" prop="imgUrl">
                    <el-input v-model="goodForm.imgUrl"></el-input>
                </el-form-item>
                <el-form-item label="适配机型" prop="modelType">
                    <el-input v-model="goodForm.modelType"></el-input>
                </el-form-item>
                <el-form-item label="控制方式" prop="controlModel">
                    <el-input v-model="goodForm.controlModel"></el-input>
                </el-form-item>
                <el-form-item label="主要功能" prop="mainFunction">
                    <el-input v-model="goodForm.mainFunction"></el-input>
                </el-form-item>
                <el-form-item label="无线功能" prop="wifiFunction">
                    <el-input v-model="goodForm.wifiFunction"></el-input>
                </el-form-item>
                <el-form-item label="电池规格" prop="battery">
                    <el-input v-model="goodForm.battery"></el-input>
                </el-form-item>
                <el-form-item label="特色功能" prop="characteristic">
                    <el-input v-model="goodForm.characteristic"></el-input>
                </el-form-item>
                <el-form-item label="外观尺寸" prop="size">
                    <el-input v-model="goodForm.size"></el-input>
                </el-form-item>
                <el-form-item label="其他功能" prop="other">
                    <el-input v-model="goodForm.other"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="goodForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    //计算属性
    computed: {
        // 引入计算属性
        ...mapState(['id'])
    },
    created(){
        console.log(this.goodForm);
        this.getGoodList();
    },
    data(){
        return{
            // 查询信息实体
            queryInfo:{
                query:"", // 查询信息
                pageStart: 1, // 当前页
                pageSize: 5,  //每页偏移
            },
            goodList:[], // 用户列表
            total: 0, // 总记录数 初始为0
            // 表单信息
            dialogVisible: false, // 对话框 隐藏/显示 状态 点击新增/修改设为true 关闭对话框设为false
            title: "", 
            // 添加商品的信息
            goodForm: {
                id: '',
                goodName: '',
                price: 0,
                inStock: 0,
                createUserId: sessionStorage.getItem('id'),
                imgUrl: '',
                modelType: '',
                controlModel: '',
                mainFunction: '',
                wifiFunction: '',
                battery: '',
                characteristic: '',
                size: '',
                other: '',
                remark: '',
            },
            // 添加表单验证
            goodFormRules: {
                goodName: [
                    { required: true, message: '请输入商品名', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    { type: 'number', min: 0, max: 2147483647, message: '价格需为整数或浮点数, 且在0~2147483647之间', trigger: 'blur' },
                ],
                inStock: [
                    { required: false, message: '请输入库存', trigger: 'blur' },
                    { type: 'integer', min: 0, max: 2147483647, message: '库存需为整数, 且在0~2147483647之间', trigger: 'blur' },
                ],
                // createUserId 为当前登录用户的id 不可更改
                imgUrl: [
                    { required: false, message: '请输入图片地址', trigger: 'blur' },
                    { max: 99, message: '长度在 1 ~ 99 个字符', trigger: 'blur' }
                ],
                modelType: [
                    { required: false, message: '请输入适配机型', trigger: 'blur' },
                    { max: 50, message: '长度在 1 ~ 50 个字符', trigger: 'blur' }
                ],
                controlModel: [
                    { required: false, message: '请输入控制方式', trigger: 'blur' },
                    { max: 50, message: '长度在 1 ~ 50 个字符', trigger: 'blur' }
                ],
                mainFunction: [
                    { required: false, message: '请输入主要功能', trigger: 'blur' },
                    { max: 250, message: '长度在 1 ~ 250 个字符', trigger: 'blur' }
                ],
                wifiFunction: [
                    { required: false, message: '请输入无线功能', trigger: 'blur' },
                    { max: 50, message: '长度在 1 ~ 50 个字符', trigger: 'blur' }
                ],
                battery: [
                    { required: false, message: '请输入电池规格', trigger: 'blur' },
                    { max: 150, message: '长度在 1 ~ 150 个字符', trigger: 'blur' }
                ],
                characteristic: [
                    { required: false, message: '请输入特色功能', trigger: 'blur' },
                    { max: 150, message: '长度在 1 ~ 150 个字符', trigger: 'blur' }
                ],
                size: [
                    { required: false, message: '请输入外观尺寸', trigger: 'blur' },
                    { max: 100, message: '长度在 1 ~ 100 个字符', trigger: 'blur' }
                ],
                other: [
                    { required: false, message: '请输入其他功能', trigger: 'blur' },
                    { max: 250, message: '长度在 1 ~ 250 个字符', trigger: 'blur' }
                ],
                remark: [
                    { required: false, message: '请输入备注', trigger: 'blur' },
                    { max: 250, message: '长度在 1 ~ 250 个字符', trigger: 'blur' }
                ],
            },
        }
    },
    methods:{
        async getGoodList(){
            // 获取所有商品
           const {data:res} = await this.$ajax.get("/goods/allGoods", {params: this.queryInfo})
           this.goodList = res.rows; // 用户列表数据封装
           this.total = res.total; // 总用户数封装
        },
        searchGoodList(){
            this.queryInfo.pageStart = 1; 
            // 如果当前pageStart不为1 那么直接调用getUserList 查询到的结果为limit pageStart 也就是说pageStart之前的数据都差不到
            this.getGoodList();
        },
        handleSizeChange(newSize){
            // 处理页面变化
            this.queryInfo.pageSize = newSize;
            this.getGoodList();
        },
        handleCurrentChange(newPage){
            // pageStart发生变化
            this.queryInfo.pageStart = newPage;
            this.getGoodList();
        },
        dialogClose(){
            // @close="dialogClose" 关闭对话框时清空表单
            this.$refs.goodFormRef.resetFields();
        },
        addGoods(){
            this.$refs.goodFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error("请输入有效信息");
                }
                const {data:res} = await this.$ajax.post("/goods/addGoods", this.goodForm);
                if(!res.flag){
                    return this.$message.error(res.message);
                }
                this.$message.success(res.message);
                this.dialogVisible = false;
                this.getGoodList();
            });
        },
        editGood(){
            this.$refs.goodFormRef.validate(async valid => {
                if(!valid){
                    return this.$message.error("请输入有效信息");
                }
                const {data:res} = await this.$ajax.put("/goods/updateGood", this.goodForm);
                if(!res.flag){
                    return this.$message.error(res.message);
                }
                this.$message.success(res.message);
                this.dialogVisible = false;
                this.getGoodList();
            });
        },
        dialogVisibleConfirm(){
            // 新增/修改 共用一个确定 使用id区别 @click="dialogVisibleConfirm" 点击确定执行相应的操作
            if(this.goodForm.id === null || this.goodForm.id === undefined){
                this.addGoods();
            }else{
                this.editGood();
            }
        },
        showAddDialog(){
            this.title = '添加商品';
            this.goodForm = {};
            this.goodForm.createUserId = this.id;
            this.dialogVisible = true;
        },
        showEditDialog(row){
            // @click="showEditDialog(scope.row)" 点击修改按钮 查询相关信息
            // 查询出商品的信息 反填在表单中
            // 增加和修改使用同一个表单
            // const {data:res} = await this.$ajax.get("/goods/getGood?id="+id);
            this.title = '编辑商品信息';
            this.goodForm = row;
            this.dialogVisible = true;
        },
        async deleteGood(id){
            // 根据主键删除商品信息
            const confirmResult = await this.$confirm("此操作将永久删除商品信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).catch(err => err);
            if(confirmResult != "confirm"){
                return this.$message.info("已取消删除");
            }
            const {data:res} = await this.$ajax.delete("/goods/deleteGood?id="+id);
            if(!res.flag){
                return this.$message.error(res.message);
            }
            this.$message.success(res.message);
            this.getGoodList();
        },
    },
}
</script>

<style lang="less" scoped>

</style>