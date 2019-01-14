<template>
	<div class="orderstate1">
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>订单信息</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'orderlist' }">订单列表</el-breadcrumb-item>
			<el-breadcrumb-item>订单状态-买家已付款</el-breadcrumb-item>
		</el-breadcrumb>
    <el-button style="float: right;" type="primary"  size="mini"  icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
    <p class="explanation"><i class="el-icon-document"></i>订单状态-买家已付款</p>
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
			<p>当前订单状态：买家已付款，等待卖家发货</p>
			<li>根据商品属性和设置的配送费模板，系统会自动将订单拆分1个或者多个包裹。</li>
			<li>每个包裹的配送方式和商品属性不同，您需要对每个包裹进行单独发货。</li>
			<li>同城配送和同城配送（即时达）包裹系统自动指派给配送员。</li>
			<li>配送方式为快递物流包裹，点击马上发货按钮，弹窗输入物流公司和运单号，确定操作后发货成功。</li>

			<el-button v-if="tableData.thirtytime==1" style="margin-top: 10px;" type="primary" @click="dialogVisible = true">申请退款</el-button>
      <el-button v-else disabled style="margin-top: 10px;" type="primary">申请退款</el-button>
		</div>

    <!--隐藏-->
    <el-dialog title="退款备注" :visible.sync="dialogVisible" width="40%">
      <div class="ordernotes">
        <p>退款钱数：
          <el-input type="input" placeholder="请输入需要退款的钱数" v-model="refund_price">
          </el-input>
        </p>
        <p>退款备注：
          <el-input type="textarea" :rows="4" placeholder="请输入退款备注" v-model="refund_note">
          </el-input>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="open">确 定</el-button>
  			</span>
    </el-dialog>

		<div class="orderinfo1">
			<p>买家信息</p>
			<b>用户昵称：</b><span>{{tableData.nickname}}</span><br />
			<b>支付方式：</b><span>{{tableData.mode_payment}}（{{tableData.prepay_id}}）</span><br />
			<b>收货地址：</b><span>{{tableData.consignee}}，{{tableData.phone}}，{{tableData.receiver_address}}</span>

			<p>物流信息</p>
      <!--拼团商品并且状态为拼团成功--拼团状态: 1拼团中 2拼团成功 3拼团失败-->
      <!--供应商发货-->
      <el-button v-if="tableData.group_status==0" type="success" @click="sendOut()">供应商发货</el-button>
      <el-button v-else-if="tableData.order_source==5&&tableData.group_status==2" type="success" @click="sendOut()">供应商发货</el-button>
      <el-button v-else disabled type="success">供应商发货</el-button>
      <!--供应商发货-->
      <el-dialog title="供应商发货请选择" :visible.sync="outerVisible" center>
        <!--生成发货单-->
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="订单编号：" :label-width="formLabelWidth" v-for="item in ordernum" :key="item.id" prop="region">
            <el-select v-model="form.region" clearable placeholder="请选择订单编号" @change="changeOrderNum(item.status)">
              <el-option :value="item.ordernumber" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--填写运单号-->
        <el-dialog width="30%" title="填写运单号" :visible.sync="innerVisible" center append-to-body>
          <el-form :model="innerform" :rules="rules" ref="innerform">
            <el-form-item label="物流公司：" :label-width="formLabelWidth" prop="simple">
              <el-select v-model="innerform.simple" placeholder="全部发货/部分" @change="changeValue">
                <el-option v-for="idnum in logistics_names" :label="idnum.b" :value="idnum.a" :key="idnum.a"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号：" :label-width="formLabelWidth" prop="code">
              <el-input v-model="innerform.code" auto-complete="off" style="width:218px" ></el-input>
            </el-form-item>
            <el-form-item label="备注：" :label-width="formLabelWidth" prop="goods_list">
              <el-select v-model="innerform.goods_list" multiple collapse-tags placeholder="全部发货/部分">
                <el-option v-for="idnum in goods_lists" :label="idnum.goods_name" :value="idnum.id" :key="idnum.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">取 消</el-button>
            <el-button type="primary" @click="addcode('innerform')">确 定</el-button>
          </div>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <div v-if="statusBtn == 0">
            <el-button @click="addinvoice('form')">生成发货单</el-button>
            <el-button type="primary" disabled>物流信息录入</el-button>
          </div>
          <div v-else>
            <el-button disabled>生成发货单</el-button>
            <el-button type="primary" @click="getExpress('form')">物流信息录入</el-button>
          </div>
        </div>
      </el-dialog>
      <!--自营发货-->
      <el-button v-if="tableData.group_status==0" type="info" @click="Proprietary">自营发货</el-button>
      <el-button v-else-if="tableData.order_source==5&&tableData.group_status==2" type="info" @click="Proprietary">自营发货</el-button>
      <el-button v-else disabled type="info">自营发货</el-button>
      <!--自营发货-->
      <el-dialog width="30%" title="自营发货" :visible.sync="ProprietaryVisible" center>
        <el-form :model="innerform" :rules="rules" ref="innerform">
          <el-form-item label="订单编号：" :label-width="formLabelWidth" v-for="item in ordernum" :key="item.id" prop="region">
            <el-select v-model="innerform.region" clearable placeholder="请选择订单编号" @change="getProprietaryExpress()">
              <el-option :value="item.ordernumber" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物流公司：" :label-width="formLabelWidth" prop="simple">
            <el-select v-model="innerform.simple" placeholder="全部发货/部分" @change="changeValue">
              <el-option v-for="idnum in logistics_names" :label="idnum.b" :value="idnum.a" :key="idnum.a"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth" prop="goods_list">
            <el-select v-model="innerform.goods_list" multiple collapse-tags placeholder="全部发货/部分">
              <el-option v-for="idnum in goods_lists" :label="idnum.goods_name" :value="idnum.id" :key="idnum.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ProprietaryVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProprietaryExpress('innerform')">确 定</el-button>
        </div>
      </el-dialog>
      <!--电子面单-->
      <el-dialog width="30%" class="print" title="自营发货电子面单" :visible.sync="PrintVisible" center>
        <span style="text-align: center;font-size: 20px;">是否打印</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="PrintVisible = false">取 消</el-button>
          <el-button type="primary" @click="printOrder()">确 定</el-button>
        </div>
      </el-dialog>
      <!--物流表格-->
			<el-table :data="expresslist" border style="width: 100%">
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
        <!--<el-table-column prop="id" label="商品序号" width="100">-->
        <!--</el-table-column>-->
        <el-table-column type="index" label="商品序号" width="100">
        </el-table-column>
        <el-table-column label="商品" show-overflow-tooltip >
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
  import {api_user,api_order} from "@/api/api.js" // export class api_user{}中的总名称
  let apiUser = new api_user(); // 给api_user另命名
  let apiOrder = new api_order();
	export default {
    name:"orderstate1",
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
        dialogVisible: false, // 备注框隐藏
        refund_price:'', // 需要退款的钱数
        refund_note:'', // 退款备注
        outerVisible: false, // 外部的表单--订单编号
        innerVisible: false, // 内部的表单--填写物流
        ProprietaryVisible: false, // 自营发货-填写单号
        PrintVisible: false, // 自营发货-打印
        oid:'', // 父编号
        form:{region:'',}, // 选择框//嵌套表单中的内容
        ordernum:[], // 订单编号的遍历
        formLabelWidth:'100px', // 表单标题宽度
        innerform:{
          region:'',
          simple:'', // 物流公司名称
          code:'', // 物流单号
          goods_list:'', // 备注id的遍历
        }, // 内部表单--填写物流
        logistics_names:[], // 物流公司名称数组
        goods_lists:[], // 备注id的遍历
        logistics_name:'', // label值
        rules: { // 规则验证
          // 订单编号
          region: [{ required: true, message: '请选择订单编号', trigger: 'blur' }],
          // 物流公司
          simple: [{ required: true, message: '请选择物流公司', trigger: 'blur' }],
          // 物流单号
          code: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
          // 商品名称
          goods_list: [{ required: true, message: '请选择商品名称', trigger: 'blur' }],
        },
        statusBtn: '', // 改变状态的按钮--发货单或填写是否禁用
        operator: '', // 操作人
        deliveryBtn:'', // 发货按钮
			}
		},
    // 页面预加载执行
    mounted: function(){
      this.getoken(); // 获取token--操作人
      this.getlist(); // 获取模板列表--tableData
    },
		methods: {
      // 获取头像信息
      getoken(){
        let param={
          id:sessionStorage.getItem("token1")
        };
        apiUser.getowndate(param).then(res=>{
          if(res.cscode == "0"){
            this.operator=res.data.data.realname; // 操作人为真实姓名
          }
        })
      },
      // 获取列表--tableData
      getlist() {
        this.id = this.$route.query.id; // 获取url中的值
        let param = {
          id: this.id, // 传参id查看数据
        };
        param = utils.filterJson(param);
        let _this = this;
        apiUser.getOrderInfo(param).then(res => {
          if(res.cscode == "0"){
            _this.tableData = res.data.data; // 表格数据
            _this.goodslist = res.data.data.commodity; // 商品数据
            _this.expresslist = res.data.data.express; // 物流数据
            _this.oid = res.data.data.parent_order; // 父编号

            if (_this.tableData.express!=null){ // 判断是否有数据
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

                if (_this.tableData.express[i].mode == 1) { // --配送方式
                  _this.tableData.express[i].mode = "同城快递";
                }else if (_this.tableData.express[i].mode == 2) { // --配送方式
                  _this.tableData.express[i].mode = "物流快递";
                }
              }
            }
            _this.goods_price = res.data.data.goods_price; // 订单金额
            _this.freight = res.data.data.freight; // 总配送费
            _this.price = res.data.data.price; // 商品总价
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.tableData = res.data.data; // 表格数据
          }
        });
      },
      // 申请退款按钮
      open(){
        this.dialogVisible = false;
          // 申请退款----status=2
        let param = {
          // 传参
          id: this.id,
          status: 7,
          remarks: " ", // 备注信息
          refund_price:this.refund_price, // 需要退款的钱数
          refund_note:this.refund_note, // 退款备注
          request_type:"0",
        };
        param = utils.filterJson(param);
        apiUser.updateOrder(param).then(res => {
          if(res.cscode === "0") { // 判断数据是否存在
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => { this.$router.push({
                path:'/orderstate7',query:{id:this.id}
              }) }
            });
          } else {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      // 自营发货
      Proprietary(){
        let params = {
          ordernumber: this.tableData.ordernumber, // 传参-订单编号
          dispatch_style: 0,
        };
        apiUser.getJudgeButton(params).then(res => {
          if(res.cscode == "0") {
            let param = {
              oid:this.oid, // 订单父编号
            };
            apiUser.sendOut(param).then(res => {
              if(res.cscode == "0") {
                this.ProprietaryVisible = true; // 自营发货弹框显示
                this.ordernum = res.data.data;
              }
            });
          } else {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });

      },
      // 自营发货根据选择的id查询物流和商品
      getProprietaryExpress(){
        if(this.innerform.region!=''){
          let params = {
            order_number: this.innerform.region, // 订单编号
          };
          apiUser.getExpress(params).then(res => {
            if(res.cscode == "0") {
              this.logistics_names = res.data.express; // 物流公司
              this.goods_lists = res.data.goods_list; // 商品列表
            } else {
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          });
        }
      },
      // 自营发货
      addProprietaryExpress(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            let param = {
              order_id:this.id, // 总id
              express:this.innerform.simple, // 编码value
              dispatch_style: '0', // 自营发货发货-0是自营发货 1是供应商发货
              operator:this.operator,//操作人
            };
            apiUser.addExpress(param).then(res => {
              if(res.cscode == "0") { // 判断数据是否存在
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getlist();
                    this.ProprietaryVisible = false; // 自营发货弹框显示
                    this.PrintVisible = true; // 打印电子面单
                  }
                });
                let params = {
                  id:this.form.region, // 订单编号
                  operator:this.operator, //操作人
                  dispatch_style: '0', // 供应商发货-0是自营发货 1是供应商发货
                };
                params = utils.filterJson(params);
                apiUser.addInvoice(params).then(res => {

                });
              } else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getlist();
                  }
                });
              }
            });
          } else {
            return false;
          }
        });

      },
      // 自营点击打印按钮
      printOrder:function(){
          window.location.href="https://api.zhisoufangdichan.com/api/v1/logistics/printOrder?order_arr="+this.tableData.ordernumber
      },
      // 供应商发货
      sendOut(){
        let params = {
          ordernumber: this.tableData.ordernumber, // 传参-订单编号
          dispatch_style: 1,
        };
        apiUser.getJudgeButton(params).then(res => {
          if(res.cscode == "0") { // 判断数据是否存在
            let param = {
              oid:this.oid, // 订单父编号
            };
            apiUser.sendOut(param).then(res => {
              if(res.cscode == "0") {
                this.outerVisible = true; // 马上发货弹框显示
                this.ordernum = res.data.data;
              }
            });
          } else {
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      } ,
      // 生成发货单--，操作人为账号登录者
      addinvoice(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            let param = {
              id:this.form.region, // 订单编号
              operator:this.operator, // 操作人
              dispatch_style: '1', // 供应商发货-0是自营发货 1是供应商发货
            };
            param = utils.filterJson(param);
            apiUser.addInvoice(param).then(res => {
              if(res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                });
                this.outerVisible = false; // 点击弹出框消失--这行应该在res.cscode === "0"的时候，弹出提示信息，确定之后执行
                this.getlist(); // 重新调用一次马上发货刷新数据
                this.resetForm(form);
              } else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      //发货单的清空
      resetForm(form) {
        this.$refs[form].resetFields();
      },
      //弹出物流信息录入
      getExpress(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            let param = {
              order_number:this.form.region,//订单编号
            };
            apiUser.getExpress(param).then(res => {
              if(res.cscode == "0") {//判断数据是否存在
                this.innerVisible = true;//填写运单号的弹窗展开
                this.logistics_names = res.data.express;//物流公司
                this.goods_lists = res.data.goods_list;//商品列表

              } else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      //选择填写马上发货运单号的按钮
      changeOrderNum(val) {
        this.statusBtn = val;
      },
      //选择填写订单号按钮的事件。
      changeValue(val) {
        let obj = {};
        obj = this.logistics_names.find((idnum)=>{//这里的userList就是上面遍历的数据源
          return idnum.a == val;//筛选出匹配数据
        });
        console.log(obj.b);//这边的name就是对应label的
        this.logistics_name = obj.b;//logistics_name赋值为label值
      },
      //填写运单号
      addcode(innerform){
        this.$refs[innerform].validate((valid) => {
          if (valid) {
            let param = {
              // order_id:this.$route.query.id,//总id
              // express:this.innerform.simple,//编码value

              customer_order:this.$route.query.id,//总id
              simple:this.innerform.simple,//编码value
              logistics_name:this.logistics_name,//汉字label
              code:this.innerform.code,//运单号
              goods_id:(this.innerform.goods_list).toString(),//订单id-数组转字符串
            };
            console.log(param);
            apiUser.addExpressSupplier(param).then(res => {
              if(res.cscode == "0") {//判断数据是否存在
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path:"/orderstate3",
                      query:{
                        id:this.$route.query.id,
                      }
                    })
                  }
                });
                this.innerVisible = false;//内部填写运单号关闭
                this.outerVisible = false;//外部选择关闭--在成功操作之后执行
                this.getlist();
                this.resetForms(innerform);
                // this.resetForm(form);
              } else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.innerVisible = false;//内部填写运单号关闭
                    this.outerVisible = false;//外部选择关闭--在成功操作之后执行
                    this.getlist();
                    this.resetForms(innerform);
                  }
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      // 填写运单号的清空
      resetForms(innerform) {
        this.$refs[innerform].resetFields();
      },
      // 获取物流信息--可以根据物流接口调数据
      logistics(simple,code){
        let _this = this;
        let param = {
          // "OrderCode": "", // 可为空
          ShipperCode: simple, // simple
          LogisticCode: code, // 运单号
        };
        console.log(param);
        apiOrder.logisticsTrack(param).then(res=>{
          console.log(res);
          _this.logisticsinfo = res.data.data;  // 物流信息
          _this.logisticsdatass = res.data.data.Traces;  // 物流的详细信息
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
  .el-select-dropdown__item{width: 216px}
  .print .el-dialog--center .el-dialog__body {text-align: center}
</style>
