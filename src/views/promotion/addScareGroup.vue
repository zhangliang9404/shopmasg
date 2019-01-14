<template>
    <div class="addScareGroup">
      <!--导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">营销</el-breadcrumb-item>
        <el-breadcrumb-item>促销活动</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'scareBuying' }">限时抢购</el-breadcrumb-item>
        <el-breadcrumb-item>添加限时抢购活动</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="explanation"><i class="el-icon-setting"></i>限时抢购活动：管理限时抢购活动</p>

      <!--表单-->
      <el-form :model="form" :rules="rules" ref="data" label-width="120px">
        <!--模板名称-->
        <el-form-item label="商品名称：" prop="form1">
          <el-input v-model="form.form1" placeholder="请输入商品名称" style="width:300px"></el-input>
          <el-select v-model="value" placeholder="请选择商品分类">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码：" prop="form2">
          <el-input v-model="form.form2" placeholder="请输入商品编码" style="width:300px"></el-input>
          <el-button type="primary" >查询</el-button>
        </el-form-item>
        <el-form-item label="限时抢购商品：" prop="form3">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p class="explain">限时抢购商品</p>
        </el-form-item>
        <el-form-item label="开始日期：" prop="form3">
          <el-input v-model="form.form3" placeholder="请输入开始日期" style="width:300px"></el-input>
          <el-select v-model="value" placeholder="0时">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p class="explain">当达到开始日期时，活动会自动变成正在参与活动状态</p>
        </el-form-item>
        <el-form-item label="结束日期：" prop="form4">
          <el-input v-model="form.form4" placeholder="请输入结束日期" style="width:300px"></el-input>
          <el-select v-model="value" placeholder="0时">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p class="explain">当达到结束日期时，活动会结束。</p>
        </el-form-item>
        <el-form-item label="限时抢购价格：" prop="form8">
          <el-input v-model="form.form8" placeholder="请输入限时抢购价格" style="width:300px"></el-input>
          <p class="explain">限时抢购价格，不能为空。</p>
        </el-form-item>
        <el-form-item label="限购数量：" prop="form7">
          <el-input v-model="form.form7" placeholder="请输入限购数量" style="width:300px"></el-input>
          <p class="explain">限时抢购每个人能购买的数量。</p>
        </el-form-item>
        <el-form-item label="活动说明：" prop="form9" style="width: 50%">
          <el-input type="textarea" v-model="form.form9"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(data)">添加</el-button>
          <!--<el-button @click="resetForm('data')">取消</el-button>-->
        </el-form-item>
      </el-form>

    </div>
</template>

<script>
  import index from "../../router";
  import * as utils from "@/common/utils.js"
  import {api_order} from "@/api/api.js"
  let apiOrder = new api_order()
  export default {
    name:"addScareGroup",
    data() {
      return {
          form:{
            form1:'',
            form2:'',
            form3:'',
            form4:'',
            form5:'',
            form6:'',
            form7:'',
            form8:'',
            form9:'',
          },
        temp_name: '', //模板名称
        options: [{
          value: '选项1',
          label: '黄金糕'
        }],
        value: '',
        bal_style: '', //结算方式
        spec_money: '', //设置包邮金额
        rules: {
          temp_name: [{
            required: true,
            message: '请输入模板名称',
            trigger: 'blur'
          },
            {
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
    methods: {
      submitForm(formName) {
        let dats  =JSON.stringify(formName)
        let param =dats
        apiOrder.addnewFreightformwork(param).then(res=>{
          console.log(res)
          if(res.cscode == "0"){
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      //清除表格中的数据
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Promotion.css");
</style>
