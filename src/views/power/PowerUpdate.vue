<template>
	<div class="PowerUpdate">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>权限设置</el-breadcrumb-item>
          <el-breadcrumb-item>修改权限</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="powerForm" :model="powerForm" label-width="150px" style="width: 30%;">
      <el-form-item label="权限id：">
        <el-input v-model="powerForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="权限名称：">
        <el-input v-model="powerForm.jurisdiction_name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限代码：">
        <el-input v-model="powerForm.jurisdiction_code" placeholder="请输入权限代码" disabled></el-input>
      </el-form-item>
      <el-form-item label="控制器名称：">
        <el-input v-model="powerForm.controller" placeholder="请输入控制器名称"></el-input>
      </el-form-item>
      <el-form-item label="方法名：">
        <el-input v-model="powerForm.action" placeholder="请输入方法名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePermissions('powerForm')">修改权限</el-button>
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
      powerForm: {
        id:'',
        jurisdiction_name:'', // 权限名称
        jurisdiction_code:'', // 权限代码
        controller:'', // 控制器名称
        action:'',// 方法名
      },
    }
  },
  mounted: function(){
    this.getDetail(); // 获取详情
  },
  methods: {
    // 获取详情
    getDetail() {
      let param = {
        id:this.$route.query.id
      };
      param = utils.filterJson(param);
      apiUser.getJurisdictionDetail(param).then(res => {
        if(res.cscode == 0){
          this.powerForm = res.data.data;
        }else{
          this.$alert(res.data.msg, '提示信息', {
            confirmButtonText: '确定'
          })
        }
      });
    },
    // 修改权限
    updatePermissions(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            id: this.$route.query.id,
            jurisdiction_name: this.powerForm.jurisdiction_name, // 权限名称
            jurisdiction_code: this.powerForm.jurisdiction_code, // 权限代码
            controller: this.powerForm.controller, // 控制器名称
            action: this.powerForm.action,// 方法名
          };
          param = utils.filterJson(param);
          apiUser.updateJurisdiction(param).then(res => {
            if(res.cscode == 0){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({
                    path:'/powerquery',
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
