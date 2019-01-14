<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>单据管理</el-breadcrumb-item>
      <el-breadcrumb-item>退款单</el-breadcrumb-item>
    </el-breadcrumb>
    <hr />

    <div class="text1">
      <span><i class="el-icon-star-off">&nbsp;&nbsp;退款单</i></span>
    </div>
    <div style="margin-top: 15px;">
      <span>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="订单编号：">
            <el-input v-model="formInline.user" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </span>
    </div>

    <div class="text3">
      <el-row>
        <span>
          <!--每页显示数量：-->
          <el-button type="primary" @click="toggleSelect(dataLists)">全选</el-button>
          <el-button type="primary" @click="toggleSelection(dataLists)">反选</el-button>
          <el-button type="primary" @click="toggleSelection()">取消选择</el-button>
          <el-button type="primary" @click="batchDeleting(multipleSelection)">批量删除</el-button>
          <el-button type="primary" @click="exportDatas(multipleSelection)">导出</el-button>
        </span>
      </el-row>
    </div>
    <el-table ref="multipleTable" :data="dataLists" border tooltip-effect="dark" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="订单编号" >
        <template slot-scope="scope">{{ scope.row.order_number }}</template>
      </el-table-column>
      <el-table-column prop="nickname" label="退款人" > </el-table-column>
      <el-table-column prop="payment" label="支付金额(元)" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="refund_time" label="退款时间" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="payment_time" label="支付时间" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="logistics_name" label="物流信息" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="remarks" label="管理员备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operator" label="操作员" show-overflow-tooltip> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="dialogVisible(scope.row.id)">查看详情</el-button>
          <el-button type="text" @click.native.prevent="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <div style="margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count" >
        </el-pagination>
      </div>
    </div>
    <!--查看详情-->
    <el-dialog title="订单详情" :visible.sync="dialogVisibles" width="50%"   :before-close="handleClose">
      <div class="ordernotes" id="xq" >
        <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;">
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
              <el-col :span="8"><p>订单内容:</p></el-col>
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
            <div class="track-list" v-if="detailDataexpress.code!=''">
              <ul v-if="logisticsinfo.State == '0'"> {{logisticsinfo.Reason}}</ul>
              <ul v-else>
                <li v-for="site in logisticsdatass">
                  <i class="node-icon"></i>
                  <span class="time">{{site.AcceptTime}}</span>
                  <span class="txt">{{site.AcceptStation}}</span>
                </li>
              </ul>
            </div>
            <div class="track-list" v-else>
              暂未发货
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
          <el-step title="商品信息"></el-step>
        </el-steps>
        <el-table :data="tableData1" border style="width: 100%">
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
        <el-button type="primary"  @click="printContent">打印</el-button>
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_order} from "@/api/api.js"
  let apiOrder = new api_order()
  export default {
    data() {
      return {
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        formInline: { // 输入框，选择器，查询
          user: '',
        },
        dialogVisibles: false, // 查看详情
        activeName: 'orderInformation',
        detailData:{},
        logisticsinfo:{}, // 物流信息
        logisticsdatass:[],
        tableData1: [],
        dataLists: [], // 收款单数据列表表格
        detailDataexpress :{}, // 物流数据
        allSelect: false, // 列表全选与否
        multipleSelection: [],
      }
    },
    mounted:function(){
      this.receivablesList()
    },
    methods: {
      // 加载进来获取数据
      receivablesList:function(){
        let _this  = this;
        let param = {
          documents_type:'2', // 退款状态
          order_number:_this.formInline.user, // 订单号
          page:_this.currentPage, // 当前页码
          limit:_this.limit, // 每页多少条数据
        };
        apiOrder.documentManagement_Receivables(param).then(res=>{
          if(res.cscode == "0"){
            _this.currentPage = res.data.page;
            _this.limit = res.data.limit;
            _this.count = res.data.count;
            _this.dataLists = res.data.data;
          }else {
            _this.dataLists = [];
          }
        })
      },
      // 全选
      toggleSelect:function(rows){
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect);
          });
          this.allSelect = !this.allSelect
        }
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
                    this.receivablesList()
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
            _this.tableData1 = res.data.data.goods;
            _this.detailDataexpress = res.data.data.express[0];
          }
        })
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
            if(res.cscode == "0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.receivablesList()
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
      // 条数
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.limit = val;
        this.receivablesList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.receivablesList()
      },
      // 反选--取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
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
      // 点击导出按钮
      exportDatas:function(rows){
        let _this = this;
        let ids = [];
        if (rows) {
          rows.forEach(row => {
            ids.push(row.id)
          })
        }
        let search =ids.toString();
        let page = _this.currentPage; // 当前页码
        let limit= _this.limit; // 每页多少条数据
        window.location.href="http://api.zhisoufangdichan.com/api/v1/documnets/inputexcel?documents_type=2&search="+search+"&page="+page+"&limit="+limit
      },
      // 输入框，选择器，查询
      onSubmit() {
        let _this = this;
        if(_this.formInline.user){
          _this.receivablesList();
        }else {
          this.$alert("请输入您要查询的退款单号", '提示信息', {
            confirmButtonText: '确定'
          });
        }
      },
      //合并列表
      objectSpanMethod({
                         row,
                         column,
                         rowIndex,
                         columnIndex
                       }) {
        if(columnIndex == 0) {
          if(rowIndex % 2 == 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleClose() {
        this.dialogVisibles = false;
        this.activeName = 'orderInformation';
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Voucher.css");
</style>
ii
