<template>
    <div class="updateGroup">
      <!--导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">营销</el-breadcrumb-item>
        <el-breadcrumb-item>促销活动</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'group' }">团购</el-breadcrumb-item>
        <el-breadcrumb-item>修改团购活动</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="explanation"><i class="el-icon-setting"></i>团购活动：管理所有团购活动</p>

      <!--输入的表单-->
      <el-form :model="form":rules="rules" ref="form" label-width="130px">
        <el-form-item label="团购商品：" prop="goods_name" >
          <el-select v-model="form.goods_name" :disabled="true" style="width:300px">
            <!--<el-option v-for="items in grouplist" :key="items.id" :label="items.name" :value="items.id"></el-option>-->
          </el-select>
          <!--<el-input v-model="form.goods_name" :disabled="true" style="width:300px"></el-input>-->
        </el-form-item>
        <p class="explain">当此团购活动有会员已订购时，商品不能再进行编辑</p>
        <el-form-item label="开始日期：" prop="start_date">
          <el-date-picker v-model="form.start_date" type="datetime" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <p class="explain">当达到开始日期时，活动会自动变成正在参与活动状态</p>
        <el-form-item label="结束日期：" prop="ending_date">
          <el-date-picker v-model="form.ending_date" type="datetime" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <p class="explain">当达到结束日期时，活动会自动变成结束未处理状态</p>
        <el-form-item label="限购总数量：" prop="buy_bounds">
          <el-input v-model="form.buy_bounds" placeholder="请输入限购总数量" style="width:300px">{{form.buy_bounds}}</el-input>
        </el-form-item>
        <p class="explain">此次活动可购买的商品总数量，不能为空，订购达到此上限时，活动会自动变为结束未处理状态。</p>
        <el-form-item label="团购满足数量：" prop="group_shopmax">
          <el-input v-model="form.group_shopmax" placeholder="请输入团购满足数量" style="width:300px">{{form.group_shopmax}}</el-input>
        </el-form-item>
        <p class="explain">满足此次活动的最低商品订购数量，不能为空。</p>
        <el-form-item label="团购价格：" prop="group_price">
          <el-input v-model="form.group_price" :disabled="true" placeholder="请输入团购价格" style="width:300px">{{form.group_price}}</el-input>
        </el-form-item>
        <el-form-item label="活动状态：" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动说明：" prop="activity_description" style="width: 50%">
          <el-input type="textarea" v-model="form.activity_description">{{form.activity_description}}</el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import index from "../../router";
  import * as utils from "@/common/utils.js"
  import {api_active} from "@/api/api.js"
  let apiActive = new api_active()
  export default {
    name:"updateGroup",
    data() {
      return {
        form:{
          start_date:'',//开始日期
          ending_date:'',//结束时间
          buy_bounds:'',//限购总数量
          group_shopmax:'',//满足此次活动的最低订单数量
          group_price:'',//团购价格
          activity_description:'',//活动说明
          status:'',//活动状态，0：正常；1：进行中；2：结束；3：主动取消；4：异常
        },
        options: [
          {value: 0,label: '正常'},
          {value: 1,label: '拼团已成功 '},
          {value: 2,label: '已结束'},
          {value: 3,label: '主动取消'},
          {value: 4,label: '异常（含部分退费）'},
          {value: 6,label: '已退费'},
          {value: 7,label: '结束未处理'}
        ],
        rules: {
          //开始日期
          start_date: [{
            type: 'date',
            required: true,
            message: '请选择团购活动的开始日期',
            trigger: 'change'
          }],
          //结束日期
          ending_date: [{
            type: 'date',
            required: true,
            message: '请选择团购活动的结束日期',
            trigger: 'change'
          }],
          //限购总数量
          buy_bounds: [{
            required: true,
            message: '限购总数量不能为空',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var group_price = /^\+?[1-9][0-9]*$/;
              if (!group_price.test(value)) {
                callback(new Error('限购总数量只能是正整数！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          //满足此次活动的最低订单数量
          group_shopmax: [{
            required: true,
            message: '团购活动的最低订单数不能为空',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var group_price = /\b[2-9]\b|([1-9]\d+)/;
              if (!group_price.test(value)) {
                callback(new Error('团购活动的最低订单数只能是大于1的正整数！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          //团购价格
          group_price: [{
            required: true,
            message: '团购价格不能为空',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var group_price = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
              if (!group_price.test(value)) {
                callback(new Error('金额只能是保留两位小数的正数！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          //排序
          sort: [{
            required: true,
            message: '此团购活动商品的排序不能为空',
            trigger: 'blur'
          },{
            validator: function (rule, value, callback) {
              var group_price = /^\+?[1-9][0-9]*$/;
              if (!group_price.test(value)) {
                callback(new Error('团购活动商品的排序只能是正整数！'))
              } else {
                callback();
              }
            }, trigger: 'blur'
          }],
          //活动说明
          activity_description: [{
            max: 200,
            message: '活动说明应在200个字符以内',
            trigger: 'blur'
          }]
        },
      };
    },
    //页面预加载执行
    mounted: function(){
      this.getGroup();//获取修改的商品信息
    },
    methods: {
      //根据id获取待修改的商品信息
      getGroup(){
        let param = {
          id:this.$route.query.id,//获取路由的id
        }
        param = utils.filterJson(param);
        apiActive.getGroup(param).then(res=>{
          console.log(res)
          if(res.cscode === "0"){
            let forms = res.data.data;//商品分类列表
            forms.start_date  = this.timestampToTime(forms.start_date);//时间戳转化为时间
            forms.ending_date  = this.timestampToTime(forms.ending_date);//时间戳转化为时间
            this.form = forms;//商品分类列表
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      // 将获取的时间戳转换成时间格式
      timestampToTime:function(timestamp) {
        let timestampa = timestamp *1000;
        let date = new Date(timestampa);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
      },
      //提交修改
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              //data以json格式传递
              let datas = {
                id:this.$route.query.id,//获取路由的id
                data:{
                  start_date: this.form.start_date,//开始日期
                  ending_date: this.form.ending_date,//结束时间
                  buy_bounds:'',//限购总数量
                  group_shopmax:'',//最低订单数
                  // group_price:'',//团购价格
                  activity_description:'',//活动说明
                  status:'',//状态
                }
              };
              var start_date = new Date(this.form.start_date);
              var start_dates = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate() + ' ' + start_date.getHours() + ':' + start_date.getMinutes() + ':' + start_date.getSeconds();
              var start_datess = new Date( start_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
              var start_datesss = start_datess/1000;//毫秒除以1000得到秒
              var ending_date = new Date(this.form.ending_date);
              var ending_dates = ending_date.getFullYear() + '-' + (ending_date.getMonth() + 1) + '-' + ending_date.getDate() + ' ' + ending_date.getHours() + ':' + ending_date.getMinutes() + ':' + ending_date.getSeconds();
              var ending_datess = new Date( ending_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
              var ending_datesss = ending_datess/1000;//毫秒除以1000得到秒
              datas.id = this.$route.query.id;//获取路由的id
              datas.data.start_date = start_datesss;//开始日期
              datas.data.ending_date = ending_datesss;//结束时间
              datas.data.buy_bounds = this.form.buy_bounds;//限购总数量
              datas.data.group_shopmax = this.form.group_shopmax;//最低订单数
              // datas.data.group_price = this.form.group_price;//团购价格
              datas.data.activity_description = this.form.activity_description;//活动说明
              datas.data.status = this.form.status;//状态
              let param = datas;//组装好的json赋值给param
              console.log(param);
              param = utils.filterJson(param);
              apiActive.upGroupPurchase(param).then(res=>{
                console.log(res)
                if(res.cscode === "0"){
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path:'/group'
                      })
                    }
                  });
                }else{
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定'
                  });
                }
              })
            // alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // submitForm() {
      //   //data以json格式传递
      //   let datas = {
      //     id:this.$route.query.id,//获取路由的id
      //     data:{
      //       start_date:'',//开始日期
      //       ending_date:'',//结束时间
      //       buy_bounds:'',//限购总数量
      //       group_shopmax:'',//最低订单数
      //       group_price:'',//团购价格
      //       activity_description:'',//活动说明
      //       status:'',//状态
      //     }
      //   };
      //   var start_date = new Date(this.form.start_date);
      //   var start_dates = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate() + ' ' + start_date.getHours() + ':' + start_date.getMinutes() + ':' + start_date.getSeconds();
      //   var start_datess = new Date( start_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
      //   var start_datesss = start_datess/1000;//毫秒除以1000得到秒
      //   var ending_date = new Date(this.form.ending_date);
      //   var ending_dates = ending_date.getFullYear() + '-' + (ending_date.getMonth() + 1) + '-' + ending_date.getDate() + ' ' + ending_date.getHours() + ':' + ending_date.getMinutes() + ':' + ending_date.getSeconds();
      //   var ending_datess = new Date( ending_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
      //   var ending_datesss = ending_datess/1000;//毫秒除以1000得到秒
      //   datas.id = this.$route.query.id;//获取路由的id
      //   datas.data.start_date = start_datesss;//开始日期
      //   datas.data.ending_date = ending_datesss;//结束时间
      //   datas.data.buy_bounds = this.form.buy_bounds;//限购总数量
      //   datas.data.group_shopmax = this.form.group_shopmax;//最低订单数
      //   datas.data.group_price = this.form.group_price;//团购价格
      //   datas.data.activity_description = this.form.activity_description;//活动说明
      //   datas.data.status = this.form.status;//状态
      //   let param = datas;//组装好的json赋值给param
      //   console.log(param);
      //   param = utils.filterJson(param);
      //   apiActive.upGroupPurchase(param).then(res=>{
      //     console.log(res)
      //     if(res.cscode === "0"){
      //       this.$alert(res.data.msg, '提示信息', {
      //         confirmButtonText: '确定',
      //         callback: action => {
      //           this.$router.push({
      //             path:'/group'
      //           })
      //         }
      //       });
      //     }else{
      //       this.$alert(res.data.msg, '提示信息', {
      //         confirmButtonText: '确定'
      //       });
      //     }
      //   })
      // },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Promotion.css");
</style>
