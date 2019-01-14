<template>
    <div class="addGroup">
      <!--导航-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">营销</el-breadcrumb-item>
        <el-breadcrumb-item>促销活动</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'group' }">团购</el-breadcrumb-item>
        <el-breadcrumb-item>添加团购活动</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="explanation"><i class="el-icon-setting"></i>团购活动：管理所有团购活动-请先查询所要加入团购活动商品的关键字</p>
      <!--查询表单-->
      <el-form :model="search" ref="data" label-width="120px" class="search1 clearfloat">
        <!--模板名称-->
        <div class="search_left">
          <el-form-item label="商品名称：">
            <el-input v-model="search.name" placeholder="请输入商品名称" style="width:180px"></el-input>
            <el-select v-model="search.classify" placeholder="请选择商品分类" style="width:180px">
              <el-option v-for="item in categorylist" :key="item.id" :label="item.cat_name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search_left">
          <el-form-item label="商品编码：">
            <el-input v-model="search.id" placeholder="请输入商品编码" style="width:200px"></el-input>
            <el-button type="primary" @click="searchForm()">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!--输入的表单-->
      <el-form :model="form" :rules="rules" ref="form" label-width="130px">
        <p class="explain">当此团购活动有会员已订购时，商品不能再进行编辑</p>
        <el-form-item label="团购商品：" prop="goods_id">
          <el-select v-model="form.goods_id" placeholder="请选择团购商品名称" @change="selectGet">
            <el-option v-for="items in grouplist" :key="items.id" :label="items.name" :value="items.id"></el-option>
          </el-select>
        </el-form-item>
        <p class="explain">当达到开始日期时，活动会自动变成正在参与活动状态</p>
        <el-form-item label="开始日期：" prop="start_date">
          <el-date-picker v-model="form.start_date" type="datetime" placeholder="请输入开始日期"></el-date-picker>
        </el-form-item>
        <p class="explain">当达到结束日期时，活动会自动变成结束未处理状态</p>
        <el-form-item label="结束日期：" prop="ending_date">
          <el-date-picker v-model="form.ending_date" type="datetime" placeholder="请输入结束日期"></el-date-picker>
        </el-form-item>
        <p class="explain">此次活动可购买的商品总数量，不能为空，订购达到此上限时，活动会自动变为结束未处理状态。</p>
        <el-form-item label="限购总数量：" prop="buy_bounds">
          <el-input v-model="form.buy_bounds" placeholder="请输入限购总数量" style="width:300px"></el-input>
        </el-form-item>
        <p class="explain">满足此次活动的最低商品订购数量，不能为空。</p>
        <el-form-item label="团购满足数量：" prop="group_shopmax">
          <el-input v-model="form.group_shopmax" placeholder="请输入团购满足数量" style="width:300px"></el-input>
        </el-form-item>
        <p class="explain">请选择团购商品的具体价格或价格区间，不能为空。</p>
        <el-form-item label="团购价格：" prop="group_price">
          <el-tabs v-model="activeName" type="border-card" style="width: 401px">
            <el-tab-pane label="团购价格" name="first">
              团购价格：
              <el-input v-model="form.group_price" placeholder="请输入团购价格" style="width:294px;margin-bottom: 10px"></el-input>
              <el-table ref="singleTable" :data="sku" border highlight-current-row @current-change="handleCurrentChange" style="width: 771px">
                <el-table-column width="50">
                  <template slot-scope="scope">
                    <el-radio :label="scope.$index" v-model="radio">&zwnj;</el-radio>
                  </template>
                </el-table-column>
                <el-table-column property="sku_res" label="规格" width="160"></el-table-column>
                <el-table-column property="group_price" label="团购价" width="160"> </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="价格区间" name="second">
              价格区间：
              <el-input v-model="form.group_price" placeholder="团购最低价" style="width:130px"></el-input>
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <el-input v-model="form.section_price" placeholder="团购最高价" style="width:130px"></el-input>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item label="团购商品排序：" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入团购商品排序" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="活动说明：" prop="activity_description" style="width: 50%">
          <el-input type="textarea" :rows="6" placeholder="请在此输入活动说明" v-model="form.activity_description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">添加</el-button>
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
    name:"addGroup",
    data() {
      return {
        categorylist:[],//商品分类列表
        search:{//查询的表格
          name:'',//商品名称,
          classify:'',//商品类别
          id:'',//商品id
        },
        grouplist:[],//团购商品列表
        sku:[],//团购商品的sku值
        form:{
          goods_name:'',//团购商品名称--label值
          goods_id:'',//团购商品id-value值
          start_date:'',//开始日期
          ending_date:'',//结束时间
          buy_bounds:'',//限购总数量
          group_shopmax:'',//满足此次活动的最低订单数量
          group_price:'',//团购价格或最小值
          section_price:'',//最大值
          sort:'',//排序,
          activity_description:'',//活动说明
          sku_id:'',//sku的id值
        },
        activeName: 'first',//选择团购价格-标签页
        radio:'',
        currentRow: null,
        rules: {
          //团购商品
          goods_id: [{
            required: true,
            message: '请选择待参加团购活动的商品名称--由查询可得',
            trigger: 'change'
          }],
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
              var buy_bounds = /^\+?[1-9][0-9]*$/;
              if (!buy_bounds.test(value)) {
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
              var group_shopmax = /\b[2-9]\b|([1-9]\d+)/;
              if (!group_shopmax.test(value)) {
                callback(new Error('团购活动的最低订单数只能是大于1的正整数！'))
              }else {
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
              var sort = /^\+?[1-9][0-9]*$/;
              if (!sort.test(value)) {
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
      this.getCategory();//获取商品分类列表
    },
    methods: {
      //获取商品分类列表
      getCategory(){
        let param = {};
        apiActive.getCategory(param).then(res=>{
          console.log(res);
          if(res.cscode === "0"){
            this.categorylist = res.data.data;//商品分类列表
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      //查询的表单
      searchForm(){
        let param = {
          name:this.search.name,//商品名称,
          classify:this.search.classify,//商品类别
          id:this.search.id,//商品id
        };
        apiActive.searchShopping(param).then(res=>{
          console.log(res);
          if(res.cscode === "0"){
            this.grouplist = res.data.data;//团购商品列表
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      //下拉框选中事件
      selectGet(val){//这个val也就是value值
        console.log(val);//即为id
        let obj = {};
        obj = this.grouplist.find((item)=>{//这里的grouplist就是上面遍历的数据源
          return item.id === val;//筛选出匹配数据
        });
        this.form.goods_name = obj.name;//name就是对应label的
        //调接口
        let param = {
          goods_id: val,
        };
        apiActive.getGroupSku(param).then(res=>{
          console.log(res);
          if(res.cscode === "0"){
            this.sku = res.data.data;//商品分类列表
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      //单选的表格
      handleCurrentChange(val) {
        this.currentRow = val;//获取表格整条数据
        this.form.sku_id = val.id; //sku_id赋值
        console.log(val.id);
      },
      //添加提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var start_date = new Date(this.form.start_date);
            var start_dates = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate() + ' ' + start_date.getHours() + ':' + start_date.getMinutes() + ':' + start_date.getSeconds();
            var start_datess = new Date( start_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
            var start_datesss = start_datess/1000;//毫秒除以1000得到秒
            var ending_date = new Date(this.form.ending_date);
            var ending_dates = ending_date.getFullYear() + '-' + (ending_date.getMonth() + 1) + '-' + ending_date.getDate() + ' ' + ending_date.getHours() + ':' + ending_date.getMinutes() + ':' + ending_date.getSeconds();
            var ending_datess = new Date( ending_dates.replace(/-/g,"/")).getTime();//时间转为时间戳
            var ending_datesss = ending_datess/1000;//毫秒除以1000得到秒
            let param = {
              goods_name:this.form.goods_name,//团购商品名称
              goods_id:this.form.goods_id,//团购商品id
              start_date:start_datesss,//开始日期
              ending_date:ending_datesss,//结束时间
              buy_bounds:this.form.buy_bounds,//限购总数量
              group_shopmax:this.form.group_shopmax,//满足此次活动的最低订单数量
              group_price:this.form.group_price,//团购价格或最小值
              activity_description:this.form.activity_description,//活动说明
              sort:this.form.sort,//排序
              sku_id:this.form.sku_id,//sku-id
              section_price: this.form.section_price,//最大值
            };
            console.log(param);
            apiActive.addGroup(param).then(res=>{
              console.log(res);
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
  @import url("../../assets/css/Promotion.css");
</style>
<style>
  .addGroup .cell{text-align: center;}
  .addGroup .el-radio__label{padding-left: 0;}
</style>
