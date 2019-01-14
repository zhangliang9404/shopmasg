<template>
  <div class="wechatReconciliationDetails">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">财务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/WeChatStatement' }">对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>微信对账详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="btn_box">
      <ul>
        <li><span>微信对账详情</span></li>
      </ul>
    </div>
    <div class="content_box">
      <ul>
        <li>

          <table class="mailTable" >
            <!--<tr>
              <td class="column">商户号</td>
              <td>{{tabledetail.mchid}}</td>
            </tr>-->
            <tr>
              <td class="column">商品名称</td>
              <td>{{tabledetail.goods_name}}</td>
            </tr>
            <tr>
              <td class="column">订单编号</td>
              <td>{{tabledetail.ord_id}}</td>
            </tr>
            <tr>
              <td class="column">订单金额</td>
              <td>¥{{tabledetail.ord_price}}</td>
            </tr>
            <tr>
              <td class="column">支付方式</td>
              <td>{{getzhifu_status(tabledetail.pay_model)}}</td>
            </tr>
            <tr>
              <td class="column">交易时间</td>
              <td>{{chuan(tabledetail.pay_time)}} </td>
            </tr>
            <tr>
              <td class="column">交易状态</td>

              <td>{{tabledetail.pay_status}}</td>

            </tr>
            <tr>
              <td class="column">用户标识</td>
              <td>  {{tabledetail.user_tag}} </td>
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
        name: "wechatReconciliationDetails",
        data(){
            return{
               tabledetail:{
                 mchid:'',
                 c_mchid:'',
                 name:'',
                 order_number:'',
                 price:'',
                 mode_payment:'',
                 paytime:'',
                 status:'',
               }



            }
        },
      methods:{
        getdetail(){
          var _this=this
          var id=this.$route.query.id
          console.log(id)
          let param = {
            id:id
          }
          param = utils.filterJson(param);
          apifinance.getAcountListDetail(param).then(res =>{
            console.log(res)
            _this.tabledetail=res.data.data
         /*   _this.tabledetail={
              mchid:'',
              c_mchid:'',
              name:detail.name,
              order_number:detail.ordernumber,
              price:detail.price,
              mode_payment:detail.mode_payment,
              paytime:detail.paytime,
              status:detail.status,
            }*/

          })
        },
        getzhifu_status(datas){
          if(datas==1){
            return '微信'
          }
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
      },
      mounted(){
          this.getdetail()
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
    width: 20%;
    background-color: #C6E1FD;
  }
</style>
