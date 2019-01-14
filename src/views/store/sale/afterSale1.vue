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
      <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
        <el-step title="1.买家申请取消订单"></el-step>
        <el-step title="2.卖家处理申请订单"></el-step>
        <el-step title="3.退款处理准备"></el-step>
      </el-steps>
      <div class="order_content">
        <div class="left">
           <div class="title_top"><span>请处理订单取消申请</span><i class="el-icon-time"></i><em>还剩2天23时45分</em></div>
           <div class="title_tit">如有必要请及时联系买家协商退款事宜</div>
           <div class="calcel_status">当前订单状态：买家已付款，等待卖家发货</div>
           <ul class="resoult">
              <li>如果您同意，将直接退款给买家</li>
              <li>如果您拒绝，买家可以申请客服介入处理</li>
              <li>如果您逾期未处理，系统将自动退款给买家，（也会生成退款单）</li>
           </ul>
          <div style="height: 100px;border-bottom: 1px solid #f5f7fa;margin-top:30px">
            <el-button>同意申请（生成退款单）</el-button>
            <el-button @click="dialogFormVisible = true">拒绝申请（请填写拒绝原因）</el-button>
          </div>
          <div class="list_bottom">
            <div class="cancel_resouce">
              <div  class="cacel_item">
                <img src="../../../assets/img/bao.jpg" />
                <div class="box_tit">
                  <p>买家</p>
                  <p>发起了退款申请。退款原因：个人原因换货。 退款金额￥60.00</p>
                </div>
                <div>2017/08/11/09:00</div>
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
          </div>
          <div>

          </div>
        </div>
      </div>
      <!--//拒绝退款原因-->
      <el-dialog title="退款原因" :visible.sync="dialogFormVisible" style="width: 50%;margin: 0 auto">
        <el-form>
          <el-form-item label="退款原因" style="width: 300px">
            <el-input type="textarea" v-model="result"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "afterSale1",
        data(){
          return{
            dialogFormVisible:false,
            result:''
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
