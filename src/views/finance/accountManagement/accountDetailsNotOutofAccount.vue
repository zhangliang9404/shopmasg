<template>
  <div class="accountDetailsNotOutofAccount">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">财务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/accountList' }">对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>对账详情未出账</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-refresh" @click="$router.back(-1)">返回</el-button>
    </div>
    <div class="btn_box">
      <ul>
        <li><span>对账信息</span></li>
      </ul>
    </div>
    <div class="content_box">
      <ul>
        <li>
          <p><img src="../../../assets/img/icon_biaoqian_m.png" alt="">订单信息</p>
          <table class="mailTable" >
            <tr>
              <td class="column">商品名称/规格/数量</td>
              <td>{{datas.detail}}</td>
            </tr>
            <tr>
              <td class="column">订单编号</td>
              <td>{{datas.ordernumber}}</td>
            </tr>
            <tr>
              <td class="column">订单金额</td>
              <td>￥{{datas.price}}</td>
            </tr>
            <tr>
              <td class="column">支付方式</td>
              <td>{{datas.mode_payment==1 ? '微信' :'其他'}}</td>
            </tr>
            <tr>
              <td class="column">支付/退款时间</td>
              <td>{{datas.paytime ? chuan(datas.paytime): '暂无'}}</td>
            </tr>
            <tr>
              <td class="column">订单状态</td>
              <td>{{datas.status}}</td>
            </tr>
          </table>

        </li>
        <li>
          <p><img src="../../../assets/img/icon_biaoqian_m.png" alt="">对账信息</p>
          <table class="mailTable" >
            <tr>
              <td class="column">对账状态</td>
              <td>{{datas.finance_status}}</td>
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
        name: "accountDetailsNotOutofAccount",
      data(){
          return{
            datas:{}
          }
      },
      mounted(){
        this.getdetail()
      },
      methods:{
        getdetail:function () {
          let _this = this
          let param = {
            id:_this.$route.query.id
          }
          apifinance.viewTheDetails(param).then(res=>{
            console.log(res)
            if(res.cscode=="0"){
              if(res.data.data.finance_status=="4"){
                res.data.data.finance_status ="未对账"
              }
              if(res.data.data.status=="0"){
                res.data.data.status ="等待买家付款"
              }
              if(res.data.data.status=="1"){
                res.data.data.status ="买家已付款"
              }
              if(res.data.data.status=="2"){
                res.data.data.status ="取消订单"
              }
              if(res.data.data.status=="3"){
                res.data.data.status ="等待买家收货"
              }
              if(res.data.data.status=="4"){
                res.data.data.status ="买家已经收货"
              }
              if(res.data.data.status=="5"){
                res.data.data.status ="交易成功"
              }
              if(res.data.data.status=="6"){
                res.data.data.status ="交易关闭"
              }
              if(res.data.data.status=="7"){
                res.data.data.status ="退款受理"
              }
              if(res.data.data.status=="8"){
                res.data.data.status ="退款成功"
              }
              if(res.data.data.status=="9"){
                res.data.data.status ="退货中"
              }
              if(res.data.data.status=="10"){
                res.data.data.status ="退款被拒绝"
              }
              if(res.data.data.status=="11"){
                res.data.data.status ="团购库存不足"
              }
              if(res.data.data.status=="12"){
                res.data.data.status ="已评价"
              }
              _this.datas = res.data.data
            }
            var str=''
            if(_this.datas.name){
              str+='商品名称:'+_this.datas.name+';'
            }
            if(_this.datas.sku_font!=null){
              str+='商品规格:'+_this.datas.sku_font+';'
            }
            if(_this.datas.goods_num){
              str+='商品数量:'+_this.datas.goods_num+';'
            }
            _this.datas.detail=str

          })
        },
        //时间处理
        chuan(times){
          var date = new Date(times * 1000);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = (date.getDate()<10 ? '0'+date.getDate() : date.getDate())+' ';
          var h = ' '+(date.getHours()<10 ? '0'+date.getHours() : date.getHours())+ ':';
          var m = (date.getMinutes()<10 ? '0' +date.getMinutes() :date.getMinutes()) +':';
          var s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
          return Y+M+D+h+m+s
        },
      }
    }
</script>

<style scoped>
  ul li {
    padding:0;
    margin:0;
    list-style:none;
  }
  /*头部样式*/
  .header{
    width: 100%;
    border-bottom: 1px solid #ccc;
    line-height: 2.5rem;

  }
  .el-breadcrumb{
    display: inline-block;
  }
  .header .el-button{
    float: right;
  }
  /*按钮盒子样式*/
  .btn_box{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #ccc;
  }
  .btn_box ul li{

    float: left;

  }
  .btn_box ul li:nth-child(2){
    float: right;
    margin-right: 1rem;
  }
  /*内容开始*/
  .content_box ul li  p{
    width: 100%;
    box-sizing: border-box;
  }
  .mailTable{
    width: 100%;
    text-align: center;
    border-collapse:collapse;
    border-spacing:0px;
  }
  .mailTable tr {
    width: 100%;

    height: 40px;
  }
  .mailTable tr td{
    border: 1px solid #ccc;
    box-sizing: inherit;

  }
  .mailTable tr .column{
    width: 40%;
    background-color: #C6E1FD;
  }
</style>
