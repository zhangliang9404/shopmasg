<template>
  <div class="goofoutb_backgroud">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品评价管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品评价</el-breadcrumb-item>
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
            </div>
          </div>
          <div class="character">
            <!--商品名称-->
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="输入搜索 :">
                <el-input v-model="formInline.search_name" placeholder="请输入商品名称/评价关键词"></el-input>
              </el-form-item>

              <!--操作类型-->
              <el-form-item label="商品分类 :">
                <el-select v-model="formInline.style_demo" clearable placeholder="请选择操作类型" @change="changeMethodsType(formInline.methodsType)">
                  <el-option
                    v-for="(item,index) in formInline.handle_style"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <!--用户昵称-->
              <el-form-item label="用户昵称 :">
                <el-input v-model="formInline.search_niname" placeholder="请输入用户昵称"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>

      <!--数据列表-->
      <div>
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
            <div class="character3" style="border-color: #333333">
              <el-table ref="multipleTable"
                        :data="tableData3"
                        stripe
                        current-row-key="index"
                        :border="true"
                        tooltip-effect="dark"
                        style="width: 100%"
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
                <!--商品图片-->
                <el-table-column label="用户昵称" width="100">
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.nickname==null?"无":scope.row.nickname}}
                    </div>
                  </template>
                </el-table-column>

                <!--商品名称-->
                <el-table-column label="商品名称" width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.name==null?'无':scope.row.name}}
                    </div>
                  </template>
                </el-table-column>

                <!--货号、属性-->
                <el-table-column label="评价" width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      <el-rate
                        v-model="scope.row.star_nums"
                        disabled
                        text-color="#ff9900"
                        >
                      </el-rate>
                    </div>
                  </template>
                </el-table-column>

                <!--订单号-->
                <el-table-column prop="amend" label="IP地址" width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.ip==null||scope.row.ip==""?'无':scope.row.ip}}
                    </div>
                  </template>
                </el-table-column>

                <!--库存-->
                <el-table-column label="评论时间" width="200" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div class="template_content">
                      {{scope.row.create_time==null?'无':chuan(scope.row.create_time)}}
                    </div>
                  </template>
                </el-table-column>

                <!--&lt;!&ndash;库存类型&ndash;&gt;-->
                <el-table-column prop="scope" label="是否显示" width="150" show-overflow-tooltip>
                  <template  slot-scope="scope">
                    <el-switch
                      v-model="scope.row.status"
                      active-color="#13ce66" inactive-color="#CBD0D6"
                      @change="check_starnums(scope.row)"
                     >
                    </el-switch>

                  </template>
                </el-table-column>

                <!--操作类型-->
                <el-table-column prop="scope" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <strong style="color: #13ce66!important" class="lookings" @click="fin_detail(scope.row)">查看</strong>
                    <strong style="margin-left: 20px!important;color: #CBD0D6!important" @click="del_list(scope.row)">删除</strong>
                  </template>
                </el-table-column>
              </el-table>

              <div style="width: 90%;margin-top: 20px;overflow: hidden">
                <div class="methods" style="float: left">
                  <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData3)">全选</el-button>
                  <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData3)">取消全选</el-button>
                  <el-button size="mini" @click="delSelectStock">删除</el-button>
                  <el-button size="mini" @click="xainSelectStock">显示</el-button>
                  <el-button size="mini" @click="yinSelectStock">隐藏</el-button>
                </div>
                <!--current-page  当前页数-->
                <!--page-sizes   每页多少条数据-->
                <el-pagination style="float: right"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pages.nowPages"
                               :page-sizes="[10,20,30,40,50]"
                               :page-size="pages.limit"
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
  </div>
</template>

