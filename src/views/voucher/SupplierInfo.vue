<template>
  <div class="SupplierInfo">
    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
          <el-breadcrumb-item>物流供应商管理</el-breadcrumb-item>
          <el-breadcrumb-item>供应管理</el-breadcrumb-item>
          <el-breadcrumb-item>供应商详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--内容信息-->
    <div class="SupplierContent">
      <!--基本信息-->
      <p class="titleInfo">基本信息</p>
      <div class="borderFlex">
        <el-form  ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="供应商名称：">
            <el-input  v-model="infos.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="供应商地址" prop="street">
            <el-input  v-model="infos.phone" readonly class="inputWidth1" ></el-input>
          </el-form-item>
        </el-form>
        <el-form  ref="MerchantsInfo" label-width="120px" class="demo-ruleForm" style="width: 40%">
          <el-form-item label="手机号：">
            <el-input v-model="infos.phone" readonly ></el-input>
          </el-form-item>
          <el-form-item label="法人代表：">
            <el-input v-model="infos.phone" readonly ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--转账信息-->
      <p class="titleInfo">转账信息</p>
      <div class="borderFlex">
        <el-form  ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="开户银行：">
            <el-input v-model="infos.bank" readonly></el-input>
          </el-form-item>
        </el-form>
        <el-form ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="账号：">
            <el-input v-model="infos.bank_no" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--联系方式-->
      <p class="titleInfo">联系方式（最多可添加3个）</p>
      <div class="InfoBox" v-for="(timeis,index) in contact_infos" :key="index">
        <el-form ref="personList" label-width="120px" class="demo-ruleForm borderFlex" >
          <el-form-item label="联系人名称：">
            <el-input v-model="timeis.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="联系人手机：">
            <el-input v-model="timeis.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="职位：">
            <el-input v-model="timeis.work" readonly></el-input>
          </el-form-item>
        </el-form>
        <el-form ref="personList" label-width="120px" class="demo-ruleForm">
          <el-form-item label="联系地址：" prop="street">
            <el-input   readonly v-model="timeis.selected.join('')+timeis.street"  style="width: 70%" class="inputWidth1" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--供应商绑定商品-->
      <p class="titleInfo">供应商绑定商品</p>
      <!--数据列表显示--><!---->
      <div class="dataList">
        <el-table class="dataListTable" ref="multipleTable" border
                  :data="bindData" stripe style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <!--商户编号-->
          <el-table-column label="商品编号" width="100"  show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.commodity_id==null?"无":scope.row.commodity_id}}
            </template>
          </el-table-column>
          <!--商品名称-->
          <el-table-column label="商品名称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.name==null?'无':scope.row.name}}
            </template>
          </el-table-column>
          <!--规格-->
          <el-table-column label="规格" show-overflow-tooltip>
            <!--<template slot-scope="scope">-->

              <template slot-scope="scope">
                {{scope.row.sku==null?'无':scope.row.sku.join(',')}}
              </template>
              <!--<div class="template_content">-->
                <!--<el-tooltip  class="item" effect="dark"   placement="top">-->
                  <!--<p>{{skuitem.sku}}/{{skuitem.cost_price}}/{{skuitem.group_price}}/{{skuitem.goods_price}}</p>-->
                <!--</el-tooltip>-->
              <!--</div>-->
            <!--</template>-->
          </el-table-column>
          <!--进货价-->
          <el-table-column label="进货价" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.cost_price==null?'无':scope.row.cost_price.join(',')}}
            </template>
          </el-table-column>
          <!--拼购价-->
          <el-table-column label="拼购价" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.group_price==null?'无':scope.row.group_price.join(',')}}
            </template>
          </el-table-column>
          <!--单买价-->
          <el-table-column label="单买价" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.goods_price==null?'无':scope.row.goods_price.join(',')}}
            </template>
          </el-table-column>
          <!--操作-->
          <!--<el-table-column label="操作" show-overflow-tooltip>-->
            <!--<template slot-scope="scope">-->
              <!--&lt;!&ndash;<el-button type="primary">解绑商品</el-button>&ndash;&gt;-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
        <!--<el-button style="float: right;margin-top: 20px;" type="primary" @click="add('merchantsAdd')">保存供应商信息</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
  import { AreaSelect } from "vue-area-linkage";
  import AreaData from "area-data";
  import { pca, pcaa } from "area-data";
  import * as utils from "@/common/utils.js"
  import {supplier} from "@/api/api.js" // export class api_user{}中的总名称
  let Apisupplier = new supplier(); // 给api_user另命名
  export default {
    name: "SupplierInfo",
    data() {
      return {
        bindData:[],//绑定商品数据
        infos:{},//详细信息
        contact_infos:[],

      };
    },
    mounted(){
      this.getsupplier_info()
    },
    methods: {
      // 获取详细信息
      getsupplier_info(){
        let _this = this
        let param = {
          id:_this.$route.query.id
        }
        Apisupplier.supplier_info(param).then(res=>{
          console.log(res);
          if(res.cscode ==0){
            _this.bindData = res.data.goods_info
            _this.infos = res.data.info
            _this.contact_infos= JSON.parse(res.data.info.contact_info)
            // // console.log(contact_infoss)
            // // for(var i=0;i<=contact_infoss.length;i++){
            // //   contact_infoss[i].selected =contact_infoss[i].selected.Join('')
            // // }
            // _this.contact_infos = contact_infoss
            // console.log("_this.contact_infos");
            console.log(_this.contact_infos);

          }
        })
      },
      //选择列表操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //分页
      handleSizeChange(val) {
        this.limit = val;
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
      },

    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Supplier.css");
</style>
<style>
  .SupplierInfo .area-select-wrap .area-select {margin-left: 0;}
  .SupplierInfo .el-form-item__content {line-height: 20px;}
</style>
