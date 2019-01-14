<template>
  <div class="OrderList">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation">此处的订单编号查询不受订单状态限制，历史订单列表只显示三个月前的订单</p>
    <!--搜索-->
    <div class="searchBorder">
      <el-form ref="form" :model="form" label-width="100px" class="borderFlex">
        <!--选择时间段-->
        <el-form-item label="选择时间段：" style="width:50%" >
          <el-date-picker type="datetimerange" range-separator="-" style="width:75%"
                          start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="timestamp" v-model="changeTime">
          </el-date-picker>
        </el-form-item>
        <!--会员名-->
        <el-form-item label="会员名：" prop="name" style="width:25%">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <!--订单编号-->
        <el-form-item label="订单编号：" prop="ordernum" style="width:25%">
          <el-input v-model="form.ordernum"></el-input>
        </el-form-item>
        <!--商品名称-->
        <el-form-item label="商品名称：" prop="product_name" style="width:25%">
          <el-input v-model="form.product_name"></el-input>
        </el-form-item>
        <!--收货人-->
        <el-form-item label="收货人：" prop="consignee" style="width:25%">
          <el-input v-model="form.consignee"></el-input>
        </el-form-item>
        <!--打印状态--0是未打印，1是已打印-->
        <el-form-item label="打印状态：" prop="print_mode" style="width:25%">
          <el-select v-model="form.print_mode" placeholder="请选择">
            <el-option label="全部" value=8></el-option>
            <el-option label="未打印" value=0></el-option>
            <el-option label="已打印" value=1></el-option>
          </el-select>
        </el-form-item>
        <!--订单来源-->
        <el-form-item label="订单来源：" prop="order_source">
          <el-select v-model="form.order_source" placeholder="请选择">
            <el-option label="全部" value=0></el-option>
            <el-option label="普通订单" value=1></el-option>
            <el-option label="拼团订单" value=5></el-option>
          </el-select>
        </el-form-item>
        <!--配送方式-->
        <el-form-item label="配送方式：" prop="distribution" style="width:25%">
          <el-select v-model="form.distribution" placeholder="请选择">
            <el-option label="全部" value=0></el-option>
            <el-option label="同城配送" value=1></el-option>
            <el-option label="快递物流" value=2></el-option>
          </el-select>
        </el-form-item>
        <!--省市区-->
        <el-form-item label="省市区选择：" prop="distribution" style="width:75%">
          <area-select type='text' :placeholders="placeholders" :level='2' v-model="selected" :data="pcaa">
          </area-select>
        </el-form-item>
        <!--供应商名-->
        <el-form-item label="供应商名：" prop="supplier_name" style="width:25%">
          <el-input v-model="form.supplier_name"></el-input>
        </el-form-item>
        <!--供应商id-->
        <el-form-item label="供应商id：" prop="supplier_id" style="width:25%">
          <el-input v-model="form.supplier_id"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" style="margin-bottom: 15px" @click="onSubmit">查询</el-button>
    </div>
    <!--分页-->
    <div align="right" style="margin: 10px 0;">
      <el-pagination @size-change="sizeChange" @current-change="currentChange"
                     :current-page="page.page" :page-sizes="[10, 20, 30, 40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalRecords"
                     v-if="paginationShow">
      </el-pagination>
    </div>
    <!--按钮-->
    <el-button-group class="operatebutton">
      <el-button type="success" size="mini" icon="el-icon-success" plain @click="toggleSelect(tableData)">全选</el-button>
      <el-button type="primary" size="mini" icon="el-icon-check" plain @click="toggleSelection(tableData)">反选</el-button>
      <el-button type="info" size="mini" icon="el-icon-close" plain @click="toggleSelection()">取消选择</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" plain @click="batchDeleting(multipleSelection)">批量删除</el-button>
      <el-button type="success" size="mini" icon="el-icon-success" plain @click="exportDatas()">导出待发货订单</el-button>
    </el-button-group>
    <!--标签-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有订单" name="all"></el-tab-pane>
      <el-tab-pane label="等待买家付款" name="0"></el-tab-pane>
      <el-tab-pane label="等待发货" name="10"></el-tab-pane>
      <el-tab-pane label="已发货" name="3"></el-tab-pane>
      <el-tab-pane label="成功订单" name="5"></el-tab-pane>
      <el-tab-pane label="已关闭" name="6"></el-tab-pane>
      <el-tab-pane label="历史订单" name="11"></el-tab-pane>
    </el-tabs>
    <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="会员名：">
              <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0 && props.row.order_source == '团购'">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
            </el-form-item>
            <el-form-item label="支付方式：">
              <span>{{ props.row.mode_payment }}</span>
            </el-form-item>
            <el-form-item label="收货人：">
              <span>{{ props.row.consignee }}</span>
            </el-form-item>
            <el-form-item label="订单状态：">
              <span>{{ props.row.status }}</span>
            </el-form-item>
            <el-form-item label="订单实收款：">
              <span>￥{{ props.row.price }}</span>
            </el-form-item>
            <el-form-item label="拼团状态：">
              <span v-if="props.row.group_status == 1">拼团中</span>
              <span v-else-if="props.row.group_status == 2">拼团成功</span>
              <span v-else-if="props.row.group_status == 3">拼团失败</span>
              <span v-else>无</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="ordernumber" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员名" prop="props" show-overflow-tooltip>
        <template slot-scope="props">
          <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0 && props.row.order_source == '团购'">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="creationtime" show-overflow-tooltip></el-table-column>
      <el-table-column label="订单状态" show-overflow-tooltip>
        <template slot-scope="props">
          <span>{{ props.row.status}}</span>
          <span v-if="props.row.order_source=='团购'" class="ifGroup">团</span>
          <span v-if="props.row.supplier_id>0" class="ifGroup" style="background: #af228a">供</span>
        </template>
      </el-table-column>
      <el-table-column label="打印状态" prop="print_mode" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
  // 根据需要按需引入数据
  import { AreaSelect } from "vue-area-linkage"; // 三级联动
  import AreaData from "area-data"; // 三级联动
  import { pca, pcaa } from "area-data"; // 三级联动
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js" // export class api_user{}中的总名称
  let apiUser = new api_user(); // 给api_user另命名
  export default {
    name:"orderlist",
    data() {
      return {
        tableData:[], // 表格数据
        page: {
          page: 1, //当前页
          limit: 10, //每页条数,  默认10条
          totalRecords: 0, //总条数
          totalPages: 0, //总页数
        },
        activeName: 'all',//监听的点击事件
        //form表单
        form: {
          start_time:'',
          end_time:'',
          product_name: '', // 商品名称
          distribution: '', // 配送方式
          consignee: '', // 收货人
          province: '', // 省
          name: '', // 会员名
          print_mode: '', // 打印状态
          city: '', // 市
          ordernum: "", // 订单编号
          order_source: '', // 订单来源
          district:'',// 区
          supplier_id:'', // 供应商id参数
          supplier_name:'', // 供应商姓名
        },
        changeTime:'', // 改变时间
        multipleSelection: [], // 订单选择的数据
        pca: pca, // 三级联动
        pcaa: pcaa, // 三级联动
        placeholders: ["请选择省", "请选择市", "请选择区"], // 默认值
        selected: [], // 省市区选择之后的值
        allSelect:false, // 是否全选
        paginationShow:true,
        historys: '', // 历史订单
      };
    },
    // created() {
    //   this.$emit('refreshList'); //触发父类的事件，
    // },
    // 页面预加载执行
    mounted: function(){
      let _this = this;
      _this.activeName = utils.getCookie("activeName"); // 否则按照cookie进行切换
      if(_this.activeName == null){ // cookie为空，默认跳转all
        _this.activeName = "all"; // 默认所有
        _this.status = ''; // 状态为空，代表全部
        _this.historys = '';  // 历史订单
      }else if(_this.activeName == "all"){
        _this.status = ''; // 传订单的状态，否则会读取之前商品的状态
        _this.historys = '';  // 历史订单
      }else if(_this.activeName == "11"){
        _this.status = ''; // 传订单的状态，否则会读取之前商品的状态
        _this.historys = 1;
      }else{
        _this.status = _this.activeName;
        _this.historys = '';  // 历史订单
      }
      this.getOrderList(); // 获取模板列表
    },

    // 监听事件，监听点击的val值
    watch: {
      // 点击状态显示列表
      activeName: function(val) {
        // 若val为11，调用历史订单的方法
        if(val == "all"){
          this.status = ''; // 传订单的状态，否则会读取之前商品的状态
          this.historys = '';  // 历史订单
        }else if(val == "11"){
          this.status = ''; // 传订单的状态，否则会读取之前商品的状态
          this.historys = 1;  // 历史订单
        }else{
          this.status = val;
          this.historys = '';  // 历史订单
        }
        this.page.page = 1; //当前页
        this.getOrderList(); // 获取所有订单
      },
    },
    methods: {
      // 获取模板列表信息
      getOrderList() {
        let _this = this;
        var start_times = ''; // 开始时间
        var end_times = ''; // 结束时间
        if(_this.changeTime != '' && _this.changeTime != null){  // 时间数据不为空赋值
          start_times = _this.changeTime[0]/1000; // 开始时间
          end_times = _this.changeTime[1]/1000; // 结束时间
        }
        let param = {
          page: _this.page.page, // 当前页
          limit: _this.page.limit, // 每页条数,  默认10条
          status: _this.status, // 全部为‘’。
          historys: _this.historys, // 历史订单，历史为1，正常为‘’。
          start_time: start_times,
          end_time: end_times,
          name: _this.form.name, // 会员名
          product_name: _this.form.product_name,//商品名称
          consignee: _this.form.consignee,//收货人
          print_mode:_this.form.print_mode,//打印状态
          order_source: _this.form.order_source,//订单来源
          ordernumber: _this.form.ordernum,//订单编号
          distribution: _this.form.distribution,
          province:_this.selected[0],//省
          city:_this.selected[1],//市
          district:_this.selected[2],//区
          supplier_name: _this.form.supplier_name,//供应商名字
          supplier_id: _this.form.supplier_id,//供应商id参数
        };
        if(param.city == "市辖区"){
          param.province = _this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
          param.city = _this.selected[0]//市变省
        }
        param = utils.filterJson(param);
        apiUser.getOrderList(param).then(res => {
          console.log(res);
          if(res.cscode == "0"){
            _this.tableData = res.data.data; // 表格数据
            _this.page.totalRecords = res.data.count; // 总数
            for (var i=0;i<_this.tableData.length;i++){
              //订单状态
              if(_this.tableData[i].status == 0){
                _this.tableData[i].status="等待买家付款";
                _this.tableData[i].root_name = 'orderstate'+'0';//路由为变量，等待买家付款是0
              }else if (_this.tableData[i].status == 1) {
                _this.tableData[i].status="买家已付款";
                _this.tableData[i].root_name = 'orderstate'+'1';//买家已付款是1
              }else if (_this.tableData[i].status == 2) {
                _this.tableData[i].status="取消订单";
                _this.tableData[i].root_name = 'orderstate'+'6';//取消订单即交易关闭，6
              }else if (_this.tableData[i].status == 3) {
                _this.tableData[i].status="等待买家收货";
                _this.tableData[i].root_name = 'orderstate'+'3';//等待收货是3
              }else if (_this.tableData[i].status == 4) {
                _this.tableData[i].status="买家已经收货";
                _this.tableData[i].root_name = 'orderstate'+'5';//已收货是4--（1期放在）
              }else if (_this.tableData[i].status == 5) {
                _this.tableData[i].status="交易成功";
                _this.tableData[i].root_name = 'orderstate'+'5';//交易成功是5
              }else if (_this.tableData[i].status == 7) {
                _this.tableData[i].status="退款受理";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款受理是7
              }

              else if (_this.tableData[i].status == 8 && _this.tableData[i].is_status == 1) {
                _this.tableData[i].status="退款成功";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }
              else if (_this.tableData[i].status == 6 && _this.tableData[i].is_status == 1) {
                _this.tableData[i].status="退款成功";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }

              else if (_this.tableData[i].status == 8 && _this.tableData[i].is_status == 0) {
                _this.tableData[i].status="交易关闭";
                _this.tableData[i].root_name = 'orderstate'+'6';//退款成功是7在页面显示退款成功
              }
              else if (_this.tableData[i].status == 6 && _this.tableData[i].is_status == 0) {
                _this.tableData[i].status="交易关闭";
                _this.tableData[i].root_name = 'orderstate'+'6';//退款成功是7在页面显示退款成功
              }



              else if (_this.tableData[i].status == 9) {
                _this.tableData[i].status="退货中";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if(_this.tableData[i].status == 10) {
                _this.tableData[i].status = "退款被拒绝";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if(_this.tableData[i].status == 11) {
                _this.tableData[i].status = "团购库存不足";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if (_this.tableData[i].status == 12) {
                _this.tableData[i].status = "已评价";
                _this.tableData[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }else if(_this.tableData[i].status == 13) {
                _this.tableData[i].status = "订单服务终止";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if(_this.tableData[i].status == 14) {
                _this.tableData[i].status = "取消订单受理 ";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if(_this.tableData[i].status == 15) {
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
                _this.tableData[i].status = "取消订单被驳回";
              }

              //打印状态
              if(_this.tableData[i].print_mode == 0){
                _this.tableData[i].print_mode = "未打印";
              }else if (_this.tableData[i].print_mode == 1){
                _this.tableData[i].print_mode = "已打印";
              }
            }
          }else{
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = 0;//总数
          }
        });
      },
      // 翻页--选择每页多少条
      sizeChange(val) {
        this.page.limit = val;
        this.getOrderList();
      },
      // 切换的第几页
      currentChange(val) {
        this.page.page = val;
        this.getOrderList();
      },
      // 导航切换
      handleClick(tab, event) {
        utils.setCookie("activeName",tab.name); // 存cookie
      },
      // 查询
      onSubmit() {
        utils.setCookie("activeName",''); // 存cookie
        this.getOrderList(); //获取订单信息
        this.paginationShow = false;
        this.currentChange(1);
        this.$nextTick(function () {
          this.paginationShow = true;})
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 全选
      toggleSelect(rows){
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
          });
          this.allSelect = !this.allSelect
        }
      },
      // 反选-取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
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
            let param ={
              status:'2',//删除=1 | 批量删除=2
              documents_id:ids,//批量传递一维数组，单独的传递ID
            };
            apiUser.delOrder(param).then(res=> {
              console.log(res);
              if (res.cscode == "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getOrderList()
                  }
                })
              }
            })
          }).catch(() => {})
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      // 点击导出按钮
      exportDatas:function(){
        let _this = this;
        var start_times = ''; // 开始时间
        var end_times = ''; // 结束时间
        if(_this.changeTime != '' && _this.changeTime != null){  // 时间数据不为空赋值
          start_times = _this.changeTime[0]/1000; // 开始时间
          end_times = _this.changeTime[1]/1000; // 结束时间
        }
        window.location.href="https://api.zhisoufangdichan.com/api/v1/orderexcel/order_excel?start_time="+start_times+"&end_time="+end_times+"&goods_name="+_this.form.product_name
      },
      //选择订单操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 跳转页面
      goto(name,id){
        this.$router.push({path:name,query:{id:id,}})
      },
    }
  };
</script>

<style scoped>
  @import url("../../assets/css/OrderList.css");
</style>
<style>
  @import url("../../assets/css/Main_elm.css");
</style>


