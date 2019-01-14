<template>
  <div class="distManagement">
    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">分销</el-breadcrumb-item>
          <el-breadcrumb-item>分销商管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
    </div>
    <!--卡片查询-->
    <el-card class="card-search">
      <div slot="header" class="clearfix">
        <div class="flex_box" style="margin-bottom: 10px;">
          <div>分销总人数:<span>{{distributionBase.total_user}}人</span></div>
          <div>一级分销:<span>{{distributionBase.commission1}}人</span></div>
          <div>二级分销:<span>{{distributionBase.commission2}}人</span></div>
          <div>直属二级分销:<span>{{distributionBase.dir_commission2}}人</span></div>
          <div>分销总金额:<span>{{distributionBase.commission_sum}}</span></div>
        </div>
        <div class="flex_box">
          <div>直属一级分销:<span>{{distributionBase.dir_commission1}}人</span></div>
          <div>一级分销订单数:<span>{{distributionBase.order_sum1}}单</span></div>
          <div>二级分销订单数:<span>{{distributionBase.order_sum2}}单</span></div>
          <div>一级分销金额:<span>{{distributionBase.commission_sum1}}</span></div>
          <div>二级分销金额:<span>{{distributionBase.commission_sum2}}</span></div>
        </div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户账号：">
          <el-input v-model="formInline.id" placeholder="用户ID/账户"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称：">
          <el-input v-model="formInline.nickname" placeholder="输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-date-picker v-model="formInline.ctime" type="date" value-format="timestamp" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-button style="float: right;" type="success" @click="resetBtn()">重置</el-button>
        <el-button style="float: right;margin-right: 20px;" type="primary" @click="searchManage()">查询结果</el-button>
      </el-form>
    </el-card>
    <el-card class="card-list" style="margin-top: 10px">
      <!--头部-->
      <div slot="header" class="clearfix" >
        <span>数据列表</span>
        <div class="search_title">
          <el-select v-model="order_rule" clearable placeholder="排序方式" style="width: 110px" @change="changeRules(order_rule)">
            <el-option disabled value="">请选择</el-option>
            <el-option label="正序时间" value="1"></el-option>
            <el-option label="倒序时间" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <!--表格-->
      <el-table border ref="multipleTable"
                :data="distributionManage" style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" show-overflow-tooltip label="用户ID" width="80"></el-table-column>
        <el-table-column prop="manager_phone" show-overflow-tooltip label="手机号" ></el-table-column>
        <el-table-column prop="manager_name" show-overflow-tooltip label="昵称/微信昵称"></el-table-column>
        <el-table-column show-overflow-tooltip label="注册时间">
          <template slot-scope="scope">
            {{scope.row.create_time==''?"无":scope.row.create_time}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="分销等级">
          <template slot-scope="scope">
            {{scope.row.level}}
            <span v-if="scope.row.is_direct == 1" class="sign">直属</span>
          </template>
        </el-table-column>
        <el-table-column prop="sub" show-overflow-tooltip label="下线数"></el-table-column>
        <el-table-column prop="sup" show-overflow-tooltip label="上线" ></el-table-column>
        <el-table-column prop="commission" show-overflow-tooltip label="申请金额"></el-table-column>
        <el-table-column show-overflow-tooltip label="来源">
          <template slot-scope="scope">
            <!--{{scope.row.level}}-->
            暂无
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="账户启用状态" width="150" show-overflow-tooltip>
          <template  slot-scope="scope">
            <el-switch v-model="scope.row.examine_status" active-color="#13ce66" inactive-color="#CBD0D6"
              @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="goToInfo(scope.row.id)"><b style="color: #3baf22">查看</b></el-button>
<!--
            <el-button type="text" @click="handleDelete(scope.row.id)"><span style="color: #af180e" >删除</span></el-button>
-->
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom clearfix" style="margin-top: 10px">
        <el-button @click="batchOn(multipleSelection)">启用</el-button>
        <el-button @click="batchOff(multipleSelection)">停用</el-button>
<!--
        <el-button @click="batchDeleting(multipleSelection)">删除</el-button>
-->
        <!--分页-->
        <el-pagination style="float: right;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {distribution} from "@/api/api.js" // export class api_user{}中的总名称
  let apiDistribution = new distribution(); // 给api_user另命名
  export default {
    name: "distManagement",
    data(){
      return{
        distributionBase:[], // 分销总数
        distributionManage:[], // 分销管理的数据
        distributionManages:[], // 分销管理的数据-尚未转码
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        formInline: { // 筛选查询
          id : '', // ID
          nickname: '', // 用户昵称
          ctime: '', // 注册时间
        },
        order_rule: '', // 正序，倒序--1是正序 2是倒序
        multipleSelection: [], // 选择的数据
      }
    },
    mounted: function(){
      this.getManage(); // 获取分销管理的数据
    },
    methods: {
      // 刷新
      refresh(){
        location.reload();
      },
      // 搜索数据
      searchManage:function(){
        this.currentPage = 1; // 当前页码
        this.getManage(); // 获取分销管理的数据
      },
      // 改变正序，倒序
      changeRules:function(val){
        this.currentPage = 1; // 当前页码
        this.order_rule = val;
        this.getManage(); // 获取分销管理的数据
      },
      // 获取分销管理的数据
      getManage:function(){
        let _this = this;
        // 标准格式转化为日期格式，日期格式转化为时间戳
        var start_time = ''; // 支付时间
        if (_this.formInline.ctime != null && _this.formInline.ctime != ''){
          start_time = (_this.formInline.ctime)/1000;
        }
        let param = {
          page:_this.currentPage, // 当前页码
          limit:_this.limit, // 每页多少条数据
          id : _this.formInline.id, // ID
          nickname: _this.formInline.nickname, // 用户昵称
          ctime:  start_time, // 注册时间
          order_rule: _this.order_rule, // 正序，倒序--1是正序 2是倒序
        };
        param = utils.filterJson(param);
        apiDistribution.getDistributionManage(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.distributionManages = res.data.info; // 分销列表信息--审核状态 1待审核 2为审核通过 3为审核拒绝 默认待审核
            for(let i=0;i<_this.distributionManages.length;i++){
              if(_this.distributionManages[i].examine_status == 1 || _this.distributionManages[i].examine_status == 3){
                _this.distributionManages[i].examine_status = false
              }else if(_this.distributionManages[i].examine_status == 2){
                _this.distributionManages[i].examine_status = true
              }
            }
            _this.distributionBase = res.data.base; // 分销总数
            _this.distributionManage = _this.distributionManages; // 分销列表信息
            _this.count = res.data.count; // 总数量
          }else{
            _this.distributionBase = res.data.base; // 分销总数
            _this.distributionManage = res.data.info; // 分销列表信息
            _this.count = 0; // 总数量
          }
        });
      },
      // 重置按钮
      resetBtn:function(){
        let _this = this;
        _this.formInline.id = ''; // ID
        _this.formInline.nickname = ''; // 用户昵称
        _this.formInline.ctime = ''; // 注册时间
      },
      //选择列表操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 点击导出按钮---假
      exportDatas:function(rows){
        console.log(rows);
        let _this = this;
        let ids = [];
        if (rows) {
          rows.forEach(row => {
            ids.push(row.id)
          })
        }
        console.log(ids);
        let search =ids.toString();
        let page = _this.currentPage; // 当前页码
        let limit= _this.limit; // 每页多少条数据
        // window.location.href="http://api.zhisoufangdichan.com/api/v1/documnets/inputexcel?documents_type=3&search="+search+"&page="+page+"&limit="+limit
      },
      // 查看
      goToInfo:function(id){
        this.$router.push({
          path:'/distributionDetails',
          query:{id:id,}
        })
      },
      // 删除
      handleDelete:function(id){
        this.$confirm('执行此操作分销商将被删除, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            id_arr:id,
          };
          param = utils.filterJson(param);
          apiDistribution.delDistributionManage(param).then(res=>{
            console.log(res);
            if(res.cscode == "0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getManage();
                }
              })
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
        });
      },
      // 批量删除
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let idss = ids.join(",");
            let param ={
              id_arr:idss // 批量传递一维数组，单独的传递ID
            };
            console.log(param);
            param = utils.filterJson(param);
            apiDistribution.delDistributionManage(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getManage();
                  }
                })
              }
            })
          }).catch(() => {
          })
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 修改状态
      changeStatus:function(scopec){
        var num=null;
        // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
        if(scopec.examine_status == true){
          num = 2
        }else{
          num = 1
        }
        let param={
          id: scopec.id,
          examine_status: num,
        };
        console.log(param);
        param = utils.filterJson(param);
        apiDistribution.changeDistributionManage(param).then(res => {
          console.log(res);
          if(res.cscode == 0){
            this.getManage(); // 获取分销管理的数据
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      // 批量启动
      batchOn:function(rows){
        if(rows.length>0){
          this.$confirm("确定启用吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let idss = ids.join(",");
            let param ={
              id: idss, // 批量传递一维数组，单独的传递ID
              examine_status: 2, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            };
            console.log(param);
            param = utils.filterJson(param);
            apiDistribution.changeDistributionManage(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getManage();
                  }
                })
              }
            })
          }).catch(() => {
          })
        }else {
          this.$alert("请选择要操作的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 批量关闭
      batchOff:function(rows){
        if(rows.length>0){
          this.$confirm("确定停用吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let idss = ids.join(",");
            let param ={
              id:idss, // 批量传递一维数组，单独的传递ID
              examine_status: 1, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            };
            console.log(param);
            param = utils.filterJson(param);
            apiDistribution.changeDistributionManage(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getManage();
                  }
                })
              }
            })
          }).catch(() => {
          })
        }else {
          this.$alert("请选择要操作的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },

      //分页
      handleSizeChange(val) {
        this.limit = val;
        this.getManage();
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getManage();
      },
    },
  }
</script>

<style scoped>
  @import url("../../assets/css/Distribution.css");
</style>
