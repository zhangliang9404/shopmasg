<template>
  <div class="goofoutb_backgroud">
    <el-breadcrumb separator-class="el-icon-arrow-right" style="position: relative">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>入库</el-breadcrumb-item>
      <el-button class="refreshs" type="primary"  @click="RefreshGoodsClassify">刷新</el-button>
    </el-breadcrumb>
    <el-form style="width:100%">
      <div class="user">
        <!--筛选查询
                  <el-button>查询结果</el-button>
                  <el-button>高级检索</el-button>-->
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="overflow: hidden">
            <span style="width: 50%;float: left; font-size: 22px;">筛选查询</span>
            <div style="float: right;overflow:hidden;">
              <el-button style="float: left;" @click="queryStock">查询</el-button>
              <el-button  style="float: right;margin-left: 10px" @click="dialogVisible = true">高级检索</el-button>
            </div>
          </div>
          <div class="character">
            <!--商品名称-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="商品名称 :">
                <el-input v-model="formInline.goods_name" placeholder="请输入商品名称"></el-input>
              </el-form-item>

              <!--操作类型-->
              <el-form-item label="操作类型 :">
                <el-select v-model="formInline.handle_style" placeholder="请选择操作类型">
                  <el-option label="买家已付款" value="1"></el-option>
                  <el-option label="取消订单成功" value="2"></el-option>
                  <el-option label="等待买家收货" value="3"></el-option>
                  <el-option label="买家已经收货(待评价)" value="4"></el-option>
                  <el-option label="交易成功" value="5"></el-option>
                  <el-option label="交易关闭" value="6"></el-option>
                  <el-option label="退款受理" value="7"></el-option>
                  <el-option label="退款成功" value="8"></el-option>
                  <el-option label="退货中" value="9"></el-option>
                  <el-option label="退款被拒绝" value="10"></el-option>
                  <el-option label="团购库存不足" value="11"></el-option>
                  <el-option label="已评价" value="12"></el-option>
                  <el-option label="订单服务终止" value="13"></el-option>
                  <el-option label="取消订单受理" value="14"></el-option>
                  <el-option label="取消订单别驳回" value="15"></el-option>
                  <el-option label="等待买家付款" value="16"></el-option>
                  <el-option label="发布商品" value="17"></el-option>
                  <el-option label="编辑增加商品库存" value="18"></el-option>
                  <el-option label="编辑减少商品库存" value="19"></el-option>
                </el-select>
              </el-form-item>

              <!--操作时间-->
              <el-form-item label="操作时间 :">
                <el-date-picker
                                v-model="formInline.time.start"
                                type="date"
                                placeholder="请选择开始时间">
                </el-date-picker>
                <el-date-picker
                                v-model="formInline.time.end"
                                type="date"
                                placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
      <!--数据列表-->
      <div>
        <!--筛选查询
                  <el-button>查询结果</el-button>
                  <el-button>高级检索</el-button>-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="width: 40%;float: left;">数据列表</span>
            <!--显示条数-->
            <!--<el-select v-model="value4" clearable placeholder="显示条数" style="float: right; padding: 3px 0">-->
            <!--<el-option-->
            <!--v-for="item in options"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--排列方式-->
            <el-select v-model="sortOrders" style="float: right" placeholder="排列方式" @change="changeSort">
              <el-option
                v-for="item in sortOrder"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <!--数据列表显示-->
            <div class="character3">
              <el-table ref="multipleTable"
                        :data="tableData3"
                        stripe
                        current-row-key="index"
                        border
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <!--编号-->
                <el-table-column label="序号"  type="index" width="60" align="center"></el-table-column>
                <!--商品图片-->
                <el-table-column prop="aaa" label="商品图片" width="100">
                  <template slot-scope="scope">
                    <img style="display: block;margin: 0 auto;" :src="scope.row.goods_img==null?'':JSON.parse(scope.row.goods_img)[0]" width="60" height="40" class="head_pic"/>
                  </template>
                </el-table-column>

                <!--商品名称-->
                <el-table-column label="商品名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.goods_name==null?'无':scope.row.goods_name}}</span>
                  </template>
                </el-table-column>

                <!--货号、属性-->
                <el-table-column label="货号/库存" width="150" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <p>货号：{{scope.row.goods_code==null?'无':scope.row.goods_code}}</p>
                      <p>库存：{{scope.row.sku_font==null?'无':scope.row.sku_font}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!--订单号-->
                <el-table-column prop="amend" label="订单号" width="160" show-overflow-tooltip>
                  <template slot-scope="scope">
                    订单号：<span>{{scope.row.ord_id==null?'无':scope.row.ord_id}}</span>
                  </template>
                </el-table-column>

                <!--库存-->
                <el-table-column label="库存" width="80" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.add_del_num==null?'无':scope.row.add_del_num }}
                  </template>
                </el-table-column>

                <!--&lt;!&ndash;库存类型&ndash;&gt;-->
                <el-table-column prop="scope" label="库存类型" width="150" show-overflow-tooltip>
                  <template  slot-scope="scope">
                    <div>
                      <p>数量：{{scope.row.sku_stock==null?'无':scope.row.sku_stock}}</p>
                      <p>剩余：{{scope.row.add_del_num==null?'无':scope.row.add_del_num}}</p>
                    </div>
                  </template>
                </el-table-column>

                <!--操作类型-->
                <el-table-column prop="scope" label="操作类型" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <p v-if="scope.row.handle_style==1">买家已付款</p>
                    <p v-if="scope.row.handle_style==2">取消订单成功</p>
                    <p v-if="scope.row.handle_style==3">等待买家收货</p>
                    <p v-if="scope.row.handle_style==4">买家已经收货(待评价)</p>
                    <p v-if="scope.row.handle_style==5">交易成功</p>
                    <p v-if="scope.row.handle_style==6">交易关闭</p>
                    <p v-if="scope.row.handle_style==7">退款受理</p>
                    <p v-if="scope.row.handle_style==8">退款成功</p>
                    <p v-if="scope.row.handle_style==9">退货中</p>
                    <p v-if="scope.row.handle_style==10">退款被拒绝 </p>
                    <p v-if="scope.row.handle_style==11">团购库存不足</p>
                    <p v-if="scope.row.handle_style==12">已评价 </p>
                    <p v-if="scope.row.handle_style==13">订单服务终止</p>
                    <p v-if="scope.row.handle_style==14">取消订单受理</p>
                    <p v-if="scope.row.handle_style==15">取消订单别驳回</p>
                    <p v-if="scope.row.handle_style==16">等待买家付款</p>
                    <p v-if="scope.row.handle_style==17">发布商品</p>
                    <p v-if="scope.row.handle_style==18">编辑增加商品库存</p>
                    <p v-if="scope.row.handle_style==19">编辑减少商品库存</p>
                  </template>
                </el-table-column>

                <!--操作信息-->
                <el-table-column label="操作信息" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div>
                      <p>{{"管理员："+scope.row.admin_name}}</p>
                      <p>{{scope.row.createtime==null?'2018/09/06':scope.row.createtime}}</p>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <div style="width: 90%;margin-top: 20px;overflow: hidden">
                <div class="methods" style="float: left">
                  <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData3)">全选</el-button>
                  <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData3)">取消全选</el-button>
                  <el-button size="mini" @click="delSelectStock">删除</el-button>
                </div>
                <!--current-page  当前页数-->
                <!--page-sizes   每页多少条数据-->
                <el-pagination style="float: right"
                               v-if="paginationShow"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pages.nowPages"
                               :page-sizes="tiaoshu"
                               :page-size="100"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pages.count"
                               @next-click="nextPages"
                               @prev-click="prevPages">
                </el-pagination>
              </div>
            </div>
          </div>
          <!--用户详情列表-->
        </el-card>
      </div>
    </el-form>


    <el-dialog class="gaoji" title="高级检索" :visible.sync="dialogVisible" width="50%">
      <div class="ordernotes">
        <!--行一-->
        <el-form :inline="true" :model="moreFormInline" class="demo-form-inline">
          <el-form-item label="输入搜索：">
            <el-input v-model="moreFormInline.goods_name" placeholder="商品名称/商品货号"></el-input>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input placeholder="订单编号" v-model="moreFormInline.orderNumber"></el-input>
          </el-form-item>
        </el-form>

        <!--&lt;!&ndash;行二&ndash;&gt;-->
        <el-form :inline="true" :model="moreFormInline" class="demo-form-inline">
          <el-form-item label="库存类型：" >
            <el-select v-model="moreFormInline.InventoryType" placeholder="全部">
              <el-option label="商品库存" value="henan"></el-option>
              <!--<el-option label="货物库存" value="zhengzhou"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型：">
            <el-select v-model="moreFormInline.OperationType" placeholder="活动区域">
              <el-option label="买家已付款" value="1"></el-option>
              <el-option label="取消订单成功" value="2"></el-option>
              <el-option label="等待买家收货" value="3"></el-option>
              <el-option label="买家已经收货(待评价)" value="4"></el-option>
              <el-option label="交易成功" value="5"></el-option>
              <el-option label="交易关闭" value="6"></el-option>
              <el-option label="退款受理" value="7"></el-option>
              <el-option label="退款成功" value="8"></el-option>
              <el-option label="退货中" value="9"></el-option>
              <el-option label="退款被拒绝" value="10"></el-option>
              <el-option label="团购库存不足" value="11"></el-option>
              <el-option label="已评价" value="12"></el-option>
              <el-option label="订单服务终止" value="13"></el-option>
              <el-option label="取消订单受理" value="14"></el-option>
              <el-option label="取消订单别驳回" value="15"></el-option>
              <el-option label="等待买家付款" value="16"></el-option>
              <el-option label="发布商品" value="17"></el-option>
              <el-option label="编辑增加商品库存" value="18"></el-option>
              <el-option label="编辑减少商品库存" value="19"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!--&lt;!&ndash;行三&ndash;&gt;-->
        <el-form :inline="true" prop="moreFormInline" class="demo-form-inline">
          <el-form-item label="操作人员：">
            <el-select v-model="moreFormInline.Operator" placeholder="全部">
              <el-option v-for="(items,index) in heightSearchPeople" :value="items.username" :key="items.id" :label="items.username"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="moreFormInline.OperationTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

        </el-form>

      </div>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="chongzhi">重置</el-button>
			    <el-button type="primary" @click="AdvancedQuery">高级查询</el-button>
  			</span>
    </el-dialog>
  </div>
