<template>
  <div class="distributionDetails">

    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">分销</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/distManagement' }">分销商管理</el-breadcrumb-item>
          <el-breadcrumb-item>分销商详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
    </div>
    <!--分销商信息-->
    <div class="dis_table1" >
      <p>分销商信息</p>
      <table  cellpadding='0' cellspacing='0' width="100%">
        <tr>
          <td  rowspan="5" style="width: 20%;text-align: center">
            <div style="margin-bottom: 20px">{{detailsDate.manager_phone}}</div>
            <div  :disabled="detailsDate.fans_num>0" @click="openFans" style="font-size: 12px;margin-bottom: 20px;color: blue;cursor: pointer;text-decoration:underline">
              粉丝：{{detailsDate.fans_num  ? detailsDate.fans_num :'0'}}</div>
            <div style="font-size: 12px">总佣金：<span>{{detailsDate.comission_sum}}</span>成功提现<span>{{detailsDate.success_sum}}</span></div>

          </td>
          <td class="title">用户ID</td>
          <td>{{detailsDate.uid}}</td>
          <td class="title">银行卡号</td>
          <td>{{detailsDate.card_number}}</td>
        </tr>
        <tr>
          <td class="title">昵称</td>
          <td>{{detailsDate.manager_name}}</td>
          <td class="title">手机号</td>
          <td>{{detailsDate.manager_phone}}</td>
        </tr>
        <tr>
          <td class="title">分销等级</td>
          <td>{{detailsDate.level}}</td>
          <td class="title">注册时间</td>
          <td>{{detailsDate.create_time|dateFilter}}</td>
        </tr>
        <tr>
          <td class="title">下线数</td>
          <td>{{detailsDate.sub}}</td>
          <td class="title">订单总数</td>
          <td>{{detailsDate.orderSum}}</td>
        </tr>
        <tr>
          <td class="title">上线</td>
          <td>
            <span v-if="mySup != null">
              {{mySup.nickname}} {{mySup.phone}} {{mySup.wx_code}} {{mySup.housing_estate}}
            </span>
          </td>
          <td class="title">小区</td>
          <td>无</td>
        </tr>
      </table>
      <el-dialog
        title="粉丝详情"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <div class="fans">
          <el-input
            placeholder="账号/昵称"
            v-model="fans_name"
            clearable style="width: 50%">
          </el-input>
          <el-button style="width:10%" @click="getSearchFans">搜索</el-button>
          <template>
            <el-table
              :data="tableData"
              border
              style="width: 100%;margin-top: 20px">
              <el-table-column prop="id" label="粉丝ID" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="nickname" label="昵称" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="phone" label="用户账号" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="scope" label="关注时间" width="200" show-overflow-tooltip>
                <template  slot-scope="scope">
                  {{scope.row.create_time}}
                 <!-- {{chuan(scope.row.create_time)}}-->
                </template>
              </el-table-column>
              <el-table-column prop="scope" label="性别"  show-overflow-tooltip>
                <template  slot-scope="scope">
                   {{scope.row.sex | sex}}
                </template>
              </el-table-column>

            </el-table>
            <el-pagination class="dataListBtnFr" @current-change="handleCurrentChange2"
                           @size-change="handleSizeChange2"
                           :current-page="pages2.nowPages" :page-sizes="[10,20,30,40,50]" :page-size="pages2.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="pages2.count"
                           @next-click="nextPages2" @prev-click="prevPages2">
            </el-pagination>
          </template>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!--佣金明细-->
    <div class="dis_table_2 detailTable">
      <p>佣金明细（1级和2级）</p>
      <p>
        <span @click="getManageCommission(1)">一周</span>
        <span @click="getManageCommission(2)">一月</span>
        <span @click="getManageCommission(3)">一年</span>
      </p>
      <table >
        <tr>
          <th>待审核(￥)</th>
          <th>待打款(￥)</th>
          <th>已打款(￥)</th>
          <th>无效佣金(￥)</th>
        </tr>
        <tr>
          <td>{{CommissionDetail.wait_check}}</td>
          <td>{{CommissionDetail.wait_recharge}}</td>
          <td>{{CommissionDetail.aly_recharge}}</td>
          <td>{{CommissionDetail.u_commission}}</td>
        </tr>
      </table>
    </div>
    <!--佣金记录-->
    <div class="dis_table_3 detailTable" v-if="detailsDate.level == '一级分销'">
      <p>佣金记录（1级）</p>
      <table >
        <tr>
          <th>可提现佣金金额(￥)</th>
          <th>已申请佣金(￥)</th>
          <th>待打款佣金(￥)</th>
          <th>无效佣金(￥)</th>
          <th>待收货佣金(￥)</th>
          <th>未结算佣金(￥)</th>
        </tr>
        <tr>
          <td>{{CommissionRecord.allow_commission}}</td>
          <td>{{CommissionRecord.apply_commission}}</td>
          <td>{{CommissionRecord.wait_recharge}}</td>
          <td>{{CommissionRecord.u_commission}}</td>
          <td>{{CommissionRecord.wait_receive}}</td>
          <td>{{CommissionRecord.wait_count}}</td>
        </tr>
      </table>
    </div>
    <!--下线详情-->
    <div class="dis_table_4" v-if="detailsDate.level == '一级分销'">
      <p>下线详情（1级）</p>
        <el-table :data="SubDetail" border style="width: 100%">
          <el-table-column prop="manager_name" show-overflow-tooltip label="姓名" ></el-table-column>
          <el-table-column prop="manager_phone" show-overflow-tooltip label="手机号" ></el-table-column>
          <el-table-column prop="housing_estate" show-overflow-tooltip label="所在小区" ></el-table-column>
          <el-table-column prop="examine_status" show-overflow-tooltip label="激活状态" ></el-table-column>
          <el-table-column show-overflow-tooltip label="扫码时间" >
            <template slot-scope="scope">
              <span v-if="scope.row.create_time == null">无</span>
              <span v-else>{{ scope.row.create_time | dateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="登录时间" >
            <template slot-scope="scope">
              <span v-if="scope.row.update_time == null">未登录</span>
              <span v-else>{{ scope.row.update_time | dateFilter }}</span>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <!--订单记录-->
    <div class="dis_table_5">
      <p>订单记录</p>
      <el-table border ref="multipleTable" :data="orderList" style="width: 100%" tooltip-effect="dark" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="ordernumber" show-overflow-tooltip label="订单编号" width="180"></el-table-column>
        <el-table-column show-overflow-tooltip label="提交时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.creationtime|dateFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="用户账号" width="180"></el-table-column>
        <el-table-column prop="price" show-overflow-tooltip label="订单金额" width="180"></el-table-column>
        <el-table-column prop="mode_payment" show-overflow-tooltip label="支付方式" width="180"></el-table-column>
        <el-table-column prop="order_source" show-overflow-tooltip label="订单来源" width="180"></el-table-column>
        <el-table-column prop="status" show-overflow-tooltip label="订单状态" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="goto(scope.row.root_name,scope.row.id)"><span style="color: #3baf22">查看订单</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="count"
      style="float: right;">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import * as utils from "@/common/utils.js"
  import {distribution} from "@/api/api.js" // export class api_user{}中的总名称
  let apiDistribution = new distribution(); // 给api_user另命名
  export default {
    name: "distributionDetails",
    data() {
      return {
        detailsDate:[], // 详细数据
        dialogVisible:false,
        fans_name:'',//粉丝名称
        tableData: [],
        pages2:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },
        mySup:[], // 我的上线
        CommissionDetail:'', // 佣金明细
        SubDetail: [], // 下线详情
        CommissionRecord: [], // 佣金记录
        orderList:[], // 订单
        orderLists:[], // 待处理的订单数据
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
      }
    },
    mounted: function(){
      this.getManageInfo(); // 获取分销管理的数据详情
      this.getManageCommission(1); // 获取佣金明细
      this.getManageSub(); // 获取下线详情
      this.getManageOrder(); // 获取订单
      /*this.getFansList();//*/
    },
    methods:{
      // 获取分销管理的数据详情
      getManageInfo:function(){
        let _this = this;
        let param = {
          id:_this.$route.query.id
        };
        param = utils.filterJson(param);
        apiDistribution.infoDistributionManage(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.detailsDate = res.data.res; // 数据展示
            _this.mySup = res.data.res.sup; // 我的上线
          }
        });
      },
      //获取粉丝列表
      getFansList:function(){

      /*  pages2:{
          count:0,
            nowPages:1,//当前页数
            limit:10
        },*/
        let param={
          search:this.fans_name,
          uid:this.detailsDate.uid,
          page:this.pages2.nowPages,
          limit:this.pages2.limit
        }
        apiDistribution.getDistributionFansList(param).then(res => {
          this.$message(res.data.msg)
          if(res.cscode == "0"){
            this.pages2.count=res.count
            this.tableData=res.data.info
          }
        })
      },
      // 获取佣金明细
      getManageCommission:function(choice){
        let _this = this;
        let param = {
          id:_this.$route.query.id,
          choice: choice, // (不传和默认为1   1代表一周 2代表一月 3代表一年)
        };
        param = utils.filterJson(param);
        apiDistribution.getDistributionManageCommission(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.CommissionDetail = res.data.info; // 数据展示-佣金明细
          }
        });
      },
      // 获取下线详情--佣金记录
      getManageSub:function(){
        let _this = this;
        let param = {
          id:_this.$route.query.id,
        };
        param = utils.filterJson(param);
        apiDistribution.getDistributionManageSub(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.CommissionRecord = res.data.info; // 数据展示-佣金记录
            var SubDetails = res.data.info.sub_info; // 数据展示-下线详情
            for (var i=0;i<SubDetails.length;i++){
              //审核状态 1待审核 2为审核通过 3为审核拒绝 默认待审核
              if(SubDetails[i].examine_status == '1'){
                SubDetails[i].examine_status = '待审核';
              }else if (SubDetails[i].examine_status == '2') {
                SubDetails[i].examine_status = '审核通过';
              }else{
                SubDetails[i].examine_status = '审核拒绝';
              }
            }
            _this.SubDetail = SubDetails; // 数据展示-下线详情
          }
        });
      },
      // 获取分销管理的数据详情
      getManageOrder:function(){
        let _this = this;
        let param = {
          id:_this.$route.query.id,
          page:_this.currentPage,//当前页码
          limit:_this.limit,//每页多少条数据
        };
        param = utils.filterJson(param);
        apiDistribution.orderDistributionManage(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.orderLists = res.data.info; //待处理的订单数据
            for(var i=0;i<_this.orderLists.length;i++){
              if(_this.orderLists[i].order_source == 1){
                _this.orderLists[i].order_source = "普通购买";
              }else if(_this.orderLists[i].order_source == 5) {
                _this.orderLists[i].order_source = "拼团";
              }
              if(_this.orderLists[i].mode_payment == 1){
                _this.orderLists[i].mode_payment = "微信支付";
              }else if(_this.orderLists[i].mode_payment == 2) {
                _this.orderLists[i].mode_payment = "支付宝";
              }else if(_this.orderLists[i].mode_payment == 3) {
                _this.orderLists[i].mode_payment = "未知";
              }
              if(_this.orderLists[i].status == 0){
                _this.orderLists[i].status = "等待买家付款";
                _this.orderLists[i].root_name = 'orderstate'+'0';//路由为变量，等待买家付款是0
              }else if(_this.orderLists[i].status == 1) {
                _this.orderLists[i].status = "买家已付款";
                _this.orderLists[i].root_name = 'orderstate'+'1';//买家已付款是1
              }else if(_this.orderLists[i].status == 2) {
                _this.orderLists[i].status = "取消订单成功";
                _this.orderLists[i].root_name = 'orderstate'+'6';//取消订单即交易关闭，6
              }else if(_this.orderLists[i].status == 3) {
                _this.orderLists[i].status = "等待买家收货";
                _this.orderLists[i].root_name = 'orderstate'+'3';//等待收货是3
              }else if(_this.orderLists[i].status == 4) {
                _this.orderLists[i].status = "买家已经收货(待评价)";
                _this.orderLists[i].root_name = 'orderstate'+'5';//已收货是4--（1期放在）
              }else if(_this.orderLists[i].status == 5) {
                _this.orderLists[i].status = "交易成功";
                _this.orderLists[i].root_name = 'orderstate'+'5';//交易成功是5
              }else if(_this.orderLists[i].status == 6) {
                _this.orderLists[i].status = "交易关闭";
                _this.orderLists[i].root_name = 'orderstate'+'6';//交易关闭是6
              }else if(_this.orderLists[i].status == 7) {
                _this.orderLists[i].status = "退款受理";
                _this.orderLists[i].root_name = 'orderstate'+'7';//退款受理是7
              }else if(_this.orderLists[i].status == 8) {
                _this.orderLists[i].status = "退款成功";
                _this.orderLists[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }else if(_this.orderLists[i].status == 9) {
                _this.orderLists[i].status = "退货中";
                _this.orderLists[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if(_this.orderLists[i].status == 10) {
                _this.orderLists[i].status = "退款被拒绝";
              }else if(_this.orderLists[i].status == 11) {
                _this.orderLists[i].status = "团购库存不足";
              }else if(_this.orderLists[i].status == 12) {
                _this.orderLists[i].status = "已评价";
                _this.orderLists[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }else if(_this.orderLists[i].status == 13) {
                _this.orderLists[i].status = "订单服务终止";
              }else if(_this.orderLists[i].status == 14) {
                _this.orderLists[i].status = "取消订单受理 ";
              }else if(_this.orderLists[i].status == 15) {
                _this.orderLists[i].status = "取消订单被驳回";
              }

            }
            _this.orderList = _this.orderLists; // 订单详情
            _this.count = res.data.count; // 总数
          }
        });
      },
      //跳转页面
      goto(name,id){
        this.$router.push({
          path:name,
          query:{
            id:id,
          }
        })
      },
      //分页
      handleSizeChange(val) {
        let _this = this;
        _this.limit = val;
        _this.getManageOrder();
      },
      //分页
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
        _this.getManageOrder();
      },
      openFans(){
        console.log(this.detailsDate)
        if(this.detailsDate.fans_num>0){
          this.dialogVisible=true
          this.getFansList()
        }

      },
      //搜索粉丝
      getSearchFans(){
        if(this.fans_name){
          this.getFansList()
        }else {
          this.$message('请输入粉丝名称')
        }
      },
      //弹框确定
      handleClose(done) {
        this.dialogVisible=false
      },
      //弹框分页
      handleSizeChange2(limit){
        console.log(limit)
        this.pages2.limit = limit
        this.pages2.nowPages=1
        this.handleCurrentChange2(1)
      },
      handleCurrentChange2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },
      nextPages2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },
      prevPages2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },

    },
    filters:{
      // 时间过滤器
      dateFilter:function(date){
        return  utils.formatDates(date)
      },
      //性别处理
      sex:function(value){
        if(value==1){
          return '男'
        }else if(value==2){
          return '女'
        }else {
          return '保密'
        }
      }
    },

  }
</script>

<style scoped>
  @import url("../../assets/css/Distribution.css");

</style>
