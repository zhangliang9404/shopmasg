<template>
	<div class="PowerQuery">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>权限设置</el-breadcrumb-item>
          <el-breadcrumb-item>权限查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--查询-->
    <div class="searchBorder">
      <el-form ref="searchForm" :model="searchForm" label-width="130px" class="borderFlex">
        <!--权限名称-->
        <el-form-item label="权限名称：" prop="jurisdiction_name" style="width:25%">
          <el-input v-model="searchForm.jurisdiction_name" clearable></el-input>
        </el-form-item>
        <!--控制器别名-->
        <el-form-item label="控制器别名：" prop="controller" style="width:25%">
          <el-input v-model="searchForm.controller" clearable></el-input>
        </el-form-item>
        <!--方法名-->
        <el-form-item label="方法名：" prop="action" style="width:25%">
          <el-input v-model="searchForm.action" clearable></el-input>
        </el-form-item>
        <el-form-item style="width:25%">
          <el-button @click="search(1,10)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button @click="$router.push('poweradd')">添加新权限</el-button>
      <el-button @click="batchDeleting(multipleSelection)">删除选中权限</el-button>
    </div>
    <!--列表-->
    <el-table ref="multipleTable" :data="powerList" tooltip-effect="dark"
              border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="权限id" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="权限名称" >
        <template slot-scope="scope">{{ scope.row.jurisdiction_name }}</template>
      </el-table-column>
      <el-table-column prop="jurisdiction_code" label="权限代码"></el-table-column>
      <el-table-column prop="controller" label="控制器名"></el-table-column>
      <el-table-column prop="action" label="方法名"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="page" :total="count" :page-sizes="[10, 200, 300, 400]"
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
				count: 0, // 总数
        limit: 10, // 每页的数据
				page: 1, // 页码
        searchForm: { // 查询数据
					jurisdiction_name: '', // 权限名称
          controller: '', // 控制器名称
          action: '', // 方法名称
				},
        powerList: [], // 列表数据
        multipleSelection: [], // 列表选择
        isSearch:0,
      }
		},
    mounted: function(){
      this.getList(); // 获取列表
    },
		methods: {
		  // 获取列表
      getList() {
        let param = {
          page: this.page, // 页码
          limit: this.limit, // 每页的数据
          jurisdiction_name: this.searchForm.jurisdiction_name, // 权限名称
          controller: this.searchForm.controller, // 控制器名称
          action: this.searchForm.action, // 方法名称
        };
        param = utils.filterJson(param);
        apiUser.getActionList(param).then(res => {
          if(res.cscode == 0){
            this.powerList = res.data.data; // 待渲染的数据
            this.count = res.data.count; // 总条数
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.powerList = res.data.data; // 待渲染的数据
            this.count = 0; // 总条数
          }
        });
      },
      // 查询
      search(val,limit) {
        this.page = val; // 选定第一页
        this.limit = limit; // 每页数据
        this.getList(); // 列表
        this.isSearch = 1; // 查询的状态变化
      },
      // 批量删除
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除权限吗", '提示信息', {
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
            apiUser.delJurisdiction(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    if(this.isSearch == 1 ){// 查询的状态变化-搜索
                      this.search(1,this.limit); // 列表
                    }else{
                      this.getList(); // 列表
                    }
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
          this.$alert("请选择要删除的权限名称", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 选择列表
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 编辑
      handleEdit(id) {
        this.$router.push({
          path:'/PowerUpdate',
          query:{id:id}
        });
      },
      // 删除
      handleDelete(id) {
        this.$confirm("确定删除权限吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            id:id
          };
          apiUser.delJurisdiction(param).then(res=> {
            if (res.cscode == "0") {
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  if(this.isSearch == 1 ){// 查询的状态变化-搜索
                    this.search(1,this.limit); // 列表
                  }else{
                    this.getList(); // 列表
                  }
                }
              })
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {})
      },
      // 每页数量改变
      handleSizeChange(val) {
        this.limit = val;
        if(this.isSearch == 1){
          this.search(this.page,val);
        }else{
          this.getList();
        }
      },
      // 页码改变
      handleCurrentChange(val) {
        this.page = val;
        if(this.isSearch == 1){
          this.search(val,this.limit);
        }else{
          this.getList();
        }
      },
		},

	}
</script>

<style scoped>
  @import url("../../assets/css/PowerQuery.css");
</style>