</template>

<script>
  import { requestLogin } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import {api_Invertory} from "@/api/api.js"
  let apiInvertory = new api_Invertory();
  const cityOptions = ['用户标签名称', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
        //所有库存的信息列表
        tableData3: [],
        paginationShow:true,
        val:[],
        //

        //搜索商品名称
        shopping:{
          shopping_name:"",
          //搜索商品操作类型
          shopping_type:"",
          //搜索商品操作时间
          shopping_time:{},
        },

        //模糊查询input输入,选择,时间框   简单搜索
        formInline: {
          status:1,
          goods_name: '',
          handle_style:'',
          time:{
            start:"",
            end:"",
          },
          page:1,
          limit:10
        },

        //定义高级检索操作人员
        heightSearchPeople:[],
        //精确查询
        moreFormInline:{
          goods_name:"",//商品名称
          orderNumber:"",//订单编号
          InventoryType:"",//库存类型
          OperationType:"",//操作类型
          Operator:"",//操作人员
          OperationTime:{},//操作时间
        },

        //是否点击了搜索
        isClickSearch:false,

        //开始时间转换格式
        beginTime:"",
        //结束时间转换格式
        endTime:"",

        //分页数据
        pages:{
          count:0,
          nowPages:0//当前页数
        },
        //分页条数
        tiaoshu:[10,20,30,40,50],

        //排列方式
        sortOrders:"",
        sortOrder:[
          {
            label:"正序",
            value:0
          },
          {
            label:"倒序",
            value:1
          }
        ],

        //table表格选中得到的数据
        multipleSelection: [],
        //全选、取消全选的禁用状态
        allSelect:true,
        selectDisabled:false,
        clearDisabled:true,

        dialogVisible: false,//确定
        //时间
        value2:'',//模糊查询操作时间
//				推送内容
        checkAll: false,

//				多选标签
        checkedCities: ['上海', '北京'],
        cities: cityOptions,
        isIndeterminate: true,
        // value4: '',
      }
    },

    //操作类型的过滤器
    filters:{
      myMethods:function(datas){
        switch (datas) {
          case 1:
            datas="订单退货"
            break;
          case 2:
            datas="添加商品"
            break;
          case 3:
            datas="订单关闭"
            break;
          case 4:
            datas="订单取消"
            break;
          case 5:
            datas="编辑添加商品"
            break;
        }
        return datas;
      }
    },

    beforeCreate(){
      var _this=this;
      let params={};
      apiInvertory.getPeople(params).then(res => {
        if(res.cscode==0){
          console.log(res.data.data)
          _this.heightSearchPeople=res.data.data;
          console.log(_this.heightSearchPeople)
        }else{
          _this.$message.error(res.data.msg);
        }
      });
    },

    //推送表单   进行判断验证
    mounted(){
      var _this=this;
      //头部信息
      utils.setCookie("__user_token__","e0909c3a435ab57e50c4dfbe95fb2e81");
      var param={
        page:1,
        limit:10,
        status:2,
        sort:''
      }
      _this.stockRendering(param);
    },
    methods: {
      //正则验证价格范围

      //刷新页面
      RefreshGoodsClassify(){
        location.reload()
      },

      //库存信息的渲染事件
      stockRendering(params){
        var _this=this;
        //库存的所有信息
        apiInvertory.WarehousingStockRes(params).then(res => {
          console.log(res)
          if(res.cscode==0){
            console.log(res)
            //总数据
            _this.tableData3=res.data.data;
            //分页
            _this.pages.count=res.data.count;//总条数
            // _this.pages.nowPages=params.page;
            console.log(_this.tableData3)
          }else{
            _this.$message.error(res.data.msg)
          }
        });
      },

      //排列方式的事件
      changeSort(listId){
        var _this=this;
        var params={
          sort:listId,
          page:1,
          limit:10,
          status:2
        }
        console.log(params)
        //库存的所有信息
        apiInvertory.stockSort(params).then(res => {
          if(res.cscode==0){
            console.log(res.data.data)
            _this.tableData3=res.data.data;

          }else{
            _this.$message.error(res.data.msg);
          }
        });

      },
      //点击模糊查询按钮
      queryStock(){
        var _this=this;
        if(_this.formInline.time.start==""&&_this.formInline.time.end==""&&_this.formInline.handle_style==""&&_this.formInline.goods_name==""){
          _this.isClickSearch=false;
          _this.$message.error("请输入或选择所需要查询的条件")
        }
        else if(_this.formInline.handle_style==""&&_this.formInline.goods_name==""&&_this.formInline.time.start==""&&_this.formInline.time.end!=""){
          _this.isClickSearch=false;
          alert("请选择开始日期")
        }else if(_this.formInline.handle_style==""&&_this.formInline.goods_name==""&&_this.formInline.time.start!=""&&_this.formInline.time.end==""){
          _this.isClickSearch=false;
          alert("请选择结束日期")
        }else if(_this.formInline.time.start==""&&_this.formInline.time.end==""){
          _this.isClickSearch=true;
          _this.formInline.page=1;
          console.log(_this.formInline)
          //调用模糊查询接口
          _this.mhSearch(_this.formInline);
          _this.paginationShow = false

          _this.handleCurrentChange(1)
          _this.$nextTick(function () {

            _this.paginationShow = true;})
        }else{
          _this.formInline.page=1;
          _this.isClickSearch=true;
          if(_this.formInline.time.start){
            let start=_this.formInline.time.start;
            _this.zhuanhuan(start)
            console.log(_this.val)
          }
          if(_this.formInline.time.end){
            let end=_this.formInline.time.end;
            _this.zhuanhuan(end)
            console.log(_this.val)
          }
          _this.formInline.time.start=_this.val[0];
          _this.formInline.time.end=_this.val[1];
          console.log(_this.formInline)
          _this.mhSearch(_this.formInline)
          _this.paginationShow = false
          _this.handleCurrentChange(1)
          _this.$nextTick(function () {
            _this.paginationShow = true;})
        }
      },

      //点击高级查询
      // moreFormInline:{
      //   orderNumber:"",//订单编号
      //   InventoryType:"",//库存类型
      //   OperationType:"",//操作类型
      //   Operator:"",//操作人员
      //   OperationTime:"",//操作时间
      // },
      //高级检索的重置按钮
      chongzhi(){
        var _this=this;
        _this.moreFormInline.goods_name="";
        _this.moreFormInline.orderNumber="";
        _this.moreFormInline.InventoryType="";
        _this.moreFormInline.OperationType="";
        _this.moreFormInline.Operator="";
        _this.moreFormInline.OperationTime=[];

        console.log(_this.moreFormInline)
      },

      AdvancedQuery(){
        let _this=this;
        if(_this.moreFormInline.goods_name==""&&_this.moreFormInline.orderNumber==""&&_this.moreFormInline.InventoryType==""&&_this.moreFormInline.OperationType==""&&_this.moreFormInline.Operator==""&&_this.moreFormInline.OperationTime==""){
          _this.$message.error("请输入高级查询的条件");
          _this.dialogVisible=false;
        }else{
          _this.dialogVisible=true;
          let newTimes=_this.moreFormInline.OperationTime;
          console.log(_this.moreFormInline.OperationTime);
          let newTimesSelect=[];
          for(let i=0;i<newTimes.length;i++){
            var year = newTimes[i].getFullYear();//年
            var month = newTimes[i].getMonth()+1;//js从0开始取 月
            var date = newTimes[i].getDate();//日
            var hour = newTimes[i].getHours();//小时
            var minutes = newTimes[i].getMinutes();//分钟
            var second = newTimes[i].getSeconds();//秒
            if(month<10){
              month = "0" + month;
            }
            if(date<10){
              date = "0" + date;
            }
            if(hour <10){
              hour = "0" + hour;
            }
            if(minutes <10){
              minutes = "0" + minutes;
            }
            if(second <10){
              second = "0" + second ;
            }
            newTimesSelect.push(year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second); //2009-06-12 17:18:05时间格式
          }
          console.log(newTimesSelect);
          console.log(_this.moreFormInline.OperationTime)
          // _this.moreFormInline.OperationTime.start=newTimesSelect[0];
          // _this.moreFormInline.OperationTime.end=newTimesSelect[1];
          if(newTimesSelect[0]==""){
            newTimesSelect[0]=""
          }
          if(newTimesSelect[1]==""){
            newTimesSelect[1]=""
          }
          let params={
            page:1,
            limit:10,
            status:1,
            ord_id:_this.moreFormInline.orderNumber,  //订单编号
            admin_name:_this.moreFormInline.Operator, //操作人员
            handle_style: _this.moreFormInline.OperationType,//操作类型
            goods_name:_this.moreFormInline.goods_name, // 商品名称
            stock_style:_this.moreFormInline.InventoryType,//库存类型
            time:{
              start:newTimesSelect[0],
              end:newTimesSelect[1]
            }
          }
          console.log(params)
          _this.HeightSearchs(params);

        }
      },
      //高级检索接口
      HeightSearchs(objesVal){
        var _this=this;
        var param=objesVal;
        console.log(param)
        param.status='2'
        param.sort=''
        // param.goods_code=Number(param.goods_code);
        apiInvertory.HeightSearch(param).then(res => {
          if(res.cscode==0){
            console.log(res)
            _this.$message({
              message: res.data.msg,
              type: 'success'
            });
            //数据总条数重新渲染
            _this.pages.count=res.data.count;//总条数
            _this.tableData3=res.data.data;
            console.log(_this.tableData3)
            //对搜索条件赋值为""
            _this.dialogVisible=false;

            _this.moreFormInline.goods_name="";
            _this.moreFormInline.orderNumber="";
            _this.moreFormInline.InventoryType="";
            _this.moreFormInline.OperationType="";
            _this.moreFormInline.Operator="";
            _this.moreFormInline.OperationTime=[];
            // _this.formInline.handle_style="";


          }else{
            _this.dialogVisible=true;
            console.log(res.data)
            this.$message.error(res.data.msg);
          }
        });
      },
      //数据转换
      zhuanhuan(val){
        var _this=this;
        console.log(val)
        // if(typeof val==)
        var year = val.getFullYear();//年
        var month = val.getMonth()+1;//js从0开始取 月
        var date = val.getDate();//日
        var hour = val.getHours();//小时
        var minutes = val.getMinutes();//分钟
        var second = val.getSeconds();//秒
        if(month<10){
          month = "0" + month;
        }
        if(date<10){
          date = "0" + date;
        }
        if(hour <10){
          hour = "0" + hour;
        }
        if(minutes <10){
          minutes = "0" + minutes;
        }
        if(second <10){
          second = "0" + second ;
        }

        _this.val.push(year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second); //2009-06-12 17:18:05时间格式
        console.log(val)
        return val;
      },

      //模糊查询接口调用
      mhSearch(objesVal){
        var _this=this;
        var param=objesVal;
        console.log(param)
        param.sort=''
        param.status='2'
        // param.goods_code=Number(param.goods_code);
        apiInvertory.searchStockRes(param).then(res => {
          if(res.cscode==0){
            console.log(res)
            _this.$message({
              message: res.data.msg,
              type: 'success'
            });
            //数据总条数重新渲染
            _this.pages.count=res.data.count;//总条数
            _this.tableData3=res.data.data;
            console.log(_this.tableData3)
            //对搜索条件赋值为""
          }else{
            console.log(res.data)
            this.$message.error(res.data.msg);
          }
        });
      },

      toggleSelection(rows) {
        if(rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      //时间选择
      getCity: function (city) {
        console.log(city);
        console.log(this.selectCity)
      },


      //对表格数据进行操作所有相关的事件
      //table表格选中事件
      handleSelectionChange(val) {
        var _this=this;
        _this.multipleSelection = val;
        if(_this.multipleSelection.length<_this.tableData3.length){
          _this.selectDisabled=false;
          _this.clearDisabled=true
        }else{
          _this.selectDisabled=true;
          _this.clearDisabled=false
        }
        console.log(_this.multipleSelection)
      },
      //全选事件
      allSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        console.log(rows)
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row,_this.allSelect);
        });
      },
      //取消全选事件
      CleatAllSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        console.log(rows)
        this.$refs.multipleTable.clearSelection();
      },
      //删除事件
      delSelectStock(){
        var _this=this;
        if(_this.multipleSelection<=0){
          alert("请先选取库存列表")
        }else{
          var param=[];//传递的参数
          for(var i=0;i<_this.multipleSelection.length;i++){
            var idObg=new Object();//定义一个obj接收id添加到param数组
            idObg.id=_this.multipleSelection[i].id;
            param.push(idObg)
          }
          //param即为需要传递的参数
          _this.delMethodsStockRes(param)
        }
      },
      //删除接口事件
      delMethodsStockRes(param){
        var _this=this;
        //库存的所有信息
        let idarr = []
        param.forEach(x=>idarr.push(x.id))
        let params={
          id:idarr.join(',')
        }
        apiInvertory.delStockRes(params).then(res => {
          if(res.cscode==0){
            _this.$message(res.data.msg);
            var paramResult={
              page:1,
              limit:10,
              sort:'',
              status:'2'
            }
            _this.stockRendering(paramResult);
          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
      //分页事件
      //下一页
      nextPages(index){
        var _this=this;
        console.log(_this.isClickSearch)
        if(_this.isClickSearch){
          _this.formInline.page=index;
          console.log(_this.formInline)
          _this.mhSearch(_this.formInline)

        }else{
          var param={
            page:index,
            limit:10
          }
          console.log(param)
          _this.stockRendering(param);
        }

        if(_this.dialogVisible){
          let params={
            page:index,
            limit:10,
            status:1,
            ord_id:_this.moreFormInline.orderNumber,  //订单编号
            admin_name:_this.moreFormInline.Operator, //操作人员
            handle_style: _this.moreFormInline.OperationType,//操作类型
            goods_name:_this.moreFormInline.goods_name, // 商品名称
            stock_style:_this.moreFormInline.InventoryType,//库存类型
            time:{
              start:newTimesSelect[0],
              end:newTimesSelect[1]
            }
          }
          console.log(params)
          _this.HeightSearchs(params);

        }
      },
      //上一页
      prevPages(index){
        var _this=this;
        if(_this.isClickSearch){
          _this.formInline.page=index;
          _this.mhSearch(_this.formInline)
        }else{
          var param={
            page:index,
            limit:10
          }
          console.log(param)
          _this.stockRendering(param);
        }

        if(_this.dialogVisible){
          let params={
            page:index,
            limit:10,
            status:1,
            ord_id:_this.moreFormInline.orderNumber,  //订单编号
            admin_name:_this.moreFormInline.Operator, //操作人员
            handle_style: _this.moreFormInline.OperationType,//操作类型
            goods_name:_this.moreFormInline.goods_name, // 商品名称
            stock_style:_this.moreFormInline.InventoryType,//库存类型
            time:{
              start:newTimesSelect[0],
              end:newTimesSelect[1]
            }
          }
          console.log(params)
          _this.HeightSearchs(params);
        }
      },
      //每页条数改变执行的事件
      handleSizeChange(limit) {
        var _this=this;
        if(_this.isClickSearch){
          _this.formInline.limit=limit;
          _this.mhSearch(_this.formInline)

        }else{
          var param={
            page:1,
            limit:limit
          }
          _this.stockRendering(param);
        }

        if(_this.dialogVisible){
          let params={
            page:1,
            limit:limit,
            status:1,
            ord_id:_this.moreFormInline.orderNumber,  //订单编号
            admin_name:_this.moreFormInline.Operator, //操作人员
            handle_style: _this.moreFormInline.OperationType,//操作类型
            goods_name:_this.moreFormInline.goods_name, // 商品名称
            stock_style:_this.moreFormInline.InventoryType,//库存类型
            time:{
              start:newTimesSelect[0],
              end:newTimesSelect[1]
            }
          }
          console.log(params)
          _this.HeightSearchs(params);

        }
      },
      //当前页发生改变的时候执行的事件
      handleCurrentChange(index) {
        var _this=this;
        if(_this.isClickSearch){
          _this.formInline.page=index;
          _this.mhSearch(_this.formInline)

        }else{
          var param={
            page:index,
            limit:10
          }
          console.log(param)
          _this.stockRendering(param);
        }

        if(_this.dialogVisible){
          let params={
            page:index,
            limit:10,
            status:1,
            ord_id:_this.moreFormInline.orderNumber,  //订单编号
            admin_name:_this.moreFormInline.Operator, //操作人员
            handle_style: _this.moreFormInline.OperationType,//操作类型
            goods_name:_this.moreFormInline.goods_name, // 商品名称
            stock_style:_this.moreFormInline.InventoryType,//库存类型
            time:{
              start:newTimesSelect[0],
              end:newTimesSelect[1]
            }
          }
          console.log(params)
          _this.HeightSearchs(params);

        }
      },


      //多选
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },//推送内容
      handleClick(tab, event) {
        console.log(tab, event);
      },//推送表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Inventory.css");
  .goodsclassify_paging{
    width: 600px;
    float: right;
  }

  .refreshs{
    position: absolute;
    top: 0px;
    right:0;
  }


</style>
