<template>
	<div class="UserQuery">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户账号查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--查询-->
    <div class="searchBorder">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="borderFlex">
        <!--用户名-->
        <el-form-item label="用户名：" style="width:25%">
          <el-input v-model="searchForm.username" clearable></el-input>
        </el-form-item>
        <!--所属部门-->
        <el-form-item label="所属部门：" style="width:25%">
          <el-select v-model="department_id" clearable placeholder="请选择所属部门">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!--真实姓名-->
        <el-form-item label="真实姓名：" prop="action" style="width:25%">
          <el-input v-model="searchForm.realname" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:25%">
          <el-checkbox v-model="searchForm.is_status">已锁定</el-checkbox>
          <!--<el-checkbox v-model="searchForm.is_del">已删除</el-checkbox>-->
          <el-button @click="searchUser(1,10)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button @click="$router.push('useradd')">添加用户</el-button>
      <el-button @click="batchDeleting(multipleSelection)">删除用户</el-button>
      <el-button @click="batchLockUser(multipleSelection)">锁定选中用户</el-button>
      <el-button @click="batchUnLockUser(multipleSelection)">解锁选中用户</el-button>
    </div>
    <!--列表-->
    <el-table ref="multipleTable" border :data="userData"
              tooltip-effect="dark" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户名" width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column prop="realname" label="真实姓名" width="130"></el-table-column>
      <el-table-column prop="department_name" label="所属部门" show-overflow-tooltip></el-table-column>
      <el-table-column label="最后登录时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.lastlogintime == null">无</span>
          <span v-else>{{ scope.row.lastlogintime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否锁定" show-overflow-tooltip></el-table-column>
      <el-table-column prop="is_del" label="已删除" show-overflow-tooltip></el-table-column>
      <el-table-column prop="log" label="操作日志" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" @click="getLoginLog(scope.row.id)">查看登陆日志</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editUser(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 200, 300, 400]" :total="count"
                     :page-size="limit" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
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
        searchForm: { // title查询
          username: '', // 用户名
          realname: '', // 真实姓名
          is_status: false, // 是否锁定
          is_del: false, // 是否删除
        },
        options: [], // 所属部门选择=所属部门下拉框
        department_id: '', // 所属部门
        userData: [], // 表格数据
        multipleSelection: [], //选择的数据
        currentPage: 1, // 页码
				limit:10, // 每页数据
        count:0, // 总数
				total: '0',
				status:0, // 查询的状态变化
			}
		},
    mounted: function(){
      this.getDepartmentList(); // 获取部门列表
      this.getUserList(); // 获取用户列表
    },
		methods: {
      // 获取部门列表
      getDepartmentList:function() {
        let param = {};
        param = utils.filterJson(param);
        apiUser.getallidname(param).then(res => {
          if(res.cscode == 0){
            this.options = res.data.department; // 所属部门下拉框
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
      },
      // 获取用户列表
      getUserList:function() {
        let param = {
          page: this.currentPage, // 页码
          limit: this.limit, // 每页数据
          username: this.searchForm.username, // 用户名
          realname: this.searchForm.realname, // 真实姓名
          department_id: this.department_id, // 所属部门id
          status: this.searchForm.is_status, // 是否锁定
          is_del: this.searchForm.is_del, // 是否删除
        };
        param = utils.filterJson(param);
        apiUser.usergetuidtoarr(param).then(res => {
          if(res.cscode == 0){
            this.userData = res.data.userinfo; // 待渲染的数据
            this.count = res.data.countnum; // 总条数
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.userData = res.data.userinfo; // 待渲染的数据
            this.count = 0; // 总条数
          }
        });
      },
      // 查询
      searchUser:function(val,limit) {
        this.currentPage = val; // 选定第一页
        this.limit = limit; // 每页数据
        this.getUserList(); // 获取用户列表
        this.status = 1; // 查询的状态变化
      },
      // 查看日志
      getLoginLog(id) {
				this.$router.push({
          path:'/poweruserlog',
          query:{
            id:id
          }
				});
			},
      // 编辑用户
			editUser(id) {
				this.$router.push({
          path:'/UserUpdate',
          query:{
            id:id
          }
				});
			},
      // 删除用户--500--12.8
      delUser(id) {
        let param={
          id: id
        };
        param = utils.filterJson(param);
        apiUser.AdminDel(param).then(res => {
          if (res.cscode == "0") {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.getUserList(); // 列表
              }
            })
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
            })
          }
        });
      },
      // 选择数据
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
      // 选择页码
			handleSizeChange(val) {
				this.limit = val;
				if(this.status == 1){
					this.searchUser(this.currentPage,val); // 查询接口
				}else{
					this.getUserList(); // 列表接口
				}
			},
      // 切换每页数据
			handleCurrentChange(val) {
				this.currentPage = val;
				if(this.status == 1){
					this.searchUser(val,this.limit); // 查询接口
				}else{
					 this.getUserList(); // 列表接口
				}
			},
      // 批量删除--500-12.8
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除用户吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let param ={
              id:ids.toString(),//批量传递一维数组，单独的传递ID
            };
            apiUser.AdminDel(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getUserList(); // 列表
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                })
              }
            })
          }).catch(() => {})
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 锁定选中用户
      batchLockUser(rows) {
        if(rows.length > 0){
          this.$confirm("确定锁定用户吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let param ={
              id:ids.toString(),//批量传递一维数组，单独的传递ID
            };
            apiUser.getuidtolocking(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getUserList(); // 列表
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                })
              }
            })
          }).catch(() => {})
        }else {
          this.$alert("请选择要锁定的用户", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 解锁选定用户
      batchUnLockUser (rows){
        if(rows.length>0){
          this.$confirm("确定解锁用户吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let param ={
              id:ids.toString(),//批量传递一维数组，单独的传递ID
            };
            apiUser.getuidtounlock(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getUserList(); // 列表
                  }
                })
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                })
              }
            })
          }).catch(() => {})
        }else {
          this.$alert("请选择要解锁的用户", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
		},
    // 时间过滤器
    filters:{
      dateFilter:function(date){
        return  utils.formatDates(date)
      }
    },

	}
</script>

<style scoped>
	@import url("../../assets/css/PowerQuery.css");
</style>
