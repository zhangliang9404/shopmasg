<template>
<div class="listOfTurns">
  <!--头部导航-->
  <div class="header">
    <div class="title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页轮播</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/listOfTurns' }">轮播列表 </el-breadcrumb-item>
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
      <li>轮播ID：<el-input v-model="goodsName" placeholder="轮播ID" class="num"></el-input></li>
      <li>
        添加日期：

        <el-date-picker
          v-model="value6"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </li>
    </ul>
  </div>
  <!--展示的列表数据-->
  <div class="lists">
    <el-card class="box-card">
      <div slot="header">
        <span class="listTitle" style="margin-top: 10px"><i class="el-icon-document"></i> 数据列表</span>
        <el-button style="float: right;margin-bottom: 20px" @click="choose_list">添加轮播图</el-button>
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
            <el-table-column label="图片名称" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.name==null?"无":scope.row.name}}
              </template>
            </el-table-column>
            <!--商品名称-->
            <el-table-column label="图片" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <img style="width: 100%;height: 40px;" :src="scope.row.img==null?'无':scope.row.img" alt="">

              </template>
            </el-table-column>
            <!--是否推荐-->
            <el-table-column prop="scope" label="是否使用" width="150" show-overflow-tooltip>
              <template  slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-color="#13ce66" inactive-color="#CBD0D6"
                  @change="check_starnums(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <!--是否推荐-->
            <el-table-column prop="scope" label="添加时间" width="200" show-overflow-tooltip>
              <template  slot-scope="scope">
                <div style="white-space:normal">
                  {{scope.row.creat_time && scope.row.creat_time ? chuan(scope.row.creat_time):'无'}}

                </div>
              </template>
            </el-table-column>
            <el-table-column label="排序" width="100px" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.sku">
                  <p v-for="(item,index) in scope.row.sku"  style="white-space: nowrap;text-overflow:ellipsis;overflow: hidden">

                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <div class="template_content">
                  {{scope.row.types==1 ? '启用中' : '未启用'}}
                </div>
              </template>
            </el-table-column>

            <!--操作-->
            <el-table-column prop="scope" label="操作" width="250" show-overflow-tooltip>
              <template slot-scope="scope">
                <strong  class="info" @click="getInfo(scope.row.id)">删除</strong>
                <strong class="update" @click="Istop(scope.row)">编辑</strong>
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
        name: "listOfTurns",
      data(){
          return{
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
      mounted(){
          this.getlivelists()
      },
      methods:{
        getlivelists(){
          let _this = this
          let param = {
            id :'',
            start_time:'',
            end_time:''
          }
          //获取轮播图列表
          apiuser.maplist(param).then(res=>{
            console.log(res);
            _this.dataLists = res.data.data
            console.log( _this.dataLists);
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
        //是否启用
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
      }
    }
</script>

<style scoped>
  /*首页-首页推荐-今日推荐-top*/
  ul li {padding:0;margin:0;list-style:none;}
  .listOfTurns .header {overflow: hidden;margin-bottom: 20px;width: 100%;font-size:12px;line-height: 20px;}
  .el-breadcrumb {display: inline-block;}
  .listOfTurns .header .el-button {float: right;margin-top: 20px;}
  .listOfTurns .header .title {width: 94%;border-bottom: 1px solid #ccc;float: left;line-height: 30px;}
  /*首页-首页推荐-今日推荐-筛选盒子样式*/
  .listOfTurns .btn_box {width: 100%;height: 70px;line-height: 70px;background-color: #ccc;}
  .listOfTurns .btn_box ul li {float: left;}
  .listOfTurns .btn_box ul li:nth-child(2) {float: right;margin-right: 12px;}
  .listOfTurns .btn_box ul li .button {width: 100px}
  .listOfTurns .generalScreening {width: 100%;height: 80px;line-height: 70px;border: 1px solid #ccc;}
  .listOfTurns .generalScreening ul {height: 100%;margin:5px 0 0 0;}
  .listOfTurns .generalScreening ul li {width: 33%;float: left;}
  .listOfTurns .generalScreening ul li .num {width: 200px;}
</style>
