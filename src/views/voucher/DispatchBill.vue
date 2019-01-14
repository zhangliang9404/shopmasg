<template>
  <div class="DispatchBill">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>发货单</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片查询-发货单查询-->
    <el-card class="card-search" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <div class="flex_box">
          <span><i class="el-icon-star-off">&nbsp;&nbsp;发货单管理</i></span>
          <div>
            <button @click="getInvoiceList">查询结果</button>
            <button @click="resetBtn()">重置</button>
          </div>
        </div>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单编号：">
          <el-input v-model="formInline.order_number" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：">
          <el-input v-model="formInline.goods_name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="支付时间：">
          <el-date-picker type="datetimerange" range-separator="-" style="width:75%"
                          start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="timestamp" v-model="changeTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单类型：">
          <el-select v-model="formInline.dispatch_style" clearable placeholder="订单类型">
            <el-option disabled value="">请选择</el-option>
            <el-option label="自营订单" value="0"></el-option>
            <el-option label="供应商订单" value="1"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </el-card>
    <!--按钮选择-->
    <div class="text3">
      <el-button plain @click="toggleSelect(invoiceList)">全选</el-button>
      <el-button type="primary" plain @click="toggleSelection(invoiceList)">反选</el-button>
      <el-button type="warning" plain @click="toggleSelection()">取消选择</el-button>
      <el-button type="success" plain @click="exportData()">导出发货单</el-button>
      <el-button type="info" plain @click="printOrder(multipleSelection)">发货单打印</el-button>
    </div>
    <!--填写运单号-->
    <el-dialog width="30%" title="供应商填写运单号" :visible.sync="innerVisible" center append-to-body>
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
    <!--发货单表格数据-->
    <el-table border ref="multipleTable" :data="invoiceList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="订单编号" >
        <template slot-scope="scope">
          {{ scope.row.order_number }}
          <span v-if="scope.row.dispatch_style == 1" class="sign">供</span>
        </template>
      </el-table-column>
      <el-table-column prop="consignee" label="收货人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payment" label="支付金额(元)" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payment_time" label="支付时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="物流信息" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.logistics_name==null?"无":scope.row.logistics_name}}
        </template>
      </el-table-column>
      <el-table-column label="打印状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.is_print == 2">已打印</span>
          <span v-else>未打印</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作员" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="dialogVisible(scope.row.id)">查看详情</el-button>
          <el-button type="text" @click.native.prevent="deleteRow(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.dispatch_style == 1 && scope.row.logistics_name == null "
                     type="text" style="color: red" @click="getExpress(scope.row.rid,scope.row.order_number)">供应商</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                     :page-sizes="[10, 20, 30, 40,50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
    <!--查看详情-->
    <el-dialog title="订单详情" :visible.sync="dialogVisibles" width="50%" :before-close="handleClose">
      <div class="ordernotes" id="xq">
        <el-tabs v-model="OrderDetail" @tab-click="handleClick" style="width: 100%;">
          <el-tab-pane label="1.订单信息" name="orderInformation">
            <el-row>
              <el-col :span="8"><p>订单编号：{{detailData.ordernumber}}</p></el-col>
              <el-col :span="8"><p>订单类型：{{detailData.types}}</p></el-col>
              <el-col :span="8"><p>订单状态：{{detailData.status}}</p>	</el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>下单时间：{{detailData.creationtime}}</p></el-col>
              <el-col :span="8"><p>支付时间：{{detailData.paytime}}</p></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>支付方式：{{detailData.pay_type}}</p></el-col>
              <el-col :span="8"><p>支付流水：{{detailData.ordernumber}}</p></el-col>
              <el-col :span="8"><p>支付渠道：{{detailData.mode_payment}}</p></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>收货人：{{detailData.consignee}}</p></el-col>
              <el-col :span="8"><p>电话：{{detailData.phone}}</p></el-col>
              <el-col :span="8"><p>地址：{{detailData.add}}</p>	</el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>物流公司：{{detailDataexpress.logistics_name}}</p></el-col>
              <el-col :span="8"><p>物流单号：{{detailDataexpress.code}}</p></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>首次出库时间：{{detailData.firsttime}}</p></el-col>
              <el-col :span="8"><p>更新出库时间：{{detailData.uptime}}</p></el-col>
              <el-col :span="8"></el-col>
            </el-row>
            <el-row>
              <el-col :span="8"><p>发票抬头：{{detailData.invoice_type}}</p></el-col>
              <el-col :span="8"><p>发票内容：{{detailData.invoice_content}}</p></el-col>
              <el-col :span="8"><p>订单备注:</p>{{detailData.remark}}</el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="2.物流记录" name="logisticsRecord">
            <ul>
              <li>
                <p>物流状态</p>
                <small>物流来源：{{detailDataexpress.logistics_name}}</small>
                <span class="num">运单编号：{{detailDataexpress.code}}</span>
              </li>
            </ul>
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
          </el-tab-pane>
        </el-tabs>
        <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
          <el-step title="商品信息"></el-step>
        </el-steps>
        <el-table :data="goodsInfo" border style="width: 100%">
          <el-table-column prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sku_id" label="SKU ID"></el-table-column>
          <el-table-column prop="specification" label="SKU规格" show-overflow-tooltip></el-table-column>
          <el-table-column prop="order_id" label="SKU OUTID"></el-table-column>
          <el-table-column prop="goods_price" label="销售单价"></el-table-column>
          <el-table-column prop="goods_num" label="销售数量"></el-table-column>
          <el-table-column prop="total" label="合计"></el-table-column>
        </el-table>

        <!--订单总和-->
        <div class="total" align="right">
          <p>订单金额：{{detailData.price}}元</p>
          <p>运费：{{detailData.freight}}元</p>
          <p>智搜币抵扣：{{detailData.integral_money}}元</p>
          <p style="color: red; font-size: 24px;">实收款：{{detailData.price}}元</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printContent">打印</el-button>
        <!--若已有物流单号禁止修改地址-->
        <el-button type="info" v-if="detailDataexpress.code == null || detailDataexpress.code == ''" @click="addressUpdate = true">修改</el-button>
        <el-button type="info" v-else disabled @click="addressUpdate = true">修改</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改收货信息" :visible.sync="addressUpdate" width="30%" style="margin-top: 20vh;">
      <el-form ref="addressInfo" :model="addressInfo" label-width="150px">
        <el-form-item label="收货人：">
          <el-input v-model="addressInfo.consignee" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input v-model="addressInfo.phone" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：">
          <el-input v-model="addressInfo.snap_address" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressUpdate = false">取 消</el-button>
    <el-button type="primary" @click="editAddress(detailData.oid)" >确 定</el-button>
  </span>
    </el-dialog>
  </div>


