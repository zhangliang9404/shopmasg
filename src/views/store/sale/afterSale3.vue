<template>
  <div class="aftersale">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">售后</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/sale_list' }">售后列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">订单取消</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
      <el-step title="1.买家申请取消订单"></el-step>
      <el-step title="2.卖家处理申请订单"></el-step>
      <el-step title="3.退款处理准备"></el-step>
    </el-steps>
    <div class="order_content">
      <div class="left">
        <div class="title_top"><span>退款中/退款处理完毕</span><i class="el-icon-time"></i><em>还剩2天23时45分</em></div>
        <ul class="resoult">
          <li>如果您同意，将直接退款给买家</li>
          <li>如果您拒绝，买家可以申请客服介入处理</li>
          <li>如果您逾期未处理，系统将自动退款给买家，（也会生成退款单）</li>
        </ul>
        <div class="list_bottom">
          <div class="cancel_resouce">
            <div  class="cacel_item">
              <img src="../../../assets/img/bao.jpg" />
              <div class="box_tit">
                <p>买家</p>
                <p>发起了退款申请。退款原因：个人原因换货。 退款金额￥60.00</p>
              </div>
              <div>2019/09/09 12:45:45</div>
            </div>
            <div  class="cacel_item">
              <img src="../../../assets/img/bao.jpg" />
              <div class="box_tit">
                <p>卖家</p>
                <p>拒绝原因：vvvvvbvv</p>
              </div>
              <div>2019/09/09 12:45:45</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <p>取消订单信息</p>
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
          <p>取消原因:<span>￥30.00</span></p>
          <p>拒绝原因:<span>信息不实</span></p>
        </div>
        <div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "afterSale3"
    }
</script>

<style scoped>
  @import url("../../../assets/css/aftersale.css");
  .order_content .title_top{border-bottom: 1px solid #f5f7fa;padding-bottom: 50px}
</style>
