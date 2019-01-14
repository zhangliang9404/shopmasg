<template>
  <div class="Recommended">
    <!--头部导航-->
    <div class="header">
      <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页推荐</el-breadcrumb-item>
        <el-breadcrumb-item>今日推荐</el-breadcrumb-item>
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
          <el-button @click="searchResult()">查询结果</el-button>
        </li>
      </ul>
    </div>
    <div class="generalScreening" v-if="!appear">
      <ul>
        <li>商品名称：<el-input v-model="goodsName" placeholder="商品名称" class="num"></el-input></li>
        <li>
          推荐状态：
          <el-select v-model="recommendedClassifys" placeholder="选择推荐状态" clearable>
            <el-option v-for="(item,index) in recommendedClassify" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <!--展示的列表数据-->
    <div class="lists">
      <el-card class="box-card">
        <div slot="header">
          <span class="listTitle" style="margin-top: 10px"><i class="el-icon-document"></i> 数据列表</span>
          <el-button style="float: right;margin-bottom: 20px" @click=" choose_list">选择商品</el-button>
          <el-dialog
            title="选择商品"
            :visible.sync="dialogVisible2"
            width="50%"
          >
            <div>
              <el-input
                class="inputInit"
                style="width: 250px"
              placeholder="商品名称搜索"
              v-model="initGoodsName"
              clearable>
              </el-input>
              <el-button type="primary" icon="el-icon-search" class="searchinit" @click="searchInit">搜索</el-button>

            </div>
            <div class="table" style="margin-top: 20px">
              <el-table class="dataListTable"
                        ref="multipleTable"
                        :data="dataLists2"
                        stripe
                        current-row-key="index"
                        :border="true"
                        tooltip-effect="dark"
                       >
                <!--商品名称-->
                <el-table-column label="商品名称" width="150">
                  <template slot-scope="scope">
                    <div style="white-space: normal">
                      {{scope.row.name}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="商品规格/单买价/团购价" width="400px">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sku">
                      <p v-for="(item,index) in scope.row.sku" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">

                        {{'规格：'+item.sku_font+'；单买价：'+item.goods_price+'；团购价'+item.group_price}}
                      </p>
                    </div>
                  </template>
                </el-table-column>
                <!--是否推荐-->
                <el-table-column prop="scope" label="推荐时间" width="200" show-overflow-tooltip>
                  <template  slot-scope="scope">
                    <div style="white-space: normal">
                      {{scope.row.recommend_start==0 && scope.row.recommend_end==0?'未设置':chuan(scope.row.recommend_start) +'—' +chuan(scope.row.recommend_end)}}
                    </div>
                  </template>
                </el-table-column>
                <!--操作-->
                <el-table-column prop="scope" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked" @change="settingTime(scope.row,3,scope.$index)">时间 </el-checkbox>
                    <!--  <el-button  class="settime"  @click="settingTime(scope.row,3)"></el-button>-->
                    <el-dialog
                      title="选择时间"
                      :visible.sync="dialogVisible3"
                      append-to-body
                      width="40%"
                      :before-close="cancel_list"
                         >
                      <el-date-picker
                        v-model="time_init"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      @change="change_timer(2)">
                      </el-date-picker>
                      <span slot="footer" class="dialog-footer">
                      <el-button @click="cancel_list">取 消</el-button>
                      <el-button type="primary" @click="changeTimes(3)">确 定</el-button>
                    </span>
                    </el-dialog>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination class="dataListBtnFr" @current-change="handleCurrentChange2"
                             @size-change="handleSizeChange2"
                             :current-page="pages2.nowPages" :page-sizes="[10,20,30,40,50]" :page-size="pages2.limit"
                             layout="total, sizes, prev, pager, next, jumper" :total="pages2.count"
                             @next-click="nextPages2" @prev-click="prevPages2">
              </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible2 = false">取 消</el-button>
                      <el-button type="primary" @click="changeTimes(2)">确 定</el-button>
                    </span>
          </el-dialog>


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
              <el-table-column label="商品名称" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.goods_name==null?"无":scope.row.goods_name}}
                </template>
              </el-table-column>
              <!--是否推荐-->
              <el-table-column prop="scope" label="是否推荐" width="150" show-overflow-tooltip>
                <template  slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#13ce66" inactive-color="#CBD0D6"
                    @change="check_starnums(scope.row)">
                  </el-switch>
                </template>
              </el-table-column>
              <!--是否推荐-->
              <el-table-column prop="scope" label="推荐时间" width="200" show-overflow-tooltip>
                <template  slot-scope="scope">
                  <div style="white-space:normal">
                    {{scope.row.recommend_start && scope.row.recommend_end ? chuan(scope.row.recommend_start)+' — '+chuan(scope.row.recommend_end):'无'}}

                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品规格/单买价/团购价" width="400px" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.sku">
                    <p v-for="(item,index) in scope.row.sku"  style="white-space: nowrap;text-overflow:ellipsis;overflow: hidden">
                      {{'规格：'+item.sku_font+'单买价：'+item.goods_price+'团购价'+item.group_price}}
                    </p>

                    <!--<el-tooltip v-for="(skuitem,index) in scope.row.goods" :key="index" class="item" effect="dark" :content="'规格：'+item.sku_font+'单买价：'+item.goods_price+'团购价'+item.group_price" placement="top">
                      <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{'规格：'+item.sku_font+'单买价：'+item.goods_price+'团购价'+item.group_price}}</p>
                    </el-tooltip>-->
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div class="template_content">
                            {{scope.row.types==1 ? '推荐中' : '未推荐'}}
                  </div>
                </template>
              </el-table-column>

              <!--操作-->
              <el-table-column prop="scope" label="操作" width="250" show-overflow-tooltip>
                <template slot-scope="scope">
                  <strong  class="info" @click="getInfo(scope.row.id)">查看</strong>
                  <strong class="update" @click="Istop(scope.row)">置顶</strong>
                    <el-button  class="settime"  @click="settingTime(scope.row,1)">时间</el-button>

                  <el-dialog
                    title="选择时间"
                    :visible.sync="dialogVisible1"
                    width="30%"
                   >
                    <el-date-picker
                      v-model="time_out"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="change_timer(1)">
                    </el-date-picker>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible1 = false">取 消</el-button>
                      <el-button type="primary" @click="changeTimes(1)">确 定</el-button>
                    </span>
                  </el-dialog>
                </template>
              </el-table-column>
            </el-table>
            <div class="dataListBtn">
              <div class="dataListBtnFl">
                <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(dataLists)">全选</el-button>
                <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(dataLists)">取消全选</el-button>
                <el-button size="mini" @click="tuijian(1)">设为推荐</el-button>
                <el-button size="mini" @click="tuijian(0)">取消推荐</el-button>
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
  import { api_user } from "@/api/api.js"
  let apiuser = new api_user();
  export default {
    name:"Recommended",
    data() {
      return {
        appear:true, // 收起-筛选是否打开
        goodsName:'', // 输入搜素-商品名称
        recommendedClassifys:'', // 选择推荐状态
        recommendedClassify: [{
          value: 'yes',
          label: '推荐中'
        }, {
          value: 'no',
          label: '未推荐'
        }],
        dataLists:[],
        dialogVisible1:false,//选择商品
        dialogVisible2: false,
        dialogVisible3: false,
        // 分页数据
        pages:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },
        multipleSelection: [],
        //全选、取消全选的禁用状态
        allSelect:true,
        selectDisabled:false,
        clearDisabled:true, // 取消全选,
        initGoodsName:'',//内部商品名称
        dataLists2:[],//内部数据
        pages2:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },
        time_init:'',//内部时间段
        startTime2:'',
        entTime2:'',
        id_index:'',//里面选中Index
        out_id:'',//外面选中时间时传的id
        startTime1:'',
        entTime1:'',
        time_out:'',//外面时间
      }
    },
    //推送表单   进行判断验证
    mounted(){
    /*  this.get_cat();
      this.getEvaluateList();*/
      this.getlistdata()
    },
    methods: {
      // 刷新
      refresh(){
        location.reload();
      },
      //查询结果
      getlistdata(){
        var _this=this
        let param = {
          limit:_this.pages.limit,
          page:_this.pages.nowPages,
          goods_name:_this.goodsName,
          types:_this.recommendedClassifys
        }
        console.log(param)
        apiuser.recommendedList(param).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:'获取成功', showClose: true,})
            _this.pages.count=res.data.count
            _this.dataLists=res.data.info
            for(var i=0;i<_this.dataLists.length;i++){
              if(_this.dataLists[i].types==1){
                _this.dataLists[i].status=true
              }else {
                _this.dataLists[i].status=false
              }
            }
            console.log( _this.dataLists)
          }else {
            this.$message.error('暂无数据')
          }
        })
      },
        searchResult(){
        if(this.goodsName=='' && this.recommendedClassifys==''){
          this.$message("请输入查询条件")
        }else {
          this.getlistdata()
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {this.paginationShow = true;})
        }

        },
        handleSizeChange(limit){
          this.pages.limit = limit
          this.pages.nowPages=1
          this.getlistdata()
          this.handleCurrentChange(1)
        },
        handleCurrentChange(index){
          this.pages.nowPages = index
          this.getlistdata()
        },
        nextPages(index){
          this.pages.nowPages = index
          this.getlistdata()
        },
        prevPages(index){
          this.pages.nowPages = index
          this.getlistdata()
        },
      //查看看商品详情
      getInfo(id){
        console.log(id)
        this.$router.push({path:'goodsDetails',query:{id:id,types:'recommended'}})
      },

      //是否推荐
      check_starnums(scopec){
        console.log(scopec.status)
        var str=''
        var goods_id=[scopec.id]
        if(scopec.status){
           str=1
        }else {
           str=0
        }
        let param={
          op:'is_recommend',
          types:str,
          goods_id:goods_id,
        }

        apiuser.recommendChange(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            this.pages.nowPages1
            this.getlistdata()
          }
        })

      },
      //Z置顶
      Istop(item){
        var arr=[item.id]
        console.log(item)
        let param={
          op:'up',
          goods_id:arr
        }
        apiuser.recommendChange(param).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:res.data.msg, showClose: true,})
            this.getlistdata()
          }else{
              this.$message(res.data.msg)
            }
        })
      },

      tuijian(num){

        if(this.multipleSelection.length>0){
          var arr=[]
          for(var i=0;i<this.multipleSelection.length;i++){
            arr.push(this.multipleSelection[i].id)
          }
          let param={
            op:'is_recommend',
            types:num,
            goods_id:arr,
          }

          apiuser.recommendChange(param).then(res => {
            console.log(res)
            if(res.cscode==0){
              this.pages.nowPages1
              this.getlistdata()
            }
          })
        }else {
          this.$message('选择要推荐的内容')
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
      change_timer(num){
        if(num==2){
          if(this.time_init){
            this.startTime2= Number(String(this.time_init[0].getTime()).slice(0,10))
          this.endTime2=Number(String(this.time_init[1].getTime()).slice(0,10))
        }
        console.log(this.startTime2,this.endTime2)
        }else if(num==1){
          this.startTime1= Number(String(this.time_out[0].getTime()).slice(0,10))
          this.endTime1=Number(String(this.time_out[1].getTime()).slice(0,10))
        }
      },
      //时间
      settingTime(item,type,index){
        if(type==3){
          this.dataLists2[index].checked = true;
          this.dialogVisible3=true
          this.id_index=index
        }else if(type==1) {
          if(item.types==1){
            this.dialogVisible1=true
            this.out_id=item.id
          }else {
            this.$message('您还没推荐该商品');
          }
        }


      },
      changeTimes(num){
        if(num==3){
          this.time_init=''
          this.dataLists2[this.id_index].recommend_start=this.startTime2
          this.dataLists2[this.id_index].recommend_end=this.endTime2
          this.dialogVisible3=false
        }else if(num==1){
          var arr=[this.out_id]
          let param={
            op:'change_time',
            recommend_start:this.startTime1,
            recommend_end:this.endTime1,
            goods_id:arr,
          }
          apiuser.recommendChange(param).then(res => {
            if(res.cscode==0){
              this.$message({type: 'success',message:res.data.msg, showClose: true,})
              this.getlistdata()
            }else {
              this.$message(res.data.msg)
            }
          })
          this.dialogVisible1=false

        }else if(num==2){
          var arr=[]
          console.log(this.dataLists2)
           for(var i=0;i<this.dataLists2.length;i++){
             if(this.dataLists2[i].recommend_end && this.dataLists2[i].recommend_start){
               var obj={
                 id:this.dataLists2[i].id,
                 recommend_start:this.dataLists2[i].recommend_start,
                 recommend_end:this.dataLists2[i].recommend_end
               }
               arr.push(obj)
             }

           }
           if(arr.length>0){
             let param={
               op:'add',
               recommend_arr:arr
             }
             apiuser.chooseGoods(param).then(res => {
               if(res.cscode==0){
                 this.$message({type: 'success',message:res.data.msg, showClose: true,})
                 this.getChooseData()
                 this.dialogVisible=false
               }
             })
           }else{
             this.$message("请选择商品")
           }

        }
      },
      cancel_list(){
        var timeStamp = new Date(new Date().setHours(0, 0, 0, 0))
        var ThreeDayAgo = timeStamp+24 * 60 * 60 * 1000;
        var str=timeStamp.getTime()+24 * 60 * 60 * 1000

        console.log(Number(String(timeStamp.getTime()).slice(0,10)))
        this.startTime2=Number(String(timeStamp.getTime()).slice(0,10))
        this.endTime2=Number(String(str).slice(0,10))
        this.dataLists2[this.id_index].recommend_start=this.startTime2
        this.dataLists2[this.id_index].recommend_end=this.endTime2
        this.dialogVisible3 = false
      },
      //对表格数据进行操作所有相关的事件
      //table表格选中事件
      handleSelectionChange(val) {
        var _this=this;
        _this.multipleSelection = val;
        if(_this.multipleSelection.length<_this.dataLists.length){
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
        console.log(_this.multipleSelection);
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

      //多选
      handleCheckAllChange(val) {
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      choose_list(){
        this.dialogVisible2=true
        this.getChooseData()
      },
      //查询结果
      getChooseData(){
        var _this=this
        let param = {
          search_name:_this.initGoodsName,
          limit:_this.pages2.limit,
          page:_this.pages2.nowPages,

        }
        console.log(param)
        apiuser.chooseGoods(param).then(res => {
          if(res.cscode==0){
            this.$message({type: 'success',message:'获取成功', showClose: true,})
            _this.pages2.count=res.data.count
            _this.dataLists2=res.data.info
            for(var i=0;i<_this.dataLists2.length;i++){
              if(_this.dataLists2[i].recommend_start==0){
                _this.dataLists2[i].checked=false
              }else {
                _this.dataLists2[i].checked=true
              }
            }

          /*  for(var i=0;i<_this.dataLists.length;i++){
              if(_this.dataLists[i].types==1){
                _this.dataLists[i].status=true
              }else {
                _this.dataLists[i].status=false
              }
            }*/
            console.log( _this.dataLists2)
          }else {
            this.$message.error('暂无数据')
          }
        })
      },
      handleSizeChange2(limit){
        console.log(limit)
        this.pages2.limit = limit
        this.pages2.nowPages=1
        this.getChooseData()
      },
      handleCurrentChange2(index){
        this.pages2.nowPages = index
        this.getChooseData()
      },
      nextPages2(index){
        this.pages2.nowPages = index
        this.getChooseData()
      },
      prevPages2(index){
        this.pages2.nowPages = index
        this.getChooseData()
      },
      //内部搜索
      searchInit(){
        if(this.initGoodsName!=''){
          this.pages2.nowPages=1
          this.getChooseData()
          this.handleCurrentChange2(1)
        }else {
          this.$message("请输入商品名称")
        }

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
<style>
  .Recommended .settime{background: none;font-size: 14px;border: 0;display: inline;padding: 0;margin-left: 10px}
  .Recommended .inputInit{border-top-right-radius: 0!important;border-bottom-right-radius: 0!important;}
  .Recommended .searchinit{border-top-left-radius: 0;border-bottom-left-radius: 0;position: absolute;left: 240px}
</style>
