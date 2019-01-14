<template>
  <div class="UserAdd">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加新用户</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="userForm" :model="userForm" label-width="150px" style="width: 30%;">
      <el-form-item label="用户名：">
        <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：">
        <el-input v-model="userForm.realname" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="userForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="选择所属部门：">
        <el-select v-model="departmentId" placeholder="请选择">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择所属角色：">
        <el-select v-model="roleId" multiple placeholder="请选择">
          <el-option v-for="item in role" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser('userForm')">添加用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { requestLogin } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    data() {
      return {
        userForm:{ // 用户列表
          username: '', // 用户名
          realname: '', // 真实姓名
          password: '', // 密码
        },
        department: [], // 所属部门
        departmentId: '', // 所属部门id
        role: [], // 角色
        roleId: '', //角色id
      }
    },
    mounted: function(){
      this.getDepartment(); // 获取部门
      this.getRole(); // 获取角色
    },
    methods: {
      // 获取部门
      getDepartment() {
        let param = {};
        param = utils.filterJson(param);
        apiUser.getallidname(param).then(res => {
          if(res.cscode == 0){
            this.department = res.data.department; // 所属部门下拉框
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
      },
      // 获取角色
      getRole(){
        let param = {};
        param = utils.filterJson(param);
        apiUser.getallroleidname(param).then(res => {
          if(res.cscode == 0){
            this.role = res.data.role; // 所属角色下拉框
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
      },
      // 添加用户
      addUser(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              username: this.userForm.username, // 用户名
              realname: this.userForm.realname, // 真实姓名
              password: this.userForm.password, // 密码
              department: this.departmentId, // 所属部门id
              role: (this.roleId).toString() // 角色id-转字符串
            };
            param = utils.filterJson(param);
            apiUser.AddRole(param).then(res => {
              if(res.cscode == 0){
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path:'/userquery',
                    });
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                })
              }
            });
          } else {
            return false;
          }
        });
      },
    },

  }
</script>

<style scoped>
  @import url("../../assets/css/Power.css");
</style>
