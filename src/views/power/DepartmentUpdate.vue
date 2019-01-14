<template>
	<div class="DepartmentUpdate">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>部门管理</el-breadcrumb-item>
          <el-breadcrumb-item>修改部门</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form ref="DepartmentForm" :model="DepartmentForm" label-width="150px" style="width: 30%;">
      <el-form-item label="部门原名称：">
        <el-input disabled v-model="DepartmentForm.department_name"></el-input>
      </el-form-item>
      <el-form-item label="部门id：">
        <el-input disabled v-model="DepartmentForm.id"></el-input>
      </el-form-item>
      <el-form-item label="部门名称：">
        <el-input v-model="DepartmentForm.lastName" placeholder="请输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="所属上级部门：">
        <el-select v-model="DepartmentForm.p_id" placeholder="请选择">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateDepartment('DepartmentForm')">修改用户</el-button>
      </el-form-item>
    </el-form>
	</div>
</template>

<script>
	import { requestLogin } from '@/api/api';
	import * as utils from "@/common/utils.js"
	import { api_user } from "@/api/api.js"
	let apiUser = new api_user();
	export default {
		data() {
			return {
        DepartmentForm: {
          department_name: '', // 部门原名称
          lastName:'', // 部门名称
          id:'', // 部门id
          p_id: '', // 父级id
				},
        department: [], // 上级部门
        departmentId: '',// 上级部门id
			}
		},
    mounted: function() {
      this.getDepartment(); // 获取上级部门
      this.getDetail(); // 获取详情
    },
		methods: {
		  // 获取上级部门
      getDepartment() {
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
      // 获取详情
      getDetail() {
				let param = {
          id:this.$route.query.id
				};
				param = utils.filterJson(param);
				apiUser.departmentgetuidtoarr(param).then(res => {
          if(res.cscode == 0){
            this.DepartmentForm = res.data.department[0];
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
				});
			},
      // 修改部门
			updateDepartment(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 若未选择上级部门，则为顶级部门this.parent_id = 0
            if(this.DepartmentForm.p_id == "" && this.DepartmentForm.p_id == null){
              this.departmentId = 0;
            }else{
              this.departmentId = this.DepartmentForm.p_id;
            }
            let param = {
              id: this.$route.query.id,
              department_name: this.DepartmentForm.lastName, // 修改过后的部门名称
              parent_id: this.departmentId, // 上级部门id
            };
            param = utils.filterJson(param);
            apiUser.uparrtodepartment(param).then(res => {
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
