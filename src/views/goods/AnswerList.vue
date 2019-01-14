<template>
  <div class="AnswerList">
    <!--头部导航-->
    <div class="header">
      <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品问答管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品问答</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
    </div>
    <!--筛选-->
    <div class="btn_box">
      <ul>
        <li @click="dialogVisible = true"><i class="el-icon-search"></i><span> 筛选查询</span></li>
        <li>
          <el-button v-if="!appear" @click="appear=!appear" class="button"><i class="el-icon-arrow-up"></i>收起筛选</el-button>
          <el-button v-if="appear" @click="appear=!appear" class="button"><i class="el-icon-arrow-down"></i>筛选</el-button>
          <el-button @click="searchResultnew()">查询结果</el-button>
        </li>
      </ul>
    </div>
    <div class="generalScreening" v-if="!appear">
      <ul>
        <li>输入搜索：<el-input v-model="goodsName" placeholder="评价关键词/商品名称" class="num"></el-input></li>
        <li>
          商品分类：
          <el-select v-model="formInline.style_demo" placeholder="请选择商品分类" clearable="">
            <el-option
              v-for="(item,index) in formInline.handle_style"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>用户昵称：<el-input v-model="userName" placeholder="输入用户昵称" class="num"></el-input></li>
      </ul>
    </div>
    <!--展示的列表数据-->
    <div class="lists">
      <el-card class="box-card">
        <div slot="header">
          <span class="listTitle"><i class="el-icon-document"></i> 数据列表</span>
          <!--排序方式-->
          <el-select class="listSort" v-model="sortOrders" placeholder="排序方式" @change="changeSort()">
            <el-option v-for="item in sortOrder" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!--数据列表显示-->
          <div class="dataList">
            <el-table class="dataListTable" ref="multipleTable" :data="dataLists" stripe current-row-key="index" :border="true" tooltip-effect="dark"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <!--编号-->
              <el-table-column label="编号" width="60" align="center">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.id==null?"无":scope.row.id}}
                  </div>
                </template>
              </el-table-column>
              <!--提问者-->
              <el-table-column label="提问者" width="150">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.nickname==null?"无":scope.row.nickname}}
                  </div>
                </template>
              </el-table-column>
              <!--商品名称-->
              <el-table-column label="商品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.goods_name==null?'无':scope.row.goods_name}}
                  </div>
                </template>
              </el-table-column>
              <!--问题-->
              <el-table-column label="问题" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.title==null?"无":scope.row.title}}
                  </div>
                </template>
              </el-table-column>
              <!--更新时间-->
              <el-table-column label="更新时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.items!=null ? chuan(scope.row.items.add_time):'暂无回答'}}
                  </div>
                </template>
              </el-table-column>
              <!--提问时间-->
              <el-table-column label="提问时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.add_time==null?"无":chuan(scope.row.add_time)}}
                  </div>
                </template>
              </el-table-column>
              <!--是否显示-->
              <el-table-column prop="scope" label="是否显示" width="150" show-overflow-tooltip>
                <template  slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#13ce66" inactive-color="#CBD0D6"
                    @change="check_starnums(scope.row.id,scope.row.status)">
                  </el-switch>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column prop="scope" label="操作" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  <strong style="color: #13ce66;cursor:pointer"  @click="getAnswerDetail(scope.row)">查看</strong>
                  <strong style="color: #CBD0D6;cursor:pointer" @click="del_listnew(scope.row)">删除</strong>
                </template>
              </el-table-column>
            </el-table>
            <div class="dataListBtn">
              <div class="dataListBtnFl">
                <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(dataLists)">全选</el-button>
                <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(dataLists)">取消全选</el-button>
                <el-button size="mini" @click="delSelectStock">删除</el-button>
                <el-button size="mini" @click="xainSelectStock(1)">显示</el-button>
                <el-button size="mini" @click="xainSelectStock(2)">隐藏</el-button>
              </div>

              <!--page-sizes   每页多少条数据----current-page  当前页数-->
              <el-pagination class="dataListBtnFr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="pages.nowPages" :page-sizes="[10,20,30,40,50]" :page-size="pages.limit"
                             layout="total, sizes, prev, pager, next, jumper" :total="pages.count"
                             @next-click="nextPages" @prev-click="prevPages">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { api_user,evaluate } from '@/api/api';
  import * as utils from "@/common/utils.js"
  let apiuser = new api_user();
  let apiEvaluate=new evaluate()
  export default {
    name:"AnswerList",
    data() {
      return {
        appear:true, // 收起-筛选是否打开
        goodsName:'', // 输入搜素-商品名称
        userName:'', // 用户昵称
        sortOrders:"", // 排序方式
        sortOrder:[{
          label:"正序",
          value:0
        },{
          label:"倒序",
          value:1
        },],
        dataLists:[], // 商品问答的列表信息
        // 分页数据
        pages:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },
        id_arr:'',//id
        //模糊查询input输入,选择,时间框   简单搜索
        formInline: {
          search_name: '',
          search_niname: '',
          style_demo:'',
          firstcheck:true,
          secondcheck:false,
          thirdcheck:false,
          handle_style:[],
          time:{
            first:"",
            last:"",
          }
        },

        star_num:3.7,//星星数量,
        //table表格选中得到的数据
        multipleSelection: [],
        //全选、取消全选的禁用状态
        allSelect:true,
        selectDisabled:false,
        clearDisabled:true, // 取消全选
      }
    },
    //推送表单   进行判断验证
    mounted(){
      this.get_cat();
      // this.getEvaluateList();
      this.getanswerlist()
    },
    methods: {

      getanswerlist(){
        let _this =this
        if(this.sortOrders==''){
          var sort = 0
        }else {
          var sort = _this.sortOrders
        }
        let params={
          'name':this.goodsName,
          'classify':this.formInline.style_demo,
          'username':this.userName,
          'page':this.pages.nowPages,
          'limit':this.pages.limit,
          "sort":sort
        }
        apiuser.answerlist(params).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:res.data.msg, showClose: true,})
            _this.dataLists = res.data.data
            for(var i=0;i<_this.dataLists.length;i++){
              if(_this.dataLists[i].status==1){
                _this.dataLists[i].status=true
              }else if(_this.dataLists[i].status==0){
                _this.dataLists[i].status=false
              }
            }

            _this.pages.count =  res.data.count

          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
      searchResultnew(){
        this.pages.nowPages=1
        this.getanswerlist()
        //页码初始化
        this.paginationShow = false
        this.handleCurrentChange(1)
        this.$nextTick(function () {
          this.paginationShow = true;
        })
      },
      //当前页发生改变的时候执行的事件
      handleCurrentChange(index) {
        var _this=this;
        _this.pages.nowPages=index
        _this.getanswerlist()
      },

      //上一页
      prevPages(index){
        var _this=this;
        _this.pages.nowPages=index

        _this.getanswerlist();
      },
      //每页条数改变执行的事件
      handleSizeChange(limit) {
        var _this=this;
        _this.pages.limit=limit
        _this.getanswerlist();
      },
      //下一页
      nextPages(index){
        var _this=this;
        _this.pages.nowPages=index

        _this.getanswerlist();
      },
      del_listnew(scope){
        let _this = this
        let params ={
          ask_id:scope.id
        }
       _this.delete(params)
      },
      delete(param){
        var _this=this
        apiuser.deleteQuestion(param).then(res => {
          if(res.cscode==0) {
            _this.$message({type: 'success',message:res.data.msg, showClose: true,})
            _this.refresh()

          }else {
            _this.$message.error(res.data.msg)
          }
        });
      },
      // 获取问答详情
      getAnswerDetail(scope){
        let id = scope.id; // 问答id
        let goods = scope.goods_id; // 商品信息id
        this.$router.push({
          path:'/answerdetail',
          query:{
            ass_id:id,
            goods_id:goods
          }
        })
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
      //多选
      handleCheckAllChange(val) {
        this.isIndeterminate = false;
      },


      // 刷新
      refresh(){
        location.reload();
      },
      //商品分类
      get_cat(){
        var _this=this;
        var param={}
        apiEvaluate.get_cat_assess(param).then(res => {
          console.log(res)
          var arr=res.data.data
          var arr_style=[]
          if(res.cscode==0){
            for(var i=0;i<arr.length;i++){
              if(arr[i].children){
                var arr1=arr[i].children
                for(var j=0;j<arr1.length;j++){
                  var obj={
                    label:arr1[j].cat_name,
                    value:arr1[j].id
                  }
                  arr_style.push(obj)
                }
              }
            }


          }
          _this.formInline.handle_style=arr_style
        })

      },

        //排列方式的事件
        changeSort(){
          var _this=this;
          this.pages.nowPages=1
          _this.getanswerlist();
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {
            this.paginationShow = true;
          })


        },
       //对表格数据进行操作所有相关的事件
      handleSelectionChange(val) {
        var _this=this;
        _this.multipleSelection = val;
        console.log( _this.multipleSelection)
        if(_this.multipleSelection.length<_this.dataLists.length){
          _this.selectDisabled=false;
          _this.clearDisabled=true

        }else{
          _this.selectDisabled=true;
          _this.clearDisabled=false
        }
        var arr=[]
          for(var i=0;i< _this.multipleSelection.length;i++){
           arr.push(_this.multipleSelection[i].id)
         }
       _this.id_arr=arr.join(",")

      },
      //全选事件
      allSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        console.log(_this.multipleSelection);
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row,_this.allSelect);
        });
        var arr=[]
        for(var i=0;i< _this.multipleSelection.length;i++){
          arr.push(_this.multipleSelection[i].id)
        }
        _this.id_arr=arr.join(",")
      },
      //取消全选事件
      CleatAllSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        _this.id_arr=''
        this.$refs.multipleTable.clearSelection();
      },
      //删除事件
      delSelectStock(){
        var _this=this;
        if(_this.multipleSelection<=0){
          alert("请先选取库存列表")
        }else {
          let param = {
            ask_id: _this.id_arr
          }
          _this.delete(param)
        }
      },
      //是否显示
      check_starnums(id,scopec){
        console.log(id,scopec)
        if(scopec){
        var  num=1
        }else{
         var num=2
        }
        let param={
          ask_id:id,
          status:num,
        }
        console.log(param)
       this.display(param)
      },
      display(param){
        apiuser.displayQuestion(param).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:res.data.msg, showClose: true,})
            this.getanswerlist()
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
    //   //显示
      xainSelectStock(num){
        var _this=this;
        if(_this.multipleSelection<=0){
          alert("请先选取库存列表")
        }else {
          let param = {
            ask_id: _this.id_arr,
            status:num
          }
          _this.display(param)
        }
      },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Goods.css");

  .cell>.template_content{
    display: block;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .lookings{
    cursor: pointer;
  }
</style>
