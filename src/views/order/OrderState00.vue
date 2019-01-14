<template>
	<div>
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>订单信息</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'orderlist' }">订单列表</el-breadcrumb-item>
			<el-breadcrumb-item>订单状态-订单详情</el-breadcrumb-item>
		</el-breadcrumb>
    <el-button style="float: right;" type="primary"  size="mini"  icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
    <p class="explanation"><i class="el-icon-document"></i>订单状态-订单详情</p>
		<div class="orderstate1">
			<div class="one">
				<span style="color: #b065d6;">当前订单（201703290610552）状态：已关闭</span>
				<span>关闭原因：过期没付款，自动关闭</span>
			</div>
			<div class="two">
				<b>会员名：</b><span>Mikoto</span>
				<b>真实姓名：</b><span>周防尊</span>
				<b>联系电话：</b><span>15738858865</span>
			</div>
			<el-button style="margin-top: 10px;" type="primary" @click="dialogVisible = true">备注</el-button>
		</div>
		<el-dialog title="订单备注" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
			<div class="ordernotes">
				<p style="color: red;">订单编号：{{ordernum}} </p>
				<p>成交时间：{{oktime}} </p>
				<p>订单实收款(元)：11.00</p>
				<p>订单状态：
					<el-radio-group v-model="radio1">
						<div class="radio">
							<el-radio :label="1">等待买家付款</el-radio>
							<el-radio :label="2">买家已付款</el-radio>
							<el-radio :label="3">买家已付款(退款)</el-radio>
						</div>
						<div class="radio">
							<el-radio :label="4">等待买家收货</el-radio>
							<el-radio :label="5">买家已收货</el-radio>
							<el-radio :label="6">交易成功</el-radio>
						</div>
						<div class="radio">
							<el-radio :label="7">交易关闭</el-radio>
						</div>
					</el-radio-group>
				</p>
				<p>备忘录：
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
					</el-input>
				</p>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  			</span>
		</el-dialog>
		<!--商品详情-->
		<el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
			<el-table-column label="商品名称" show-overflow-tooltip width="300">
				<template slot-scope="scope">
					{{ scope.row.goods }}<br />
					<span>货号：{{ scope.row.num1 }}  </span><span>颜色：{{ scope.row.color }} </span><span>尺寸：{{ scope.row.size }} </span>
				</template>
			</el-table-column>
			<el-table-column label="商品图片" show-overflow-tooltip width="80">
				<template slot-scope="scope">
					<img :src="scope.row.goodsimg" style="width: 50px;height: 50px">
				</template>
			</el-table-column>
			<el-table-column label="商品单价(元)">
				<template slot-scope="scope">
					<span>{{ scope.row.money }}</span>
				</template>
			</el-table-column>
			<el-table-column label="购买数量">
				<template slot-scope="scope">
					* {{ scope.row.num2 }}
				</template>
			</el-table-column>
			<el-table-column label="发货数量">
				<template slot-scope="scope">
					* {{ scope.row.num3 }}
				</template>
			</el-table-column>
			<el-table-column label="小计">
				<template slot-scope="scope">
					{{ scope.row.num4 }}
				</template>
			</el-table-column>
		</el-table>
		<div class="info">
			<b class="title">运费：</b> 10.00 (快递)
		</div>
		<div class="info">
			<b class="title">优惠券折扣(元)：</b>-0.00
		</div>
		<div class="info">
			<b class="title">涨价或减价(元)：</b><span>0.00</span><span>为负代表折扣，为正代表涨价</span>
		</div>
		<div class="info">
			<b class="title">订单可得积分：</b><span>56</span>
		</div>
		<div class="info1">
			<b class="title">订单实收款(元)：</b><span>570.00</span>
		</div>
		<!--物流-->
		<p class="explanation" style="margin-top: 30px;"><i class="el-icon-document"></i>物流信息</p>
		<div class="info2">
			<b class="title">收货地址：</b> 
			<span>金陵台，九江市，德安县帝豪园三区二单元203室</span>
			<span>江厌离</span>
			<span>15738858864</span>
		</div>
		<div class="info">
			<b class="title">送货上门时间：</b>时间不限
		</div>
		<div class="info">
			<b class="title">配送方式：</b>快递
		</div>
		<div class="info" style="height: 50px;">
			<b class="title">买家留言：</b> 
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
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
				}]
			}
		},
		methods: {
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

<style>
	@import url("../../assets/css/Order.css");
</style>
