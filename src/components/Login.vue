<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt/>
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">提交</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    // 存放各式各样的数据
    data(){
        return {
            // 表单数据对象
            loginForm:{
                username:"admin",
                password:"123456"
            },
            // 验证对象
            loginRules:{
                // 校验用户名
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' }, //必填项验证
                    { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' } //长度验证
                ],
                // 校验密码 blur: 失去焦点触发
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }, //必填项验证
                    { min: 6, max: 10, message: '长度在 6 ~ 10 个字符', trigger: 'blur' } //长度验证
                ],
            },
        };
    },
    // 存放各种方法
    methods:{
        // 重置表单内容
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            // 1. 验证校验规则 通过$refs找到loginFormRef 获取到表单校验结果valid进行判断
            this.$refs.loginFormRef.validate(async valid =>{
                // 验证失败
                if(!valid) return;
                // 验证成功 访问后台进行数据库校验
                this.$ajax.post('/login', this.loginForm).then((res) => {
                    console.log(res);
                    if (!res.data.flag) return this.$message.error(res.data.message);
                    const tokenBody = res.data.data;
                    let token = tokenBody.token;
                    let tokenHead = tokenBody.tokenHead;
                    sessionStorage.setItem('token', tokenHead + token);
                    //获取用户信息
                    this.$ajax.get('/getUserInfo').then((res) => {
                        // console.log('获取用户信息', res.data.data);
                        
                        let user = res.data.data;
                        //将用户信息存入本地
                        this.$store.commit('setId', user.id);
                        this.$store.commit('setName', user.username);
                        //获取权限信息
                        this.$store.commit('setRole', user.role);
                        this.$store.commit('setRoleList', user.roleList);
                        this.$store.commit('setMenus', user.roleList[0].menus);
                        this.$store.commit('setPermissions', user.roleList[0].permissions);
                    });
                    //登录成功 页面跳转
                    this.$message.success("登录成功");
                    this.$router.push({ path: '/home' });
                }).catch((err) => {
                    if(err.message === 'Network Error') {
                        this.$message.warning('网络错误，请稍后尝试！');
                    }
                });
                // const {data: res} = await this.$http.post("login", this.loginForm);
                
                // if(res.flag == true){ // 登录成功的信息提示 并进行页面路由跳转
                //     this.$message.success("登录成功");
                //     // session中存放相关信息
                //     window.sessionStorage.setItem("user", JSON.stringify(res.user));
                //     this.$router.push({path:"/home"});
                // }else{ // 登录失败的信息提示
                //     this.$message.error("登录失败");
                // }
            })
        },
    },
}
</script>

<style lang="less" scoped>
// scope为受保护的样式 当前style标签下的样式只在当前组件生效 其他组件无法使用 避免样式污染
// 根节点样式
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 3px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>