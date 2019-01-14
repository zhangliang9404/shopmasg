<template>
	<div>
			<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单系统</el-breadcrumb-item>
			<el-breadcrumb-item>退换货(款)</el-breadcrumb-item>
			<el-breadcrumb-item>退款申请单</el-breadcrumb-item>
			</el-breadcrumb>
		<hr />

		<div class="text1">
			<span><i class="el-icon-star-off">&nbsp;&nbsp;退款申请单</i></span>
		</div>
			<div style="margin-top: 15px;">
				<span>
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
					  <el-form-item label="关键词：">
					    <el-input v-model="formInline.user" placeholder="日期、订单编号、手机号等"></el-input>
					  </el-form-item>
					  <el-form-item label="订单状态：">
					    <el-select v-model="formInline.region" placeholder="所有状态">
					      <el-option label="待处理" value="shanghai"></el-option>
					      <el-option label="已处理" value="beijing"></el-option>
					      <el-option label=" 已拒绝" value="shanghai"></el-option>
					    </el-select>
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
						每页显示数量：
						<el-button type="primary">50</el-button>
						<el-button type="primary">100</el-button>
						<el-button type="primary">200</el-button>
					</span>
					
				</el-row> 	
			</div>			
<hr />
		<el-table
	    ref="multipleTable"
	    :data="tableData3"
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
	      <template slot-scope="scope">{{ scope.row.date }}</template>
	    </el-table-column>
	    <el-table-column
	      prop="name"
	      label="会员名"
	      width="200">
	    </el-table-column>
	    <el-table-column
	      prop="address"
	      label="退款金额(元)"
	      width="200"
	      show-overflow-tooltip>
	    </el-table-column>
	    
	    <el-table-column
	      prop="aaa"
	      label="申请退款时间"
	      width="250"
	      show-overflow-tooltip>
	    </el-table-column>
	    
	    <el-table-column
	      prop="bbb"
	      label="退款备注"
	      width="200"
	      show-overflow-tooltip>
	      
	    </el-table-column>
	    
	    <el-table-column
	      prop="ccc"
	      label="处理状态"
	      width="200"
	      show-overflow-tooltip>
	    </el-table-column>
	    
	    <el-table-column label="管理员备注" width="200" show-overflow-tooltip>
			<template slot-scope="scope">
				售后{{scope.row.pictures}}<br />
				<span>{{scope.row.scope}}</span>
			</template>
		</el-table-column>
	
	    
	     <el-table-column
	      label="操作"
	      width="100">
	      <template slot-scope="scope">
        	<el-button type="text" @click="dialogVisible = true">查看详情</el-button>
	      </template>
	    </el-table-column>
	  </el-table>
	  <div style="margin-top: 20px">
	    <el-button @click="toggleSelection()">取消选择</el-button>
	    <el-button >批量删除</el-button>
	    <div style="margin-top: 20px">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[100, 200, 300, 400]"
		      :page-size="100"  
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="400" 
			>
		    </el-pagination>
		</div>
	  </div>
	   
	   <!--//查看详情-->
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
						<img src="../../assets/img/wifi.jpg" style="height: 150px; width: 150px;" alt="" align="center"/>					
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
</div>
	

</template>

<script>
	export default {
    data() {
      return {
      	//关键词搜索框
      	input3: '',
	    input4: '',
	    select: '',
	    //输入框，选择器，查询
	     formInline: {
          user: '',
          region: ''
        },
      	//查看详情
      	input: '',
		ordernum: '20180807104101', //订单编号
		oktime: '2018-08-07 10:41:35', //成交时间
		dialogVisible: false,
		radio1: 1,
		textarea: '',
		tableData: [{
		goods: '正版ACTOYS 狐妖小红娘涂山雅雅手办动漫模型公仔', //商品
		num1: '52026-2', //货号
		color: '蓝色', //颜色
		size: '22cm', //尺寸
		goodsimg: '/static/img/ya.4d6ec6d.jpg', //图片地址
		money: '560.00', //单价(元)
		num2: '1', //购买数量
		num3: '1', //发货数量
		num4: '560.00', //小计		
		}],
		aaa:'123',//订单实收款
		bbb:'123',//退款金额
		admin:'admin',//管理员
		remark:'。。。。。',//备注
      	num5: '10', //购买数量
      	ordernum1: '201703290610552A', //订单编号
//多选
            options: [ {
	          value: '选项2',
	          label: '待处理'
	        }, {
	          value: '选项3',
	          label: '已处理'
	        }, {
	          value: '选项4',
	          label: '已拒绝'
	        }, ],
	        value: '',
	        //表格
	        tableData3: [{
	          date: '201703290610552',
	          name: '王小虎',
	          address: '123.00',
	          aaa:'2017-03-29 15:30:48',
	          bbb : '其他原因',
	          ccc : '已处理',
	          eee:'查看详情',
	          pictures:'01',//管理员备注
	          scope:"2017-03-29 15:31:48"
	        }, {
	          date: '2016-05-02',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-04',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-01',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-08',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-06',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-07',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }],
	        multipleSelection: [],
      	}
    },
        methods: {
        	//条数
	      handleSelectionChange(val) {
	        this.multipleSelection = val;
	      },
	      handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	      },
	      handleCurrentChange(val) {
	        console.log(`当前页: ${val}`);
	      },
        	//输入框，选择器，查询
		onSubmit() {
        console.log('submit!');
      	},
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
	@import url("../../assets/css/Returns.css");
</style>
