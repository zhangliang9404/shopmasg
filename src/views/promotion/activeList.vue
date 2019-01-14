<template>
  <div class="Recommended">
    <!--头部导航-->
    <div class="header">
      <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="refresh()">刷新</el-button>
    </div>
    <!--筛选-->
    <div class="generalScreening" style="border: 0">
      <ul style="width: 80%">
        <li>活动名称：<el-input v-model="goodsName" placeholder="活动名称" class="num" clearable></el-input></li>
        <li>
          活动状态状态：
          <el-select v-model="activeValue" placeholder="选择活动状态" clearable>
            <el-option v-for="(item,index) in activeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
      </ul>
      <el-button @click="searchResultnew()" style="float: right;margin-top: -65px">查询结果</el-button>
    </div>
    <div style="clear: both"></div>
    <!--展示的列表数据-->
    <div class="lists">
      <el-card class="box-card">
        <div slot="header">
          <span class="listTitle" style="margin-bottom: 20px"><i class="el-icon-document"></i> 数据列表</span>
          <el-select v-model="sortValue" placeholder="排序方式" @change="changeSort()" style="margin-top: -8px;margin-left: 20px;float: right;width: 120px">
            <el-option v-for="(item,index) in sortList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button style="float: right;margin-top: -8px;" @click="$router.push('addActive')">添加活动</el-button>

          <!--按钮-选择商品-->
          <!--<el-button class="listSort" plain>选择商品</el-button>-->
          <!--数据列表显示-->
          <div class="dataList">
            <el-table class="dataListTable"
                      ref="multipleTable"
                      :data="dataLists"
                      stripe
                      current-row-key="index"
                      :border="true"
                      tooltip-effect="dark"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <!--编号-->
              <el-table-column label="编号" width="100" align="center">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.id==null?"无":scope.row.id}}
                  </div>
                </template>
              </el-table-column>
              <!--商品名称-->
              <el-table-column label="活动名称" width="250">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.title}}
                  </div>
                </template>
              </el-table-column>
              <!--开始时间-->
              <el-table-column label="开始时间" width="250">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.add_time}}
                  </div>
                </template>
              </el-table-column>
              <!--结束时间-->
              <el-table-column label="结束时间" width="250">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.end_time}}
                  </div>
                </template>
              </el-table-column>
              <!--状态-->
              <el-table-column label="活动状态" width="200">
                <template slot-scope="scope">
                  <div class="template_content">
                    {{scope.row.types==1?"限时优惠":'满减优惠'}}
                  </div>
                </template>
              </el-table-column>
              <!--操作-->
              <el-table-column prop="scope" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                  <strong class="info" @click="update(scope.row,1)">查看</strong>
                  <strong class="update" @click="update(scope.row,2)">编辑</strong>
                  <strong class="delete" @click="del_list(scope.row.id)">删除</strong>
                </template>
              </el-table-column>
            </el-table>
            <div class="dataListBtn">
              <div class="dataListBtnFl">
                <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(dataLists)">全选</el-button>
                <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(dataLists)">取消全选</el-button>
                <el-button size="mini" @click="delSelectStock">删除</el-button>
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
  import {api_active} from "@/api/api.js"//export class api_Chat{}中的总名称
  let apiActive=new api_active()
  export default {
    name:"Recommended",
    data() {
      return {
        goodsName:'', // 输入搜素-商品名称
        activeValue:'',
        activeList:[
          {label:'限时优惠',value:1},
          {label:'满减优惠',value:2}
        ],
        sortValue:'',
        sortList:[
          {label:'正序',value:1},
          {label:'倒序',value:0}],
        dataLists:[], // 商品问答的列表信息
        // 分页数据
        pages:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },

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
        id_arr:[]
      }
    },
    //推送表单   进行判断验证
    mounted(){
    this.getlist()
    },
    methods: {
      // 刷新
      refresh(){
        location.reload();
      },
      getlist(){
        let _this =this
        if(this.sortValue==''){
          var sort = 1
        }else {
          var sort = _this.sortOrders
        }
        let params={
           title:this.goodsName,
           types:_this.activeValue,
           status:1,
           sort:sort,
           page:_this.pages.nowPages,
           limit:_this.pages.limit
        }
        apiActive.activeList(params).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:res.data.msg, showClose: true,})
            _this.dataLists = res.data.data
            _this.pages.count =  res.data.count

          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
        searchResultnew(){
          this.pages.nowPages=1
          this.getlist()
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
          _this.getlist()
        },

        //上一页
        prevPages(index){
          var _this=this;
          _this.pages.nowPages=index
          _this.getlist();
        },
        //每页条数改变执行的事件
        handleSizeChange(limit) {
          var _this=this;
          _this.pages.limit=limit
          _this.getlist();
        },
        //下一页
        nextPages(index){
          var _this=this;
          _this.pages.nowPages=index
          _this.getlist();
        },
      // 获取问答详情
      getAnswerDetail(scope){
       /* let id = scope.id; // 问答id
        let goods = scope.goods_id; // 商品信息id
        this.$router.push({
          path:'/answerdetail',
          query:{
            ass_id:id,
            goods_id:goods
          }
        })*/
      },

     //排列方式的事件
        changeSort(){
          var _this=this;
          this.pages.nowPages=1
          _this.getlist()
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {
            this.paginationShow = true;
          })


        },
      handleSelectionChange(val) {
        console.log(val)
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
        _this.id_arr=arr
        console.log(_this.id_arr)
      },
      //全选事件
      allSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        console.log(_this.multipleSelection);
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row,_this.allSelect);
        });
      },
      //取消全选事件
      CleatAllSelectStock(rows){
        var _this=this;
        _this.multipleSelection=rows;
        this.$refs.multipleTable.clearSelection();
      },
      //删除事件
      delSelectStock(){
        var _this=this;
        if(_this.multipleSelection<=0){
          alert("请先选取库存列表")
        }else {
          let param = {
           id: _this.id_arr
          }
          _this.delete(param)
        }
      },
      //删除接口事件
      delMethodsStockRes(params){
      /*  var _this=this;
        //库存的所有信息
        apiInvertory.delStockRes(params).then(res => {
          if(res.cscode==0){
            _this.$message(res.data.msg);
            var paramResult={
              page:1,
              limit:_this.pages.limit
            }
            _this.getEvaluateList(paramResult);
          }else{
            _this.$message.error(res.data.msg);
          }
        });*/
      },
      //单个shanchu
      del_list(item){
        var _this=this
        var arr=[item]
        let param={
          id:arr
        }
       _this.delete(param)
      },
      delete(param){
        var _this=this
        apiActive. deleteActive(param).then(res => {
          if(res.cscode==0) {
            _this.$message({type: 'success',message:res.data.msg, showClose: true,})
            _this.getlist()

          }else {
            _this.$message.error(res.data.msg)
          }
        })
      },

      update(item,num){
        this.$router.push({path:'redactActive',query:{id:item.id,type:item.types,num:num}})
      }
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Index.css");

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
