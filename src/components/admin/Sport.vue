<template>
    <div>运动模块
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 运动信息列表主体 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="25">
                <el-col :span="10">
                <!-- 搜索 & 添加 -->
                    <el-input placeholder="请输入搜索内容" v-hasPermission="['SPORT_QUERY']" v-model="queryInfo.query" clearable @clear="getSportList()">
                        <el-button slot="append" icon="el-icon-search" @click="searchSportList()" @keyup.native.enter="searchSportList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" v-hasPermission="['SPORT_ADD']" @click="showAddDialog">添加运动</el-button>
                </el-col>
            </el-row>
            <!-- 运动列表 border边框 stripe隔行变色-->
            <el-table :data="sportList" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="运动概述">
                                <div class="markdown-body" v-highlight v-html="props.row.introduction"></div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="运动" prop="name"></el-table-column>
                <el-table-column label="适合年龄" prop="applicableAge"></el-table-column>
                <el-table-column label="锻炼部位" prop="beneficialPosition"></el-table-column>
                <!-- <el-table-column label="介绍" prop="introduction"></el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" v-hasPermission="['SPORT_UPDATE']" @click="showEditDialog(scope.row)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" v-hasPermission="['SPORT_DELETE']" @click="deleteSport(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 新增或编辑运动信息区域 -->
            <el-dialog :title="title" :visible.sync="dialogVisible" width="60%" @close="dialogClose()">
                <el-form :model="dataForm" :rules="dataFormRules" ref="dataFormRef" label-width="70px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="运动" prop="name">
                                <el-input v-model="dataForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="适合年龄" prop="applicableAge">
                                <el-input v-model="dataForm.applicableAge"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="锻炼部位" prop="beneficialPosition">
                        <el-input v-model="dataForm.beneficialPosition"></el-input>
                    </el-form-item>
                    <el-form-item label="运动简介" prop="introduction">
                        <!-- <el-input v-model="dataForm.introduction"></el-input> -->
                        <mavon-editor ref="md" v-model="dataForm.introduction" class="pc-md" :ishljs="true" @imgAdd="uploadImage"/>
                        <mavon-editor ref="md" v-model="dataForm.introduction" :toolbars="toolbars" :subfield="false" class="phone-md" @imgAdd="uploadImage"/>
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
import { marked } from 'marked';
export default {
    data() {
        return{
            queryInfo: {
                query: '',
                pageStart: 1,
                pageSize: 5,
            },
            sportList: [],
            total: 0,
            dataForm: {},
            // 添加表单验证
            dataFormRules: {
                name: [
                    { required: true, message: '请输入运动名', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
                ],
                // applicableAge: [
                //     { required: true, message: '请输入适宜年龄', trigger: 'blur' },
                //     { min: 1, max: 20, message: '长度在 1 ~ 20 个字符', trigger: 'blur' }
                // ]
            },
            title: '',
            dialogVisible: false,
            // 编辑器工具栏
            toolbars: {
                bold: false,  //粗体
                italic: false,  //粗体
                header: true,  //标题
                underline: false,  //下划线
                strikethrough: false,  //中划线
                mark: false,  //标记
                superscript: false,  //上角标
                subscript: false,  //下角标
                quote: false,  //引用
                ol: false,  //有序列表
                ul: true,  //无序列表
                link: false,  //链接
                imagelink: true,  //图片链接
                code: false,  //code
                table: false,  //表格
                fullscreen: true,  //全屏编辑
                readmodel: false,  //沉浸式阅读
                htmlcode: false,  //展示html源码
                help: false,  //帮助
                // 1.3.5
                undo: false,  //
                redo: false,  //
                trash: true,  //清空
                save: false,  //保存 出发events中的save事件
                // 1.4.2
                navigation: false,  //导航目录
                // 2.1.8
                alignleft: false,  //左对齐
                aligncenter: false,  //居中
                alignright: false,  //右对齐
                // 2.2.1
                subfield: true,  //单双栏模式
                preview: false,  //预览
            },
        }
    },
    created(){
        this.getSportList();
    },
    methods:{
        getSportList(){
            this.$ajax.post('/sport/getSports', this.queryInfo).then((res) => {
                if(!res.data.flag) return this.$message.error(this.data.message);
                console.log(res);
                this.total = res.data.total;
                this.sportList = res.data.rows.filter(item => {
                    if(item.introduction && item.introduction !== ''){
                        item.remark = item.introduction; // 保存原有的markdown文本
                        item.introduction = marked(item.introduction); //使用marked渲染
                    }
                    return true;
                });
            });
        },
        searchSportList(){
            this.queryInfo.queryStart = 1;
            this.getSportList();
        },
        handleSizeChange(newPageSize){
            this.queryInfo.pageSize = newPageSize;
            this.getSportList();
        },
        handleCurrentChange(newPageStart){
            this.queryInfo.pageStart = newPageStart;
            this.getSportList();
        },
        showAddDialog(){
            this.title = '新增运动信息';
            this.dataForm = {};
            this.dialogVisible = true;
        },
        showEditDialog(row){
            this.title = '编辑运动信息';
            this.dataForm = row;
            this.dataForm.introduction = row.remark;
            this.dialogVisible = true;
        },
        addSport(){
            this.$refs.dataFormRef.validate(valid => {
                if(!valid) return this.$message.error("请输入有效信息");
                this.$ajax.post('/sport/insertSport', this.dataForm).then((res) => {
                    if(!res.data.flag){
                        return this.$message.error(res.data.message);
                    }
                    this.$message.success(res.data.message);
                    this.dialogVisible = false;
                    this.getSportList();
                });
            });
        },
        updateSport(){
            this.$refs.dataFormRef.validate(valid => {
                if(!valid) return this.$message.error("请输入有效信息");
                this.$ajax.post("/sport/updateSport", this.dataForm).then((res) => {
                    if(!res.data.flag){
                        return this.$message.error(res.data.message);
                    }
                    this.$message.success(res.data.message);
                    this.dialogVisible = false;
                    this.getSportList();
                });
            });
        },
        dialogVisibleConfirm(){
            // 新增/修改 共用一个确定 使用id区别 @click="dialogVisibleConfirm" 点击确定执行相应的操作
            if(this.dataForm.id === null || this.dataForm.id === undefined){
                this.addSport();
            }else{
                this.updateSport();
            }
        },
        dialogClose(){
            this.$refs.dataFormRef.resetFields();
        },
        deleteSport(id){
            this.$confirm('此操作将永久删除该运动信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //delete请求遵循restful风格
                this.$ajax.delete(`/sport/deleteSport/${id}`).then((res) => {
                    if (!res.data.flag) return this.$message.error(res.data.message);
                    this.$message.success(res.data.message);
                    this.getSportList();
                });
            }).catch(() => {
                // 成功删除为confirm 取消为 cancel
                return this.$message.info("操作已取消");
            });
        },
        imageValidate(file){
            if(file.type != 'image/jpeg' && file.type != 'image/png'){
                this.$message.warning('文件仅支持PNG/JPEG格式');
                return false;
            }
            if(file.size / 1024 / 1024 > 3){
                this.$message.warning('文件大小不能超过3MB');
                return false;
            }
            return true;
        },
        uploadImage(pos, file){
            if(this.imageValidate(file)){
                let formData = new FormData();
                formData.append('file', file);
                this.$ajax.post('/tool/uploadQiniu', formData, {'Content-Type': 'multipart/form-data'}).then((res) => {
                    if(!res.data.flag) return this.$message.error(res.data.message);
                    this.$refs.md.$img2Url(pos, this.$qiniu + res.data.data);
                });
            }else{
                console.log(this.$refs.md);
            }
        }
    }
}
</script>

<style lang="less">

</style>