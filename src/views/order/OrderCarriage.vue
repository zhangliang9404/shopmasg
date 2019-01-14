<template>
  <div class="ordercarriage">
    <!--导航-->
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
        <el-breadcrumb-item>运费管理</el-breadcrumb-item>
        <el-breadcrumb-item>运费模板</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
    </div>
    <p class="explanation"><i class="el-icon-setting"></i>运费模板：对运费管理配置</p>
    <!--输入-->
    <el-input class="search" placeholder="运费模板名称" @keyup.enter.native="seach()" v-model="tempName">
      <el-button slot="append" @click="seach()" icon="el-icon-search">搜索</el-button>
    </el-input>
    <el-button type="primary" icon="el-icon-plus" @click="$router.push('ordercaradd')">新增运费模板</el-button>
    <!--运费模板-->
    <!--<div class="model" v-for="item in tableData">-->
      <el-table :data="tableData" border style="width: 100%;margin-top: 20px">
        <el-table-column label="模板名称">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.temp_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算方式" >
          <template slot-scope="scope">
            <span style="margin-left: 10px" v-if="scope.row.bal_style =='0'">普通结算</span>
            <span style="margin-left: 10px" v-else>独立订单结算</span>
          </template>
        </el-table-column>
        <el-table-column label="包邮金额" width="100px">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.spec_money }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送方式" >
          <template slot-scope="scope">
            <p  v-for="item in scope.row.children">
            <span style="margin-left: 10px">同城配送</span>
            <span style="margin-left: 10px" >快递物流</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="默认运费" width="100px">
          <template slot-scope="scope">
            <p  v-for="item in scope.row.children">
              <span style="margin-left: 10px" >{{item.def_freight}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="增加运费" width="100px">
          <template slot-scope="scope">
            <p  v-for="item in scope.row.children">
              <span style="margin-left: 10px" >{{item.def_add_freight}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="最后编辑时间">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.edit_time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="update(scope.row.id)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-sizes="[10, 20, 30, 40,50]" :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>

      <!---->
      <!--<div class="model1">-->
        <!--<span>{{item.temp_name}}</span>-->
        <!--<div style="float: right;">-->
          <!--最后编辑时间：{{item.edit_time}}-->
          <!--<el-button type="text" @click="updateid(item.id)">修改</el-button> |-->
          <!--<el-button type="text">删除</el-button>-->
        <!--</div>-->
      <!--</div>-->
      <!--<el-table :data="item.children" border style="width: 100%">-->
        <!--<el-table-column prop="send_style" label="配送方式" width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="send_address" label="配送地区" show-overflow-tooltip width="350">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="first_num" label="首件(个)">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="first_feight" label="配送费(元)">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="upd_num" label="续件(个)">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="upd_freight" label="配送费(元)">-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    <!--</div>-->
  </div>
</template>

<script>
  import * as http from '../../common/http.js'
  import * as utils from "../../common/utils.js"
  import {api_user} from "../../api/api.js"//export class api_user{}中的总名称
  import {api_order} from "../../api/api.js"
  let apiUser = new api_user();//给api_user另命名
  let apiOrder = new api_order();
  export default {
    name:'ordercarriage',
    data() {
      return {
        currentPage:1,//当前页码
        limit:10,//每页条数
        count:0,//总条数
        tableData:[],//模板列表信息
        children:[],//运费详情
        time1:'',//时间
        tempName:'',//搜索
        formLabelWidth: '120px'
      }
    },
    //页面预加载执行
    mounted: function(){
      var _this=this;
      utils.setCookie("__user_token__","f323a78bc592f4834ec09be710fe2530");
      //获取模板列表
      if(_this.$route.query.muBanId){
        _this.getListId(_this.$route.query.muBanId);
      }else{
        _this.getlist();
      }
    },
    methods: {
      //点击刷新页面
      refresh(){
        location.reload();
      },
      //有参数获取模板列表歇息
      getListId(id){
        let _this = this;
        let param = {
          send_id: id,//当前id
        };
        apiUser.getupdateDeliveryTemplate(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            console.log(res.data);
            let zhuanhuaTime=res.data;
            var date = new Date(res.data.edit_time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            zhuanhuaTime.edit_time=Y+M+D+h+m+s;
            _this.tableData.push(zhuanhuaTime);
          }else{
            _this.$alert(res.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },

      //没有参数 获取模板列表信息
      getlist() {
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit//每页多少条数据
        };
        apiUser.getDeliveryTemplate(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            //时间戳转化为时间-循环数组转换
            let time1list = res.data.data;//定义临时变量
            _this.count = res.data.count;
            for(let i=0;i<time1list.length;i++){//循环需要转换的数组
              if(time1list[i].edit_time == null){  //若从未编辑过显示“尚未编辑”
                time1list[i].edit_time = "尚未编辑"
              }else {
                time1list[i].edit_time  = _this.timestampToTime(time1list[i].edit_time);//将需要装换的数据转换
              }
              //数字转换为文字
              let sendstyle = time1list[i].children;//定义临时变量
              for(let j=0;j<sendstyle.length;j++){//循环需要转换的数组
                if(sendstyle[j].send_style === "0"){
                  sendstyle[j].send_style="同城配送"
                }else if(sendstyle[j].send_style === "1"){
                  sendstyle[j].send_style="全国配送"
                }else{
                  sendstyle[j].send_style="指定配送"
                }
              }
              _this.children = sendstyle//转换过后的数组复制给需要渲染的数据
            }
            _this.tableData = time1list//转换过后的数组赋值给需要渲染的数据
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        let _this = this;
        _this.limit = val;
        _this.getlist()
      },
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
        _this.getlist();
        console.log(`当前页: ${val}`);
      },
      // 将获取的时间戳转换成时间格式
      timestampToTime:function(timestamp) {
        let timestampa = timestamp *1000
        let date = new Date(timestampa);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
      },
      //修改
      updateid(id){
        this.updateVisible = true
        console.log(id);
      },
      //修改模板
      update(id){
        this.$router.push({
          // path:'/ordercarupdate',
          path:'/ordercaradd',
          query: {id: id}
        })
      },
      // 删除订单
      handleDelete:function(id){
        console.log(id)
        let _this = this
        _this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(id)
        let param = {
          send_id:id
        }
          apiOrder.delFreightformwork(param).then(res=>{
            console.log(res)
            if(res.cscode =="0"){
              _this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.getlist()
                }
              })
            }
          })
        }).catch(() => {
          // this.$alert("取消删除", '提示信息', {
          //   confirmButtonText: '确定',
          // })
        });
      },

      //查找，搜查
      seach:function(){
        let _this = this;
        let param = {
          temp_name:_this.tempName
        };
        apiOrder.searchSendTemp(param).then(res=>{
          console.log(res);
          if(res.cscode == "0"){
            //时间戳转化为时间-循环数组转换
            let time1list = res.data.data;//定义临时变量
            _this.count = res.data.count;
            for(let i=0;i<time1list.length;i++){//循环需要转换的数组
              if(time1list[i].edit_time == null){  //若从未编辑过显示“尚未编辑”
                time1list[i].edit_time = "尚未编辑"
              }else {
                time1list[i].edit_time  = _this.timestampToTime(time1list[i].edit_time);//将需要装换的数据转换
              }
              //数字转换为文字
              let sendstyle = time1list[i].children;//定义临时变量
              for(let j=0;j<sendstyle.length;j++){//循环需要转换的数组
                if(sendstyle[j].send_style === "0"){
                  sendstyle[j].send_style="同城配送"
                }else if(sendstyle[j].send_style === "1"){
                  sendstyle[j].send_style="全国配送"
                }else{
                  sendstyle[j].send_style="指定配送"
                }
              }
              _this.children = sendstyle//转换过后的数组复制给需要渲染的数据
            }
            _this.tableData = time1list//转换过后的数组赋值给需要渲染的数据
            // _this.tableData = res.data.data
          }else{
            _this.tableData = res.data.data
          }
        })
      }
    },
  }
</script>

<style scoped>
  @import url("../../assets/css/Order.css");
  /*头部样式*/
  .header{width: 100%;border-bottom: 1px solid #ccc;line-height: 40px;margin-bottom: 12px;}
  .el-breadcrumb{display: inline-block;}
  .header .el-button{float: right;}
</style>