<script>
  import { requestLogin } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import {api_active,evaluate} from "@/api/api.js"
  let apiActive = new api_active();
  let apiEvaluate=new evaluate()
  export default {
    data() {
      return {
        //所有商品评价的信息列表
        tableData3: [],


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

        //分页数据
        pages:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },

        //排列方式
        sortOrders:"",
        sortOrder:[
          {
            label:"时间顺序",
            value:2
          },
          {
            label:"时间倒序",
            value:1
          },
          {
            label:"好评靠前",
            value:3
          },{
            label:"差评靠前",
            value:4
          }
        ],
        star_num:3.7,//星星数量,

        //table表格选中得到的数据
        multipleSelection: [],
        //全选、取消全选的禁用状态
        allSelect:true,
        selectDisabled:false,
        clearDisabled:true,
      }
    },
    //推送表单   进行判断验证
    mounted(){
      var _this=this;
      _this.get_cat();
      //头部信息
      var param={
        page:1,
        limit:10,
      }
      _this.getEvaluateList(param);

    },
    methods: {
      //库存信息的渲染事件
      getEvaluateList(params){
        var _this=this;
        //库存的所有信息
        //商品评价列表信息
        apiActive.getEvaluate(params).then(res => {
          console.log(res)
          if(res.cscode==0){
            _this.tableData3=res.data.data;
            _this.pages.count=res.data.count;
            _this.getfr()

          }else{
            _this.$message.error(res.data.msg);
          }
        });
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
        console.log(_this.sortOrders)
        var params={
          sort:_this.sortOrders,
          page:1,
          limit:_this.limit
        }
        //商品评价列表信息
        apiEvaluate.sort_assess(params).then(res => {
          _this.formInline.firstcheck=false
          _this.formInline.secondcheck=false
          _this.formInline.thirdcheck=true
          if(res.cscode==0){
            _this.pages.count=res.data.count;
            _this.tableData3=res.data.data;
            _this.getfr()

          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
      //排序封装
      changsort_num(param){
        var _this=this
        apiEvaluate.sort_assess(param).then(res => {
          _this.formInline.firstcheck=false
          _this.formInline.secondcheck=false
          _this.formInline.thirdcheck=true
          if(res.cscode==0){
            _this.pages.count=res.data.count;
            _this.tableData3=res.data.data;
            _this.getfr()

          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
      //是否显示评价
      getfr(){
        var _this=this
        for(let i=0;i<_this.tableData3.length;i++){

        if(_this.tableData3[i].status==1){
          _this.tableData3[i].status=false

        }else if(_this.tableData3[i].status==2){
          _this.tableData3[i].status =true
        }
        }
      },

      //模糊查询所用到的事件
      changeMethodsType(val){
      },
      //改变时间开始时间和结束时间
      changeTimeBegin(val){
        var _this=this;
        //先转时间戳然后再截取字符串   最后转数字
        val=String(val.getTime()).slice(0,10);
        console.log(val)
      },
      changeTimeStop(val){
        var _this=this;
        //先转时间戳然后再截取字符串   最后转数字
        val=String(val.getTime()).slice(0,10);
        console.log(val)
      },
      //点击查询按钮
      queryStock(){
        var _this=this;
        _this.formInline.firstcheck=false
        _this.formInline.secondcheck=true
        _this.formInline.thirdcheck=false
        let param={
          key_words: _this.formInline.search_name,
          cat_id:_this.formInline.style_demo,
          username:_this.formInline.search_niname,
          page:1,
          limit:_this.pages.limit,
        }
        console.log(param)

        _this.searchJieKou(param);
      },
      //模糊查询调用接口
      searchJieKou(params){
        var _this=this;
        apiEvaluate.search_assess(params).then(res => {
          console.log(res)
          _this.pages.count=res.data.count;
          if(res.cscode==0){
            _this.tableData3=res.data.data
            _this.getfr()
          }
        })
      },

      //对表格数据进行操作所有相关的事件
      //table表格选中事件
      handleSelectionChange(val) {
        var _this=this;
        _this.multipleSelection = val;
        console.log(val)
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
      delMethodsStockRes(params){
        var _this=this;
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
        });
      },
      //分页事件
      //下一页
      nextPages(index){
        var _this=this;
        var param={
          page:index,
          limit:_this.pages.limit
        }
        _this.getEvaluateList(param);
      },
      //上一页
      prevPages(index){
        var _this=this;
        var param={
          page:index,
          limit:_this.pages.limit
        }
        _this.getEvaluateList(param);
      },
      //每页条数改变执行的事件
      handleSizeChange(limit) {
        var _this=this;
        _this.pages.limit=limit
        if(_this.formInline.firstcheck){
          var param={
            page:1,
            limit:limit
          }
          console.log(param)
          _this.getEvaluateList(param);
        }
        if(_this.formInline.secondcheck){
          let param={
            key_words: _this.formInline.search_name,
            cat_id:_this.formInline.style_demo,
            username:_this.formInline.search_niname,
            page:1,
            limit:limit,
          }
          console.log("bbbb")
          // _this.queryStock(param)
          _this.searchJieKou(param);
        }
        if(_this.formInline.thirdcheck){
          let param={
            sort:_this.sortOrders,
            page:1,
            limit:limit,
          }
          _this.changsort_num(param)
        }

      },
      //当前页发生改变的时候执行的事件
      handleCurrentChange(index) {
        var _this=this;
        _this.pages.nowPages=index
        if(_this.formInline.firstcheck){
          var param={
            page:index,
            limit:_this.pages.limit
          }
          console.log(param)
          _this.getEvaluateList(param);
        }
        if(_this.formInline.secondcheck){
          let param={
            key_words: _this.formInline.search_name,
            cat_id:_this.formInline.style_demo,
            username:_this.formInline.search_niname,
            page:index,
            limit:_this.pages.limit,
          }
          console.log(param)
          _this.searchJieKou(param);
        }
        if(_this.formInline.thirdcheck){
          let param={
            sort:_this.sortOrders,
            page:index,
            limit:_this.pages.limit,
          }
          _this.changsort_num(param)
        }
      },
      //多选
      handleCheckAllChange(val) {
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
      //是否显示
      check_starnums(scopec){
        var num=null
        if(scopec.status){
          num=1
        }else{
          num=2
        }

      let param={
        ass_id:scopec.id,
        status:num
      }
      apiEvaluate.xianshi_assess(param).then(res => {
        console.log(res)
          if(res.cscode==0){
           alert("更改成功")
          }
        })

      },
      //显示
      xainSelectStock(){
        var arr=[]
        var _this=this;
        for(var i=0;i<_this.multipleSelection.length;i++){
          arr.push(_this.multipleSelection[i].id)
        }
        console.log(_this.multipleSelection)
        let param={
          status:2,
          ids:arr
        }
       apiEvaluate.xianshi_Allassess(param).then(res => {
          console.log(res)

         if(res.cscode==0){
           var param={
             page:1,
             limit:_this.pages.limit
           }
           _this.getEvaluateList(param);
           }
        })

      },
      //隐藏
      yinSelectStock(){
        var _this=this
        2//展示
        var arr=[]
        var _this=this;
        for(var i=0;i<_this.multipleSelection.length;i++){
          arr.push(_this.multipleSelection[i].id)
        }
        console.log(_this.multipleSelection)
        let param={
          status:1,
          ids:arr
        }
        apiEvaluate.xianshi_Allassess(param).then(res => {
          console.log(res)

          if(res.cscode==0){
            var param={
              page:1,
              limit:_this.pages.limit
            }
            _this.getEvaluateList(param);
          }
        })
      },
      //查看详情
      fin_detail(scope){
        var id=scope.id
        var goods=scope.goods_id
        console.log(id)
        this.$router.push({path:'/evadetail',query:{ass_id:id,goods_id:goods}})
       /* console.log(sessionStorage.getItem("token"))
        console.log(sessionStorage.getItem("token1"))
        console.log(sessionStorage.getItem("token2"))*/
      },
      //单个shanchu
      del_list(item){
        var _this=this
        var arr=[item.id]
        arr.push()
        console.log(arr)

        let param={
          ids:arr
        }
        apiEvaluate. del_eva(param).then(res => {
          if(res.cscode==0){
            _this.$message({
              showClose: true,
              message: '删除成功'
            });
            var param={
              page:1,
              limit:_this.pages.limit
            }
            _this.getEvaluateList(param);
          }
          console.log(res)

        })
      },
      //批量删除
      delSelectStock(item){
        var _this=this
        var _this=this
        2//展示
        var arr=[]
        var _this=this;
        for(var i=0;i<_this.multipleSelection.length;i++){
          arr.push(_this.multipleSelection[i].id)
        }
        console.log(arr)
        let param={
          ids:arr
        }
        apiEvaluate. del_eva(param).then(res => {
          if(res.cscode==0){
            _this.$message({
              showClose: true,
              message: '删除成功'
            });
            var param={
              page:1,
              limit:_this.pages.limit
            }
            _this.getEvaluateList(param);
          }
          console.log(res)

        })
      },
    }
  }
</script>

<style scoped>
  @import url("../../assets/css/Inventory.css");

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
