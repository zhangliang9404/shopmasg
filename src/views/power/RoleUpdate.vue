<template>
  <div class="RoleUpdate">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>修改角色</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="roleForm" :model="roleForm" label-width="150px" style="width: 50%;">
      <el-form-item label="角色id：">
        <el-input v-model="roleForm.id" style="width: 240px;" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色名称：">
        <el-input v-model="roleForm.role_name" style="width: 240px;" disabled></el-input>
      </el-form-item>
      <el-form-item label="绑定权限：">
        <el-transfer filterable :filter-method="filterMethod"
                     :titles="['所有权限', '选定权限']"
                     :button-texts="['移除', '选定']"
                     filter-placeholder="请输入权限名称" v-model="getPermissionsValue" :data="getPermissionsData">
        </el-transfer>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateRole('roleForm')">修改角色</el-button>
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
          role_name: '', // 角色名称
          roleName: '', // 角色名称
          roleId:'', // 角色id
        },
        getPermissionsData: [], // 获取权限
        getPermissionsValue: [], // 获取权限具体数据
      }
    },
    mounted: function(){
      this.getDetail(); // 获取详情
      this.getList(); // 获取权限列表
    },
    methods: {
      // 穿梭框
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      // 获取详情
      getDetail() {
        let param = {
          id:this.$route.query.id
        };
        param = utils.filterJson(param);
        apiUser.getListDetail(param).then(res => {
          if(res.cscode == 0){
            this.roleForm = res.data.data; // 展示数据
            let value = [];
            let PermissionsValue = res.data.role;
            for( var i=0;i<PermissionsValue.length;i++){
              value.push(PermissionsValue[i].jurisdiction_id)
            }
            this.getPermissionsValue = value; // 穿梭框
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
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
      // 修改角色
      updateRole(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              role_id: this.$route.query.id, // 角色id
              jurisdiction_id: (this.getPermissionsValue).toString(), // 权限id
              up: 1, // 修改接口固定传值-添加接口不传值
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
          } else {
            return false;
          }
        });
      },
    },

  }
</script>

