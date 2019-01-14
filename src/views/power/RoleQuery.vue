<template>
  <div class="RoleQuery">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--查询-->
    <div class="searchBorder">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="borderFlex">
        <!--权限名称-->
        <el-form-item label="角色名称：" prop="roleName" style="width:25%">
          <el-input v-model="searchForm.roleName" clearable @keyup.enter.native="searchRole(1,10)"></el-input>
        </el-form-item>
        <el-form-item style="width:25%">
          <el-button @click="searchRole(1,10)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button @click="$router.push('roleadd')">绑定角色</el-button>
      <!--<el-button @click="batchDeleting(multipleSelection)">删除选中角色</el-button>-->
    </div>
    <!--列表-->
    <el-table ref="multipleTable" :data="roleList" tooltip-effect="dark"
              border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="角色id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="角色名称" >
        <template slot-scope="scope">{{ scope.row.role_name }}</template>
      </el-table-column>
      <el-table-column label="创建时间" >
        <template slot-scope="scope">
          <span v-if="scope.row.update_time == null">无</span>
          <span v-else>{{ scope.row.update_time | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="page" :page-sizes="[10, 200, 300, 400]" :total="count"
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
        searchForm:{
          roleName: '', // 角色名称
        },
        roleList: [], // 角色列表
        limit:10, // 每页的数量
        page: 1, // 页码
        count:0, // 总数
        multipleSelection: [], // 列表选择的数据
        isSearch:0, // 是否为搜索，0正常，1搜索
      }
    },
    mounted: function(){
      this.getRoleList(); // 获取角色列表
    },
    methods: {
      // 获取角色列表
      getRoleList() {
        let param = {
          page: this.page, // 页码
          limit: this.limit, // 每页数据
          name: this.searchForm.roleName, // 角色名称
        };
        param = utils.filterJson(param);
        apiUser.getDepartmentList(param).then(res => {
          if(res.cscode == 0){
            this.roleList = res.data.data; // 待渲染的数据
            this.count = res.data.count; // 总条数
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.roleList = res.data.data; // 待渲染的数据
            this.count = 0; // 总条数
          }
        });
      },
      // 查询
      searchRole(val,limit) {
        this.page = val; // 选定第一页
        this.limit = limit; // 每页数据
        this.getRoleList(); // 获取用户列表
        this.isSearch = 1; // 查询的状态变化
      },
      // 批量删除--500-12.11
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除角色吗", '提示信息', {
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
            apiUser.getroleidtodelrole(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getRoleList(); // 列表
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
          this.$alert("请选择要删除的角色", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 选择列表
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 每页数据量
      handleSizeChange(val) {
        this.limit=val;
        if(this.isSearch == 1){
          this.searchRole(this.page,val);
        }else{
          this.getRoleList();
        }
      },
      // 页码
      handleCurrentChange(val) {
        this.page=val;
        if(this.isSearch == 1){
          this.searchRole(val,this.limit);
        }else{
          this.getRoleList();
        }
      },
      // 编辑
      handleEdit(id) {
        this.$router.push({
          path:'/RoleUpdate',
          query:{id:id}
        });
      },
      // 删除
      handleDelete(id) {
        let param={
          id:id
        };
        param = utils.filterJson(param);
        apiUser.getroleidtodelrole(param).then(res => {
          if (res.cscode == "0") {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.getRoleList(); // 列表
              }
            })
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
            })
          }
        });
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
</style>>
