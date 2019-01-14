<template>
	<div>
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>物流供应商管理</el-breadcrumb-item>
			<el-breadcrumb-item>合作物流</el-breadcrumb-item>
		</el-breadcrumb>
		<p class="explanation"><i class="el-icon-setting"></i>合作物流：对合作物流管理配置</p>
		<!--输入-->
		<el-input class="search" placeholder="物流名称" v-model="input1">
			<el-button slot="append" icon="el-icon-search">搜索</el-button>
		</el-input>
		<el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">添加物流合作商</el-button>
		<!--弹出内容-->
		<el-dialog title="添加物流合作商" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
			<div class="ordernotes">
				<el-table :data="tableData1" border style="width: 100%">
					<el-table-column prop="name" label="合作物流名称">
					</el-table-column>
					<el-table-column prop="cycle" label="合作周期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="sync" label="同步数据仓储">
					</el-table-column>
					<el-table-column prop="sdk" label="调用物流SDK">
					</el-table-column>
					<el-table-column prop="state" label="合作状态">
					</el-table-column>
					<el-table-column prop="contacts" label="操作员">
						<template slot-scope="scope">
							{{ scope.row.contacts }}<br /> {{ scope.row.tel }}
						</template>
					</el-table-column>
				</el-table>

				<div class="join">
					<b>合作方</b>
					<p>公司地址：</p>
					<p>联系人：</p>
					<p class="way">联系方式：<span> TEL：13800138000</span><span>010-3588 6820</span><span>E-mail ：zhangzc@163.com</span></p>
					<p>合作协议/合同：
						<el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">每次可以上传10份文档，每个文档小于20M。 支持以下格式的文档上传： doc(.docx)、.ppt(.pptx)、.xls(.xlsx)、.pot、.pps、.vsd、.rtf、.wps、.et、.dps、.pdf
							</div>
						</el-upload>
					</p>
				</div>

				<div class="record">
					<b>沟通记录</b>
					<div class="record1">
						<b class="con">合作协议已沟通，寄到顺丰速运北京xxxx公司，等待盖章邮回</b>
						<span>商务01</span>
						<span>2017-03-29 15:30:48</span>
					</div>
					<div class="record1">
						<b class="con">合作协议已沟通，待确认</b>
						<span>商务01</span>
						<span>2017-03-29 15:30:48</span>
					</div>
					<p>添加新记录：
						<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="textarea">
						</el-input>
					</p>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">修 改</el-button>
			    <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
  			</span>
		</el-dialog>

		<!--运费模板1-->
		<div class="model">
			<div class="model1">
				<div style="float: right;">
					最后编辑时间：2016-04-16 23:56
					<el-button type="text">修改</el-button> |
					<el-button type="text">删除</el-button>
				</div>
			</div>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="way" label="配送方式" width="140">
				</el-table-column>
				<el-table-column prop="place" label="配送地区" show-overflow-tooltip width="350">
				</el-table-column>
				<el-table-column prop="join" label="合作物流">
				</el-table-column>
				<el-table-column prop="contacts" label="商务联系人">
					<template slot-scope="scope">
						{{ scope.row.contacts }}
					</template>
				</el-table-column>
				<el-table-column label="是否启用" width="180">
					<template slot-scope="scope">
						<el-button type="text" @click="handleEdit(scope.$index, scope.row)">是</el-button>
						<el-button type="text" @click="handleDelete(scope.$index, scope.row)">否</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				ordernum: '20180807104101', //订单编号
				oktime: '2018-08-07 10:41:35', //成交时间
				dialogVisible: false,
				tableData: [{
					way: '快递物流', //配送方式
					place: '金陵台,云梦,不夜城,姑苏', //配送地区
					join: '顺丰', //合作物流
					contacts: '魏婴', //商务联系人
					tel: '15738858865', //联系人电话
				}, {
					way: '快递物流', //配送方式
					place: '大陆、港澳台、国际', //配送地区
					join: '顺丰', //合作物流
					contacts: '魏婴', //商务联系人
					tel: '15738858865', //联系人电话
				}, {
					way: '快递物流', //配送方式
					place: '全国收寄范围内', //配送地区
					join: '顺丰', //合作物流
					contacts: '魏婴', //商务联系人
					tel: '15738858865', //联系人电话
				}],
				tableData1: [{
					name: '顺丰速运', //合作物流名称
					cycle: '3年', //合作周期
					sync: '已同步', //同步数据仓储
					sdk: ' SF800138000',
					state: '合作中', //合作状态
					contacts: '魏婴', //商务联系人
					tel: '15738858865', //联系人电话
				}]
			}
		},
		methods: {
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			}
		}
	}
</script>

<style scoped>
	@import url("../../assets/css/Order.css");
</style>
