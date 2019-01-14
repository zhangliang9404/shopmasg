<template>
  <div class="MerchantsList">
    <!--头部导航-->
    <div class="header">
      <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
        <el-breadcrumb-item>商户列表</el-breadcrumb-item>
        <el-breadcrumb-item>商户列表</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
    </div>
    <!--筛选-->
    <div class="btn_box" align="center">
      <el-button @click="searchMerchantsList()">查询</el-button>
<!--
      <el-button class="button" @click="batchDeleting(multipleSelection)"><i class="el-icon-delete"></i> 删除商户</el-button>
-->
      <el-button class="button" @click="$router.push('merchantsadd')"><i class="el-icon-circle-plus-outline"></i> 新增商户</el-button>
      <el-input v-model="searchData" placeholder="商户ID/商户名/联系方式" class="num" @keyup.enter.native="searchMerchantsList()"></el-input>
    </div>
    <!--弹出框-->
    <el-dialog title="选择商品" :visible.sync="bindingGoods">
      <div class="searchGoods">
        <el-input placeholder="商品名称搜索" v-model="goodsNames" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-table :data="gridData" border ref="multipleTables" @selection-change="handleSelectionChanges">
        <el-table-column property="date" label="商品名称" width="150"></el-table-column>
        <el-table-column property="name" label="规格" width="200"></el-table-column>
        <el-table-column property="address" label="单买价（元）"></el-table-column>
        <el-table-column property="address" label="团购价（元）"></el-table-column>
        <el-table-column property="address" label="市场价（元）"></el-table-column>
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
        <el-button type="primary" @click="bindingGoods = false">确 定</el-button>
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
          <!--<el-button class="listSort" plain>导入数据</el-button>-->
          <!--<el-button class="listSort" plain>导出数据</el-button>-->
          <!--<el-button class="listSort" plain>推送</el-button>-->
          <!--<el-button class="listSort" plain>群发短信</el-button>-->
          <!--数据列表显示-->
          <div class="dataList">
            <el-table border class="dataListTable" ref="multipleTable" :data="MerchantsList"
                      current-row-key="index" :border="true" tooltip-effect="dark" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <!--商户编号-->
              <el-table-column label="商户编号" width="100" align="center">
                <template slot-scope="scope">
                  {{scope.row.id==null?"无":scope.row.id}}
                </template>
              </el-table-column>
              <!--商户名-->
              <el-table-column label="商户名" width="150">
                <template slot-scope="scope" show-overflow-tooltip>
                  {{scope.row.manager_name==null?"无":scope.row.manager_name}}
                </template>
              </el-table-column>
              <!--联系方式-->
              <el-table-column label="联系方式" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.manager_phone==null?'无':scope.row.manager_phone}}
                </template>
              </el-table-column>
              <!--商户地址-->
              <el-table-column label="商户地址" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.shop_address==null?"无":scope.row.shop_address}}
                </template>
              </el-table-column>
              <!--入驻时间-->
              <el-table-column label="入驻时间" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.create_time==null?"无":scope.row.create_time}}
                </template>
              </el-table-column>
              <!--商品数-->
              <el-table-column label="商品数" width="80">
                <template slot-scope="scope">
                  {{scope.row.totalnum==null?"无":scope.row.totalnum}}
                </template>
              </el-table-column>
              <!--账户启用状态-->
              <el-table-column prop="scope" label="账户启用状态" width="150" show-overflow-tooltip>
                <template  slot-scope="scope">
                  <el-switch v-model="scope.row.examine_status" active-color="#13ce66" inactive-color="#CBD0D6"
                    @change="changeStatus(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column prop="scope" label="操作" width="235">
                <template slot-scope="scope">
                  <strong class="info" @click="goToDetail(scope.row.id)">查看</strong>
                  <strong class="update" @click="updateDetail(scope.row.id)">编辑</strong>
<!--
                  <strong class="delete" @click="handleDelete(scope.row.id)">删除</strong>
