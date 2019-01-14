<template>
  <div class="userLog">
    <!--头部导航-->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>登录日志</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>

    <i class="el-icon-date"></i><span>数据列表</span>
    <el-table :data="loginLists" border style="width: 100%">
      <el-table-column label="时间">
        <template slot-scope="scope">
          {{scope.row.login_time | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="address" label="地区"></el-table-column>
      <el-table-column prop="login_style" label="登录方式"></el-table-column>
      <el-table-column prop="uid" label="登录人id"></el-table-column>
      <el-table-column prop="realname" label="登录人"></el-table-column>
    </el-table>

    <div align="right" style="margin: 10px 0;">
      <el-pagination @size-change="sizeChange" @current-change="currentChange"
                     :current-page="page.page" :page-sizes="[10, 20, 30, 40]" background :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalRecords">
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
        loginLists: [],// 登录日志
        page: {
          page: 1, // 当前页
          limit: 10, // 每页条数,  默认10条
          totalRecords: 0, // 总条数
          totalPages: 0, // 总页数
        },
      }
    },
    // 页面预加载执行
    mounted: function(){
      this.getLoginList(); // 获取登录日志的数据列表
    },
    methods: {
      // 刷新页面
      refresh(){
        location.reload();
      },
      // 获取登录日志的数据列表
      getLoginList() {
        let param = {
          page: this.page.page, // 当前页
          limit: this.page.limit, // 每页条数,  默认10条
        };
        param = utils.filterJson(param);
        apiUser.loginJournal(param).then(res => {
          if(res.cscode == 0){
            let loginList = res.data.data;
            for(let i=0;i<loginList.length;i++){
              if(loginList[i].login_style == "1"){
                loginList[i].login_style = "pc端";
              }else if(loginList[i].login_style == "2"){
                loginList[i].login_style = "手机端";
              }
            }
            this.page.totalRecords = res.data.count; // 总数
            this.loginLists = loginList; // 重新赋值
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      // 翻页--选择每页多少条
      sizeChange(val) {
        this.page.limit = val;
        this.getLoginList(); // 获取登录日志的数据列表
      },
      // 切换的第几页
      currentChange(val) {
        this.page.page = val;
        this.getLoginList(); // 获取登录日志的数据列表
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
  /*头部样式*/
  .userLog body{color: #262626;}
  .userLog .header{width: 100%;border-bottom: 1px solid #ccc;line-height: 40px;}
  .userLog .el-breadcrumb{display: inline-block;font-size: 14px;}
  .userLog .header .el-button{float: right;}
  .userLog .el-icon-date{font-size: 30px; padding: 20px 5px 15px 0;color: #626262;}
  .el-table thead {color: #9093D5;}
</style>
