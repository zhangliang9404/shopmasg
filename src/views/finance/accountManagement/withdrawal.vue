<template>
  <div class="withdrawal">
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
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户账号：">
          <el-input v-model="formInline.id" placeholder="用户ID/账户"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称：">
          <el-input v-model="formInline.nickname" placeholder="输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="提现申请时间：">
          <el-date-picker v-model="formInline.ctime" type="date" value-format="timestamp" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option disabled value="">请选择</el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已拒绝" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-button style="float: right;" type="success" @click="resetBtn()">重置</el-button>
        <el-button style="float: right;margin-right: 20px;" type="primary" @click="searchManage()">查询结果</el-button>
      </el-form>
    </el-card>
    <el-card class="card-list" style="margin-top: 10px">
      <!--头部-->
      <div slot="header" class="clearfix" >
        <span>数据列表</span>
        <el-select v-model="order_rule" clearable placeholder="排序方式" style="width: 110px;float: right;" @change="changeRules(order_rule)">
          <el-option disabled value="">请选择</el-option>
          <el-option label="正序时间" value="1"></el-option>
          <el-option label="倒序时间" value="2"></el-option>
        </el-select>
      </div>
      <!--表格-->
      <el-table border ref="multipleTable" :data="distributionManage" style="width: 100%"
                tooltip-effect="dark" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="uid" show-overflow-tooltip label="用户ID" width="80"></el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="姓名"></el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="账号" ></el-table-column>
        <el-table-column show-overflow-tooltip label="提现申请时间">
          <template slot-scope="scope">
            {{scope.row.add_time==''?"无":scope.row.add_time}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="银行">
          <template slot-scope="scope">
            {{scope.row.bank}}
          </template>
        </el-table-column>
        <el-table-column prop="number" show-overflow-tooltip label="卡号"></el-table-column>
        <el-table-column prop="money" show-overflow-tooltip label="申请金额"></el-table-column>
        <el-table-column show-overflow-tooltip label="审核状态" >
          <template slot-scope="scope">
            <!--审核状态 ''0=>待审核  1=>审核通过    2=>已提现   3=>无效。-->
            <span v-if="scope.row.status == 0">待审核</span>
            <span v-else-if="scope.row.status == 1">审核通过</span>
            <span v-else-if="scope.row.status == 2">已提现</span>
            <span v-else-if="scope.row.status == 3">无效</span>
          </template>
        </el-table-column>
        <el-table-column label="审核操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="Allow(scope.row.id)"><b style="color: #3baf22">通过</b></el-button>
            <el-button type="text" @click="RefuseVisibles(scope.row.id)"><b style="color: #af180e">拒绝</b></el-button>
          </template>
        </el-table-column>
        <el-table-column label="打款" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status == 1" @click="remit(scope.row.id)"><b style="color: #3baf22">待打款</b></el-button>
            <el-button type="text" v-else-if="scope.row.status == 2" disabled><b style="color: #9DAFAE">已打款</b></el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="备注">
          <template slot-scope="scope">
            {{scope.row.remark}}
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="提示" :visible.sync="RefuseVisible" width="30%" >
        <el-input v-model="RefuseInfo" placeholder="请输入拒绝原因"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="RefuseVisible = false">取 消</el-button>
          <el-button type="primary" @click="Refuse()">确 定</el-button>
        </span>
      </el-dialog>

      <div class="bottom clearfix" style="margin-top: 10px">
        <!--分页-->
        <el-pagination style="float: right;margin-bottom: 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="count">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_finance} from "@/api/api.js" // export class api_user{}中的总名称
  let apiFinance = new api_finance(); // 给api_user另命名

  export default {
    name: "withdrawal",
    data(){
      return{
        distributionManage:[], // 分销管理的数据
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        formInline: { // 筛选查询
          id : '', // ID
          nickname: '', // 用户昵称
          ctime: '', // 注册时间
          status:'', // 状态
        },
        order_rule: '', // 正序，倒序--1是正序 2是倒序
        multipleSelection: [], // 选择的数据
        RefuseVisible: false, // 拒绝的弹框
        RefuseInfo:'', // 拒绝原因
        RefuseId:'', // 拒绝id
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
        // 用户账号id 用户昵称name 开始时间start_time 结束时间end_time 审核状态status
        // 排序参数 rule   为2时 按提现申请时间倒序排列 其余状态按正序
        let param = {
          page:_this.currentPage, // 当前页码
          limit:_this.limit, // 每页多少条数据
          id : _this.formInline.id, // ID
          name: _this.formInline.nickname, // 用户昵称
          start_time:  start_time, // 注册时间
          status : _this.formInline.status, // 审核状态
          rule: _this.order_rule, // 正序，倒序--1是正序 2是倒序
        };
        param = utils.filterJson(param);
        apiFinance.getCashList(param).then(res => {
          if(res.cscode == "0"){
            _this.distributionManage = res.data.info; // 分销列表信息--审核状态 1待审核 2为审核通过 3为审核拒绝 默认待审核
            _this.count = res.count; // 总数量
          }else{
            _this.distributionManage = res.data.info; // 分销列表信息--审核状态 1待审核 2为审核通过 3为审核拒绝 默认待审核
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
        _this.formInline.status = ''; // 审核状态
      },
      //选择列表操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 通过
      Allow:function(id){
        // em_id:list里的数据id ,op:refuse 拒绝，allow通过
        let param = {
          em_id:id,
          op:"allow",
          action_uid:sessionStorage.getItem("token1"),
        };
        param = utils.filterJson(param);
        apiFinance.cashExamine(param).then(res => {
          if(res.cscode == "0"){
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              // showClose: false
            });
            this.getManage(); // 获取分销管理的数据
          }else{
            this.$notify.error({
              title: '错误',
              message: res.data.msg,
              // showClose: false,
            });
          }
        });
      },
      // 拒绝弹框
      RefuseVisibles:function(id) {
        this.RefuseId = id; // 拒绝id赋值
        this.RefuseVisible = true; // 拒绝弹框
      },
      // 拒绝
      Refuse:function(){
        // em_id:list里的数据id ,op:refuse 拒绝，allow通过
        let param = {
          em_id:this.RefuseId,
          op:"refuse",
          action_uid:sessionStorage.getItem("token1"),
          remark:this.RefuseInfo,
        };
        param = utils.filterJson(param);
        apiFinance.cashExamine(param).then(res => {
          if(res.cscode == "0"){
            this.RefuseVisible = false;
            this.$notify({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              // showClose: false
            });
            this.getManage(); // 获取分销管理的数据
          }else{
            this.RefuseVisible = false;
            this.$notify.error({
              title: '错误',
              message: res.data.msg,
              // showClose: false,
            });
          }
        });
      },
      // 待打款
      remit:function(id){
        this.$confirm('执行此操作将为客户打款, 是否继续?', '打款通知', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            id:id,
          };
          param = utils.filterJson(param);
          apiFinance.cashChange(param).then(res=>{
            if(res.cscode == "0"){
              this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success',
                // showClose: false
              });
              this.getManage();
            }else{
              this.$notify.error({
                title: '错误',
                message: res.data.msg,
                // showClose: false,
              });
            }
          })
        }).catch(() => {
        });
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

</style>
