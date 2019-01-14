<template>
	<div class="orderstate0">
		<!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'orderlist' }">订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单状态-等待买家付款</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button style="float: right;" type="primary"  size="mini"  icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
		<p class="explanation"><i class="el-icon-document"></i>订单状态-等待买家付款</p>
		<el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
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
		</div>
		<div class="orderstate1">
			<p>当前订单状态：商品已拍下，等待买家付款</p>
			<li>买家还有{{day}}天{{hr}}时{{min}}分{{sec}}秒支付订单，否则系统将自动关闭订单。</li>
			<li>如果商品被恶意拍下，您可以后台取消订单哟~</li>
			<el-button style="margin-top: 10px;" type="primary" @click="open">关闭交易</el-button>
		</div>
		<div class="orderinfo1">
      <p>买家信息</p>
      <b>用户昵称：</b><span>{{tableData.nickname}}</span><br />
      <b>支付方式：</b><span>{{tableData.mode_payment}}（{{tableData.prepay_id}}）</span><br />
      <b>收货地址：</b><span>{{tableData.consignee}}，{{tableData.phone}}，{{tableData.receiver_address}}</span>


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
        <li><b>{{tableData.status}}</b></li>
      </div>
			<el-table :data="goodslist" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="商品序号" width="100">
        </el-table-column>
				<el-table-column label="商品" show-overflow-tooltip >
					<template slot-scope="scope" >
						<img :src="scope.row.img" style="width: 50px;height: 50px;float: left;">
            <li style="list-style: none;vertical-align:top;text-align: left;margin-left: 60px">名称：{{ scope.row.goods_name }}</li>
            <li style="list-style: none;vertical-align:top;text-align: left;margin-left: 60px">规格：{{ scope.row.specification }}</li>
            <!--<span v-for="site in scope.row.specification">{{site.val}} </span>-->
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
	export default {
	  name:"orderstate0",
		data() {
			return {
        tableData:[], // 表格数据
        goodslist:[], // 商品数据
        goods_price:'', // 订单金额
        freight:'', // 总配送费
        price:'', // 总价
        id:'', // 数据的id
        day: 0, // 天
        hr: "00", // 时
        min: "00", // 秒
        sec: "00", // 分
        orderTime:'', // 订单时间
        endTime:'', // 订单结束时间
			}
		},
    // 页面预加载执行
    mounted: function(){
      this.getlist(); // 获取模板列表--tableData
    },
		methods: {
		  // 获取列表--tableData
      getlist() {
        let _this = this;
        _this.id = _this.$route.query.id;//获取url中的值
        let param = {
          id: this.id,// 传参id查看数据
        };
        param = utils.filterJson(param);
        apiUser.getOrderInfo(param).then(res => {
          if(res.cscode == "0"){
            _this.tableData = res.data.data;//表格数据
            _this.goodslist = res.data.data.commodity;//商品数据
            if(_this.tableData.status == 0){
              _this.tableData.status="等待买家付款"
            }else if (_this.tableData.status == 1) {
              _this.tableData.status="买家已付款"
            }else if (_this.tableData.status == 2) {
              _this.tableData.status="取消订单"
            }else if (_this.tableData.status == 3) {
              _this.tableData.status="等待买家收货"
            }else if (_this.tableData.status == 4) {
              _this.tableData.status="买家已经收货"
            }else if (_this.tableData.status == 5) {
              _this.tableData.status="交易成功"
            }else if (_this.tableData.status == 6) {
              _this.tableData.status="交易关闭"
            }else if (_this.tableData.status == 7) {
              _this.tableData.status="退款受理"
            }else if (_this.tableData.status == 8) {
              _this.tableData.status="退款成功"
            }else if (_this.tableData.status == 9) {
              _this.tableData.status="退货中"
            }
            _this.orderTime = res.data.data.creationtime;//订单时间
            let timess  = new Date( _this.orderTime.replace(/-/g,"/")).getTime();//时间转为时间戳
            // let timess  = new Date('2018-09-11 14:40:00').getTime()
            _this.endTime  = timess + 24*60*60*1000;//计算结束时间
            let stime = res.data.data.systime*1000;//系统时间
            _this.countdown(stime);//调用倒计时，将转化过的时间戳传过去进行计算

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
      // 倒计时
      countdown: function (times) {
        const orderti =  times;   //接收的系统时间戳赋值给orderti进行计算
        const end = this.endTime;   //end结束时间是计算的一天后的时间戳
        const now = new Date().getTime();
        const msec = end - now;  //结束时间减去开始时间，订单倒计时的时间戳
        if(msec<0){
          return
        }
        let day = parseInt(msec / 1000 / 60 / 60 / 24);  //天数，时间戳转化为时间
        let hr = parseInt(msec / 1000 / 60 / 60 % 24);    //小时，时间戳转化为时间
        let min = parseInt(msec / 1000 / 60 % 60);
        let sec = parseInt(msec / 1000 % 60);
        this.day = day;
        this.hr = hr > 9 ? hr : '0' + hr;
        this.min = min > 9 ? min :'0' + min;
        this.sec = sec > 9 ? sec : '0' + sec;
        //若时间超过1天，则结束订单
        if(this.day==0 && this.hr== '00'&& this.min=='00'&& this.sec =='00'){
          return
        }
        const that = this;
        setTimeout(function () {
          that.countdown(orderti)
        }, 1000)
      },
      //弹出框
      open(){
        this.$prompt('请输入关闭原因（200字以内）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^([\u4e00-\u9fa5]|[0-9]|[,]|[，]){0,200}$/,
          inputErrorMessage: '最多只能输入200字'
        }).then(({ value }) => {
          // 取消订单--关闭订单
          this.id = this.$route.query.id;
          let param = {
            id: this.id,//传参
            status: 2,
            refund_note: value,//关闭原因
          };
          param = utils.filterJson(param);
          apiUser.updateOrder(param).then(res => {
            //判断数据是否存在
            if(res.cscode == "0") {
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push({
                    path:"/orderstate6",query:{id:this.$route.query.id,}
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
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Order.css");
</style>
