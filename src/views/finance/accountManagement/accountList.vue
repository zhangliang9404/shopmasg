<template>
  <div class="accountList">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">财务</el-breadcrumb-item>
        <el-breadcrumb-item>对账管理</el-breadcrumb-item>
        <el-breadcrumb-item>对账列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh()">刷新</el-button>
    </div>
    <div class="btn_box">
      <ul>
        <li @click="dialogVisible = true"><i class="el-icon-search"></i><span>筛选查询</span></li>
        <li>
          <el-button v-if="!appear" @click="appear=!appear"  style="width: 100px"><i class="el-icon-arrow-down"></i>收起筛选</el-button>
          <el-button v-if="appear" @click="appear=!appear" style="width: 100px"><i class="el-icon-arrow-up"></i>筛选</el-button>
          <el-button @click="search_result">查询结果</el-button>
          <el-button @click="dialogTableVisible">高级检索</el-button>
        </li>
      </ul>
    </div>
    <el-dialog title="高级检索" :visible.sync="dialogTableVisibles">
      <div class="chunk">
        <span style="margin-right: 6px">订单类型</span>
        <el-select v-model="inner.typemodel" clearable placeholder="请选择">
          <el-option
            v-for="item in inner.typeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span style="margin-left: 18px;margin-right: 6px">支付时间</span>
        <el-date-picker
          v-model="inner.datevalue1"
          type="date"
          @change="paytime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="chunk" style="margin: 20px auto">
        <span style="margin-right: 6px">支付方式</span>

        <el-select v-model="inner.paymodel" clearable placeholder="请选择">
          <el-option
            v-for="item in inner.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span style="margin-right: 6px;margin-left: 20px"> 交易金额</span>

        <el-input v-model="minmoney2" placeholder="最小值" style="width: 80px;font-size: 10px"></el-input><span style="margin: 0 6px">---</span>
        <el-input v-model="maxmoney2" placeholder="最大值" style="width: 80px;font-size: 10px"></el-input>
      </div>
      <div class="chunk" style="margin: 20px auto">
        <span style="margin-right: 6px">对账状态</span>

        <el-select v-model="inner.statusvalu" clearable placeholder="请选择">
          <el-option
            v-for="(item,index) in out.statusoptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span style="margin-left: 18px;margin-right: 6px">对账时间</span>
        <el-date-picker
          v-model="inner.datevalue2"
          type="date"
          @change="accounttime"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="chunk_foot" style="margin-top: 20px;margin-left: 70px">
        <el-button type="primary" style=" width: 100px" @click="reset_search">重置</el-button>
        <el-button type="primary" style="width: 100px" @click="start_search">开始检索</el-button>
      </div>
    </el-dialog>
    <div class="generalScreening" v-if="!appear">
      <div class=""></div>
      <ul>
        <li>订单编号：<el-input v-model="out.OrderNumber" placeholder="订单编号" style="width: 180px;" clearable=""></el-input>
        </li>
        <li>
        <li>
         交易状态：
          <el-select v-model="out.transactionvalue" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in out.transactionoptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          对账状态：

          <el-select v-model="out.statusvalue" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in out.statusoptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>商品名称：<el-input v-model="out.goods_name" placeholder="商品名称" style="width: 180px;" clearable></el-input>
        </li>
      </ul>
    </div>
    <div class="content_box">
      <div class="content_box_btn">
        <ul>
          <li>
            <el-select v-model="value" placeholder="批量对账" clearable @change="ff(multipleSelection)">
              <el-option v-for="item in batchs" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          <li>
            <el-button type="primary" @click="exportDatas(multipleSelection)">导出</el-button>
          </li>
          <li>
            <el-select v-model="value2" placeholder="排序方式"  @change="changeSort">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <div><p><i class="el-icon-tickets"></i><span>数据列表</span></p></div>
      <el-table ref="multipleTable" :data="accountList" border tooltip-effect="dark"
        style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="订单编号" show-overflow-tooltip style="position: relative">
          <template slot-scope="scope">{{ scope.row.ordernumber }}
            <span class="sign" v-if="scope.row.supplier_id>0">供</span></template>

        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template slot-scope="scope">￥{{scope.row.price }}</template>
        </el-table-column>

        <el-table-column
          label="商品名称"
          width="120"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.name ? scope.row.name  :'暂无'}}</template>
        </el-table-column>
        <el-table-column
          label="规格"
          width="120">
          <template slot-scope="scope">{{scope.row.sku_font ? scope.row.sku_font :'暂无'}}</template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="120">
          <template slot-scope="scope">{{scope.row.goods_num }}</template>
        </el-table-column>

        <el-table-column
          label="支付时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.paytime ? chuan(scope.row.paytime) : '暂无'  }}</template>
        </el-table-column>
        <el-table-column
          label="交易状态"
          show-overflow-tooltip>
          <template slot-scope="scope">{{  scope.row.status | capitalize }}</template>
        </el-table-column>
       <!-- <el-table-column label="支付方式" show-overflow-tooltip>
          <template slot-scope="scope">微信</template>
        </el-table-column>
        <el-table-column label="支付时间" show-overflow-tooltip>
          <template slot-scope="scope">{{chuan(scope.row.paytime)  }}</template>
        </el-table-column>
        <el-table-column label="对账人员" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.finance_name }}</template>
        </el-table-column>
        <el-table-column label="对账时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.finance_time}}</template>
        </el-table-column>

        <el-table-column
          label="对账状态"
          show-overflow-tooltip>
        </el-table-column>-->
        <el-table-column label="状态" show-overflow-tooltip>

          <template slot-scope="scope">{{ scope.row.finance_status }}</template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="dialogVisible(scope.row.id,scope.row.finance_status)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="paginationShow" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="page" :page-sizes="[10, 20, 30,40,50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as utils from "../../../common/utils.js"
  import {api_finance} from "../../../api/api.js"
  let apifinance = new api_finance();
  export default {
    name: "accountList",
    data() {
      return {
        page: 1,
        limit:10,
        total:0,

        paginationShow:true,
        checklength:true,//一段时间
        appear:true,//收起

        paginationShow: true,
        checklength: true,//一段时间
        appear: true,//收起
        datevalue1:'',//支付时间

        datevalue2:'',//对账时间
        paytimes:'',
        accounttimes:'',
        dialogTableVisibles:false,
        firstcheck:true,//初始化分页
        secondcheck:false,//普通查询分页
        thirdcheck:false,//高级查询分页
        fourcheck:false,
        pliangarr:[],
        /*form:{
          model:'',
          paytimers:'',
          status:'',
          zhitimers:'',
        },
*/
        out:{
          goods_name:'',//商品名称
          OrderNumber:'', // 订单编号
          transactionvalue:'',
          transactionoptions:[//交易状态
            {
              value: "1",
              label: '成功'
            },
            {
              value: "2",
              label: '退款'
            },
          ],
          statusvalue:'',
          statusoptions:[ { //对账状态
            value: "4",
            label: '未对账'
          },
            {
              value: "1",
              label: '已对账'
            },
            {
              value: "2",
              label: '异常'
            }, {
              value: "3",
              label: '已冲正'
            }],//状态
        },
        inner:{
          ord_id:'',//订单编号
          datevalue1:'',//支付时间
          paymodel:'',//弹框支付方式
          typemodel:'',
          typeoptions:[{
            value:'0',
            label:'自营'
          },
            {
              value:'1',
              label:'供应商'
            }],
          options:[{
            value: '微信',
            label: '微信'
          }],
          statusvalu:'',//对账状态
          datevalue2:'',//对账时间

        },

        minmoney2:'',
        maxmoney2:'',
        // 对账状态
        // 批量
        batchs: [
          {
            value: "4",
            label: '未对账'
          },
          {
            value: "1",
            label: '已对账'
          },
          {
          value: "2",
          label: '异常'
        }, {
          value: "3",
          label: '已冲正'
        }],
        options1: [{
          value: '选项1',
          label: '选中数据'
        }, {
          value: '选项2',
          label: '全部数据'
        }
        ],
        options2: [
          {
            label:"正序",
            value:1
          },
          {
            label:"倒序",
            value:2

          },
        ],
        statusvalu2:'',
        // 对账状态
        reconciliationState:'',
        value:'',
        value1: '',
        value2: '',
        input:'',
        accountstatus:'',//弹框支付状态
        much:'',//弹框金额
        isDisabled1:true,
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
        accountList: [], // 列表数据
        multipleSelection: [], // 选择数据
        listId:''
      }
    },
    mounted(){
      this.getalllist();
    },
    methods: {
      // 刷新
      refresh(){
        location.reload()
      },
      // 点击高级检索弹出对话框
      dialogTableVisible:function(){
        let _this = this;
        _this.dialogTableVisibles = true
      },
      //初始化获取对账裂变数据
      getalllist(){

        var _this=this
        if(_this.value2==''){
          var sort=2
        }else {
          var sort=_this.value2
        }
        let param = {
          page: _this.page,
          limit: _this.limit,
          sort:sort
        }
        var arr=[]
        param = utils.filterJson(param);
        apifinance.getAccountListData(param).then(res =>{
          if(res.cscode == "0"){
            for(var i =0;i<res.data.data.length;i++){
              if(res.data.data[i].finance_status != 4){
                res.data.data[i].finance_time = _this.chuan( res.data.data[i].finance_time);
              }else{
                res.data.data[i].finance_time = "还未对账";
                res.data.data[i].finance_name = "暂无"
              }
              if(res.data.data[i].finance_status == "4"){
                res.data.data[i].finance_status = "未对账"
              }
              if(res.data.data[i].finance_status == "1"){
                res.data.data[i].finance_status = "已对账"
              }
              if(res.data.data[i].finance_status == "2"){
                res.data.data[i].finance_status = "异常"
              }
              if(res.data.data[i].finance_status == "3"){
                res.data.data[i].finance_status = "已冲正"
              }
            }
            _this.accountList=res.data.data; // 列表数据
            _this.total = res.data.count; // 总数
          }else {
            _this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
          }
        })
      },
      // 点击导出按钮
      exportDatas:function(rows){

        console.log(rows)
        let _this = this
        if(_this.value2==''){
          var sort=2
        }else {
          var sort=_this.value2
        }
        if(_this.value2==''){
          var sort=2
        }else {
          var sort=_this.value2
        }
        let ids = []
        if (rows) {
          rows.forEach(row => {
            ids.push(row.id)
          })
        }
        let search =ids.toString();
        let page = _this.page; // 当前页码
        let limit= _this.limit; // 每页多少条数据
        window.location.href="http://api.zhisoufangdichan.com/api/v1/finance/finance_excel?documents_type=2&search="+search+"&page=1"+"&limit="+limit+"&sort="+sort

      },
      // 点击查看详情
      dialogVisible:function(id,status){
        let ids = id;
        if(status=="未对账"){
          this.$router.push({path: '/accountDetailsNotOutofAccount',query:{ id:ids}});
        }
        if(status=="已对账"){
          this.$router.push({path: '/AccountStatementAlreadyReconciled',query:{ id:ids}});
        }
        if(status=="异常"){
          this.$router.push({path: '/AccountStatementabnormal',query:{ id:ids}});
        }
        if(status=="已冲正"){
          this.$router.push({path: '/AccountStatementHavebeencorrected',query:{ id:ids}});
        }
      },
      getzhifu_status(datas){
        if(datas==1){
          return '微信'
        }
      },
      handleSizeChange(val) {
        let _this=this
        if(_this.value2==''){
          var sort=2
        }else {
          var sort=_this.value2
        }
        _this.limit=val
        if(_this.firstcheck){
          _this.getalllist()
          return
        }
        if(_this.secondcheck){
          let param = {
            limit:_this.limit,
            page:1,
            ord_id:_this.out.OrderNumber,
            finance_status:_this.out.statusvalue,
            status:_this.out.transactionvalue,
            goods_name:_this.out.goods_name,
            sort:sort
          }
          _this.searchbao(param)
          return
        }

        if(_this.thirdcheck){
          let param={
            pay_model:'',
            pay_time:_this.paytimes,
            finance_status:_this.inner.statusvalu,
            finance_time:_this.accounttimes,
            is_supplier:this.inner.typemodel,
            ord_id:_this.inner.ord_id,
            page:1,
            limit:_this.limit,
            money:{
              one:_this.getmoney(_this.minmoney2),
              end:_this.getmoney(_this.maxmoney2)
            },
            sort:sort

          }
          _this.start_searchbao(param)
        }
        if(_this.fourcheck){
          var params={
            page:1,
            limit:_this.limit,
            sort:_this.listId
          }
          //库存的所有信息
          _this.paixu(params)
        }

        console.log(`每页 ${val} 条`);
      },
      changePage(){
        let _this = this
        if(_this.value2==''){
          var sort=2
        }else {
          var sort=_this.value2
        }
        if(_this.firstcheck){
          _this.getalllist()
        }
        if(_this.secondcheck){
          let param = {
            limit:_this.limit,
            page:_this.page,
            ord_id:_this.out.OrderNumber,
            finance_status:_this.out.statusvalue,

            status:_this.out.transactionvalue,
            goods_name:_this.out.goods_name,
            sort:sort
          }
          _this.searchbao(param)

        }
        if(_this.thirdcheck){
          if(_this.value2==''){
            var sort=2
          }else {
            var sort=_this.value2
          }
          let param={
            pay_model:'',
            pay_time:_this.paytimes,
            finance_status:_this.inner.statusvalu,
            finance_time:_this.accounttimes,
            is_supplier:this.inner.typemodel,
            ord_id:_this.inner.ord_id,
            page:_this.page,
            limit:_this.limit,
            money:{
              one:_this.getmoney(_this.minmoney2),
              end:_this.getmoney(_this.maxmoney2)
            },
            sort:sort

          }
          _this.start_searchbao(param)
        }
      /*  if(_this.fourcheck){
          var params={
            page:val,
            limit:_this.limit,
            sort:_this.listId
          }
          //库存的所有信息
          _this.paixu(params)
        }*/
      },
      handleCurrentChange(val) {
        let _this = this
        _this.page = val
        _this.changePage()
      },
      //支付时间
      paytime(val){
        if(val){
          console.log(val.getTime())
          this.paytimes=Number(String(val.getTime()).slice(0,10))
        }else {
          console.log(this.paytimes)
          this.paytimes=''
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

      //排列方式的事件
      changeSort(listIds){
       this.changePage()
      },
      //对账时间
      accounttime(val){
        if(val){

          console.log(val.getTime())
          this.accounttimes=Number(String(val.getTime()).slice(0,10));
        }else {
          this.accounttimes=''

          this.accounttimes=Number(String(val.getTime()).slice(0,10));

        }
      },
      //查询结果
      search_result(){

        var _this=this
        _this.firstcheck=false
        _this.thirdcheck=false
        _this.secondcheck=true

       if(_this.out.goods_name=='' && _this.out.OrderNumber=="" && _this.out.statusvalue=="" && _this.out.transactionvalue==''){
         _this.$message("请输入搜索条件")
       }else{
         if(_this.value2==''){
           var sort=2
         }else {
           var sort=_this.value2
         }
         let param = {
           limit:_this.limit,
           page:1,
           ord_id:_this.out.OrderNumber,
           finance_status:_this.out.statusvalue,
           status:_this.out.transactionvalue,
           goods_name:_this.out.goods_name,
           sort:sort
         }
         _this.searchbao(param)
         _this.paginationShow = false

         _this.handleCurrentChange(1)
         _this.$nextTick(function () {

           _this.paginationShow = true;

         })
       }

      },
      //查询包装
      searchbao(param){
        var _this=this
        apifinance.financeRemark(param).then(res =>{
          if(res.cscode==0){
            _this.$message(res.data.msg)
            for(var i =0;i<res.data.data.length;i++){
              if(res.data.data[i].finance_status!=4){
                res.data.data[i].finance_time=_this.chuan( res.data.data[i].finance_time)
              }else{
                res.data.data[i].finance_time="还未对账"
                res.data.data[i].finance_name="暂无"
              }
              if(res.data.data[i].finance_status=="4"){
                res.data.data[i].finance_status = "未对账"
              }
              if(res.data.data[i].finance_status=="1"){

                res.data.data[i].finance_status = "已对账"

              }
              if(res.data.data[i].finance_status=="2"){
                res.data.data[i].finance_status = "异常"
              }
              if(res.data.data[i].finance_status=="3"){
                res.data.data[i].finance_status = "已冲正"
              }
            }
            _this.accountList=res.data.data
            _this.total = res.data.count

          }else{
            _this.$message(res.data.msg)
          }
          console.log(res)

        })
      },
      //重置
      reset_search(){
        let _this = this
        _this.inner.ord_id='',
        _this.inner.datevalue1=''
        _this.inner.paymodel=''
        _this.inner.statusvalu=''
        _this.inner.datevalue2=''
        _this.minmoney2=''
        _this.maxmoney2=''
      },

      //高级检索

      start_search(){
        let _this=this
        _this.firstcheck=false
        _this.secondcheck=false
        _this.thirdcheck=true
       if( _this.inner.ord_id=='' && _this.paytimes ==undefined &&
            _this.inner.statusvalu=='' &&  _this.accounttimes==undefined &&_this.minmoney2=="" && _this.maxmoney2=="" ){
          _this.$message("请输入搜索条件")

        }else{
         console.log("aa")
           if(_this.value2==''){
             var sort=2
           }else {
             var sort=_this.value2
           }
          let param={
            pay_model:'',
            pay_time:_this.paytimes,
            finance_status:_this.inner.statusvalu,
            finance_time:_this.accounttimes,
            is_supplier:this.inner.typemodel,
            ord_id:_this.inner.ord_id,
            page:1,
            limit:_this.limit,
            money:{
              one:_this.getmoney(_this.minmoney2),
              end:_this.getmoney(_this.maxmoney2)
            },
            sort:sort

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
      //过滤器

      //高级检索包装
      start_searchbao(param){
        var _this=this
        apifinance.searchHeightview(param).then(res =>{
          if(res.cscode==0){
            _this.$message(res.data.msg)
            for(var i =0;i<res.data.data.length;i++){
              if(res.data.data[i].finance_status!=4){
                res.data.data[i].finance_time=_this.chuan( res.data.data[i].finance_time)
              }else{
                res.data.data[i].finance_time="还未对账"
                res.data.data[i].finance_name="暂无"
              }
              if(res.data.data[i].finance_status=="4"){
                res.data.data[i].finance_status = "未对账"
              }
              if(res.data.data[i].finance_status=="1"){

                res.data.data[i].finance_status = "已对账"

              }
              if(res.data.data[i].finance_status=="2"){
                res.data.data[i].finance_status = "异常"
              }
              if(res.data.data[i].finance_status=="3"){
                res.data.data[i].finance_status = "已冲正"
              }
            }
            _this.accountList=res.data.data
            _this.total = res.data.count

          }else{
            _this.$message(res.data.msg)
          }
          _this.dialogTableVisibles =false
        })
      },
      //下拉框改变列表该变
      handleSelectionChange(val){
        let _this = this
        _this.multipleSelection = val;
        console.log(_this.multipleSelection)
        if(val.length==0){
          _this.isDisabled1=false
        }
        if(val.length>0){
          _this.isDisabled1=true
        }
      },

      ff(multipleSelection){
        var _this=this
        var str=_this.value
        var idarr=[]
        console.log(_this.multipleSelection)
        console.log(this.value)
        if( this.value){
          if(_this.multipleSelection.length>0){
            var arr=_this.multipleSelection
            for(var i=0;i<arr.length;i++){
              idarr.push(arr[i].id)

            }
            let param={
              id:idarr,
              finance_status:str,
              finance_name:sessionStorage.getItem("token2")
            }
            console.log(param)
            apifinance.batch(param).then(res =>{
              console.log(res)
              if(res.cscode==0){
                this.$alert("修改成功", '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                  }
                })
                _this.changePage()
              }else{
                this.$alert("修改失败", '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                  }
                })
              }

            })
          }else {
            alert("请选择要更改的内容")
            _this.value=''
          }
        }


      }


    },
    filters:{
      capitalize:function(value){
        if(value==1 || value==3 || value==4 || value==5 || value==7 || value==9 || value==10 || value==12 ||
          value==13 || value==15){
          return '成功'
        }else if(value==6 || value==8){
          return '退款'
        }else {
          return '暂无'
        }

      }
    }

  }
</script>

<style scoped>
  .sign{
    padding: 2px 6px;
    color: #13ce66;
    border-radius: 50%;
    border: 1px solid #13ce66;
    position: absolute;
    top: 10px;
    z-index: 99;
  }
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
