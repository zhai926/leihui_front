<template>
        <div class="form_box" id="auth" :style="bg">
            <star-flow></star-flow>
            <el-form :model="user" :rules="rules" ref="ruleForm" label-position="center" v-loading="loginLoading" class="demo-ruleForm login-container" >
                 <el-form-item prop="username">
                <el-input placeholder = "请输入用户名" v-model="user.username" @keyup.enter.native="check">
                    <template slot="prepend">
                       <i class="el-icon-edit"></i>
                    </template>    
                </el-input>
                 </el-form-item>
                  <el-form-item prop="password">
                <el-input placeholder="请输入密码" type="password" v-model="user.password" @keyup.enter.native="check">
                     <template slot="prepend">
                       <i class="el-icon-message"></i>
                    </template>  
                </el-input> 
                </el-form-item>   
                <el-col>
                    <el-button type="primary" class="btn" @click="check">登录</el-button>
                </el-col>
                
            </el-form>    
               
        </div>
</template>
<script>

import starFlow from "./startFlow"
    export default {
        data() {
            return {
                loginLoading:false,
                bg:{background:"url("+require('../../assets/auth-bg.jpg')+") no-repeat",backgroundSize:"100% 100%"},
                user:{
                    username:'',
                    password: ''                
                },
                rules: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
               
            },
            }
        },
        components:{
            starFlow
        },
         computed: {
            // 验证手机号
            rightPhoneNumber: function () {
                    return /^1[34578]\d{9}$/gi.test(this.user.username) 
            }
        },
        mounted() {
            console.log(this.user)
        },
        methods: {
            getValue (url) {
                    let values = {}
                    if(url.indexOf('?') != -1) {
                        let str = url.substr(1)
                        let strs = str.split('redirect=');
                        values['redirect'] = strs[1]
                    }
                    
                    return values
            }, 
            check () {
               
              this.$refs.ruleForm.validate((valid) => {
                if(valid) {
                    this.loginLoading=true
                    this.$store.dispatch('checkUser',this.user).then((res) => {
                        this.loginLoading=false
                        if(res == false){
                            this.$message('用户名或密码不正确')
                            return false
                        }else if(res == true){
                            let url = decodeURIComponent(window.location.search)
                            if(url == ''){
                                this.$router.push('/index/userList')
                            }else{
                                this.$router.push(decodeURIComponent(this.getValue(url).redirect))
                            }
                            
                        }else{
                             this.$message('请勿重复登录！')
                             this.$router.push('/index/userList')
                        }
                         
                    })
                    }
                })

            }
        }
    }
</script>
<style>
    #auth{
        width:100%;
        height:100%;
        overflow: hidden;

        position: relative;

    }
    #auth .el-form{
        width:300px;
        position: absolute;
        top:50%;
        left:50%;
        margin-left:-150px;
        margin-top: -100px;
    }
     #auth .el-form-item{
         margin-bottom: 15px;
     }
     #auth .el-input{
        margin: 10px 0;
    }
     #auth .btn{
        width:300px;
        margin-top:10px;
    }
     .el-button+.el-button{
        margin-left: 0 !important;
    }
     .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
