<template>
  <div class="MerchantsUpdate">
    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/merchantslist' }">商户列表</el-breadcrumb-item>
          <el-breadcrumb-item>商户编辑</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--内容信息-->
    <div class="MerchantsContent">
      <!--基本信息-->
      <p class="titleInfo">
        基本信息
        <el-button size="mini" round type="success" @click="editMerchantsInfo()">保存</el-button>
      </p>

      <div class="InfoBox">
        <!--左一-->
        <div class="left1" align="center">
          <img v-if="MerchantsInfo.farmer_photo" :src="MerchantsInfo.farmer_photo" alt="" style="width: 70px;height: 70px;border-radius: 50%;">
          <img v-else src="../../assets/img/Headportrait.png" alt="" style="width: 70px;height: 70px;border-radius: 50%;">
          <p>{{MerchantsInfo.manager_phone}}</p>
          <p>保证金：未缴纳</p>
        </div>
        <!--左二-->
        <div class="left2">
          <el-form :model="MerchantsInfo" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
            <el-form-item label="身份证号：">
              <el-input v-model="MerchantsInfo.name_number"></el-input>
            </el-form-item>
            <el-form-item label="商户名称：">
              <el-input v-model="MerchantsInfo.manager_name"></el-input>
            </el-form-item>
            <el-form-item label="商户地址：">
              <el-input v-model="MerchantsInfo.shop_address"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--左三-->
        <div class="left3">
          <el-form :model="MerchantsInfo" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
            <el-form-item label="入驻时间：">
              <el-date-picker v-model="MerchantsInfo.create_time" type="datetime" :disabled="true"
                               placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开户银行：">
              <el-input v-model="MerchantsInfo.bank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号：">
              <el-input v-model="MerchantsInfo.card_number"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!--商户介绍-->
      <p class="titleInfo">商户介绍</p>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="MerchantsInfo.user_info"></el-input>
      <!--农场介绍-->
      <p class="titleInfo">农场介绍</p>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="MerchantsInfo.business_info"></el-input>
      <!--编辑绑定商品-->
      <p class="titleInfo">编辑绑定商品</p>
      <!--数据列表显示-->
      <div class="dataList">
        <el-table class="dataListTable" ref="multipleTable" border
                  :data="bindData" stripe style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <!--商户编号-->
          <el-table-column label="商品编号" width="100" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.goods_id==null?"无":scope.row.goods_id}}
            </template>
          </el-table-column>
          <!--商品名称-->
          <el-table-column label="商品名称" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.goodsname==null?'无':scope.row.goodsname}}
            </template>
          </el-table-column>
          <!--商户标签-->
          <el-table-column label="商户标签" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.goods_tag==null?"无":scope.row.goods_tag}}
            </template>
          </el-table-column>
          <!--三品一标-->
          <el-table-column label="三品一标" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.sku_tag==null?"无":scope.row.sku_tag}}
            </template>
          </el-table-column>
          <!--规格-->
          <el-table-column label="规格" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.sku_font==null?"无":scope.row.sku_font}}
            </template>
          </el-table-column>
          <!--市场价-->
          <el-table-column label="市场价" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.market_price==null?"无":scope.row.market_price}}
            </template>
          </el-table-column>
          <!--单买价-->
          <el-table-column label="单买价" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.goods_price==null?"无":scope.row.goods_price}}
            </template>
          </el-table-column>
          <!--拼购价-->
          <el-table-column label="拼购价" show-overflow-tooltip>
            <template slot-scope="scope">
                {{scope.row.group_price==null?"无":scope.row.group_price}}
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column prop="scope" label="操作" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></i>
            </template>
          </el-table-column>
        </el-table>
        <div class="dataListBtn">
          <!--page-sizes   每页多少条数据----current-page  当前页数-->
          <el-pagination class="dataListBtnFr"  @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {business} from "@/api/api.js"
  let apiBusiness=new business();
  export default {
    name:"MerchantsUpdate",
    data() {
      return {
        MerchantsInfo: { //信息详情
          id: '', //商户id
          manager_name: '', // 商户名称
          manager_phone: '', // 账户 左上角图片上的数字
          shop_address: '', // 店铺地址
          create_time: '', // 入驻时间
          bank: '', // 开户银行
          name_number: '', // 身份证
          card_number: '', // 银行卡号
          business_info: '', // 农场介绍
          user_info: '', // 商户介绍
          farmer_photo: '', // 商户照片
        },
        bindData: [], // 绑定的商品
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        multipleSelections:[], // 列表选中的数据
      }
    },
    mounted(){
      this.getMerchantsInfo(); // 商户详情
      this.getBindData(); // 获取绑定的商品
    },
    methods: {
      // 获取绑定商品
      getMerchantsInfo(){
        let _this = this;
        let param = {
          business_id:_this.$route.query.id,
        };
        param = utils.filterJson(param);
        apiBusiness.infoBusiness(param).then(res => {
          if(res.cscode == 0){
            _this.MerchantsInfo = res.data.info; // 商户详情数据
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      // 获取绑定商品的数据
      getBindData:function(){
        let _this = this;
        let param = {
          business_id:_this.$route.query.id,
          page:_this.currentPage, // 当前页码
          limit:_this.limit, // 每页多少条数据
        };
        param = utils.filterJson(param);
        apiBusiness.bindBusiness(param).then(res => {
          console.log(res);
          if(res.cscode == 0){
            _this.bindData = res.data.info; // 绑定商品的数据
            _this.count = res.data.count; // 总数
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      // 删除绑定商品
      deleteGoods(ids){
        var params={
          // 商户id  :id和 商品id goods_id
          id:this.$route.query.id,
          goods_id:ids
        };
        this.$confirm('执行此操作商户将被删除, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // let params ={
          //   // 商户id  :id和 商品id goods_id
          //   id: _this.$route.query.id,
          //   goods_id: ids,
          // };
          apiBusiness.delGoodsBusiness(params).then(res=>{
            console.log(res);
            if(res.cscode == "0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getBindData();
                }
              })
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
        });
      },
      // 修改商户详情
      editMerchantsInfo:function(){
        let _this = this;
        var createTime = new Date(_this.MerchantsInfo.create_time).getTime();
        let param = {
          id:_this.$route.query.id,
          manager_name:_this.MerchantsInfo.manager_name, // 商户名称
          create_time:createTime/1000, // 入驻时间
          shop_address:_this.MerchantsInfo.shop_address, // 店铺地址
          name_number:_this.MerchantsInfo.name_number, // 身份证
          bank:_this.MerchantsInfo.bank, // 开户银行
          card_number:_this.MerchantsInfo.card_number, // 银行卡号
          business_info:_this.MerchantsInfo.business_info, // 农场介绍
          user_info:_this.MerchantsInfo.user_info, // 商户介绍
        };
        param = utils.filterJson(param);
        apiBusiness.editBusiness(param).then(res => {
          console.log(res);
          if(res.cscode == 0){
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定',
            // });
            this.$router.push({path:'/merchantslist'})
          }else{
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      //选择列表操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //分页
      handleSizeChange(val) {
        this.limit = val;
        this.getBindData();
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getBindData();
      },
    }

  }
</script>

<style scoped>
  @import url("../../assets/css/User.css");
</style>
