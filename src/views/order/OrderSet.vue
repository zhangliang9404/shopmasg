<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      <el-breadcrumb-item>订单设置</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation"><i class="el-icon-setting"></i>订单设置：对订单管理配置</p>
    <!--表单-->
    <el-form v-model="ruleForm" label-width="180px" class="demo-ruleForm" :label-position="labelPosition">
      <div class="set" v-for="item in ruleForm" :key="item.id">
        <el-form-item :label="item.name">
          <el-input v-model="item.values" :value="item.values" ></el-input>
          <span class="rem">{{item.remark}}</span>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleForm)">提交</el-button>
        <el-button @click="resetForm(ruleForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    data() {
      return {
        labelPosition: 'right',
        ruleForm: [],//备注的数组
      };
    },
    //页面加载之前执行
    mounted:function(){
      this.getDatas();//获取备注信息
    },
    methods: {
      //获取备注信息
      getDatas:function(){
        let _this = this;
        let param = {};
        apiUser.orderSetting(param).then(res=>{
          console.log(res);//打印数据
          if(res.cscode === "0"){//若返回值为0即为成功
            _this.ruleForm= res.data.data;//为数组赋值
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
            });
          }
        })
      },
      //提交表单
      submitForm(formName) {
        let dats = [];//定义新数组
        for(var i=0;i<formName.length;i++){
          let p = {};
          p.id = formName[i].id;
          p.values = formName[i].values;
          dats.push(p);
        }
        let data = JSON.stringify(dats);
        let param = {
          data:data,//为data赋值字符串
        };
        apiUser.getorderSetting(param).then(res=>{
          console.log(res);
          if(res.cscode === "0"){
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      //重置表单
      resetForm(formName) {
        this.$confirm('您是否要重置订单设置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dats = [];
          for(var i=0;i<formName.length;i++){
            let p = {};
            p.id = formName[i].id;//id
            p.name = formName[i].name;//名称
            p.remark = formName[i].remark;//备注信息
            p.values = "";//输入框中的值
            dats.push(p);
          }
          let data = JSON.stringify(dats);
          this.ruleForm = JSON.parse(data);//字符串转数组，重新赋值。
        }).catch(() => {
        });
      },
    }
  }
</script>

<style>
  @import url("../../assets/css/Order.css");
</style>
