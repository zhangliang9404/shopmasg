<template>
  <div class="SupplierList">
    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
          <el-breadcrumb-item>物流供应商管理</el-breadcrumb-item>
          <el-breadcrumb-item>供应管理</el-breadcrumb-item>
          <el-breadcrumb-item>供应商列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--筛选-->
    <div class="btn_box">
      <el-button class="button" @click="$router.push('supplieradd')"><i class="el-icon-circle-plus-outline"></i> 添加供应商</el-button>
      <el-button class="button" @click="getbindingGoodss"><i class="el-icon-goods"></i> 绑定商品</el-button>
      <el-input v-model="SupplierId" placeholder="供应商ID" class="num" ></el-input>
      <el-input v-model="phone" placeholder="联系方式" class="num" ></el-input>
      <el-input v-model="Supplier" placeholder="供应商" class="num" ></el-input>
      <el-date-picker v-model="RegistrationTime" type="daterange" range-separator="至"
                      style="margin-top: 15px;margin-left: 20px;"
                      start-placeholder="注册开始日期" end-placeholder="注册结束日期" value-format="timestamp">
      </el-date-picker>
      <el-button @click="searchSupplierList()">查询</el-button>
    </div>
    <!--弹出框-->
    <el-dialog title="选择商品" :visible.sync="bindingGoods">
      <div class="searchGoods">
        <el-input placeholder="商品名称搜索" v-model="goodsNames" class="input-with-select">
          <el-button slot="append" @click="SearchButton" icon="el-icon-search"></el-button>
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
        <el-button @click="bindingGoodsa">取 消</el-button>
        <el-button type="primary" @click="bindingGoodsa">确 定</el-button>
      </div>
    </el-dialog>
    <!--展示的列表数据-->
    <div class="lists">
      <el-card class="box-card">
        <div slot="header">
          <span class="listTitle"><i class="el-icon-document"></i> 数据列表</span>
          <el-select class="listSort" v-model="order_rule" clearable placeholder="排序方式" style="width: 110px" @change="changeRules(order_rule)">
            <el-option label="正序时间" value="1"></el-option>
            <el-option label="倒序时间" value="2"></el-option>
          </el-select>
          <!--按钮-选择商品-->
          <el-button class="listSort" @click="DerivedData" plain>导出数据</el-button>
          <!--数据列表显示-->
          <div class="dataList">
            <el-table border class="dataListTable" ref="multipleTable" :data="SupplierList"
                      current-row-key="index" :border="true"  tooltip-effect="dark" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <!--商户编号-->
              <el-table-column label="供应商编号" width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.id==null?"无":scope.row.id}}
                </template>
              </el-table-column>
              <!--商户名-->
              <el-table-column label="供应商姓名" width="150">
                <template slot-scope="scope" show-overflow-tooltip>
                  {{scope.row.name==null?"无":scope.row.name}}
                </template>
              </el-table-column>
              <!--联系方式-->
              <el-table-column label="联系方式" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.phone==null?'无':scope.row.phone}}
                </template>
              </el-table-column>
              <!--商户地址-->
              <el-table-column label="供应商地址" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.address==null?"无":scope.row.address}}
                </template>
              </el-table-column>
              <!--入驻时间-->
              <el-table-column label="添加时间" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.add_time==null?"无":scope.row.add_time}}
                </template>
              </el-table-column>
              <!--商品数-->
              <el-table-column label="商品数" width="80">
                <template slot-scope="scope">
                  {{scope.row.goods_num==null?"无":scope.row.goods_num}}
                </template>
              </el-table-column>
              <!--账户启用状态-->
              <el-table-column prop="scope" label="账户启用状态" width="150" show-overflow-tooltip>
                <template  slot-scope="scope">
                  <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#CBD0D6"
                             @change="changeStatus(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column prop="scope" label="操作" width="235">
                <template slot-scope="scope">
                  <strong class="info" @click="goToDetail(scope.row.id)">查看</strong>
                  <strong class="update" @click="updateDetail(scope.row.id)">编辑</strong>
                  <strong class="delete" @click="handleDelete(scope.row.id)">删除</strong>
                </template>
              </el-table-column>
            </el-table>
            <div class="dataListBtn">
              <div class="dataListBtnFl">
                <el-button size="mini" @click="batchOn(multipleSelection)">启用</el-button>
                <el-button size="mini" @click="batchOff(multipleSelection)">拒绝</el-button>
              </div>
              <!--分页-->
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" class="dataListBtnFr"
                             :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="limit"
                             layout="total, sizes, prev, pager, next, jumper" :total="count">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
    import * as utils from "@/common/utils.js"
    import {business,supplier} from "@/api/api.js" // export class api_user{}中的总名称
    let apiBusiness = new business(); // 给api_user另命名
    let apiSupplier = new supplier(); // 给api_user另命名
    export default {
      name:"SupplierList",
      data() {
        return {
          searchData:'', // 输入搜素-商品名称
          goodsNames:'', // 输入搜素-商品名称-弹出框
          SupplierList: [], // 供应商列表
          currentPage:1, // 当前页码
          limit:10, // 每页条数
          count:0, // 总条数
          multipleSelection: [], // 选择的表格列表数据
          multipleSelections: [], // 选择的表格列表数据-弹出框
          order_rule:"", // 排序方式
          gridData: [],
          bindingGoods: false, // 绑定商品
          SupplierId:'',//供应商id
          phone:'',//供应商联系方式
          Supplier:'',//供应商
          RegistrationTime:'',//注册时间
          idsbox:[],
          shopIds:[],
          multipleSelectionsIds:[],


        }
      },
      mounted(){
        this.getSupplierList(); // 获取供应商列表
      },
      methods: {
        // 改变正序，倒序
        changeRules:function(val){
          this.currentPage = 1; // 当前页码
          this.order_rule = val;
          this.getSupplierList(); // 获取供应商的数据
        },
        // 获取供应商列表
        getSupplierList:function() {
          let _this = this;
          let param = {
            //searchData: _this.searchData, // 商户id/商户名/联系方式id ,phone,name,start_time,end_time
            id:_this.SupplierId,
            phone:_this.phone,
            name:_this.Supplier,
            start_time:_this.RegistrationTime[0]/1000,
            end_time:_this.RegistrationTime[1]/1000,
            page: _this.currentPage, // 当前页码
            limit: _this.limit, // 每页多少条数据
            rule: _this.order_rule, // 正序，倒序--1是正序 2是倒序
          };
          param = utils.filterJson(param);
          apiSupplier.supplier_list(param).then(res => {
            console.log("res")
            console.log(res)
            if(res.cscode == "0"){
              var SupplierLists = res.data.info; // 待处理的商户列表
              for(var i=0;i<SupplierLists.length;i++){
                // 通过验证调接口--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
                if(SupplierLists[i].status == 0){
                  SupplierLists[i].status = false;
                }else if(SupplierLists[i].status == 1){
                  SupplierLists[i].status = true;
                }
              }
              _this.SupplierList = SupplierLists; // 商户的列表
              _this.count = res.data.count; // 总数量
            }else{
              // _this.$alert(res.data.msg, '提示信息', {
              //   confirmButtonText: '确定'
              // });
              _this.SupplierList = res.data.info; // 待处理的商户列表
              _this.count = 0; // 总数量
            }
          });
        },
        // 查询商品
        searchSupplierList:function(){
          // console.log(this.RegistrationTime);
          this.currentPage = 1;
          this.getSupplierList(); // 获取商户列表
        },
        // 点击确定或者取消时清除搜索输入框的值
        bindingGoodsa(){
         this.goodsNames = ''
         // this.bindingGoods = false
          if(this.idsbox.length>0){
            if( this.multipleSelections.length>0){
              let ids = [];
              for (var i = 0;i<this.multipleSelections.length;i++){
                ids.push(this.multipleSelections[i].commodity_id)
              }
              this.shopIds = ids
              console.log(this.shopIds)
              let param = {
                commodity_id:this.shopIds,
                id:this.idsbox,
                op:"add"
              }
              apiSupplier.goods_edit(param).then(res=>{
                console.log(res);
                if(res.cscode==0){
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定',
                  })
                  this.getSupplierList();
                  this.bindingGoods = false
                }
              })
            }else {
              this.$alert("请选择要添加的商品", '提示信息', {
                confirmButtonText: '确定',
              })
            }
          }
        },
        // 点击搜索获取商品列表
        SearchButton(){
          this.getbindingGoodss()
        },
        //获取绑定商品列表
        getbindingGoodss(){
          let _this = this
          if(_this.multipleSelection.length==0){
            _this.bindingGoods = false
            _this.$alert("请选择要添加的商户", '提示信息', {
              confirmButtonText: '确定',
            })
            return
          }
          if(_this.multipleSelection.length>=2){
            _this.$confirm("每个商户只能添加自己的商品", '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.getSupplierList()

            }).catch(() => {
              _this.getSupplierList()
            })
          }else {
            _this.bindingGoods = true
            let ids = [];
            for (var i = 0;i<_this.multipleSelection.length;i++){
              ids.push(_this.multipleSelection[i].id)
            }
            _this.idsbox = ids.join(",");
            console.log(_this.idsbox);
          }
          let param = {
            search:_this.goodsNames
          }
          apiSupplier.suppliergoods_list(param).then(res=>{
            console.log(res);
            _this.currentPage=res.data.page, // 当前页码
              _this.limit=res.data.limit, // 每页条数
              _this.count=res.data.count, // 总条数
              _this.gridData = res.data.list
          })
        },
        // 查看
        goToDetail(id){
          this.$router.push({path:'/supplierinfo',query:{id:id}})
        },
        // 编辑
        updateDetail(id){
          this.$router.push({path:'/supplierupdate',query:{id:id}})
        },
        //分页
        handleSizeChange(val) {
          this.limit = val;
          this.getSupplierList();
        },
        //分页
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getSupplierList();
        },
        // 选择的数据
        handleSelectionChange(val) {
          console.log(val);
          this.multipleSelection = val;
          for(var i=0;i<this.multipleSelection.length;i++){
            this.multipleSelectionsIds = []
            val.forEach((val, index) => {
              this.multipleSelectionsIds.push(val.id)
            })
            console.log( this.multipleSelectionsIds)
          }
        },
        // 弹出框选择的数据
        handleSelectionChanges(val) {
          console.log(val)
          this.multipleSelections = val;
        },
        // 删除
        handleDelete:function(id){
          this.$confirm('执行此操作商户将被删除, 是否继续?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let param ={id_arr:id};
            param = utils.filterJson(param);
            apiSupplier.supplier_delete(param).then(res=>{
              console.log(res);
              if(res.cscode == "0"){
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getSupplierList();
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
        // 批量删除
        batchDeleting:function(rows){
          if(rows.length>0){
            this.$confirm("确定删除吗", '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let ids = [];
              for (var i = 0;i<rows.length;i++){
                ids.push(rows[i].id)
              }
              let idss = ids.join(",");
              let param ={
                id:idss // 批量传递一维数组，单独的传递ID
              };
              param = utils.filterJson(param);
              apiBusiness.delBusiness(param).then(res=> {
                console.log(res);
                if (res.cscode == "0") {
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.getSupplierList();
                    }
                  })
                }
              })
            }).catch(() => {
            })
          }else {
            this.$alert("请选择要删除的内容", '提示信息', {
              confirmButtonText: '确定',
            })
          }
        },
        // 修改状态
        changeStatus:function(scopec){
          let arrs = []
          arrs.push(scopec.id)
          var num=null;
          // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
          if(scopec.status == true){
            num = 1
          }else{
            num = 0
          }
          let param={
            id_arr: arrs,
            status: num,
          };
          param = utils.filterJson(param);
          apiSupplier.supplier_status(param).then(res => {
            console.log(res);
            if(res.cscode == 0){
              this.getSupplierList(); // 获取分销管理的数据
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定'
              });
            }
          })
        },
        // 批量启动
        batchOn:function(rows){
          if(rows.length>0){
            this.$confirm("确定启用吗", '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let ids = [];
              for (var i = 0;i<rows.length;i++){
                ids.push(rows[i].id)
              }
              let idss = ids;
              let param ={
                id_arr: idss, // 批量传递一维数组，单独的传递ID
                status: 1, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
              };
              param = utils.filterJson(param);
              apiSupplier.supplier_status(param).then(res=> {
                console.log(res);
                if (res.cscode == "0") {
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.getSupplierList();
                    }
                  })
                }
              })
            }).catch(() => {
            })
          }else {
            this.$alert("请选择要操作的内容", '提示信息', {
              confirmButtonText: '确定',
            })
          }
        },
        // 批量关闭
        batchOff:function(rows){
          if(rows.length>0){
            this.$confirm("确定停用吗", '提示信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let ids = [];
              for (var i = 0;i<rows.length;i++){
                ids.push(rows[i].id)
              }
              let idss = ids;
              let param ={
                id_arr:idss, // 批量传递一维数组，单独的传递ID
               status: 0, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
              };
              param = utils.filterJson(param);
              apiSupplier.supplier_status(param).then(res=> {
                console.log(res);
                if (res.cscode == "0") {
                  this.$alert(res.data.msg, '提示信息', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.getSupplierList();
                    }
                  })
                }
              })
            }).catch(() => {
            })
          }else {
            this.$alert("请选择要操作的内容", '提示信息', {
              confirmButtonText: '确定',
            })
          }
        },
        // 导出数据
        DerivedData(){
          let _this = this;
            let id = _this.SupplierId;
            let id_arr = _this.multipleSelectionsIds;
            let phone = _this.phone;
            let name = _this.Supplier;
          let start_time = '';
          let end_time = ''
          if(_this.RegistrationTime != '' && _this.RegistrationTime != null){  // 时间数据不为空赋值
            start_time = _this.RegistrationTime[0]/1000; // 开始时间
            end_time = _this.RegistrationTime[1]/1000; // 结束时间
          }
          window.location.href="https://api.zhisoufangdichan.com/api/v1/supplier/supplier_excel?start_time="+start_time+"&end_time="+end_time+"&name="+name+"&phone="+phone+"&id="+id
        }
      }
    }
</script>


<style scoped>
  @import url("../../assets/css/Supplier.css");

  .cell>.template_content{
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .SupplierList .btn_box{line-height: 0}

</style>
<style>
  .SupplierList .btn_box .el-button,.SupplierList .btn_box .el-input{margin-top: 15px;margin-left: 20px}
</style>

