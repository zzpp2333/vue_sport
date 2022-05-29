<template>
    <div>运动科普
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $router.currentRoute.matched" :key="index">{{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-backtop>
                <i class="el-icon-caret-top"></i>
            </el-backtop>
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
            <el-row :gutter="25">
                <el-col v-for="(item, i) in sportList" class="infinite-list-item col" :key="i">
                    <el-card :body-style="{ padding: '0px' }">
                        <el-descriptions class="margin-top" :title="item.name" :column="3">
                            <template slot="extra">
                                <el-button type="primary" @click="showEditDialog(item)" v-if="item.creatorId==id">编辑</el-button>
                            </template>
                            <el-descriptions-item label="标题"> {{ item.name }} </el-descriptions-item>
                            <el-descriptions-item label="适合年龄"> {{ item.applicableAge }} </el-descriptions-item>
                            <el-descriptions-item label="锻炼部位"> {{ item.beneficialPosition }} </el-descriptions-item>
                            <el-descriptions-item label="简介">
                                <div inline class="markdown-body" v-highlight v-html="item.introduction"></div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-card>
                </el-col>
                <div v-infinite-scroll="load" style="overflow:auto"/>
            </el-row>
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
                        <el-col>
                            <!-- 新增是creatorId为当前登录用户的id 不可更改 -->
                            <el-form-item label="创建者" prop="creatorId">
                                <el-input v-model="dataForm.creatorId" disabled></el-input>
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
        </el-card>
    </div>
</template>

<script>
import { marked } from 'marked';
import { mapState } from 'vuex';
export default {
    //计算属性
    computed: {
        // 引入计算属性
        ...mapState(['id'])
    },
    data() {
        return{
            queryInfo:{
                query: '',
                pageStart: 1,
                pageSize: 0,
            },
            count: 0,
            total: 0,
            sportList: [],
            title: '',
            dialogVisible: false,
            dataForm:{},
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
    methods: {
        load() {
            if(this.count < this.total + 1){
                this.count += 1;
            }
        },
        getSportList(){
            this.$ajax.post('/sport/getSports', this.queryInfo).then((res) => {
                if(!res.data.flag) return this.$message.warning(res.data.message);
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
            this.queryInfo.pageStart = 1;
            this.getSportList();
        },
        showAddDialog(){
            this.dataForm = {};
            this.dataForm.creatorId = this.id;
            this.title = "添加运动信息";
            this.dialogVisible = true;

        },
        showEditDialog(row){
            console.log('row', row);
            this.dataForm = row;
            this.title = "编辑运动信息";
            this.dialogVisible = true;
        },
        dialogClose(){
            this.$refs.dataFormRef.resetFields();
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