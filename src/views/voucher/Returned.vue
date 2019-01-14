<template>
	<div>
			<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>单据管理</el-breadcrumb-item>
			<el-breadcrumb-item>退货单</el-breadcrumb-item>
			</el-breadcrumb>
		<hr />

		<div class="text1">
			<span><i class="el-icon-star-off">&nbsp;&nbsp;退货单</i></span>
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
<hr />
		<el-table
	    ref="multipleTable"
	    :data="dataLists"
	    tooltip-effect="dark"
	    style="width: 100%"
	    @selection-change="handleSelectionChange">
	    <el-table-column
	      type="selection"
	      width="55">
	    </el-table-column>
	    <el-table-column
	      label="订单编号"
	      width="200">
	      <template slot-scope="scope">{{ scope.row.order_number }}</template>
	    </el-table-column>
	    <el-table-column
	      prop="nickname"
	      label="收货人"
	      width="200">
	    </el-table-column>
	    <el-table-column
	      prop="payment"
	      label="支付金额(元)"
	      width="200"
	      show-overflow-tooltip>
	    </el-table-column>

	    <!--<el-table-column-->
	      <!--prop="aaa"-->
	      <!--label="联系方式"-->
	      <!--width="250"-->
	      <!--show-overflow-tooltip>-->
	    <!--</el-table-column>-->

	    <el-table-column
	      prop="payment_time"
	      label="支付时间"
	      width="200"
	      show-overflow-tooltip>

	    </el-table-column>

	    <el-table-column
	      prop="ccc"
	      label="物流信息"
	      width="200"
	      show-overflow-tooltip>
	    </el-table-column>

	    <el-table-column prop="remarks" label="管理员备注" width="200" show-overflow-tooltip>
		</el-table-column>

		<el-table-column prop="operator" label="操作员" width="200" show-overflow-tooltip>
		</el-table-column>

	     <el-table-column
	      label="操作"
	      width="100">
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
		      :total="count"
			>
		    </el-pagination>
		</div>
	  </div>

	   <!--//查看详情-->
	   <el-dialog title="订单详情" :visible.sync="dialogVisibles" width="50%" :before-close="handleClose">
       <hr />
       <div class="ordernotes" id="xq"  >
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
               <el-col :span="8"></el-col>
             </el-row>
             <el-row>
               <el-col :span="8"><p>支付方式：{{detailData.pay_type}}</p></el-col>
               <el-col :span="8"><p>支付流水：{{detailData.pay_water}}</p></el-col>
               <el-col :span="8"><p>支付渠道：</p></el-col>
             </el-row>
             <el-row>
               <el-col :span="8"><p>收货人：{{detailData.consignee}}</p></el-col>
               <el-col :span="8"><p>电话：{{detailData.phone}}</p></el-col>
               <el-col :span="8"><p>地址：{{detailData.add}}</p>	</el-col>
             </el-row>
             <el-row>
               <el-col :span="8"><p>物流公司：{{detailDataexpress.logistics_name}}</p></el-col>
               <el-col :span="8"><p>物流单号：{{detailDataexpress.code}}</p></el-col>
               <el-col :span="8"><p>订单状态：{{detailData.status}}</p>	</el-col>
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
                 <small>物流来源：{{logisticsinfo.ShipperCode}}</small>
                 <span class="num">运单编号：{{logisticsinfo.LogisticCode}}</span>
                 <b>{{logisticsinfo.Reason}}</b>
               </li>
             </ul>
             <div class="track-list">
               <ul style="padding-top: 0;">
                 <li v-for="logisticsData in logisticsdatass">
                   <i class="node-icon"></i>
                   <span class="time">{{logisticsData.AcceptTime}}</span>
                   <span class="txt">{{logisticsData.AcceptStation}}</span>
                 </li>
               </ul>
             </div>
           </el-tab-pane>
         </el-tabs>
         <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
           <el-step title="商品信息"></el-step>
         </el-steps>
         <el-table :data="tableData1" border style="width: 100%">
           <el-table-column prop="goods_name" label="商品名称">
           </el-table-column>
           <!--<el-table-column prop="" label="SPU ID">-->
           <!--</el-table-column>-->
           <el-table-column prop="sku_id" label="SKU ID">
           </el-table-column>
           <el-table-column prop="goods_attribute" label="SKU规格">
           </el-table-column>
           <el-table-column prop="order_id" label="SKU OUTID">
           </el-table-column>
           <el-table-column prop="goods_price" label="销售单价">
           </el-table-column>
           <el-table-column prop="goods_num" label="销售数量">
           </el-table-column>
           <el-table-column prop="goods_price*goods_num" label="合计">
           </el-table-column>
         </el-table>

         <!--订单总和-->
         <div class="total" align="right">
           <p>订单金额：{{detailData.price}}元</p>
           <!--<p>促销抵扣：320.00元</p>-->
           <!--<p>优惠券：320.00元</p>-->
           <!--<p>健康金：320.00元</p>-->
           <p>运费：{{detailData.freight}}元</p>
           <!--<p>购物卡抵扣运费：+20.00元</p>-->
           <!--<p>购物卡抵扣订单金额：-30.00元</p>-->
           <p style="color: red; font-size: 24px;"><i class="el-icon-star-on"></i>实收款：{{detailData.price}} </p>
         </div>
       </div>
			<span slot="footer" class="dialog-footer">
				<!--<el-button >修改</el-button>-->
           <el-button type="primary" @click="printContent">打印</el-button>
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
        currentPage:1,//当前页码
        limit:10,//每页条数
        count:0,//总条数
	    //输入框，选择器，查询
	     formInline: {
          user: '',
        },
        // 物流信息
        logisticsinfo:{},
        logisticsdatass:[],
      	//查看详情
        dialogVisibles: false,
        activeName: 'orderInformation',
        detailData:{},
	        tableData1: [],
        //收款单数据列表表格
        dataLists: [],
        // 物流数据
        detailDataexpress :{},
        // 列表全选与否
        aallSelect: true,
        multipleSelection: [],
      	}
    },
    mounted:function () {
      // 获取收款单数据列表
      this.receivablesList()
    },
        methods: {
          // 加载进来获取数据
          receivablesList:function(){
            let _this  = this;
            let param = {
              documents_type:'4',//退货单
              order_number:_this.formInline.user,//订单号
              page:_this.currentPage,//当前页码
              limit:_this.limit//每页多少条数据
            }
            apiOrder.documentManagement_Receivables(param).then(res=>{
              console.log(res)
              if(res.cscode == "0"){
                _this.currentPage = res.data.page
                _this.limit = res.data.limit
                _this.count = res.data.count
                _this.dataLists = res.data.data
              }else {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    _this.dataLists = []
                  }
                })
              }
            })
          },
          // 全选
          toggleSelect:function(rows){
            console.log(rows)
            if (rows) {
              rows.forEach(row => {
                console.log(row)
                this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
                console.log(this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect))
              })
              this.allSelect = !this.allSelect
            }
          },
          // 反选
          // reverseSelection:function(rows){
          //   console.log(rows)
          //   if (rows) {
          //     rows.forEach(row => {
          //       console.log(row)
          //       this.$refs.multipleTable.toggleRowSelection(row, !this.aallSelect)
          //       console.log(this.$refs.multipleTable)
          //     })
          //     this.aallSelect = !this.aallSelect
          //   }
          // },
          // 批量删除
          batchDeleting:function(rows){
            console.log(rows)
            if(rows.length>0){
              this.$confirm("确定删除吗", '提示信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let ids = []
                for (var i = 0;i<rows.length;i++){
                  ids.push(rows[i].id)
                }
                console.log(ids)
                let param ={
                  status:'2',
                  documents_id:ids
                }
                apiOrder.documentManagement_Receivablesdel(param).then(res=> {
                  console.log(res)
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
            console.log(tab, event);
            console.log(tab.name)
            if(tab.name == "logisticsRecord"){
              let param = {
                "OrderCode": "",
                "ShipperCode": _this.detailDataexpress.simple,
                "LogisticCode": _this.detailDataexpress.code
              }
              apiOrder.logisticsTrack(param).then(res=>{
                console.log(res)
                _this.logisticsinfo = res
                _this.logisticsdatass = res.Traces
              })
            }
          },
          // 查看详情
          dialogVisible:function(id){
            let _this = this;
            let detailsid = id;
            _this.dialogVisibles = true
            let param  = {
              id:detailsid
            }
            apiOrder.documentManagement_ViewTheDetails(param).then(res=>{
              console.log(res)
              if(res.cscode == "0"){
                _this.detailData = res.data.data
                _this.tableData1 = res.data.data.goods
                _this.detailDataexpress = res.data.data.express[0]
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
              console.log(id)
              let param ={
                status:'1',
                documents_id:id
              }
              apiOrder.documentManagement_Receivablesdel(param).then(res=>{
                console.log(res)
                if(res.cscode=="0"){
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
          //条数
          handleSelectionChange(val) {
            let _this = this
            _this.multipleSelection = val;
            console.log(_this.multipleSelection)
            // this.receivablesList()
          },
          handleSizeChange(val) {
            let _this = this
            console.log(`每页 ${val} 条`);
            _this.limit = val
            this.receivablesList()

          },
          handleCurrentChange(val) {
            let _this = this
            console.log(`当前页: ${val}`);
            _this.currentPage = val
            this.receivablesList()
          },
          //反选--取消选择
          toggleSelection(rows) {
            console.log(rows)
            if (rows) {
              rows.forEach(row => {
                console.log(row)
                this.$refs.multipleTable.toggleRowSelection(row);
              });
            } else {
              this.$refs.multipleTable.clearSelection();
            }
          },
          // 打印
          printContent(){
            let subOutputRankPrint = document.getElementById('xq');
            console.log(subOutputRankPrint.innerHTML);
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
            console.log(rows)
            let _this = this

            let ids = []
            if (rows) {
              rows.forEach(row => {
                ids.push(row.id)
              })
            }
            console.log(ids)
            let search =ids.toString()
            let page = _this.currentPage//当前页码
            let limit= _this.limit//每页多少条数据
            window.location.href="http://api.zhisoufangdichan.com/api/v1/documnets/inputexcel?documents_type=4&search="+search+"&page="+page+"&limit="+limit
          },
          //输入框，选择器，查询
          onSubmit() {
            let _this = this;
            console.log(_this.formInline.user);
            if(_this.formInline.user){
              _this.receivablesList()
            }else {
              this.$alert("请输入订单号", '提示信息', {
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
				if(columnIndex === 0) {
					if(rowIndex % 2 === 0) {
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
	@import url("../../assets/css/Voucher.css");
</style>
