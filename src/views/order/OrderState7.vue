<template>
	<div class="orderstate7">
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>订单信息</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'orderlist' }">订单列表</el-breadcrumb-item>
			<el-breadcrumb-item>订单状态-买家已付款（退款受理）</el-breadcrumb-item>
		</el-breadcrumb>
    <el-button style="float: right;" type="primary"  size="mini"  icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
    <p class="explanation"><i class="el-icon-document"></i>订单状态-买家已付款（退款受理）</p>
		<el-steps :active="2" finish-status="success" simple style="margin-top: 20px">
			<el-step title="1.买家下单"></el-step>
			<el-step title="2.买家付款"></el-step>
			<el-step title="3.发货"></el-step>
			<el-step title="4.买家确认收货"></el-step>
		</el-steps>
		<div class="ordertime">
			<div class="timeinfo">
				<b>下单时间：</b><br />
				<span>{{tableData.creationtime}}</span>
			</div>
			<div class="timeinfo">
				<b>付款时间：</b><br />
				<span>{{tableData.paytime}}</span>
			</div>
		</div>
		<div class="orderstate1">
			<p>当前订单状态：卖家申请退款，买家已付款</p>
			<li>申请退款后，用户端用户订单状态改变为退款受理</li>
			<li>申请退款后，客服核查无误后在退款管理中操作同意申请申请，订单退款完成</li>
			<li>如果没有和用户达成一致，请及时取消退款申请</li>
			<li>取消退款申请后，用户端订单状态还原在当前订单状态</li>
			<el-button v-if="tableData.thirtytime===1" tyle="margin-top: 10px;" type="primary" @click="open">同意退款申请</el-button>
      <el-button v-else disabled tyle="margin-top: 10px;" type="primary" @click="open">同意退款申请</el-button>
		</div>
		<div class="orderinfo1">
      <p>买家信息</p>
      <b>用户昵称：</b><span>{{tableData.nickname}}</span><br />
      <b>支付方式：</b><span>{{tableData.mode_payment}}（{{tableData.prepay_id}}）</span><br />
      <b>收货地址：</b><span>{{tableData.consignee}}，{{tableData.phone}}，{{tableData.receiver_address}}</span>

			<p>物流信息</p>
      <el-table :data="expresslist" border style="width: 100%">
        <!--<el-table-column prop="id" label="序号" width="50px">-->
        <!--</el-table-column>-->
        <el-table-column type="index" label="编号" width="50">
        </el-table-column>
        <el-table-column prop="mode" label="配送方式">
        </el-table-column>
        <el-table-column prop="logistics_name" label="物流公司名称">
        </el-table-column>
        <el-table-column prop="logistics_status" label="物流状态">
        </el-table-column>
        <el-table-column prop="code" label="运单号">
        </el-table-column>
        <el-table-column label="发货时间">
          <template slot-scope="scope">
            {{scope.row.addtime|dateFilter}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="click">
              <el-tabs type="border-card">
                <el-tab-pane><span slot="label"><i class="el-icon-date"></i> 物流动态</span>
                  <div class="track-rcol">
                    <div class="track-list">
                      <ul v-if="logisticsinfo.State == '0'"> {{logisticsinfo.Reason}}</ul>
                      <ul v-else>
                        <li v-for="site in logisticsdatass">
                          <i class="node-icon"></i>
                          <span class="time">{{site.AcceptTime}}</span>
                          <span class="txt">{{site.AcceptStation}}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <el-button slot="reference" @click="logistics(scope.row.simple,scope.row.code)">查看物流信息</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <div class="ordertop">
        <span class="span1">官方自营</span><span>订单信息</span><span>订单编号：{{tableData.parent_order}}</span>
      </div>
      <div class="orderinfos">
        <li>
          <b>订单子编号：</b><span>{{tableData.ordernumber}}</span>
          <span v-if="tableData.order_source=='5'" class="ifGroup">团</span>
          <span v-if="tableData.supplier_id>0" class="ifGroup" style="background: #af228a">供</span>
        </li>
        <li><b>下单时间：</b><span>{{tableData.creationtime}}</span></li>
        <li><b>付款时间：</b><span>{{tableData.paytime}}</span></li>
      </div>
      <el-table :data="goodslist" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="商品序号" width="100">
        </el-table-column>
        <el-table-column label="商品" show-overflow-tooltip>
          <template slot-scope="scope" >
            <img :src="scope.row.img" style="width: 50px;height: 50px;float: left;">
            <li style="list-style: none;vertical-align:top;text-align: left;margin-left: 60px">名称：{{ scope.row.goods_name }}</li>
            <li style="list-style: none;vertical-align:top;text-align: left;margin-left: 60px">规格：{{ scope.row.specification }}</li>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)*数量" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.goods_price }}</span>*{{ scope.row.goods_num }}
          </template>
        </el-table-column>
        <el-table-column label="商品总价(元)" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.goods_price*scope.row.goods_num }}</div>
          </template>
        </el-table-column>
      </el-table>
      <!--订单总和-->
      <div class="total" align="right">
        <p>订单商品金额：{{goods_price}}元</p>
        <p>订单总配送费：+{{freight}}元</p>
        <p>订单优惠金额：-{{tableData.discounts_money}}元</p>
        <p>实收款： {{price}}元</p>
      </div>
		</div>
	</div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js" // export class api_user{}中的总名称
  let apiUser = new api_user(); // 给api_user另命名
  import {api_order} from "@/api/api.js"
  let apiOrder = new api_order()
  export default {
    name:"orderstate7",
    data() {
      return {
        tableData:[], // 表格数据
        goodslist:[], // 商品数据
        expresslist:[], // 物流数据
        logisticsinfo:[], // 物流信息
        logisticsdatass:[], // 物流的详细信息
        goods_price:'', // 订单金额
        freight:'', // 总配送费
        price:'', // 总价
      }
    },
    // 页面预加载执行
    mounted: function(){
      this.getlist(); // 获取模板列表--tableData
    },
    methods: {
      // 获取列表--tableData
      getlist() {
        this.id = this.$route.query.id; // 获取url中的值
        let param = {
          id: this.id, // 传参id查看数据
        };
        param = utils.filterJson(param);
        let _this = this;
        apiUser.getOrderInfo(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//表格数据
            _this.goodslist = res.data.data.commodity;//商品数据
            _this.expresslist = res.data.data.express;//物流数据
            // for(var i=0;i<_this.goodslist.length;i++){//字符串转数组
            //   if(_this.goodslist[i].specification!=null){//判断specification是否有数据
            //     _this.goodslist[i].specification = JSON.parse(_this.goodslist[i].specification)
            //   }else{//若specification无数据，则直接赋值为空
            //     _this.goodslist[i].specification = " ";
            //   }
            // }
            if (_this.tableData.express!=null){//判断是否有数据
              for(var i=0;i<_this.tableData.express.length;i++){
                if (_this.tableData.express[i].logistics_status == 0){ // --物流状态
                  _this.tableData.express[i].logistics_status = "暂无轨迹信息";
                }else if (_this.tableData.express[i].logistics_status == 1){ // --物流状态
                  _this.tableData.express[i].logistics_status = "待确认";
                }else if (_this.tableData.express[i].logistics_status == 2){ // --物流状态
                  _this.tableData.express[i].logistics_status = "在途中";
                }else if (_this.tableData.express[i].logistics_status == 3) { // --物流状态
                  _this.tableData.express[i].logistics_status = "已送达";
                }else{
                  _this.tableData.express[i].logistics_status = "问题件";
                }

                if (_this.tableData.express[i].mode == 1) {//--配送方式
                  _this.tableData.express[i].mode = "同城快递";
                }else if (_this.tableData.express[i].mode == 2) {//--配送方式
                  _this.tableData.express[i].mode = "物流快递";
                }

              }
            }

            _this.goods_price = res.data.data.goods_price;//订单金额
            _this.freight = res.data.data.freight;//总配送费
            _this.price = res.data.data.price;//商品总价

          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.tableData = res.data.data;//表格数据
          }
        });
      },
      //申请退款按钮
      open(){
        this.$confirm('您是否同意此订单的退款申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 同意退款申请--status=8
          this.id = this.$route.query.id
          let param = {//传参
            id: this.id,
            status: 8,
            remarks:' ',
          };
          param = utils.filterJson(param);
          apiUser.updateOrder(param).then(res => {
            if(res.cscode == "0") {//判断数据是否存在
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({
                    path:'/orderlist'
                  })
                }
              });
            } else {
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          });
        }).catch(() => {

        });
      },
      //获取物流信息--可以根据物流接口调数据
      logistics(simple,code){
        let _this = this;
        let param = {
          // "OrderCode": "",//可为空
          ShipperCode: simple,//simple
          LogisticCode: code//运单号
          // "ShipperCode": "YD",
          // "LogisticCode": "3831265894169"
        };
        apiOrder.logisticsTrack(param).then(res=>{
          _this.logisticsinfo = res.data.data;  //物流信息
          _this.logisticsdatass = res.data.data.Traces;  //物流的详细信息
        })
      },
    },
    filters:{
      // 时间过滤器
      dateFilter:function(date){
        return  utils.formatDates(date)
      }
    },
  }
</script>

<style scoped>
	@import url("../../assets/css/Order.css");
</style>
<style>
  .cell{text-align: center;}
</style>
