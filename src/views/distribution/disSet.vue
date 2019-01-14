<template>
    <div class="dis_set">
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
          <el-breadcrumb-item>当前位置：</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">分销</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/accountList' }">分销设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button style="margin-top: 0" type="primary" icon="el-icon-refresh" @click="$router.back(-1)">返回</el-button>
      </div>
      <div>
        <div class="title_head">
          <p><span class="iconfont icon-shezhi setting"></span><em>分销设置</em></p>
          <p>对分销管理进行配置</p>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-top: 30px">
          <el-form-item label="一级分销分成比例%:" prop="rate1">
            <el-input v-model="ruleForm.rate1"></el-input>
          </el-form-item>
          <el-form-item label="二级分销分成比例%:" prop="rate2">
            <el-input v-model="ruleForm.rate2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {distribution} from "@/api/api.js"
  let apiDistribution = new distribution();
  export default {
    name: "disSet",
    data() {
      return {
        ruleForm:{}, // 获取分销信息
        rules: {
          //限购总数量
          rate1: [
            { required: true, message: '请输入一级分销比例', trigger: 'blur' }
          ],
          //限购总数量
          rate2: [
            { required: true, message: '请输入二级分销比例', trigger: 'blur' }
          ],
        }
      }
    } ,
    // 页面加载之前执行
    mounted:function(){
      this.getDistribution(); // 获取分销信息
    },
    methods: {
      // 获取分销信息
      getDistribution:function(){
        let _this = this;
        let param = {};
        apiDistribution.getDistribution(param).then(res=>{
          console.log(res); // 打印数据
          if(res.cscode == "0"){ // 若返回值为0即为成功
            _this.ruleForm= res.data.res; // 为数组赋值
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
            });
          }
        })
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              rate1:this.ruleForm.rate1,
              rate2:this.ruleForm.rate2,
            };
            apiDistribution.setDistribution(param).then(res=>{
              console.log(res); // 打印数据
              if(res.cscode == "0"){ // 若返回值为0即为成功
                this.getDistribution(); // 获取分销信息
              }else{
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.ruleForm.rate1 = '';
        this.ruleForm.rate2 = '';
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/disset.css");
</style>
<style>
  .dis_set .el-form-item__label{width: 200px}
  .dis_set .el-input__inner{width: 300px}
</style>
