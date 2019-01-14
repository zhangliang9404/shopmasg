<template>
  <div class="DepartmentAdd">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>部门管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加新部门</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="DepartmentForm" :model="DepartmentForm" label-width="150px" style="width: 30%;">
      <el-form-item label="部门名称：">
        <el-input v-model="DepartmentForm.department_name" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="所属上级部门：">
        <el-select v-model="DepartmentForm.p_id" clearable placeholder="请选择,不选为最大级">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDepartment('DepartmentForm')">添加部门</el-button>
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
        DepartmentForm:{ // 部门表单
          department_name: '', // 部门名称
          p_id: '', // 父级id
        },
        department: [], // 父级数据
        parent_id:"", // 父级id
      }
    },
    mounted: function(){
      this.parentList(); // 获取父级列表
    },
    methods: {
      // 获取父级列表
      parentList() {
        let param = {};
        param = utils.filterJson(param);
        apiUser.getparentdepartment(param).then(res => {
          if(res.cscode == 0){
            this.department = res.data.department; // 所属部门下拉框
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
      },
      // 添加部门
      addDepartment(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 若未选择上级部门，则为顶级部门this.parent_id = 0
            if(this.DepartmentForm.p_id == ""){
              this.parent_id = 0;
            }else{
              this.parent_id = this.DepartmentForm.p_id;
            }
            let param = {
              department_name:this.DepartmentForm.department_name, // 部门名称
              parent_id:this.parent_id, // 父级id
            };
            param = utils.filterJson(param);
            apiUser.setarrtodepartment(param).then(res => {
              if(res.cscode == 0){
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path:'/departmentquery',
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
