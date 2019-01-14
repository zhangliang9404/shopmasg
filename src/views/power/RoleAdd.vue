<template>
	<div class="RoleAdd">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>绑定角色</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="roleForm" :model="roleForm" label-width="150px" style="width: 50%;">
      <el-form-item label="角色名称：">
        <el-select v-model="roleForm.roleId" placeholder="请选择角色名称">
          <el-option v-for="item in role" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="绑定权限：">
        <el-transfer filterable :filter-method="filterMethod"
                     :titles="['所有权限', '选定权限']"
                     :button-texts="['移除', '选定']"
          filter-placeholder="请输入权限名称" v-model="getPermissionsValue" :data="getPermissionsData">
        </el-transfer>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole('roleForm')">添加角色</el-button>
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
      roleForm:{
        roleId:'', // 角色id
      },
      role: [], // 角色
      getPermissionsData: [], // 获取权限
      getPermissionsValue: [], // 获取权限具体数据

    }
  },
  mounted: function(){
    this.getList(); // 获取权限列表
    this.getRole(); // 获取角色
  },
  methods: {
    // 穿梭框
    filterMethod(query, item) {
      return item.label.indexOf(query) > -1;
    },
    // 获取权限列表
    getList() {
      let param = {
        page: 1, // 页码
        limit: 500, // 每页的数据
      };
      let vm = this;
      param = utils.filterJson(param);
      apiUser.getActionList(param).then(res => {
        if(res.cscode == 0){
          let newarr = [];
          res.data.data.forEach((x,index)=>{
            newarr.push({
              label: x.jurisdiction_name,
              key:x.id,
            })
          });
          this.getPermissionsData = newarr; // 数据
        }else{
          this.$alert(res.data.msg, '提示信息', {
            confirmButtonText: '确定'
          });
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
    // 添加角色
    addRole(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.getPermissionsValue.length>0){
            let param = {
              role_id: this.roleForm.roleId, // 角色id
              jurisdiction_id: (this.getPermissionsValue).toString(), // 权限id
            };
            param = utils.filterJson(param);
            apiUser.UserRole(param).then(res => {
              if(res.cscode == 0){
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path:'/rolequery',
                    });
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                })
              }
            });

          }else {
            this.$alert("请选择待绑定的权限", '提示信息', {
              confirmButtonText: '确定',
            })
          }
        } else {
          return false;
        }
      });
    },
  },

}
</script>