</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_order,api_user} from "@/api/api.js"
  let apiOrder = new api_order();
  let apiUser = new api_user(); // 给api_user另命名
  export default {
    data() {
      return {
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        formInline: { // 输入框，选择器，查询
          order_number: '', // 订单编号
          goods_name: '', // 请输入商品名称
          dispatch_style: '', // 发货方式 - 自营0 供应1
        },
        changeTime:'', // 改变时间
        invoiceList: [], // 发货单数据列表表格
        logisticsinfo:{}, // 物流信息
        logisticsdatass:[], // 查看详情
        innerVisible: false, // 内部的表单--填写物流
        innerform:{
          simple:'', // 物流公司名称
          code:'', // 物流单号
          goods_list:'', // 备注id的遍历
        }, // 内部表单--填写物流
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
        logistics_names:[], // 物流公司名称数组
        goods_lists:[], // 备注id的遍历
        logistics_name:'', // label值
        formLabelWidth:'100px', // 表单标题宽度
        dialogVisibles: false,
        customer_order: '', // 订单id
        OrderDetail: 'orderInformation', // 默认弹框的显示
        detailData:{}, // 订单信息-查看详情
        goodsInfo: [], // 订单信息-列表数据
        detailDataexpress :{}, // 物流数据
        allSelect: false, // 列表全选与否
        multipleSelection: [], // 订单选择数据
        addressUpdate:false, // 修改地址的弹框
        addressInfo: {
          consignee: '', // 收货人姓名
          phone: '', // 电话
          snap_address: '', // 收货地址
        },
      }
    },
    mounted:function(){
      this.getInvoiceList(); // 获取发货单信息
    },
    methods: {
      // 获取发货单信息
      getInvoiceList:function(){
        let _this  = this;
        var start_times = ''; // 开始时间
        var end_times = ''; // 结束时间
        if(_this.changeTime != '' && _this.changeTime != null){  // 时间数据不为空赋值
          start_times = _this.changeTime[0]/1000; // 开始时间
          end_times = _this.changeTime[1]/1000; // 结束时间
        }
        let param = {
          documents_type: 3, // 状态
          page: _this.currentPage, // 当前页码
          limit: _this.limit, // 每页多少条数据
          order_number: _this.formInline.order_number, // 订单编号
          goods_name: _this.formInline.goods_name, // 请输入商品名称
          dispatch_style: _this.formInline.dispatch_style, // 订单方式 - 自营0供应1
          start_time: start_times,
          end_time: end_times,
        };
        param = utils.filterJson(param);
        apiOrder.documentManagement_Receivables(param).then(res=>{
          if(res.cscode == "0"){
            _this.count = res.data.count; // 总数据
            _this.invoiceList = res.data.data; // 发货单数据
          }else {
            _this.count = 0; // 总数据
            _this.invoiceList = []; // 发货单数据
          }
        })
      },
      // 重置按钮
      resetBtn:function(){
        let _this = this;
        _this.formInline.order_number = ''; // 订单编号
        _this.formInline.goods_name = ''; // 请输入商品名称
        _this.changeTime = ''; // 支付时间-时间段
        _this.formInline.dispatch_style = ''; // 订单方式
      },
      //填写运单号
      addcode(innerform){
        this.$refs[innerform].validate((valid) => {
          if (valid) {
            let param = {
              customer_order:this.customer_order,//总id
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
                    this.getInvoiceList(); // 获取发货单信息
                  }
                });
                this.innerVisible = false;//内部填写运单号关闭
              } else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.innerVisible = false;//内部填写运单号关闭
                  }
                });
              }
            });
          } else {
            return false;
          }
        });
      },
      // 弹出物流信息录入
      getExpress(id,order_number){
          this.customer_order = id; // 订单id
          let param = {
            order_number:order_number, // 订单编号
          };
          apiUser.getExpress(param).then(res => {
            if(res.cscode == "0") { // 判断数据是否存在
              this.innerVisible = true; // 填写运单号的弹窗展开
              this.logistics_names = res.data.express; // 物流公司
              this.goods_lists = res.data.goods_list; // 商品列表
            } else {
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          });
      },
      //选择填写订单号按钮的事件。
      changeValue(val) {
        let obj = {};
        obj = this.logistics_names.find((idnum)=>{ // 这里的userList就是上面遍历的数据源
          return idnum.a == val;//筛选出匹配数据
        });
        console.log(obj.b);//这边的name就是对应label的
        this.logistics_name = obj.b;//logistics_name赋值为label值
      },
      // 全选
      toggleSelect:function(rows){
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
          });
          this.allSelect = !this.allSelect
        }
      },
      //反选--取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 点击导出按钮
      exportData:function(){
        let _this = this;
        var start_times = ''; // 开始时间
        var end_times = ''; // 结束时间
        if(_this.changeTime != '' && _this.changeTime != null){  // 时间数据不为空赋值
          start_times = _this.changeTime[0]/1000; // 开始时间
          end_times = _this.changeTime[1]/1000; // 结束时间
        }
        window.location.href="https://api.zhisoufangdichan.com/api/v1/orderexcel/order_excel?start_time="
          +start_times+"&end_time="+end_times+"&order_number="+_this.formInline.order_number
          +"&goods_name="+_this.formInline.goods_name+"&op=documents"
      },
      // 点击打印按钮
      printOrder:function(rows){
        if(rows.length>0){
          let order_arr = [];
          if (rows) {
            rows.forEach(row => {
              order_arr.push(row.order_number)
            })
          }
          window.location.href="https://api.zhisoufangdichan.com/api/v1/logistics/printOrder?order_arr="+order_arr
        }else {
          this.$alert("请选择要打印的单号", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 查看详情
      dialogVisible:function(id){
        let _this = this;
        _this.dialogVisibles = true;
        let param  = {
          id:id
        };
        apiOrder.documentManagement_ViewTheDetails(param).then(res=>{
          if(res.cscode == "0"){
            _this.detailData = res.data.data;
            _this.goodsInfo = res.data.data.goods; // 订单数据-列表
            _this.detailDataexpress = res.data.data.express[0]; // 物流信息--单号等
            _this.addressInfo.consignee = _this.detailData.consignee; // 联系人
            _this.addressInfo.phone = _this.detailData.phone; // 电话
            _this.addressInfo.snap_address = _this.detailData.receiver_address; // 收货地址
          }
        })
      },
      // 点击切换按钮（订单详情与物流信息）
      handleClick(tab, event) {
        let _this = this;
        if(tab.name == "logisticsRecord"){
          let param = {
            // "OrderCode": "", // 可为空
            ShipperCode: _this.detailDataexpress.simple, // simple
            LogisticCode: _this.detailDataexpress.code, // 运单号
          };
          apiOrder.logisticsTrack(param).then(res=>{
            _this.logisticsinfo = res.data.data;  // 物流信息
            _this.logisticsdatass = res.data.data.Traces;  // 物流的详细信息
          })
        }
      },
      // 打印
      printContent(){
        let subOutputRankPrint = document.getElementById('xq');
        let newContent =subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
      },
      // 修改地址
      editAddress:function(id){
        let _this = this;
        let param = {
          order_id:id,
          consignee:_this.addressInfo.consignee, // 收货人姓名
          phone:_this.addressInfo.phone, // 电话
          snap_address:_this.addressInfo.snap_address, // 收货地址
        };
        param = utils.filterJson(param);
        apiOrder.editAddress(param).then(res => {
          if(res.cscode == 0){
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                _this.addressUpdate = false; // 修改地址弹框
                _this.handleClose(); // 关闭订单详情弹框
                _this.getInvoiceList(); // 获取发货单信息
              }
            })
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      // 关闭订单详情弹框
      handleClose(){
        this.dialogVisibles = false;
        this.OrderDetail = 'orderInformation';
      },
      // 删除
      deleteRow:function(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            status:'1',
            documents_id:id
          };
          apiOrder.documentManagement_Receivablesdel(param).then(res=>{
            if(res.cscode=="0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getInvoiceList(); // 获取发货单列表
                }
              })
            }
          })
        }).catch(() => {
          this.$alert("取消删除", '提示信息', {
            confirmButtonText: '确定',
          })
        });
      },
      // 批量删除
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].id)
            }
            let param ={
              status:'2',
              documents_id:ids
            };
            apiOrder.documentManagement_Receivablesdel(param).then(res=> {
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getInvoiceList(); // 获取发货单列表
                  }
                })
              }
            })
          }).catch(() => {
            this.$alert("取消删除", '提示信息', {
              confirmButtonText: '确定',
            })
          })
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 选择列表数据
      handleSelectionChange(val) {
        this.multipleSelection = val; // 列表数据赋值
      },
      // 条数
      handleSizeChange(val) {
        this.limit = val;
        this.getInvoiceList(); // 获取发货单列表
      },
      // 页码
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getInvoiceList(); // 获取发货单列表
      },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Voucher.css");

</style>