-->
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
  import {business} from "@/api/api.js" // export class api_user{}中的总名称
  let apiBusiness = new business(); // 给api_user另命名
  export default {
    name:"MerchantsList",
    data() {
      return {
        searchData:'', // 输入搜素-商品名称
        goodsNames:'', // 输入搜素-商品名称-弹出框
        MerchantsList: [], // 商户列表
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
        multipleSelection: [], // 选择的表格列表数据
        multipleSelections: [], // 选择的表格列表数据-弹出框
        order_rule:"", // 排序方式
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        bindingGoods: false, // 绑定商品


      }
    },
    // 推送表单   进行判断验证
    mounted(){
      this.getMerchantsList(); // 获取商户列表
    },
    methods: {
      // 改变正序，倒序
      changeRules:function(val){
        this.currentPage = 1; // 当前页码
        this.order_rule = val;
        this.getMerchantsList(); // 获取分销管理的数据
      },
      // 获取商户列表
      getMerchantsList:function() {
        let _this = this;
        let param = {
          searchData: _this.searchData, // 商户id/商户名/联系方式
          page: _this.currentPage, // 当前页码
          limit: _this.limit, // 每页多少条数据
          order_rule: _this.order_rule, // 正序，倒序--1是正序 2是倒序
        };
        param = utils.filterJson(param);
        apiBusiness.listBusiness(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            var MerchantsLists = res.data.info; // 待处理的商户列表
            for(var i=0;i<MerchantsLists.length;i++){
              // 通过验证调接口--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
              if(MerchantsLists[i].examine_status == 1|| MerchantsLists[i].examine_status == 3){
                MerchantsLists[i].examine_status = false;
              }else if(MerchantsLists[i].examine_status == 2){
                MerchantsLists[i].examine_status = true;
              }
            }
            _this.MerchantsList = MerchantsLists; // 商户的列表
            _this.count = res.data.count; // 总数量
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
            _this.MerchantsList = res.data.info; // 待处理的商户列表
            _this.count = 0; // 总数量
          }
        });
      },
      // 查询商品
      searchMerchantsList:function(){
        this.currentPage = 1;
        this.getMerchantsList(); // 获取商户列表
      },
      // 查看
      goToDetail(id){
        this.$router.push({path:'/merchantsinfo',query:{id:id}})
      },
      // 编辑
      updateDetail(id){
        this.$router.push({path:'/merchantsupdate',query:{id:id}})
      },
      //分页
      handleSizeChange(val) {
        this.limit = val;
        this.getMerchantsList();
      },
      //分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getMerchantsList();
      },
      // 选择的数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 弹出框选择的数据
      handleSelectionChanges(val) {
        this.multipleSelections = val;
      },
      // 删除
      handleDelete:function(id){
        this.$confirm('执行此操作商户将被删除, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={id:id};
          param = utils.filterJson(param);
          apiBusiness.delBusiness(param).then(res=>{
            console.log(res);
            if(res.cscode == "0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getMerchantsList();
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
                    this.getMerchantsList();
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
        var num=null;
        // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
        if(scopec.examine_status == true){
          num = 2
        }else{
          num = 3
        }
        let param={
          id: scopec.id,
          examine_status: num,
        };
        param = utils.filterJson(param);
        apiBusiness.updateBusiness(param).then(res => {
          console.log(res);
          if(res.cscode == 0){
            this.getMerchantsList(); // 获取分销管理的数据
          }else{
            _this.$alert(res.data.msg, '提示信息', {
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
            let idss = ids.join(",");
            let param ={
              id: idss, // 批量传递一维数组，单独的传递ID
              examine_status: 2, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            };
            param = utils.filterJson(param);
            apiBusiness.updateBusiness(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getMerchantsList();
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
            let idss = ids.join(",");
            let param ={
              id:idss, // 批量传递一维数组，单独的传递ID
              examine_status: 3, // 分销列表信息--审核状态 1待审核-按钮关闭 2为审核通过 3为审核拒绝 默认待审核
            };
            param = utils.filterJson(param);
            apiBusiness.updateBusiness(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getMerchantsList();
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
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/User.css");

  .cell>.template_content{
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .MerchantsList .btn_box{line-height: 0}

</style>
<style>
  .MerchantsList .btn_box .el-button,.MerchantsList .btn_box .el-input{float: right;margin-top: 15px;margin-right: 20px}
</style>
