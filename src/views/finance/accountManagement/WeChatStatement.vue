<template>
  <div class="WeChatStatement">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">财务</el-breadcrumb-item>
        <el-breadcrumb-item >对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>微信对账列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-refresh" @click="shua">刷新</el-button>
    </div>
    <div class="btn_box">
      <ul>
        <li><i class="el-icon-search"></i><span>筛选查询</span></li>
        <li>
          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            icon="el-icon-date"
            :picker-options="pickerOptions2" @change="longtime">
          </el-date-picker>
          <el-button v-if="!appear" @click="appear=!appear"  style="width: 100px"><i class="el-icon-arrow-down"></i>收起筛选</el-button>
          <el-button v-if="appear" @click="appear=!appear" style="width: 100px"><i class="el-icon-arrow-up"></i>筛选</el-button>
          <el-button @click="search_result">查询结果</el-button>
          <el-button @click="dialogTableVisible">高级检索</el-button>
        </li>
      </ul>
    </div>
    <el-dialog title="高级检索" :visible.sync="dialogTableVisibles">
      <div class="chunk">
       <span style="margin-right: 6px">支付方式</span>
          <el-select v-model="paymodel" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

       <span style="margin-left: 18px;margin-right: 6px">支付时间</span>
          <el-date-picker
            v-model="datevalue1"
            type="date"
            @change="paytime"
            placeholder="选择日期时间">
          </el-date-picker>
      </div>
      <div class="chunk" style="margin: 20px auto">
        <span style="margin-right: 6px">交易状态</span>

          <el-select v-model="statusvalu2" clearable placeholder="请选择">
            <el-option
              v-for="(item,index) in statusoptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        <span style="margin-left: 18px;margin-right: 6px">对账时间</span>
          <el-date-picker
            v-model="datevalue2"
            type="date"
            @change="accounttime"
            placeholder="选择日期时间">
          </el-date-picker>
      </div>
      <div class="chunk">
        <span style="margin-right: 6px"> 金额范围</span>
        <el-input v-model="minmoney2" placeholder="最小值" style="width: 80px;font-size: 10px"></el-input><span style="margin: 0 6px">---</span>
        <el-input v-model="maxmoney2" placeholder="最大值" style="width: 80px;font-size: 10px"></el-input>
       <span style="margin-left: 42px;margin-right: 6px">订单编号</span>
        <el-input v-model="dnumber" style="width: 220px"></el-input>
      </div>

        <div class="chunk_foot" style="margin-top: 20px;margin-left: 70px">

            <el-button type="primary" style=" width: 100px" @click="reset_search">重置</el-button>
            <el-button type="primary" style="width: 100px" @click="start_search">开始检索</el-button>

        </div>

     <!-- </el-form>-->
    </el-dialog>
    <div class="generalScreening" v-if="!appear">
      <div class=""></div>
      <ul>
        <li>订单编号：<el-input v-model="input" placeholder="订单编号" style="width: 180px;"></el-input>
        </li>
        <li>
          金额范围：
          <el-input v-model="minmoney" placeholder="最小值" style="width: 80px;font-size: 10px"></el-input><span style="margin: 0 6px">---</span>
          <el-input v-model="maxmoney" placeholder="最大值" style="width: 80px;font-size: 10px"></el-input>
        </li>
        <li>
          交易状态：
          <el-select v-model="statusvalue" placeholder="请选择">
            <el-option
              v-for="(item,index) in statusoptions2"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          商品名称：<el-input v-model="goodsName" placeholder="订单编号" style="width: 180px;"></el-input>
        </li>
      </ul>
    </div>
    <div class="content_box">
      <div class="content_box_btn">
        <ul>
          <li>
            <el-button type="primary" @click="exportDatas(multipleSelection)">导出</el-button>
          </li>

        </ul>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="订单编号"
          width="120">
          <template slot-scope="scope">{{ scope.row.ord_id }}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="商品名称"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.goods_name}}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="订单金额"
          width="120">
          <template slot-scope="scope">￥{{ scope.row.ord_price }}</template>
          pay_time  </el-table-column>
        <el-table-column
          prop="pay_model"
          label="支付方式"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ getzhifu_status(scope.row.pay_model)}}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="支付时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{chuan(scope.row.pay_time)}}</template>
        </el-table-column>
        <el-table-column
          prop="pay_type"
          label="交易类型"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="交易状态"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.pay_status | capitalize}}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible( scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="paginationShow"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 30,40,50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as utils from "../../../common/utils.js"
  import {api_finance} from "../../../api/api.js"
  let apifinance = new api_finance();
    export default {
        name: "WeChatStatement",
      data() {
        return {
          page: 1,//当前页码
          count:0,//总条数
          limit:10,//每页条数
          paginationShow:true,
          checklength:true,//一段时间
          appear:true,//收起
          datevalue1:'',//支付时间
          datevalue2:'',//对账时间
          first_time:'',
          last_time:'',
          formLabelWidth: '120px',
          dialogTableVisibles:false,
          firstcheck:true,//初始化分页
          secondcheck:false,//普通查询分页
          thirdcheck:false,//高级查询分页
          statusoptions:[
            {value:'SUCCESS',label:'成功'},
            {value:'REFUND',label:'退款'},
            ],//状态
          goodsName:'',//商品名称
          statusvalue:'',
          statusvalu2:'',
          statusoptions2:[
            {value:'SUCCESS',label:'成功'},
            {value:'REFUND',label:'退款'},
            ],//状态
          minmoney:'',
          maxmoney:'',
          minmoney2:'',
          maxmoney2:'',
          dnumber:'',
          options:[{
            value: '微信',
            label: '微信'
          }],
          paymodel:'',//弹框支付方式
          accountstatus:'',//弹框支付状态
          much:'',//弹框金额
          input:'',
          paytimes:'',//支付时间
          accounttimes:'',//对账时间
          shua(){
            location.reload()
          },
          // 时间选择插件
          pickerOptions2: {
            shortcuts: [{
              text: '最近一天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          value7: '',
          tableData3: [],
          multipleSelection: []
        }
      },
      methods: {
          // 点击高级检索弹出对话框
        dialogTableVisible:function(){

          let _this  =this
          _this.dialogTableVisibles =true
        },
        handleSizeChange(val) {
          var _this=this
          _this.limit=val
          if(_this.firstcheck){
            _this.getalllist()
          }
          if(_this.secondcheck){
            let param = {
              ord_id:_this.input,
              status:_this.statusvalue,
              money:{one:_this.getmoney(_this.minmoney),end:_this.getmoney(_this.maxmoney)},
              time:{first:_this.first_time,last:_this.last_time},
              page:1,
              limit:val,
            }
            _this. search_resultbao(param)

          }
          if(_this.thirdcheck){
            let param={
              pay_model:'',
              pay_time:_this.paytimes,
              pay_status:_this.statusvalu2,
              chk_time:_this.accounttimes,
              ord_id:_this.dnumber,
              money:{
                one:_this.getmoney(_this.minmoney2),
                end:_this.getmoney(_this.maxmoney2)
              },
              page:1,
              limit:val,

            }
            _this.start_searchbao(param)
          }
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          let _this = this
          if(_this.firstcheck){
            _this.getalllist()
          }
          if(_this.secondcheck){
            let param = {
              ord_id:_this.input,
              goods_name:_this.goodsName,
              status:_this.statusvalue,
              money:{one:this.getmoney(_this.minmoney),end:_this.getmoney(_this.maxmoney)},
              time:{first:_this.first_time,last:_this.last_time},
              page:val,
              limit:_this.limit,
            }
            _this. search_resultbao(param)

          }
          if(_this.thirdcheck){
            let param={

              pay_model:'',
              pay_time:_this.paytimes,
              pay_status:_this.statusvalu2,
              chk_time:_this.accounttimes,
              ord_id:_this.dnumber,
              money:{
                one:_this.minmoney2,
                end:_this.maxmoney2
              },
              page:val,
              limit:_this.limit,

            }
            _this.start_searchbao(param)
          }
          console.log(`当前页: ${val}`);
        },
        //支付状态过滤


        //一段时间
        longtime(val){
          let _this=this
          console.log(val)
          if(val){

            _this.first_time=Number(String(new Date(val[0]).getTime()).slice(0,10))
            _this.last_time=Number(String(new Date(val[1]).getTime()).slice(0,10))
          }else {
            _this.first_time=''
            _this.last_time=''
          }


        },
        //详情
        dialogVisible(id){
          this.$router.push({path:'/wechatReconciliationDetails',query:{id:id}});
        },
        //下拉框改变列表该变
        handleSelectionChange(val){
          let _this = this
          _this.multipleSelection = val;
          console.log(_this.multipleSelection)
        },
        // 点击导出按钮
        exportDatas:function(rows){
          console.log(rows)
          let _this = this

          let ids = []
          if (rows) {
            rows.forEach(row => {
              ids.push(row.id)
            })
          }
          console.log(ids)
          let search =ids.toString()
          console.log(search);
          let page = _this.page//当前页码
          let limit= _this.limit//每页多少条数据
          window.location.href="http://api.zhisoufangdichan.com/api/v1/finance/wx_excel?documents_type=2&search="+search+"&page=1"+"&limit="+limit
        },
        //初始化
        getalllist(){
          var _this=this
          let param = {
            page:_this.page,
            limit:_this.limit
          }
          param = utils.filterJson(param);
          apifinance.getAcountList(param).then(res =>{
            console.log(res)
            _this.tableData3=res.data.data
            _this.count = res.data.count

          })
        },
        //查询结果
        search_result(){
          var _this=this
          _this.page=1
          _this.firstcheck=false
          _this.secondcheck=true
          _this.thirdcheck=false

          if(_this.input=="" && _this.statusvalue=="" &&_this.minmoney==""&& _this.maxmoney=="" && _this.first_time=="" && _this.last_time=="" && _this.goodsName=='' ){
            _this.$message("请输入搜索条件")
          }else {
            let param = {
              ord_id:_this.input,
              status:_this.statusvalue,
              money:{one:_this.getmoney(_this.minmoney),end:_this.getmoney(_this.maxmoney)},
              time:{first:_this.first_time,last:_this.last_time},
              page:1,
              limit:_this.limit,
              goods_name:_this.goodsName
            }
            console.log(param)
            _this. search_resultbao(param)
            _this.paginationShow = false

            _this.handleCurrentChange(1)
            _this.$nextTick(function () {

              _this.paginationShow = true;

            })
          }



        },
        //查询包装
        search_resultbao(param){
          var _this=this
          apifinance. searchAcountList(param).then(res =>{
            console.log(res)
            if(res.cscode==0){
              _this.$message(res.data.msg)
              _this.tableData3=res.data.data
              _this.count = res.data.count
            }else{
              _this.$message(res.data.msg)
              _this.input=""
              _this.statusvalue=""
              _this.minmoney=""
              _this.maxmoney=""
              _this.first_time=""
              _this.last_time=""
            }

          })
        },
        //钱的格式
        getmoney(strin){
          if(strin!=''){
            var str=strin.toString()
            var rs = str.indexOf('.');//判断是否有小数点
            if (rs < 0) {
              rs = str.length;
              str += '.';
            }
            while (str.length <= rs + 2) {
              str += '0';
            }
            return  str
          }else {
            return
          }

        },
        //支付时间
        paytime(val){
          if(val){
            console.log(val.getTime())
            this.paytimes=Number(String(val.getTime()).slice(0,10))
          }

        },

        //对账时间
        accounttime(val){
          if(val){
            this.accounttimes=Number(String(val.getTime()).slice(0,10))
          }
        },

        //重置
        reset_search(){
          var _this=this
          _this.dnumber=''
          _this.statusvalu2=''
          _this.paytimes=''
          _this.accounttimes=''
          _this.minmoney2=''
          _this.maxmoney2=''
        },

        //高级检索
        start_search(){
          var _this=this
          _this.firstcheck=false
          _this.secondcheck=false
          _this.thirdcheck=true

          if(_this.paytimes=="" && _this.statusvalu2=="" &&_this.accounttimes==""&& _this.dnumber=="" && _this.minmoney2=="" && _this.maxmoney2=="" ){
            _this.$message("请输入搜索条件")
          }else {
            let param={

              pay_model:'',
              pay_time:_this.paytimes,
              pay_status:_this.statusvalu2,
              chk_time:_this.accounttimes,
              ord_id:_this.dnumber,
              money:{
                one:_this.minmoney2,
                end:_this.maxmoney2
              },
              page:1,
              limit:_this.limit,

            }
            console.log(param)
            _this.start_searchbao(param)
            _this.paginationShow = false

            _this.handleCurrentChange(1)
            _this.$nextTick(function () {

              _this.paginationShow = true;

            })
          }


        },
        //高级检索包装
        start_searchbao(param){
          var _this=this
          apifinance.searchHeightWx(param).then(res =>{
            if(res.cscode==0){
              _this.$message(res.data.msg)
              console.log(res.data.data)
              _this.tableData3=res.data.data
              console.log(_this.tableData3)
              _this.dialogTableVisibles =false
              _this.count = res.data.count
            }else{
              _this.$message(res.data.msg)
            }

          })
        },
        getzhifu_status(datas){
          if(datas==1){
            return '微信'
          }
        },
        //时间处理
        chuan(times){
          var date = new Date(times * 1000);
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = (date.getDate()<10 ? '0'+date.getDate() : date.getDate())+' ';
          var h = ' '+(date.getHours()<10 ? '0'+date.getHours() : date.getHours())+ ':';
          var m = (date.getMinutes()<10 ? '0' +date.getMinutes() :date.getMinutes()) +':';
          var s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
          return Y+M+D+h+m+s
        },
      },
      filters:{
        capitalize:function(value){
          /*var str1=value
          var str='SUCCESS'*/
          if(value.indexOf('SUCCESS')!=-1){
            return '成功'
          }else {
            return '退款'
          }
        }
      },
      mounted(){
        this.getalllist()
      },
    }
</script>

<style scoped>
  ul li {
    padding:0;
    margin:0;
    list-style:none;
  }
  /*头部样式*/
  .header{
    width: 100%;
    border-bottom: 1px solid #ccc;
    line-height: 2.5rem;

  }
  .el-breadcrumb{
    display: inline-block;
  }
  .header .el-button{
    float: right;
  }
  /*按钮盒子样式*/
  .btn_box{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #ccc;
  }
  .btn_box ul li{

    float: left;

  }
  .btn_box ul li:nth-child(2){
    float: right;
    margin-right: 1rem;
  }
  /*内容开始*/
  .content_box{
    margin-top: 20px;
  }
  .content_box ul li  p{
    width: 100%;
    box-sizing: border-box;
  }
  .mailTable{
    width: 100%;
    text-align: center;
    border-collapse:collapse;
    border-spacing:0px;
  }
  .mailTable tr {
    width: 100%;

    height: 40px;
  }
  .mailTable tr td{
    border: 1px solid #ccc;
    box-sizing: inherit;

  }
  .mailTable tr .column{
    width: 40%;
    background-color: #C6E1FD;
  }
  .generalScreening{
    width: 100%;
    height: 50px;
    border: 1px solid #ccc;
  }
  .generalScreening ul{
    height: 100%;
    margin:5px 0px 0px 0px;
  }
  .generalScreening ul li{
    margin-left: 20px;
    float: left;
  }
  .content_box_btn{
    width: 100%;
    height: 50px;
    border: 1px solid #ccc;
    background-color: #d7d6d3;

  }
  .content_box_btn ul{
    float: right;
    margin:5px 0px 0px 0px;
  }
  .content_box_btn ul li{
    float: left;
    margin: 0 5px;
  }

</style>
