<template>
  <div class="DepartmentQuery">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>部门管理</el-breadcrumb-item>
          <el-breadcrumb-item>部门查询</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-form :model="departmentSearch">
      <div class="user">
        <div class="character">
          部门名称 :<el-input placeholder="请输入名称" v-model="departmentSearch.departmentname" style="width: 200px;" clearable></el-input>
          部门ID：<el-input placeholder="请输入id" v-model="departmentSearch.departmentid" style="width: 200px;" clearable></el-input>
          <el-checkbox v-model="departmentSearch.locked">已锁定</el-checkbox>
          <el-checkbox v-model="departmentSearch.del">已删除</el-checkbox>
          <el-button @click="search(1,limit)">查询</el-button>
        </div>
        <div class="character2">
          <el-button @click="$router.push('departmentadd')">添加新部门</el-button>
          <el-button @click="delDepartment(multipleSelection)">删除选中部门</el-button>
          <el-button @click="lockDepartment(multipleSelection)">锁定选中部门</el-button>
          <el-button @click="unlockDepartment(multipleSelection)">解锁选中部门</el-button>
        </div>
      </div>
      <div class="character3">
        <el-table ref="multipleTable" :data="departmentList" tooltip-effect="dark" style="width: 100%"
                  border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="部门id" width="180">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="部门名称" width="180" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.department_name }}</template>
          </el-table-column>
          <el-table-column prop="parent_id" label="上级部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="是否锁定" show-overflow-tooltip></el-table-column>
          <el-table-column prop="is_del" label="已删除" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="page" :page-sizes="[10, 200, 300, 400]" :page-size="limit"
                         :total="count" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
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
        departmentSearch: { // 部门查询
          departmentname: '', // 部门名称
          departmentid: '', // 部门id
          locked: false, // 是否锁定
          del: false, // 是否删除
        },
        limit:10, // 每页数量
        status:0, // 搜索或获取
        count:0, // 总数
        page: 1, // 页码
        departmentList: [], // 部门列表
        multipleSelection: [], // 表格选择的数据
      }
    },
    mounted: function(){
      this.getList(); // 获取部门列表
    },
    methods: {
      // 获取部门列表
      getList(){
        let param = {
          page:this.page, // 页码
          limit:this.limit, // 每页数量
          department_name:this.departmentSearch.departmentname, // 部门名称
          id:this.departmentSearch.departmentid, // 部门id
          status:this.departmentSearch.locked, // 是否锁定
          is_del:this.departmentSearch.del, // 是否删除
        };
        param = utils.filterJson(param);
        apiUser.departmentgetuidtoarr(param).then(res => {
          if(res.cscode == 0){
            this.departmentList = res.data.department; // 部门列表
            this.count = res.data.countnum; // 数据总数
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.departmentList = res.data.department; // 部门列表
            this.count = 0; // 数据总数
          }
        });
      },
      // 查询
      search(val,limit) {
        this.page = val; // 选定第一页
        this.limit = limit; // 每页数据
        this.getList(); // 获取部门列表
        this.status = 1; // 查询的状态变化
      },
      // 删除部门
      delDepartment(rows) {
        if(rows.length>0){
          this.$confirm("确定删除部门吗", '提示信息', {
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
            apiUser.getdepartmentidtodeldm(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getList(); // 列表
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
      // 锁定
      lockDepartment(rows) {
        if(rows.length>0){
          this.$confirm("确定锁定部门吗", '提示信息', {
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
            apiUser.getdepartmentidtolocking(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getList(); // 列表
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
          this.$alert("请选择要锁定的部门", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 解锁
      unlockDepartment(rows) {
        if(rows.length>0){
          this.$confirm("确定解锁部门吗", '提示信息', {
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
            apiUser.getdepartmentidtounlock(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getList(); // 列表
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
          this.$alert("请选择要解锁的部门", '提示信息', {
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
          path:'/DepartmentUpdate',
          query:{
            id:id
          }
        });
      },
      // 删除
      handleDelete(id) {
        let param={
          id:id
        };
        param = utils.filterJson(param);
        apiUser.getdepartmentidtodeldm(param).then(res => {
          if (res.cscode == "0") {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.getList(); // 列表
              }
            })
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
            })
          }
        });
      },
      // 每页数量改变
      handleSizeChange(val) {
        this.limit = val;
        if(this.status == 1){
          this.search(this.page,val);
        }else{
          this.getList();
        }
      },
      // 页码改变
      handleCurrentChange(val) {
        this.page = val;
        if(this.status == 1){
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
