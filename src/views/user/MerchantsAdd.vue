<template>
    <div class="MerchantsAdd">
      <!--头部导航-->
      <div class="header">
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/merchantslist' }">商户列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增商户</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <!--输入的表单-->
      <div class="formContent">
        <el-form :model="merchantsAdd" :rules="rules" ref="merchantsAdd" label-width="150px" class="demo-ruleForm">
          <el-form-item label="手机号码：" prop="manager_phone" class="inputWidth">
            <el-input v-model="merchantsAdd.manager_phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="用户名：" prop="manager_name" class="inputWidth">
            <el-input v-model="merchantsAdd.manager_name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="城市：" prop="street">
            <area-select type='text' :placeholders="placeholders" :level='2' v-model="selected" :data="pcaa"></area-select>
            <el-input v-model="merchantsAdd.street" class="inputWidth1" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="name_number" class="inputWidth">
            <el-input v-model="merchantsAdd.name_number" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="bank" class="inputWidth">
            <el-input v-model="merchantsAdd.bank" placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号：" prop="card_number" class="inputWidth">
            <el-input v-model="merchantsAdd.card_number" placeholder="请输入银行卡号"></el-input>
          </el-form-item>
          <el-form-item label="农户信息：" prop="user_info" class="inputWidth2">
            <el-input type="textarea" :rows="5" v-model="merchantsAdd.user_info" placeholder="请输入农户信息 150字左右"></el-input>
          </el-form-item>
          <el-form-item label="农场信息：" prop="business_info" class="inputWidth2">
            <el-input type="textarea" :rows="5" v-model="merchantsAdd.business_info" placeholder="请输入农场信息 150字左右"></el-input>
          </el-form-item>
          <el-form-item label="账户启用状态：" prop="delivery" >
            <el-switch class="switchBtn" v-model="merchantsAdd.examine_status" active-color="#13ce66" inactive-color="#CBD0D6"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('merchantsAdd')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import { AreaSelect } from "vue-area-linkage";
  import AreaData from "area-data";
  import { pca, pcaa } from "area-data";
  import * as utils from "@/common/utils.js"
  import {business} from "@/api/api.js" // export class api_user{}中的总名称
  let apiBusiness = new business(); // 给api_user另命名
  export default {
    name: "MerchantsAdd",
    data() {
      return {
        pca: pca,  // 三级联动
        pcaa: pcaa, // 三级联动
        placeholders: ["选择省", "选择市", "选择区"], // 三级联动
        selected: [], // 三级联动
        merchantsAdd: {
          manager_name:'', // 用户名
          manager_phone:'', //手机
          street:'', //详细地址
          name_number:'', //身份证号,
          bank:'', //开户行
          card_number:'', //银行卡号
          user_info:'', //农户信息
          business_info:'', //农场信息
          examine_status:false, //账户启用状态
        },
        rules: {
          // 用户名
          manager_name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          // 手机号
          manager_phone: [{
            required: true,
            message: '请填写手机号',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var manager_phone = /^1[3456789]\d{9}$/;
              if (!manager_phone.test(value)) {
                callback(new Error('手机号格式不正确！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          // 详细地址
          street: [{
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }],
          // 身份证号
          name_number: [{
            required: true,
            message: '请填写身份证号',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var name_number = /^\d{15}|\d{}18$/;
              if (!name_number.test(value)) {
                callback(new Error('身份证号格式不正确！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          // 开户行
          bank: [{
            required: true,
            message: '请填写开户行',
            trigger: 'blur'
          }],
          // 银行卡号
          card_number: [{
            required: true,
            message: '请填写银行卡号',
            trigger: 'blur'
          }],
          // 农户信息
          user_info: [{
            required: true,
            message: '请填写农户信息',
            trigger: 'blur'
          },{
            max: 150,
            message: '长度不超过150个字符',
            trigger: 'blur'
          }],
          // 农场信息
          business_info: [{
            required: true,
            message: '请填写农场信息',
            trigger: 'blur'
          },{
            max: 150,
            message: '长度不超过150个字符',
            trigger: 'blur'
          }],
        }
      };
    },
    methods: {
      // 提交商户增加
      submitForm(add) {
        this.$refs[add].validate((valid) => {
          if (valid) {
            // 通过验证调接口--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            if(this.merchantsAdd.examine_status == false){
              this.merchantsAdd.examine_status = 1
            }else if (this.merchantsAdd.examine_status == true){
              this.merchantsAdd.examine_status = 2
            }
            let param = {
              manager_name: this.merchantsAdd.manager_name, // 用户名
              manager_phone: this.merchantsAdd.manager_phone, //手机
              province: this.selected[0], // 省
              city: this.selected[1], // 市
              district: this.selected[2], // 区
              street: this.merchantsAdd.street, //详细地址
              name_number: this.merchantsAdd.name_number, //身份证号,
              bank: this.merchantsAdd.bank, //开户行
              card_number: this.merchantsAdd.card_number, //银行卡号
              user_info: this.merchantsAdd.user_info, //农户信息
              business_info: this.merchantsAdd.business_info, //农场信息
              examine_status: this.merchantsAdd.examine_status, //账户启用状态
            };
            if(param.city == "市辖区"){
              param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
              param.city = this.selected[0]//市变省
            }
            console.log(param);
            param = utils.filterJson(param);
            apiBusiness.addBusiness(param).then(res => {
              console.log(res);
              if(res.cscode == "0"){
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path:"/merchantslist",
                    })
                  }
                });
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                })

              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/User.css");
</style>
<style>
  .MerchantsAdd .area-select-wrap .area-select {margin-left: 0;}
  .MerchantsAdd .el-form-item__content {line-height: 20px;}
</style>
