<template>
  <div class="aftersale">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">售后</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/sale_list' }">售后列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">售后换货</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
      <el-step title="1.买家申请换货"></el-step>
      <el-step title="2.买家退货"></el-step>
      <el-step title="3.换货处理完毕"></el-step>
    </el-steps>
    <div class="order_content">
      <div class="left">
        <div class="title_top"><span>换货中/换货完毕</span><i class="el-icon-time"></i><em>换货结束时间2019/09/08 14:45 （10天）</em></div>
        <div class="title_tit">请及时联系买家协商换货事宜</div>

        <div style="height: 100px;border-bottom: 1px solid #f5f7fa;margin-top:30px">
          <div class="calcel_status">当前订单状态：买家已付款，等待确认收货</div>
        </div>
        <div class="list_bottom">
          <div class="cancel_resouce">
            <div  class="cacel_item">
              <img src="../../../assets/img/bao.jpg" />
              <div class="box_tit">
                <p>卖家</p>
                <p>发起了换货退款申请，等待买家确认收货。原因：个人原因换货。</p>
              </div>
              <div>2019/09/09 12:45:45</div>
            </div>
            <div  class="cacel_item">
              <img src="../../../assets/img/bao.jpg" />
              <div class="box_tit">
                <p>买家</p>
                <p>拒绝申请原因</p>
              </div>
              <div>2019/09/09 12:45:45</div>
            </div>
            <div  class="cacel_item">
              <img src="../../../assets/img/bao.jpg" />
              <div class="box_tit">
                <p>卖家</p>
                <p>发起了换货退款申请2，等待买家确认收货。原因：个人原因换货。</p>
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
          <p>申请数量:<span>￥10*2</span></p>
          <p>换货原因:<span>个人原因换货</span></p>
          <p>问题描述:<span>收货信息有误</span></p>
          <p>换货说明:<span>收货信息有误</span></p>
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
    <!--//退款单-->
    <el-dialog title="订单备注" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <div class="ordernotes">
        <p style="color: red;">订单编号：{{ordernum}} </p>
        <p>申请时间：{{oktime}} </p>
        <p>订单实收款(元)：{{aaa}}元</p>
        <p>退款金额（元）：{{bbb}}元</p>
        <span>订单状态：
					<el-radio-group v-model="radio1">
						<div class="radio">
							<el-radio :label="1">已处理</el-radio>
							<el-radio :label="2">待处理</el-radio>
							<el-radio :label="3">已拒绝</el-radio>
						</div>
					</el-radio-group>
				</span>
        <p>退货原因：
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
          </el-input>
        </p>
        <p>管理员：{{admin}}</p>
        <p>备注：{{remark}}</p>
        <hr />
        <p style="color: red;">订单详情：</p>
        <p>成交时间：{{oktime}} </p>
        <p>购买数量：x{{num5}} </p>
        <div style="height: 200px; width: 1000px;">
					<span>
						<img src="../../../assets/img/wifi.jpg" style="height: 150px; width: 150px;" alt="" align="center"/>
							【测试数据切勿真实购买】简约大气质感皮面套脚正装鞋货号：52026-2 颜色：黑色；尺寸：37；
					</span>
        </div>
        <p style="color: red; font-size: 20px;"><i class="el-icon-star-on"></i>退款编号：{{ordernum1}} </p>
      </div>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  			</span>
    </el-dialog>
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
        name: "changeGoods3",
        data() {
          return {
            dialogVisible: false,
            dialogFormVisible: false,
            ordernum: '20180807104101', //订单编号
            oktime: '2018-08-07 10:41:35', //成交时间
            aaa: '123',//订单实收款
            bbb: '123',//退款金额
            radio1: 1,
            textarea: '',
            admin: 'admin',//管理员
            remark: '。。。。。',//备注
            num5: '10', //购买数量
            ordernum1: '201703290610552A', //订单编号
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
<style>
  .aftersale .order_content .left .notice{width: 400px;float: right;margin-right: 20%}
  .aftersale .order_content .right .bottom ul,.aftersale .order_content .right .bottom ul li{
    margin: 0;padding: 0;
  }
  .aftersale .order_content .right .bottom ul li{list-style: none;width: 33.3%;float: left;height:100px;margin-bottom: 50px}
  .aftersale .order_content .right .bottom ul li img{width: 80%;height: auto;margin: 0 auto;display: block}
</style>
