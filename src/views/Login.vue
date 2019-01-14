<template>
  <div class="login-page-container">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" @keyup.enter.native="handleSubmit2()"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import * as utils from "@/common/utils.js"
  import {api_login} from "@/api/api.js"
  let apilogin = new api_login();
  export default {
    props: {},
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }, ],
          checkPass: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, ]
        },
        checked: true
      };
    },
    created(){
      if (utils.getCookie("token")) {
        if(parseInt(utils.getCookie("token_time"))<utils.currentTimes()){
          utils.setCookie("token", '');
          utils.setCookie("token_time", '');
          this.$router.push({
            path:'/login'
          })
        }
       else {
          this.$router.push({
            path:'/recommended',
          })
        }
      }
    },
    methods: {
      handleSubmit2(ev) {
        var _this = this;
        _this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            _this.logining = true;
            var loginParams = {
              username: this.ruleForm2.account,
              password: this.ruleForm2.checkPass
            };
            apilogin.login(loginParams).then(res => {
              if (res.cscode == "0") {
                _this.logining = false;
                console.log(res.data);
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("token1", res.data.uid);
                sessionStorage.setItem("token2", res.data.realname);
                utils.setCookie('token',res.data.token)
                utils.setCookie("token_time", utils.currentTimes()+ 30*24*60*60*1000);
                utils.setCookie('uid',res.data.uid)
                utils.setCookie('realname',res.data.realname)
                _this.$router.push({
                  path: '/recommended'
                });
                utils.setCookie("activeIndexTop",'1-1'); // 头部导航存cookie
                utils.setCookie("activeIndexLeft",'1-1-1'); // 左侧导航存cookie
                utils.setCookie("activeName",'all'); // 订单列表存cookie
              } else {
                _this.logining = false;
                _this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-container {-webkit-border-radius: 5px;border-radius: 5px;-moz-border-radius: 5px;background-clip: padding-box;margin: 180px auto;width: 350px;padding: 35px 35px 15px;
    background: #fff;border: 1px solid #eaeaea;box-shadow: 0 0 25px #cac6c6;}
  label.el-checkbox.remember {margin: 0 0 35px 0;}
</style>
