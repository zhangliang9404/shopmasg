<template>
  <div class="SupplierUpdate">
    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
          <el-breadcrumb-item>物流供应商管理</el-breadcrumb-item>
          <el-breadcrumb-item>供应管理</el-breadcrumb-item>
          <el-breadcrumb-item>修改供应商</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--内容信息-->
    <div class="SupplierContent">
      <!--基本信息-->
      <p class="titleInfo">基本信息</p>
      <div class="borderFlex">
        <el-form :model="infos" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="供应商名称：">
            <el-input v-model="infos.name"></el-input>
          </el-form-item>
          <el-form-item label="城市：" prop="street">
            <!--<area-select type='text' :placeholders="infos.address" :level='2' v-model="infos.address" :data="pcaa"></area-select>-->
            <el-input  v-model="infos.address" class="inputWidth1" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="infos" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm" style="width: 40%">
          <el-form-item label="手机号：">
            <el-input v-model="infos.phone"></el-input>
          </el-form-item>
          <el-form-item label="法人代表：">
            <el-input v-model="infos.corporate"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--转账信息-->
      <p class="titleInfo">转账信息</p>
      <div class="borderFlex">
        <el-form :model="infos" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="开户银行：">
            <el-input v-model="infos.bank"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="infos" ref="MerchantsInfo" label-width="120px" class="demo-ruleForm">
          <el-form-item label="账号：">
            <el-input v-model="infos.bank_no"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--联系方式-->
      <p class="titleInfo">联系方式（最多可添加3个）</p>
      <el-button class="button" @click="addnewperson"><i class="el-icon-circle-plus-outline"></i> 新建联系人</el-button>
      <div class="InfoBox" v-for="(timeis,index) in personList" :key="index">
        <el-form ref="personList" label-width="120px" class="demo-ruleForm borderFlex" >
          <el-form-item label="联系人名称：">
            <el-input v-model="timeis.name" ></el-input>
          </el-form-item>
          <el-form-item label="联系人手机：">
            <el-input v-model="timeis.phone" ></el-input>
          </el-form-item>
          <el-form-item label="职位：">
            <el-input v-model="timeis.work" ></el-input>
          </el-form-item>
        </el-form>
        <el-form ref="personList" label-width="120px" class="demo-ruleForm">
          <el-form-item label="联系地址：" prop="street">
            <el-input v-model="timeis.selected.join('')+timeis.street"  style="width: 70%" class="inputWidth1" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="danger" icon="el-icon-delete" style="float: right;margin: 0 20px 20px 0;" circle @click="reduce(index)"></el-button>
      </div>
      <!--供应商绑定商品-->
      <p class="titleInfo">供应商绑定商品</p>
      <el-button class="button" @click="bindingGoods = true"><i class="el-icon-circle-plus-outline"></i> 绑定商品</el-button>
      <!--弹出框-->
      <el-dialog title="选择商品" :visible.sync="bindingGoods">
        <div class="searchGoods">
          <el-input placeholder="商品名称搜索" v-model="goodsNames" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <el-table :data="gridData" border ref="multipleTables" @selection-change="handleSelectionChanges">
          <el-table-column property="name" label="商品名称" width="150"></el-table-column>
          <el-table-column property="sku" label="规格" width="200"></el-table-column>
          <el-table-column property="goods_price" label="单买价（元）"></el-table-column>
          <el-table-column property="group_price" label="团购价（元）"></el-table-column>
          <el-table-column property="market_price" label="市场价（元）"></el-table-column>
          <el-table-column type="selection" width="55" label="操作"></el-table-column>
        </el-table>
        <!--page-sizes   每页多少条数据----current-page  当前页数-->
        <div class="page">
          <!--分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bindingGoods = false">取 消</el-button>
          <el-button type="primary" @click="bindingGoodss">确 定</el-button>
        </div>
      </el-dialog>
      <!--数据列表显示-->
      <div class="dataList">
        <el-table class="dataListTable" ref="multipleTable" border
                  :data="bindData" stripe style="width: 100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
          <!--商户编号-->
          <el-table-column label="商品编号" width="100" align="center" property="commodity_id">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.id==null?"无":scope.row.id}}-->
            <!--</template>-->
          </el-table-column>
          <!--商品名称-->
          <el-table-column label="商品名称" property="name">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.name==null?'无':scope.row.name}}-->
            <!--</template>-->
          </el-table-column>
          <!--规格-->
          <el-table-column label="商品规格" property="sku">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.sku_font==null?"无":scope.row.sku_font}}-->
            <!--</template>-->
          </el-table-column>
          <!--进货价-->
          <el-table-column label="进货价"  property="market_price">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.market_price==null?"无":scope.row.market_price}}-->
            <!--</template>-->
          </el-table-column>
          <!--拼购价-->
          <el-table-column label="拼购价" property="group_price">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.group_price==null?"无":scope.row.group_price}}-->
            <!--</template>-->
          </el-table-column>
          <!--单买价-->
          <el-table-column label="单买价" property="goods_price">
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.goods_price==null?"无":scope.row.goods_price}}-->
            <!--</template>-->
          </el-table-column>
          <!--操作-->
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="primary" @click.native.prevent="deleteRow(scope.$index, bindData)">解绑商品</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="float: right;margin-top: 20px;" type="primary" @click="add()">保存供应商信息</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { AreaSelect } from "vue-area-linkage";
  import AreaData from "area-data";
  import { pca, pcaa } from "area-data";
  import * as utils from "@/common/utils.js"
  import {business,supplier} from "@/api/api.js" // export class api_user{}中的总名称
  let apiBusiness = new business(); // 给api_user另命名
  let apisupplier = new supplier(); // 给api_user另命名
  export default {
    name: "SupplierUpdate",
    data() {
      return {
        pca: pca,  // 三级联动
        pcaa: pcaa, // 三级联动
        placeholders: ["选择省", "选择市", "选择区"], // 三级联动
        selected: [], // 三级联动
        personList:[{name:'',phone:'',work:'',street:'',selected:[]}], // 新增联系人
        bindData:[], // 绑定商品
        multipleSelection: [], // 选择的表格列表数据
        multipleSelections: [], // 选择的表格列表数据-弹出框

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
        },
        goodsNames:'', // 输入搜素-商品名称-弹出框
        SupplierList: [], // 供应商列表
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数

        order_rule:"", // 排序方式
        gridData: [],
        bindingGoods: false, // 绑定商品

        bindData:[],//绑定商品数据
        infos:{},//详细信息
        contact_infos:[],
        multipleSelectionsIds:'',
      };
    },
    mounted(){
      this.getsupplier_info()
      //获取供应商-绑定商品列表
      this.getsuppliergoods_list()
    },
    methods: {
      //获取供应商-绑定商品列表
      getsuppliergoods_list(){
        let _this = this
        let param = {
          search:_this.goodsNames
        }
        apisupplier.suppliergoods_list(param).then(res=>{
          console.log(res);
          _this.currentPage=res.data.page, // 当前页码
            _this.limit=res.data.limit, // 每页条数
            _this.count=res.data.count, // 总条数
            _this.gridData = res.data.list
        })
      },
      // 获取详细信息
      getsupplier_info(){
        let _this = this
        let param = {
          id:_this.$route.query.id
        }
        apisupplier.supplier_info(param).then(res=>{
          console.log(res);
          if(res.cscode ==0){
            _this.bindData = res.data.goods_info
            _this.infos = res.data.info
            _this.personList= JSON.parse(res.data.info.contact_info)
            console.log(_this.contact_infos);

          }
        })
      },

      //绑定商品时点击确定按钮
      bindingGoodss(){
        let _this = this
        for(var i=0;i<_this.multipleSelections.length;i++) {
          _this.bindData.push(_this.multipleSelections[i])
        }
        _this.multipleSelectionsIds = []
        _this.bindData.forEach((val, index) => {
          _this.multipleSelectionsIds.push(val.commodity_id)
        })
        console.log(_this.bindData);
        console.log(_this.multipleSelectionsIds);
        _this.bindingGoods = false
      },
      //解除绑定
      deleteRow(index, rows) {
        rows.splice(index, 1);
        this.multipleSelectionsIds=[]
        rows.forEach((rows) => {
          this.multipleSelectionsIds.push(rows.commodity_id)
        })
        console.log( this.multipleSelectionsIds)
      },
      // 提交商户增加
      add() {
        let param = {
          op:'edit', // 新增
          name: this.infos.name, // 供应商名称
          phone: this.infos.phone, // 联系方式
          address:  this.infos.address, // 省市区
          // street: this.merchantsAdd.street, // 详细地址
          bank: this.infos.bank, // 转账信息开户行
          bank_no: this.infos.bank_no, // 转账信息账号
          contact_info: JSON.stringify(this.personList), // 联系人
          bind_commodity: this.multipleSelectionsIds.join(','), // 绑定id
          status:this.infos.status,
          id:this.$route.query.id,//供货商id
        };
        console.log(param);
        param = utils.filterJson(param);
        apisupplier.editSupplier(param).then(res => {
          if(res.cscode == "0"){
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({
                  path:"/supplierlist",
                })
              }
            });
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            })
          }
        });
      },
      // 新建联系人
      addnewperson(){
        if(this.personList.length<3){
          this.personList.push({name:'',phone:'',work:'',street:'',selected:[]})
        }
      },
      // 删除联系人
      reduce(index){
        if(this.personList.length>=2){
          this.personList.splice(index,1)
        }
      },
      //选择列表操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 弹出框选择的数据
      handleSelectionChanges(val) {
        let _this = this
        _this.multipleSelections = val;
        console.log( _this.multipleSelections)
        _this.multipleSelectionsIds = []
        val.forEach((val, index) => {
          _this.multipleSelectionsIds.push(val.commodity_id)
        })
        console.log( _this.multipleSelectionsIds)
      },
      //分页
      handleSizeChange(val) {
        this.limit = val;
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      // add(){
      //   let param = {
      //     personList: this.personList,
      //   };
      //   // if(param.city == "市辖区"){
      //   //   param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
      //   //   param.city = this.selected[0]//市变省
      //   // }
      //   console.log(param);
      // },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Supplier.css");
</style>
<style>
  .SupplierUpdate .area-select-wrap .area-select {margin-left: 0;}
  .SupplierUpdate .el-form-item__content {line-height: 20px;}
</style>
