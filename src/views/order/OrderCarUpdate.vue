<template>
	<div class="orderCarUpdate">
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>运费管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'ordercarriage' }">运费模板</el-breadcrumb-item>
			<el-breadcrumb-item>修改运费模板</el-breadcrumb-item>
		</el-breadcrumb>
		<p class="explanation"><i class="el-icon-setting"></i>修改运费模板：对运费管理配置</p>
    <!--表单-->
    <el-form :model="data" :rules="rules" ref="data" label-width="100px" class="demo-ruleForm">
      <!--模板名称-->
      <el-form-item label="模板名称：" prop="temp_name">
        <el-input v-model="data.temp_name" style="width:300px">{{data.temp_name}}</el-input>
      </el-form-item>
      <!--结算方式-->
      <el-form-item label="结算方式：" prop="bal_style">
        <el-radio-group v-model="data.bal_style">
          <el-radio label="0">普通结算</el-radio>
          <el-radio label="1">模板独立订单结算</el-radio>
        </el-radio-group>
        <p class="explain">使用独立结算模板商品，提交订单时系统自动将所有属于该模板商品归于一个订单结算，不和普通结算商品一起结算。</p>
      </el-form-item>
      <!--是否包邮-->
      <el-form-item label="包邮金额：" prop="spec_money">
        <el-input v-model.number="data.spec_money" style="width:300px">{{data.spec_money}}</el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(data)">保存</el-button>
        <el-button @click="resetForm('data')">取消</el-button>
      </el-form-item>
    </el-form>

	</div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"//export class api_user{}中的总名称
  let apiUser = new api_user();//给api_user另命名
	export default {
	  name:'orderCarUpdate',
		data() {
			return {
          data: {
            temp_name: '', //模板名称
            bal_style: '', //结算方式
            spec_money: '', //设置包邮金额
          },
          rules: {
            temp_name: [{
              required: true,
              message: '请输入模板名称',
              trigger: 'blur'
            },{
              min: 3,
              max: 50,
              message: '长度在 3 到 50 个字符',
              trigger: 'blur'
            }
            ],
            bal_style: [{
              required: true,
              message: '请选择结算方式',
              trigger: 'change'
            }],
            spec_money: [{
              required: true,
              message: '请设置包邮金额',
              trigger: 'change',
            },{
              type: "number",
              message: '请输入数字',
              trigger: 'change',
            }],
          },
			};
		},
    //页面预加载执行
    mounted: function(){
      //获取模板信息
      this.get_temp();
    },
		methods: {
      //获取模板信息
      get_temp(){
        let _this = this;
        let param = {
          send_id: _this.$route.query.id,//当前id
        };
        param = utils.filterJson(param);
        apiUser.getupdateDeliveryTemplate(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.data = res.data;
          }else{
            _this.$alert(res.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
			submitForm(formName) {
        let _this = this;
        let param = JSON.stringify(formName)
        apiUser.updateDeliveryTemplate(param).then(res=>{
          console.log(res)
          if(res.cscode === "0"){
            _this.$alert(res.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                _this.$router.push({
                  path:'/ordercarriage',
                })
              }
            });
          }else{
            _this.$alert(res.msg, '提示信息', {
              confirmButtonText: '确定',
            });
          }
        })
			},
			resetForm(formName) {
        console.log(this.$refs[formName]);
        this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style scoped>
	@import url("../../assets/css/Order.css");
</style>
