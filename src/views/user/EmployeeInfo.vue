<template>
  <div class="distributionDetails">

    <!--头部导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/employee' }">考核列表</el-breadcrumb-item>
          <el-breadcrumb-item>人员详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
    </div>
    <!--分销商信息-->
    <div class="dis_table1" >
      <p>分销商信息</p>
      <table  cellpadding='0' cellspacing='0' width="100%">
        <tr>
          <td  rowspan="6" style="width: 20%;text-align: center">
           <img src="../../assets/img/bao.jpg"/>
            <div style="margin-bottom: 50px">18000000</div>
            <div style="font-size: 12px">总佣金：<span>{{detailsDate.comission_sum}}</span>成功提现<span>{{detailsDate.success_sum}}</span></div>
          </td>
          <td class="title">用户ID</td>
          <td>{{detailsDate.id}}</td>
          <td class="title">性别</td>
          <td><span v-if="detailsDate.sex==1">男</span><span v-if="detailsDate.sex==2">女</span><span v-if="detailsDate.sex==3">保密</span></td>
        </tr>
        <tr>
          <td class="title">考核状态</td>
          <td> {{detailsDate.chk ? detailsDate.chk : '暂无'}}</td>
          <td class="title">手机号</td>
          <td> {{detailsDate.mobile ? detailsDate.mobile : '暂无'}}</td>
        </tr>
        <tr>
          <td class="title">添加时间</td>
          <td>{{detailsDate.create_time ? detailsDate.create_time : '暂无'}} </td>
          <td class="title">身份证号</td>
          <td>{{detailsDate.name_num ? detailsDate.name_num : '暂无'}}  </td>
        </tr>
        <tr>
          <td class="title">地址</td>
          <td>{{detailsDate.address ? detailsDate.address : '暂无'}}  </td>
          <td class="title">发展店铺数</td>
          <td>{{detailsDate.shop_num ? detailsDate.shop_num : '0'}} </td>
        </tr>
        <tr>
          <td class="title">所有1级店有效订单数</td>
          <td>{{detailsDate.ord_num ? detailsDate.ord_num : '0'}}</td>
          <td class="title">开户行</td>
          <td> {{detailsDate.bank_address ? detailsDate.bank_address : '暂无'}}</td>
        </tr>
        <tr>
          <td class="title">卡号</td>
          <td>{{detailsDate.bank_num ? detailsDate.bank_num : '暂无'}}</td>
          <td class="title"> </td>
          <td> </td>
        </tr>
      </table>
    </div>

    <!--订单记录-->
    <div class="dis_table_5">
      <p>店铺列表</p>
      <el-table border ref="multipleTable" :data="orderList" style="width: 100%" tooltip-effect="dark" >
        <el-table-column prop="ordernumber" show-overflow-tooltip label="店铺id" width="250"></el-table-column>
        <el-table-column prop="creationtime" show-overflow-tooltip label="店名" width="250"></el-table-column>
        <el-table-column prop="phone" show-overflow-tooltip label="一级店主名" width="250"></el-table-column>
        <el-table-column prop="price" show-overflow-tooltip label="手机号" width="250"></el-table-column>
        <el-table-column prop="mode_payment" show-overflow-tooltip label="店铺地址" width="250"></el-table-column>
        <el-table-column label="店铺详情">
          <template slot-scope="scope">
            <el-button type="text" @click="goto(scope.row.root_name,scope.row.id)"><span style="color: #3baf22">查看订单</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[10, 20, 30,40,50]" :page-size="limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="count"
                     style="float: right;">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    name: "distributionDetails",
    data() {
      return {
        detailsDate:{
          id:'',
          sex:'',
          chk:'',
          mobile:'',
          create_time:'',
          name_num:'',
          address:'',
          shop_num:'',
          ord_num:'',
          bank_address:'',
          bank_num:''

        }, // 详细数据
        orderList:[],
        type:'',
        currentPage:1, // 当前页码
        limit:10, // 每页条数
        count:0, // 总条数
      }
    },
    mounted: function(){
     this.getdata()
    },
    methods:{
      //分页
      handleSizeChange(val) {
        let _this = this;
        _this.limit = val;
      },
      //分页
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
      },
      getdata(){
        let param={
          sale_id:this.$route.query.id
        }
        apiUser.salerDetail(param).then(res => {
          if(res.cscode==0){
            for(var item1 in this.detailsDate){
              for(var item in res.data.data){
                if(item1==item){
                  this.detailsDate[item1]=res.data.data[item]
                }
              }
            }
            console.log(this.detailsDate)
          }else {
            this.$message.error(res.data.msg)
          }
        })
      }
    }
  }
</script>


<style scoped>
  @import url("../../assets/css/Distribution.css");
.dis_table1 img{width:150px;height: 150px;border-radius: 50%;display: block;margin: 0 auto;margin-bottom: 20px}
</style>
