<template>
  <div class="aftersale">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">售后</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/sale_list' }">售后列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">售后仅退款</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
      <el-step title="1.买家申请仅退款"></el-step>
      <el-step title="2.卖家处理仅退款"></el-step>
      <el-step title="3.退款完毕"></el-step>
    </el-steps>
    <div class="order_content">
      <div class="left">
        <div class="title_top"><span>退款完毕/用户撤销</span><i class="el-icon-time"></i><em>到账时间/撤销时间2天23时45分</em></div>
        <div class="title_tit">如有需要，请及时联系买家协商相关事宜</div>
        <div class="calcel_status">当前订单状态：买家已付款，等待买家确认收货</div>
        <ul class="resoult">
          <li>如果您同意，将直接退款给买家</li>
          <li>如果您拒绝，买家可以申请客服介入处理</li>
          <li>如果您逾期未处理，系统将自动退款给买家，（也会生成退款单）</li>
        </ul>
      </div>
      <div class="right">
        <p>售后仅退款</p>
        <div class="top">
          <img src="../../../assets/img/bao.jpg"/>
          <div class="tit">
            <p>商品名称</p>
            <p>规格</p>
            <p>数量X3</p>
          </div>
        </div>
        <div class="middle">
          <p>买&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家:<span>王五</span></p>
          <p>订单编号:<span>1366666666666</span></p>
          <p>订单提交:<span>2019-08-09 19：34：34</span></p>
          <p>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价:<span>10*3(数量)</span></p>
          <p>运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费: <span>￥30.00</span></p>
          <p>商品总价:<span>￥30.00</span></p>
        </div>
        <div class="bottom">
          <p>退款金额:<span>￥30.00</span></p>
          <p>收货状态:<span>已收到货物</span></p>
          <p>退款原因:<span>收货信息有误</span></p>
          <p>退款描述:<span>收货信息有误</span></p>
          <ul>
            <li><img src="../../../assets/img/bao.jpg"/></li>
            <li><img src="../../../assets/img/bao.jpg"/></li>
            <li><img src="../../../assets/img/bao.jpg"/></li>
            <li><img src="../../../assets/img/bao.jpg"/></li>
            <li><img src="../../../assets/img/bao.jpg"/></li>
            <li><img src="../../../assets/img/bao.jpg"/></li>
          </ul>
        </div>
        <div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "drawback3",
        data() {
          return {
          }
        },
        methods:{
          handleClose(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
          }
        }
    }
</script>

<style scoped>
  @import url("../../../assets/css/aftersale.css");
</style>
<style>
  .aftersale .order_content .right .bottom ul,.aftersale .order_content .right .bottom ul li{
    margin: 0;padding: 0;
  }
  .aftersale .order_content .right .bottom ul li{list-style: none;width: 33.3%;float: left;height:100px;margin-bottom: 50px}
  .aftersale .order_content .right .bottom ul li img{width: 80%;height: auto;margin: 0 auto;display: block}
</style>
