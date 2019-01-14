<template>
	<div>
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
			<el-breadcrumb-item>运费管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: 'ordercarriage' }">运费模板</el-breadcrumb-item>
			<el-breadcrumb-item>新增运费模板</el-breadcrumb-item>
		</el-breadcrumb>
		<p class="explanation"><i class="el-icon-setting"></i>新增运费模板：对运费管理配置</p>
		<!--表单-->
		<el-form :model="data" ref="data" label-width="100px" class="demo-ruleForm">
			<!--模板名称-->
			<el-form-item label="模板名称:">
				<el-input v-model="data.temp_name" placeholder="请输入模板名称" style="width:300px"></el-input>
			</el-form-item>
			<!--结算方式-->
			<el-form-item label="结算方式：" >
				<el-radio-group v-model="data.bal_style">
					<el-radio label="0">普通结算</el-radio>
					<el-radio label="1">模板独立订单结算</el-radio>
				</el-radio-group>
				<p class="explain">使用独立结算模板商品，提交订单时系统自动将所有属于该模板商品归于一个订单结算，不和普通结算商品一起结算。</p>
			</el-form-item>
			<!--是否包邮-->
			<el-form-item label="包邮金额：">
        <el-input type="spec_money" v-model.number="data.spec_money" style="width: 20%;"></el-input>
				<!--<el-radio-group v-model="ruleForm.free">-->
					<!--<el-radio label="0">自定义配送费</el-radio>-->
					<!--<el-radio label="1">卖家承担配送费</el-radio>-->
				<!--</el-radio-group>-->
			</el-form-item>
			<!--计价方式-->
			<!--<el-form-item label="计价方式：" prop="valuation">-->
				<!--<el-radio-group v-model="ruleForm.valuation">-->
					<!--<el-radio label="0">按件数</el-radio>-->
					<!--<el-radio label="1">按重量</el-radio>-->
				<!--</el-radio-group>-->
			<!--</el-form-item>-->
			<!--配送方式-->
			<el-form-item label="配送方式：" >
				<p class="explain">除指定区域外，其余地区的配送费采用“默认配送费”（首重默认1KG）。</p>
				<div>同城配送</div>
				<div class="border1">
          <div class="b-title">
						<span>默认运费：<input v-model="data.children[0].def_freight" style="width: 80px;"/> 元，每增加1KG，增加运费
						<input  v-model="data.children[0].def_add_freight"  style="width: 80px;"/> 元</span>
          </div>
					<!--<div class="b-title">-->
						<!--<span>默认运费：<input v-model="ruleForm.sty_temp_res[0].def_freight_num" clearable style="width: 80px;"/>-->
						 <!--件内，<input v-model="ruleForm.sty_temp_res[0].def_freight" clearable style="width: 80px;"/> 元，每增加-->
						<!--<input v-model="ruleForm.sty_temp_res[0].add_num" clearable style="width: 80px;"/> 件，增加运费-->
						<!--<input v-model="ruleForm.sty_temp_res[0].add_freight" clearable style="width: 80px;"/> 元</span>-->
					<!--</div>-->
					<!--<div class="b-border">-->
						<!--<table style="width: 100%;">-->
							<!--<tr>-->
								<!--<th>配送到</th>-->
								<!--<th>首件(件)</th>-->
								<!--<th>首费(元)</th>-->
								<!--<th>续件(件)</th>-->
								<!--<th>续费(元)</th>-->
								<!--<th>操 作</th>-->
							<!--</tr>-->
							<!--<tr v-for="list in ruleForm.sty_temp_res[0].lists ">-->
								<!--<td >-->
									<!--<input v-model="list.send_address" clearable />-->
								<!--</td>-->
								<!--<td>-->
									<!--<input v-model="list.first_num" clearable />-->
								<!--</td>-->
								<!--<td>-->
									<!--<input v-model="list.first_freight" clearable/>-->
								<!--</td>-->
								<!--<td>-->
									<!--<input v-model="list.upd_num" clearable/>-->
								<!--</td>-->
								<!--<td>-->
									<!--<input v-model="list.upd_freight" clearable/>-->
								<!--</td>-->
								<!--<td style="width: 100px;">-->
									<!--<el-button type="text">删除</el-button>-->
								<!--</td>-->
							<!--</tr>-->
						<!--</table>-->
						<!--<span style="margin-right: 20px;"  @click="addData"><el-button type="text">为指定地区区县设置运费</el-button></span>-->
						<!--<span><el-button type="text">批量操作</el-button></span>-->
					<!--</div>-->
				</div>
				<div>快递物流</div>
				<div class="border1">
          <div class="b-title">
							<span>默认运费：<input v-model="data.children[1].def_freight" style="width: 80px;"/> 元，每增加1KG，增加运费
						<input  v-model="data.children[1].def_add_freight" style="width: 80px;"/> 元</span>
          </div>
					<!--<div class="b-title">-->
						<!--<span>默认运费：<input v-model="ruleForm.sty_temp_res[1].def_freight_num" clearable style="width: 80px;"/>-->
						 <!--件内，<input v-model="ruleForm.sty_temp_res[1].def_freight" clearable style="width: 80px;"/> 元，每增加-->
						<!--<input v-model="ruleForm.sty_temp_res[1].add_num" clearable style="width: 80px;"/> 件，增加运费-->
						<!--<input v-model="ruleForm.sty_temp_res[1].add_freight" clearable style="width: 80px;"/> 元</span>-->
					<!--</div>-->
					<!--<div class="b-border">-->
						<!--<table style="width: 100%;">-->
							<!--<tr>-->
								<!--<th>配送到</th>-->
								<!--<th>首件(件)</th>-->
								<!--<th>首费(元)</th>-->
								<!--<th>续件(件)</th>-->
								<!--<th>续费(元)</th>-->
								<!--<th>操 作</th>-->
							<!--</tr>-->
							<!--<tr>-->
                <!--<td>-->
                  <!--<input v-model="ruleForm.sty_temp_res[1].send_address" clearable />-->
                <!--</td>-->
                <!--<td>-->
                  <!--<input v-model="ruleForm.sty_temp_res[1].first_num" clearable />-->
                <!--</td>-->
                <!--<td>-->
                  <!--<input v-model="ruleForm.sty_temp_res[1].first_freight" clearable/>-->
                <!--</td>-->
                <!--<td>-->
                  <!--<input v-model="ruleForm.sty_temp_res[1].upd_num" clearable/>-->
                <!--</td>-->
                <!--<td>-->
                  <!--<input v-model="ruleForm.sty_temp_res[1].upd_freight" clearable/>-->
                <!--</td>-->
								<!--<td style="width: 100px;">-->
									<!--<el-button type="text">保 存</el-button>-->
								<!--</td>-->
							<!--</tr>-->
						<!--</table>-->
						<!--&lt;!&ndash;<span style="margin-right: 20px;"><el-button type="text">为指定地区区县设置运费</el-button></span>&ndash;&gt;-->
						<!--&lt;!&ndash;<span><el-button type="text">批量操作</el-button></span>&ndash;&gt;-->
					<!--</div>-->
				</div>
				<!--<el-checkbox label="2" v-model="ruleForm.sty_temp_res">指定条件包邮</el-checkbox>-->
				<!--<div class="border1">-->
					<!--<div class="b-title">-->
							<!--<span>默认运费：<input v-model="ruleForm.sty_temp_res[2].def_freight_num" clearable style="width: 80px;"/>-->
						 <!--件内，<input v-model="ruleForm.sty_temp_res[2].def_freight" clearable style="width: 80px;"/> 元，每增加-->
						<!--<input v-model="ruleForm.sty_temp_res[2].add_num" clearable style="width: 80px;"/> 件，增加运费-->
						<!--<input v-model="ruleForm.sty_temp_res[2].add_freight" clearable style="width: 80px;"/> 元</span>-->
					<!--</div>-->
					<!--<div class="b-border">-->
						<!--<table style="width: 100%;">-->
							<!--<tr>-->
								<!--<th>选择地区</th>-->
								<!--<th>选择配送方式</th>-->
								<!--<th>设置包邮条件</th>-->
								<!--<th>操 作</th>-->
							<!--</tr>-->
							<!--<tr v-for="item in ruleForm.sty_temp_res[2].lists">-->
								<!--<td>-->
									<!--<input v-model="item.send_address" clearable/>-->
								<!--</td>-->
								<!--<td>-->
									<!--<el-select v-model="item.send_style" placeholder="请选择">-->
										<!--<el-option v-for="items in options" :key="items.value" :label="items.label" :value="items.value">-->
										<!--</el-option>-->
									<!--</el-select>-->
									<!--&lt;!&ndash;<el-input v-model="input8" clearable></el-input>&ndash;&gt;-->
								<!--</td>-->
								<!--<td>-->
                  <!--<el-select v-model="item.free_style" placeholder="请选择">-->
                    <!--<el-option v-for="itemd in free_styles" :key="itemd.label" :label="itemd.value" :value="itemd.label">-->
                    <!--</el-option>-->
                  <!--</el-select>-->
									<!--&lt;!&ndash;<input v-model="ruleForm.sty_temp_res[2].upd_freight" clearable style="width: 20%;"/><span>件,包邮</span>&ndash;&gt;-->
								<!--</td>-->
								<!--<td style="width: 100px;">-->
									<!--<el-button type="text">保 存</el-button>-->
								<!--</td>-->
							<!--</tr>-->
						<!--</table>-->
						<!--<span style="margin-right: 20px;"><el-button type="text">为指定地区区县设置运费</el-button></span>-->
						<!--<span><el-button type="text">批量操作</el-button></span>-->
					<!--</div>-->
				<!--</div>-->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm(data)">保存</el-button>
				<el-button @click="resetForm()">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import index from "../../router";
  import {api_user} from "../../api/api.js"//export class api_user{}中的总名称
  let apiUser = new api_user();//给api_user另命名
  import * as utils from "@/common/utils.js"
  import {api_order} from "@/api/api.js"
  let apiOrder = new api_order()
  export default {
		data() {
			return {
        data: {
          temp_name: '', //模板名称
          bal_style: '', //结算方式
          spec_money: '', //设置包邮金额
          // valuation: '', //计价方式
          children:[
            {
              "city_express":1,                //1同城配送  2为快递配送
              "def_freight":'',                // 默认XX元钱
              "def_add_freight":'',            // 每增加1kg增加XX元钱
            },
            {
              "city_express":2,                //1 同城配送  2为快递配送
              "def_freight":'',                // 默认XX元钱
              "def_add_freight":'',            // 每增加1kg增加XX元钱
            },
          ],

				},

			};
		},
    mounted(){
		  if(this.$route.query.id){
        this.get_temp();
      }
    },
		methods: {
		  //提交运费模板
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
			submitForm(datas) {
			  if(datas.temp_name === ''){
          this.$alert("模板名称不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.bal_style === ''){
          this.$alert("结算方式不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.spec_money === ''){
          this.$alert("包邮金额不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.children[0].def_freight === ''){
          this.$alert("同城默认不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.children[0].def_add_freight === ''){
          this.$alert("同城超出增加运费不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.children[1].def_freight === ''){
          this.$alert("快递默认不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        if(datas.children[1].def_add_freight === ''){
          this.$alert("快递超出增加运费不能为空", '提示信息', {
            confirmButtonText: '确定'
          });
          return
        }
        let param =datas;


        if(this.$route.query.id){
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
        }else {
          apiUser.addnewFreightformwork(param).then(res => {
            console.log(res);
            if(res.cscode === "0"){
              _this.data = res.data;
              debugger
            }else{
              _this.$alert(res.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          });
        }





        apiOrder.addnewFreightformwork(param).then(res=>{
          console.log(res);
          if(res.cscode === "0"){
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({
                  path:'/ordercarriage'
                })
              }
            });
          }
        })
      },
      //取消
      resetForm:function () {
        Object.assign(this.$data, this.$options.data())
      }
		}
	}
</script>

<style scoped>
	@import url("../../assets/css/Order.css");
</style>
