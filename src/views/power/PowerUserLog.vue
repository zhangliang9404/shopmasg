<template>
  <div class="PowerUserLog">
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">权限</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/userquery' }">用户账号查询</el-breadcrumb-item>
          <el-breadcrumb-item>登录日志</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <i class="el-icon-date" style="margin-bottom: 20px;"><span>数据列表</span></i>
    <el-table :data="logList" border style="width: 95%">
      <el-table-column prop="create_time" label="时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ip" label="IP"  width="180"></el-table-column>
      <el-table-column prop="cityinfo" label="地区" show-overflow-tooltip></el-table-column>
      <el-table-column prop="login_type" label="登录方式"></el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
        :page-sizes="[10, 200, 300, 400]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
        :total="count">
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
        limit:10, // 每页数量
        count:0, // 总数
        page:1, // 页码
        logList: [], // 登录列表
      }
    },
    mounted: function(){
      this.getLogList(); // 获取登录日志
    },
    methods: {
      // 获取登录日志
      getLogList() {
        let param={
          page:this.page, // 页码
          limit:this.limit, // 每页数量
          id:this.$route.query.id,
        };
        param = utils.filterJson(param);
        apiUser.loggetuidtoarr(param).then(res => {
          if(res.cscode == 0){
            this.logList = res.data.userlog; // 登录日志
            this.count = res.data.countnum; // 总数量
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.logList = res.data.userlog; // 登录日志
            this.count = 0; // 总数量
          }
        });
      },
      // 每页数量的切换
      handleSizeChange(val) {
        this.limit = val;
        this.getLogList();
      },
      // 页码的切换
      handleCurrentChange(val) {
        this.page = val;
        this.getLogList();
      },

    },

  }
</script>


