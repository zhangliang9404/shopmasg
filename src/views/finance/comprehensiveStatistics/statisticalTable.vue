<template>
  <div class="statisticalTable">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">财务</el-breadcrumb-item>
        <el-breadcrumb-item>综合统计</el-breadcrumb-item>
        <el-breadcrumb-item>商城综合统计</el-breadcrumb-item>
        <el-breadcrumb-item>统计表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
    </div>
    <div class="btn_box">
      <ul>
        <li><span>综合统计</span></li>
        <li>
          <el-button  @click="exportDatas">导出数据</el-button>
          <el-button @click="getalllist" :class="[alltrue ? 'btnblue' :'']">全部</el-button>
          <el-button @click="searchlist" :class="[thirtrue ? 'btnblue' :'']">最近30天</el-button>
          <el-button  @click="nie_searchlist" :class="[nietrue ? 'btnblue' :'']">最近90天</el-button>
          <el-date-picker v-model="StatisticsTime" type="daterange" align="right"
            unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
            icon="el-icon-date" :picker-options="pickerOptions2" @change="changeTime">
          </el-date-picker>
        </li>
      </ul>
    </div>
    <div class="content_box">
      <ul>
        <!--订单统计-->
        <li>
          <p><img src="../../../assets/img/icon_biaoqian_m.png" alt="">订单统计</p>
          <table class="mailTable" >
            <tr>
              <td class="column">销售总额</td>
              <td>{{alldata.all_sale_money}}</td>
            </tr>
            <tr>
              <td class="column">有效订单总数</td>
              <td>{{alldata.ok_ord_num}}</td>
            </tr>
            <tr>
              <td class="column">有效订单总额</td>
              <td>{{alldata.ok_ord_money}}</td>
            </tr>
            <tr>
              <td class="column">无效订单总数(关闭或取消)</td>
              <td>{{alldata.invalid_ord_num}}</td>
            </tr>
            <tr>
              <td class="column">无效订单总额</td>
              <td>{{alldata.invalid_ord_money}}</td>
            </tr>
            <tr>
              <td class="column">退款总额</td>
              <td>{{alldata.back_over_ord_money}}</td>
            </tr>

          </table>

        </li>
        <!--会员统计-->
        <li>
          <p><img src="../../../assets/img/icon_biaoqian_m.png" alt="">会员统计</p>
          <table class="mailTable" >
            <tr>
              <td class="column">会员总数</td>
              <td>{{alldata.member_num}}</td>
            </tr>
            <tr>
              <td class="column">有订单会员数</td>
              <td>{{alldata.have_ord_mem_num}}</td>
            </tr>
            <tr>
              <td class="column">会员订单总数</td>
              <td>{{alldata.mem_ord_all_num}}</td>
            </tr>
            <tr>
              <td class="column">会员购物总额</td>
              <td>{{alldata.mem_buy_all_money}}</td>
            </tr>
            <tr>
              <td class="column">会员购买率</td>
              <td>{{alldata.buy_rate}}</td>
            </tr>
            <tr>
              <td class="column">每会员订单数</td>
              <td>{{alldata.each_mem_ord_num}}</td>
            </tr>
            <tr>
              <td class="column">每会员购物额</td>
              <td>{{alldata.each_mem_buy_money}}</td>
            </tr>
          </table>
        </li>
        <!--积分统计-->
        <li>
          <p><img src="../../../assets/img/icon_biaoqian_m.png" alt="">积分统计</p>
          <table class="mailTable" >
            <tr>
              <td class="column">平台发放总积分数</td>
              <td>{{alldata.all_integral}}</td>
            </tr>
            <tr>
              <td class="column">平台发放总积分总额（元）</td>
              <td>￥{{alldata.all_integral_money}}</td>
            </tr>
            <tr>
              <td class="column">会员已使用总积分</td>
              <td>{{alldata.all_use_integral}}</td>
            </tr>
            <tr>
              <td class="column">会员已使用积分总额（元）</td>
              <td>￥{{alldata.all_use_integral_money}}</td>
            </tr>
            <tr>
              <td class="column">会员未使用积分数</td>
              <td>{{alldata.not_use_integral}}</td>
            </tr>
            <tr>
              <td class="column">会员未使用积分总额（元）</td>
              <td>￥{{alldata.not_use_integral_money}}</td>
            </tr>
          </table>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import * as utils from "../../../common/utils.js"
  import {api_finance} from "../../../api/api.js"
  let apifinance = new api_finance();
  export default {
    name: "statisticalTable",
    data(){
      return{
        alltrue:true,
        thirtrue:false,
        nietrue:false,
        longtrue:false,
        onetime:false,
        checktime:'',
        t_times:'',
        t_start:'',
        t_end:'',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        StatisticsTime: '', // 统计日期
        alldata:{},
      }
    },
    mounted(){
      this.getall()
    },
    methods:{
      // 刷新
      refresh(){
        location.reload()
      },
      // 切换时间
      changeTime(val){
        this.alltrue = false;
        this.thirtrue = false;
        this.nietrue = false;
        this.onetime = false;
        var _this=this;
        if(val){
          var first_time=Number(String(new Date(val[0]).getTime()).slice(0,10));
          var last_time=Number(String(new Date(val[1]).getTime()).slice(0,10));
          _this.t_start=first_time;
          _this.t_end=last_time;
          let param={
            range_time:{
              start:first_time,
              end:last_time
            }
          };
          _this.getlist(param)
        }
      },
      //初始化
      getall(){
        var _this=this;
        var param={};
        _this.getlist(param)
      },
      //包装
      getlist(param){
        apifinance.getZongHe(param).then(res =>{
          if(res.cscode == 0){
            this.alldata=res.data.data
            if(this.alldata.all_sale_money==0){
              this.alldata.all_sale_money="暂无"
            }else {
              this.alldata.all_sale_money="￥"+this.alldata.all_sale_money
            }

            if(this.alldata.ok_ord_num==0){
              this.alldata.ok_ord_num="暂无"
            }

            if(this.alldata.ok_ord_money==0){
              this.alldata.ok_ord_money="暂无"
            }else {
              this.alldata.ok_ord_money="￥"+this.alldata.ok_ord_money
            }

            if(this.alldata.invalid_ord_num==0){
              this.alldata.invalid_ord_num="暂无"
            }

            if(this.alldata.invalid_ord_money==0){
              this.alldata.invalid_ord_money="暂无"
            }else {
              this.alldata.invalid_ord_money="￥"+this.alldata.invalid_ord_money
            }

            if(this.alldata.over_ord_num==0){
              this.alldata.over_ord_num="暂无"
            }

            if(this.alldata.over_ord_money==0){
              this.alldata.over_ord_money="暂无"
            }else {
              this.alldata.over_ord_money="￥"+this.alldata.over_ord_money
            }

            if(this.alldata.member_num==0){
              this.alldata.member_num="暂无"
            }

            if(this.alldata.have_ord_mem_num==0){
              this.alldata.have_ord_mem_num="暂无"
            }

            if(this.alldata.mem_ord_all_num==0){
              this.alldata.mem_ord_all_num="暂无"
            }

            if(this.alldata.mem_buy_all_money==0){
              this.alldata.mem_buy_all_money="暂无"
            }else {
              this.alldata.mem_buy_all_money="￥"+this.alldata.mem_buy_all_money
            }


            if(this.alldata.buy_rate==0){
              this.alldata.buy_rate="暂无"
            }else {
              this.alldata.buy_rate=this.alldata.buy_rate+"%"
            }

            if(this.alldata.each_mem_ord_num==0){
              this.alldata.each_mem_ord_num="暂无"
            }
            if(this.alldata.back_over_ord_money==0){
              this.alldata.back_over_ord_money='暂无'
            }else {
              this.alldata.back_over_ord_money="￥"+ this.alldata.back_over_ord_money
            }
            if(this.alldata.each_mem_buy_money==0){
              this.alldata.each_mem_buy_money="暂无"
            }else {
              this.alldata.each_mem_buy_money="￥"+this.alldata.each_mem_buy_money
            }
          }
        })
      },
      //全部
      getalllist(){
        this.alltrue=true,
          this.thirtrue=false,
          this.nietrue=false,
          this.onetime=true
        this.StatisticsTime=''; // 统计日期
        this.t_start=''
        this.t_end=''
        console.log(this.t_start)
        console.log(this.t_end)
        this.getall()
      },
      //最近30天
      searchlist(){
        this.alltrue=false,
          this.thirtrue=true,
          this.nietrue=false
        this.onetime=false
        this.StatisticsTime=''; // 统计日期
        this.t_start=''
        this.t_end=''
        var _this=this
        _this.t_times=30
        /*var end = new Date().getTime();
          var start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          start=Number(String(new Date(start).getTime()).slice(0,10))
          end=Number(String(end).slice(0,10))
          _this.t_start=start
          _this.t_end=end*/
        console.log( _this.t_start, _this.t_end)
        var param={
          "time":30
        }
        _this.getlist(param)
      },
      //最近90天
      nie_searchlist(){
        this.alltrue=false,
          this.thirtrue=false,
          this.nietrue=true
        this.onetime=false
        this.StatisticsTime=''; // 统计日期
        this.t_start=''
        this.t_end=''
        var _this=this
        _this.t_times=90
        /*var end = new Date().getTime();
          var start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          start=Number(String(new Date(start).getTime()).slice(0,10))
          end=Number(String(end).slice(0,10))
          _this.t_start=start
          _this.t_end=end*/
        var param={
          "time":90
        }
        _this.getlist(param)
      },

      // 点击导出按钮
      exportDatas:function(){
        var _this=this
        if(_this.onetime){
          window.location.href="http://api.zhisoufangdichan.com/api/v1/finance/finance_all_excel?documents_type=2&"
        }else{
          if(_this.t_start!=''&&_this.t_end!=''){
            let start = _this.t_start;
            let end= _this.t_end;
            window.location.href="http://api.zhisoufangdichan.com/api/v1/finance/finance_all_excel?documents_type=2&start="+start+"&end="+end
          }else {
            window.location.href="http://api.zhisoufangdichan.com/api/v1/finance/finance_all_excel?documents_type=2&time="+_this.t_times
          }
        }
      },
    },
  }
</script>
<style scoped>
  ul li { padding:0; margin:0; list-style:none; }
  /*头部样式*/
  .header{ width: 100%; border-bottom: 1px solid #ccc; line-height: 2.5rem; }
  .el-breadcrumb{ display: inline-block; }
  .header .el-button{ float: right; }
  /*按钮盒子样式*/
  .btn_box{ width: 100%; height: 50px; line-height: 50px; background-color: #ccc; }
  .btn_box ul li{ float: left; }
  .btn_box ul li:nth-child(2){ float: right; margin-right: 12px; }
  /*内容开始*/
  .content_box ul li  p{ width: 100%; box-sizing: border-box; }
  .mailTable{ width: 100%; text-align: center; border-collapse:collapse; border-spacing:0; }
  .mailTable tr { width: 100%; height: 40px; }
  .mailTable tr td{ border: 1px solid #ccc; box-sizing: inherit; }
  .mailTable tr .column{ width: 40%; background-color: #C6E1FD; }
  .btnblue{ background: #409EFF; color: #fff; }
</style>
