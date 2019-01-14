<template>
	<div>
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>订单信息</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'orderlist' }">订单列表</el-breadcrumb-item>
			<el-breadcrumb-item>订单状态-买家已收货（退/换货受理）</el-breadcrumb-item>
		</el-breadcrumb>
    <el-button style="float: right;" type="primary"  size="mini"  icon="el-icon-back" @click="$router.back(-1)">返回</el-button>
    <p class="explanation"><i class="el-icon-document"></i>订单状态-买家已收货（退/换货受理）</p>
		<el-steps :active="3" finish-status="success" simple style="margin-top: 20px">
			<el-step title="1.买家下单"></el-step>
			<el-step title="2.买家付款"></el-step>
			<el-step title="3.发货"></el-step>
			<el-step title="4.买家确认收货"></el-step>
		</el-steps>
		<div class="ordertime">
			<div class="timeinfo">
				<b>下单时间：</b><br />
				<span>2018-08-07 09:23</span>
			</div>
			<div class="timeinfo">
				<b>付款时间：</b><br />
				<span>2018-08-07 09:33</span>
			</div>
			<div class="timeinfo">
				<b>发货时间：</b><br />
				<span>2018-08-07 09:43</span>
			</div>
		</div>
		<div class="orderstate1">
			<p>当前订单状态：卖家已发货，买家收货过程中</p>
			<li>申请退/换货后，用户端用户订单状态改变为退/换货受理</li>
			<li>申请退/换货后，客服核查无误后在退/换货管理中操作同意申请，订单退款完成</li>
			<li>如果没有和用户达成一致，请及时取消退/换货申请，并将交易资金临时冻结</li>
			<li>取消退/换货申请后，用户端订单状态还原在当前订单状态</li>
			<el-button style="margin-top: 10px;" type="primary">同意退/换货申请</el-button>
			<el-button style="margin-top: 10px;" >取消退/换货申请</el-button>
		</div>
		<div class="orderinfo1">
			<p>买家信息</p>
			<b>用户昵称：</b><span>尊王(Mikoto)</span><br />
			<b>支付方式：</b><span>微信支付(20180807093401)</span><br />
			<b>收货地址：</b><span>陈小姐，18270246040，广东省 深圳市 福田区 华强北街道 华强北路1019号华强广场酒店</span>

			<p>物流信息</p>
			<el-table :data="tableData1" border style="width: 100%">
				<el-table-column prop="goodsnum" label="包裹">
				</el-table-column>
				<el-table-column prop="way" label="配送方式">
				</el-table-column>
				<el-table-column prop="name" label="物流公司名称">
				</el-table-column>
				<el-table-column prop="state" label="物流状态">
				</el-table-column>
				<el-table-column prop="ordernum" label="运单号">
				</el-table-column>
				<el-table-column prop="gotime" label="发货时间">
				</el-table-column>
				<el-table-column prop="operate" label="操作">
				</el-table-column>
			</el-table>
			<el-tabs type="border-card">
				<el-tab-pane><span slot="label"><i class="el-icon-date"></i> 物流动态</span>
					<div class="track-rcol">
						<div class="track-list">
							<ul>
								<li>
									<i class="node-icon"></i>
									<span class="time">2018-09-07 10:07:15</span>
									<span class="txt">到达【云梦】</span>
								</li>
								<li>
									<i class="node-icon"></i>
									<span class="time">2018-09-07 15:07:15</span>
									<span class="txt">离开【云梦邮区中心局邮件处理中心】，下一站【金陵台】</span>
								</li>
								<li>
									<i class="node-icon"></i>
									<span class="time">2018-09-07 18:07:15</span>
									<span class="txt">到达【金陵台】，下一站【瑶妹投递】</span>
								</li>
								<li>
									<i class="node-icon"></i>
									<span class="time">2018-09-07 20:07:15</span>
									<span class="txt">【瑶妹投递部】正在投递 电话：15738858865</span>
								</li>
								<li>
									<i class="node-icon"></i>
									<span class="time">2018-09-07 20:27:15</span>
									<span class="txt">【瑶妹投递部】金陵配送员【大小姐】已出发，联系电话【15738858865】，感谢您的耐心等待</span>
								</li>
								<li class="first">
									<i class="node-icon"></i>
									<span class="time">2018-09-07 20:47:15</span>
									<span class="txt">【瑶妹投递部】已妥投，投递员：金陵，签收人：江厌离 本人收！</span>
								</li>
							</ul>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>

			<p>订单信息</p>
			<b>订单编号：</b><span>2345720005765350</span>
			<b>下单时间：</b><span>2018-08-07 09:44</span>
			<b>等待买家付款</b>
			<el-table :data="tableData2" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
				<el-table-column prop="goodsnum" label="包裹" width="50">
				</el-table-column>
				<el-table-column label="商品" show-overflow-tooltip width="300">
					<template slot-scope="scope">
						<img :src="scope.row.goodsimg" style="width: 50px;height: 50px"> {{ scope.row.goods }}
					</template>
				</el-table-column>
				<el-table-column label="单价(元)*数量">
					<template slot-scope="scope">
						<span>{{ scope.row.money1 }}</span>*{{ scope.row.num }}
					</template>
				</el-table-column>
				<el-table-column label="商品总价(元)">
					<template slot-scope="scope">
						<div>{{ scope.row.money2 }}</div>
						<div>{{ scope.row.way }}</div>
						<div>配送费：{{ scope.row.fee }}</div>
					</template>
				</el-table-column>
				<el-table-column label="优惠(元)">
					<template slot-scope="scope">
						<div>{{ scope.row.money3 }}</div>
						<div>{{ scope.row.discounts }}</div>
					</template>
				</el-table-column>
			</el-table>

			<!--订单总和-->
			<div class="total" align="right">
				<p>订单商品金额：320.00元</p>
				<p>订单总配送费：+20.00元</p>
				<p>订单优惠金额：-30.00元</p>
				<p>实收款： 310.00元</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				input: '',
				tableData1: [{
					goodsnum: '2', //包裹
					way: '同城配送', //配送方式
					name: '深圳运营商', //物流公司名称
					state: '待确认', //物流状态
					ordernum: '9620067407253', //运单号
					gotime: '2018-08-07 09:44', //发货时间
					operate: '查看物流信息', //操作
				}, {
					goodsnum: '1', //包裹
					way: '快递物流', //配送方式
					name: '邮政', //物流公司名称
					state: '已签收', //物流状态
					ordernum: '9620067407253', //运单号
					gotime: '2018-08-07 09:44', //发货时间
					operate: '收起', //操作
				}],
				tableData2: [{
					goodsnum: '1', //包裹
					goods: '正版ACTOYS 狐妖小红娘涂山雅雅手办动漫模型公仔', //商品
					goodsimg: '/static/img/ya.4d6ec6d.jpg', //图片地址
					money1: '560.00', //单价(元)*数量
					num: '1', //商品数量
					money2: '570.00', //商品总价(元)
					way: '同城配送', //配送方式
					fee: '10.00', //配送费用
					money3: '0.00', //优惠(元)
					discounts: '满300减20', //折扣
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
			}
		}
	}
</script>

<style>
	@import url("../../assets/css/Order.css");
</style>
