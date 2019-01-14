<template>
  <div class="scareBuying">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">营销</el-breadcrumb-item>
      <el-breadcrumb-item>促销活动</el-breadcrumb-item>
      <el-breadcrumb-item>限时抢购</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation"><i class="el-icon-setting"></i>限时抢购活动：管理限时抢购活动</p>
    <!--搜索-->
    <el-input placeholder="请输入内容" v-model="input1" class="search">
      <template slot="prepend">商品名称</template>
      <el-button slot="append" @click="seach()" icon="el-icon-search">查询</el-button>
    </el-input>
    <el-button type="primary" icon="el-icon-plus" @click="$router.push('addScareGroup')">添加限时抢购活动</el-button>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[3,5,10, 20, 30, 40,50]" :page-size="limit"
                   layout="total, sizes, prev, pager, next, jumper" :total="count">
    </el-pagination>
    <!--按钮-->
    <el-button-group class="operatebutton">
      <el-button type="success" size="mini" icon="el-icon-success" plain >全选</el-button>
      <el-button type="primary" size="mini" icon="el-icon-check" plain >反选</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" plain >删除</el-button>
      <el-button type="info" size="mini" icon="el-icon-close" plain >保存排序</el-button>
    </el-button-group>

    <!--运费模板-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.temp_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="100px">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.spec_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.spec_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抢购价格">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.spec_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-input v-model="input"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini">
            <router-link :to="{path:('addScareGroup'),query: {id: scope.row.id}}" >编辑</router-link>
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"//export class api_user{}中的总名称
  import {api_order} from "@/api/api.js"
  let apiUser = new api_user();//给api_user另命名
  let apiOrder = new api_order();
  export default {
    name:'scareBuying',
    data() {
      return {
        input:'',
        currentPage:1,//当前页码
        limit:3,//每页条数
        count:0,//总条数
        tableData:[],//模板列表信息
        children:[],//运费详情
        time1:'',//时间
        input1:'',//搜索
        formLabelWidth: '120px'
      }
    },
    //页面预加载执行
    mounted: function(){
      utils.setCookie("__user_token__","f323a78bc592f4834ec09be710fe2530");
      //获取模板列表
      this.getlist();
    },
    methods: {
      //获取模板列表信息
      getlist() {
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit//每页多少条数据
        };
        param = utils.filterJson(param);
        apiUser.getDeliveryTemplate(param).then(res => {
          console.log(res);
          if(res.cscode=="0"){

            //时间戳转化为时间-循环数组转换
            let time1list = res.data.data;//定义临时变量
            _this.count = res.data.count
            for(let i=0;i<time1list.length;i++){//循环需要转换的数组
              time1list[i].edit_time  = _this.timestampToTime(time1list[i].edit_time);//将需要装换的数据转换
              //数字转换为文字
              let sendstyle = time1list[i].children;//定义临时变量
              for(let j=0;j<sendstyle.length;j++){//循环需要转换的数组
                if(sendstyle[j].send_style=="0"){
                  sendstyle[j].send_style="同城配送"
                }else if(sendstyle[j].send_style=="1"){
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
      // 删除订单
      handleDelete:function(id){
        console.log(id)
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = id
          let param = {
            send_id:ids
          }
          apiOrder.delFreightformwork(param).then(res=>{
            console.log(res)
            if(res.cscode =="0"){
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getlist()
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
      //单选
      handleSelectionChange(val) {
       /* var _this=this;
        _this.multipleSelection = val;
        var newArray=[];
        for(let i=0;i<_this.multipleSelection.length;i++){
          newArray.push(_this.multipleSelection[i].id);
        }
        _this.delShopId=newArray;
        console.log(_this.delShopId)*/
      },
      //全选
      checkAll(val){
        var _this=this;
        _this.multipleSelection = val;
        console.log(val)
        var newArray=[];
        for(let i=0;i<_this.multipleSelection.length;i++){
          newArray.push(_this.multipleSelection[i].id);
        }
        _this.delShopId=newArray;
        console.log(_this.delShopId)
      },
      //查找，搜查
      seach(){
        alert(1)
      }
    },

  }
</script>

<style scoped>
  @import url("../../assets/css/Promotion.css");
</style>
