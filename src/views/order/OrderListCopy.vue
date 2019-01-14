<template>
  <div class="orderlist">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单信息</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation">此处的订单编号查询不受订单状态限制，历史订单列表只显示三个月前的订单</p>
    <!--搜索-->
    <div class="searchborder">
      <el-form ref="form" :model="form" label-width="100px">
        <!--左半部分，两两一组-->
        <div class="left block">
          <el-form-item label="选择时间段：" prop="distribution">
            <div class="block" style="float: left;width: 163px">
              <el-date-picker style="width: 163px" v-model="form.start_time" type="date" placeholder="选择开始日期"></el-date-picker>
            </div>
            <div style="float: left;padding: 0 10px">至</div>
            <div class="block" style="float: left">
              <el-date-picker style="width: 163px" v-model="form.end_time" type="date" placeholder="选择结束日期"></el-date-picker>
            </div>
          </el-form-item>
          <div class="left">
            <el-form-item label="商品名称：" prop="product_name">
              <el-input v-model="form.product_name"></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="收货人：" prop="consignee">
              <el-input v-model="form.consignee"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--右半部分，两两一组-->
        <div class="right">
          <div class="left">
            <el-form-item label="会员名：" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <!--0是未打印，1是已打印-->
            <el-form-item label="打印状态：" prop="print_mode">
              <el-select v-model="form.print_mode" placeholder="请选择">
                <el-option label="全部" value=8></el-option>
                <el-option label="未打印" value=0></el-option>
                <el-option label="已打印" value=1></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="订单编号：" prop="ordernum">
              <el-input v-model="form.ordernum"></el-input>
            </el-form-item>
            <el-form-item label="订单来源：" prop="order_source">
              <el-select v-model="form.order_source" placeholder="请选择">
                <el-option label="全部" value=0></el-option>
                <el-option label="普通订单" value=1></el-option>
                <el-option label="拼团订单" value=5></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div style="float: left;width: 35%">
          <el-form-item label="配送方式：" prop="distribution">
            <el-select v-model="form.distribution" placeholder="请选择">
              <el-option label="全部" value=0></el-option>
              <el-option label="同城配送" value=1></el-option>
              <el-option label="快递物流" value=2></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="float: left;width: 65%">
          <el-form-item label="省市区选择：" prop="distribution">
            <area-select type='text' :placeholders="placeholders" :level='2' v-model="selected" :data="pcaa">
            </area-select>
          </el-form-item>
        </div>
        <el-button type="primary" style="margin-bottom: 15px" @click="onSubmit">查询</el-button>
        <!--<el-button @click="resetForm('form')">重置</el-button>-->
      </el-form>
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
      <!--<el-button type="success" size="mini" icon="el-icon-printer" plain>批量打印快递单</el-button>-->
      <!--<el-button type="success" size="mini" icon="el-icon-printer" plain>批量打印发货单</el-button>-->
      <!--<el-button type="primary" size="mini" icon="el-icon-download" plain>批量下载配货单</el-button>-->
    </el-button-group>
    <!--标签-->
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <!--所有订单-->
      <el-tab-pane label="所有订单" name="all">
        <el-table ref="multipleTableall" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--等待买家付款--0-->
      <el-tab-pane label="等待买家付款" name="0">
        <el-table ref="multipleTable0" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--买家已付款--等待发货--10-->
      <el-tab-pane label="等待发货" name="10">
        <el-table ref="multipleTable1" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--卖家已发货--3-->
      <el-tab-pane label="已发货" name="3">
        <el-table ref="multipleTable3" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--交易成功--5-->
      <el-tab-pane label="成功订单" name="5">
        <el-table ref="multipleTable5" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--交易关闭--6-->
      <el-tab-pane label="已关闭" name="6">
        <el-table ref="multipleTable6" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--历史订单--11-->
      <el-tab-pane label="历史订单" name="11">
        <el-table ref="multipleTable11" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="会员名：">
                  <span>{{ props.row.nickname }}<span v-if="props.row.pid == 0">（拼主）</span><span v-else-if="props.row.pid == 1">（团员）</span></span>
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
          <el-table-column label="订单编号" prop="ordernumber"></el-table-column>
          <el-table-column label="提交时间" prop="creationtime"></el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="props">
              <span>{{ props.row.status}}</span>
              <span v-if="props.row.order_source==='团购'" class="ifGroup">团</span>
            </template>
          </el-table-column>
          <el-table-column label="打印状态" prop="print_mode"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="info" size="mini" plain @click="goto(scope.row.root_name,scope.row.id)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  // 根据需要按需引入数据
  import { AreaSelect } from "vue-area-linkage";
  import AreaData from "area-data";
  import { pca, pcaa } from "area-data";
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"//export class api_user{}中的总名称
  let apiUser = new api_user();//给api_user另命名
  export default {
    name:"orderlist",
    data() {
      return {
        tableData:[],//表格数据
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
          seatime: '', //时间段--开始时间结束时间，start_time，end_time
          product_name: '', //商品名称
          distribution: '', //配送方式
          consignee: '', //收货人
          province: '', //省
          name: '', //会员名
          print_mode: '', //打印状态
          city: '', //市
          ordernum: "", //订单编号
          order_source: '', //订单来源
          district:'',//区
        },
        multipleSelection: [],//订单选择的数据
        pca: pca,
        pcaa: pcaa,
        placeholders: ["请选择省", "请选择市", "请选择区"],//默认值
        selected: [],//省市区选择之后的值
        allSelect:false,
        tabName:'multipleTableall',//拼接tabs中table中ref的变量
        paginationShow:true,
      };
    },
    // created() {
    //   this.$emit('refreshList'); //触发父类的事件，写法
    // },
    //页面预加载执行
    mounted: function(){
      this.getlist();//获取模板列表
    },

    //监听事件，监听点击的val值
    watch: {
      //点击状态显示列表
      activeName: function(val) {
        //若val为11，调用历史订单的方法
        if(val === "all"){
          this.status = '';//传订单的状态，否则会读取之前商品的状态
          this.page.page= 1;//当前页
          this.getalllist();//获取所有订单
        } else if(val === "11"){
          this.page.page= 1;//当前页
          this.historys = 1;
          this.historylist();//获取历史订单
        }else{
          this.status = val;
          this.page.page= 1;//当前页
          this.getlist();//获取订单信息
        }
      },
    },
    methods: {
      //获取模板列表信息
      getlist() {
        if(this.activeName == null){//cookie为空，默认跳转all
          this.activeName = "all";//默认所有
          this.status = '';//状态为空，代表全部
        }else{
          this.activeName = utils.getCookie("activeName");//否则按照cookie进行切换
          if(utils.getCookie("activeName") === "all"){
            this.status = '';//传订单的状态，否则会读取之前商品的状态
          }else if(utils.getCookie("activeName") === "11"){
            this.historys = 1;
            this.historylist();//获取历史订单
          }else{
            this.status = utils.getCookie("activeName");
          }
        }

        //标准格式转化为日期格式，日期格式转化为时间戳
        var start_time = new Date(this.form.start_time);
        var start_times=start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate() + ' ' + start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var start_timess = new Date( start_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var start_timesss = start_timess/1000;
        var end_time = new Date(this.form.end_time);
        var end_times=end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate() + ' ' + end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        var end_timess = new Date( end_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var end_timesss = end_timess/1000 + 24*60*60*1000;
        let param = {
          page: this.page.page,//当前页
          limit: this.page.limit,//每页条数,  默认10条
          status: this.status,
          start_time: start_timesss,
          end_time: end_timesss,
          name: this.form.name,//会员名
          product_name: this.form.product_name,//商品名称
          consignee: this.form.consignee,//收货人
          print_mode:this.form.print_mode,//打印状态
          order_source: this.form.order_source,//订单来源
          ordernumber: this.form.ordernum,//订单编号
          distribution: this.form.distribution,
          province:this.selected[0],//省
          city:this.selected[1],//市
          district:this.selected[2],//区
        };
        if(param.city === "市辖区"){
          param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
          param.city = this.selected[0]//市变省
        }
        param = utils.filterJson(param);
        let _this = this;
        apiUser.getOrderList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//表格数据
            _this.page.totalRecords = res.data.count;//总数
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
              }else if (_this.tableData[i].status == 6) {
                _this.tableData[i].status="交易关闭";
                _this.tableData[i].root_name = 'orderstate'+'6';//交易关闭是6
              }else if (_this.tableData[i].status == 7) {
                _this.tableData[i].status="退款受理";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款受理是7
              }else if (_this.tableData[i].status == 8) {
                _this.tableData[i].status="退款成功";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }else if (_this.tableData[i].status == 9) {
                _this.tableData[i].status="退货中";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if (_this.tableData[i].status == 12) {
                _this.tableData[i].status = "已评价";
                _this.tableData[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }
              //打印状态
              if(_this.tableData[i].print_mode === 0){
                _this.tableData[i].print_mode = "未打印";
              }else if (_this.tableData[i].print_mode === 1){
                _this.tableData[i].print_mode = "已打印";
              }
            }
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = res.data.count;//总数
          }
        });
      },
      //历史订单列表
      historylist(){
        //标准格式转化为日期格式，日期格式转化为时间戳
        var start_time = new Date(this.form.start_time);
        var start_times=start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate() + ' ' + start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var start_timess = new Date( start_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var start_timesss = start_timess/1000;
        var end_time = new Date(this.form.end_time);
        var end_times=end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate() + ' ' + end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        var end_timess = new Date( end_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var end_timesss = end_timess/1000 + 24*60*60*1000;
        let param = {
          page: this.page.page,//当前页
          limit: this.page.limit,//每页条数,  默认10条
          historys: this.historys,
          start_time: start_timesss,
          end_time: end_timesss,
          name: this.form.name,//会员名
          product_name: this.form.product_name,//商品名称
          consignee: this.form.consignee,//收货人
          print_mode:this.form.print_mode,//打印状态
          order_source: this.form.order_source,//订单来源
          ordernumber: this.form.ordernum,//订单编号
          distribution: this.form.distribution,
          province:this.selected[0],//省
          city:this.selected[1],//市
          district:this.selected[2],//区
        };
        console.log(param);
        if(param.city === "市辖区"){
          param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
          param.city = this.selected[0]//市变省
        }
        param = utils.filterJson(param);
        let _this = this;
        apiUser.getOrderList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//表格数据
            _this.page.totalRecords = res.data.count;//总数
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
                _this.tableData[i].root_name = 'orderstate'+'5';//已收货是4
              }else if (_this.tableData[i].status == 5) {
                _this.tableData[i].status="交易成功";
                _this.tableData[i].root_name = 'orderstate'+'5';//交易成功是5
              }else if (_this.tableData[i].status == 6) {
                _this.tableData[i].status="交易关闭";
                _this.tableData[i].root_name = 'orderstate'+'6';//交易关闭是6
              }else if (_this.tableData[i].status == 7) {
                _this.tableData[i].status="退款受理";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款受理是7
              }else if (_this.tableData[i].status == 8) {
                _this.tableData[i].status="退款成功";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }else if (_this.tableData[i].status == 9) {
                _this.tableData[i].status="退货中";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if (_this.tableData[i].status == 12) {
                _this.tableData[i].status = "已评价";
                _this.tableData[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }
              //打印状态
              if(_this.tableData[i].print_mode === 0){
                _this.tableData[i].print_mode = "未打印";
              }else if (_this.tableData[i].print_mode === 1){
                _this.tableData[i].print_mode = "已打印";
              }
            }
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = res.data.count;//总数
          }
        });
      },
      //获取所有列表信息
      getalllist(){
        //标准格式转化为日期格式，日期格式转化为时间戳
        var start_time = new Date(this.form.start_time);
        var start_times=start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate() + ' ' + start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var start_timess = new Date( start_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var start_timesss = start_timess/1000;
        var end_time = new Date(this.form.end_time);
        var end_times=end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate() + ' ' + end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        var end_timess = new Date( end_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var end_timesss = end_timess/1000 + 24*60*60*1000;
        let param = {
          page: this.page.page,//当前页
          limit: this.page.limit,//每页条数,  默认10条
          //form表单中的内容
          start_time: start_timesss,
          end_time: end_timesss,
          name: this.form.name,//会员名
          product_name: this.form.product_name,//商品名称
          consignee: this.form.consignee,//收货人
          print_mode:this.form.print_mode,//打印状态
          order_source: this.form.order_source,//订单来源
          ordernumber: this.form.ordernum,//订单编号
          distribution: this.form.distribution,
          province:this.selected[0],//省
          city:this.selected[1],//市
          district:this.selected[2],//区
        };
        console.log(param);
        if(param.city === "市辖区"){
          param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
          param.city = this.selected[0]//市变省
        }
        param = utils.filterJson(param);
        let _this = this;
        apiUser.getOrderList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//表格数据
            _this.page.totalRecords = res.data.count;//总数
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
                _this.tableData[i].root_name = 'orderstate'+'5';//已收货是4
              }else if (_this.tableData[i].status == 5) {
                _this.tableData[i].status="交易成功";
                _this.tableData[i].root_name = 'orderstate'+'5';//交易成功是5
              }else if (_this.tableData[i].status == 6) {
                _this.tableData[i].status="交易关闭";
                _this.tableData[i].root_name = 'orderstate'+'6';//交易关闭是6
              }else if (_this.tableData[i].status == 7) {
                _this.tableData[i].status="退款受理";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款受理是7
              }else if (_this.tableData[i].status == 8) {
                _this.tableData[i].status="退款成功";
                _this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }else if (_this.tableData[i].status == 9) {
                _this.tableData[i].status="退货中";
                _this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if (_this.tableData[i].status == 12) {
                _this.tableData[i].status = "已评价";
                _this.tableData[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }
              //打印状态
              if(_this.tableData[i].print_mode === 0){
                _this.tableData[i].print_mode = "未打印";
              }else if (_this.tableData[i].print_mode === 1){
                _this.tableData[i].print_mode = "已打印";
              }
            }
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = res.data.count;//总数
          }
        });
      },
      //翻页--选择每页多少条
      sizeChange(val) {
        this.page.limit = val;
        this.getlist();
      },
      //切换的第几页
      currentChange(val) {
        this.page.page = val;
        this.getlist();
      },
      //导航切换
      handleClick(tab, event) {
        this.tabName = 'multipleTable' + tab.name;//拼接tabs中table中ref的变量
        utils.setCookie("activeName",tab.name);//存cookie
      },
      //查询
      onSubmit() {
        this.activeName = "all";//默认所有
        this.status = '';//状态为空，代表全部
        //标准格式转化为日期格式，日期格式转化为时间戳
        var start_time = new Date(this.form.start_time);
        var start_times=start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate() + ' ' + start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var start_timess = new Date( start_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var start_timesss = start_timess/1000;
        var end_time = new Date(this.form.end_time);
        var end_times=end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate() + ' ' + end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        var end_timess = new Date( end_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var end_timesss = end_timess/1000 + 24*60*60*1000;
        let param = {
          page: this.page.page,//当前页
          limit: this.page.limit,//每页条数,  默认10条
          //form表单中的内容
          start_time: start_timesss,
          end_time: end_timesss,
          name: this.form.name,//会员名
          product_name: this.form.product_name,//商品名称
          consignee: this.form.consignee,//收货人
          print_mode:this.form.print_mode,//打印状态
          order_source: this.form.order_source,//订单来源
          ordernumber: this.form.ordernum,//订单编号
          distribution: this.form.distribution,
          province:this.selected[0],//省
          city:this.selected[1],//市
          district:this.selected[2],//区
        };
        console.log(param);
        if(param.city === "市辖区"){
          param.province = this.selected[0].substring(0,2);// 取得字符串数据的前2位，省截取前两位
          param.city = this.selected[0]//市变省
        }
        console.log(param);
        param = utils.filterJson(param);
        apiUser.getOrderList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = res.data.count;//总数
            for (let i=0;i<this.tableData.length;i++){
              if(this.tableData[i].status == 0){
                this.tableData[i].status="等待买家付款";
                this.tableData[i].root_name = 'orderstate'+'0';//路由为变量，等待买家付款是0
              }else if (this.tableData[i].status == 1) {
                this.tableData[i].status="买家已付款";
                this.tableData[i].root_name = 'orderstate'+'1';//买家已付款是1
              }else if (this.tableData[i].status == 2) {
                this.tableData[i].status="取消订单";
                this.tableData[i].root_name = 'orderstate'+'6';//取消订单即交易关闭，6
              }else if (this.tableData[i].status == 3) {
                this.tableData[i].status="等待买家收货";
                this.tableData[i].root_name = 'orderstate'+'3';//等待收货是3
              }else if (this.tableData[i].status == 4) {
                this.tableData[i].status="买家已经收货";
                this.tableData[i].root_name = 'orderstate'+'5';//已收货是4
              }else if (this.tableData[i].status == 5) {
                this.tableData[i].status="交易成功";
                this.tableData[i].root_name = 'orderstate'+'5';//交易成功是5
              }else if (this.tableData[i].status == 6) {
                this.tableData[i].status="交易关闭";
                this.tableData[i].root_name = 'orderstate'+'6';//交易关闭是6
              }else if (this.tableData[i].status == 7) {
                this.tableData[i].status="退款受理";
                this.tableData[i].root_name = 'orderstate'+'7';//退款受理是7
              }else if (this.tableData[i].status == 8) {
                this.tableData[i].status="退款成功";
                this.tableData[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
              }else if (this.tableData[i].status == 9) {
                this.tableData[i].status="退货中";
                this.tableData[i].root_name = 'orderstate'+'7';//暂无退货中，//7
              }else if (this.tableData[i].status == 12) {
                this.tableData[i].status = "已评价";
                this.tableData[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
              }
              //打印状态
              if(this.tableData[i].print_mode == 0){
                this.tableData[i].print_mode = "未打印";
              }else if (this.tableData[i].print_mode == 1){
                this.tableData[i].print_mode = "已打印";
              }
            }
          }else{
            // this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
            this.tableData = res.data.data;//表格数据
            this.page.totalRecords = res.data.count;//总数
          }
        });
        this.paginationShow = false

        this.currentChange(1)
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
            console.log(this.$refs[this.tabName]);

            this.$refs[this.tabName].toggleRowSelection(row, !this.allSelect)

          });
          this.allSelect = !this.allSelect
        }
      },
      //反选-取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs[this.tabName].toggleRowSelection(row);
            //this.$refs.multipleTableall.toggleRowSelection(row);
          });
        } else {
          this.$refs[this.tabName].clearSelection();
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
              if (res.cscode === "0") {
                this.$alert(res.data.msg, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.getlist()
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
      //选择订单操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //跳转页面
      goto(name,id){
        this.$router.push({
          path:name,
          query:{
            id:id,
          }
        })
      },
    }
  };
</script>

<style>
  @import url("../../assets/css/Main_elm.css");
</style>
<style scoped>
  @import url("../../assets/css/Order.css");
</style>

