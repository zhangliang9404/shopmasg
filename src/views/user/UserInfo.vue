<template>
  <div class="UserInfo">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/UserList' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--<p class="explanation">显示使用者的详情信息</p>-->

    <div class="notwrap">
      <!--左面图片-->
      <div class="img">
        <el-col :span="4">
          <el-card >
            <img :src="headingimg" class="image">
            <div style="padding: 16px 6px;">
              <span>{{phone}}</span>
              <div :disabled="fans_num>0" @click="openFans" style="font-size: 12px;color: blue;cursor: pointer;text-decoration:underline">粉丝：{{fans_num}}</div>
              <el-button round>{{leve}}</el-button>
            </div>
          </el-card>
        </el-col>
      </div>
      <el-dialog
        title="粉丝详情"
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <div class="fans">
          <el-input
            placeholder="账号/昵称"
            v-model="fans_name"
            clearable style="width: 50%">
          </el-input>
          <el-button style="width:10%" @click="getSearchFans">搜索</el-button>
          <template>
            <el-table
              :data="tableDatas"
              border
              style="width: 100%;margin-top: 20px">
              <el-table-column prop="id" label="粉丝ID" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="nickname" label="昵称" width="150" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="phone" label="用户账号" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="scope" label="关注时间" width="200" show-overflow-tooltip>
                <template  slot-scope="scope">
                  {{scope.row.create_time}}
                  <!-- {{chuan(scope.row.create_time)}}-->
                </template>
              </el-table-column>
              <el-table-column prop="scope" label="性别"  show-overflow-tooltip>
                <template  slot-scope="scope">
                  {{scope.row.sex | sex}}
                </template>
              </el-table-column>

            </el-table>
            <el-pagination class="dataListBtnFr" @current-change="handleCurrentChange2"
                           @size-change="handleSizeChange2"
                           :current-page="pages2.nowPages" :page-sizes="[10,20,30,40,50]" :page-size="pages2.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="pages2.count"
                           @next-click="nextPages2" @prev-click="prevPages2">
            </el-pagination>
          </template>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--详情-->
      <div class="biaoge1">
        <el-table :data="tableData" border style="width: 60%">
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="nickname" label="昵称"> </el-table-column>
          <el-table-column  label="性别">
            <template slot-scope="scope">
            {{xingbie(scope.row.sex)}}
            </template>
          </el-table-column>
          <el-table-column prop="identityid" label="身份证号"></el-table-column>
          <el-table-column prop="occupation" label="车牌号"></el-table-column>
        </el-table>
        <el-table :data="tableData2" border style="width: 60%">
          <el-table-column prop="phone" label="账号"></el-table-column>
          <el-table-column prop="phone" label="手机号" ></el-table-column>
          <el-table-column label="注册时间" >
            <template slot-scope="scope">
              {{chuan(scope.row.create_time)}}
            </template>
          </el-table-column>
          <el-table-column prop="province" label="城市"></el-table-column>
          <el-table-column prop="country" label="国家 "></el-table-column>
        </el-table>
      </div>
    </div>
    <hr />
    <div class="biaoge2">
      <i class="el-icon-edit">
        <span>统计信息</span>
      </i>

      <el-table
        :data="tableData4"
        border
        style="width: 95%">
        <el-table-column
          label="消费金额"
          width="100">
          <template slot-scope="scope">
          ￥{{scope.row.sfje}}
          </template>
        </el-table-column>
        <el-table-column
          prop="djsl"
          label="订单数量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="kyjf"
          label="可用积分"
          width="100">
        </el-table-column>
        <el-table-column
          prop="thjl"
          label="退货记录"
          width="300">
        </el-table-column>
        <el-table-column
          prop="gz"
          label="关注"
          width="100">
        </el-table-column>
        <el-table-column
          prop="yqyh"
          label="邀请用户"
          width="100">
        </el-table-column>
        <el-table-column
          prop="scsp"
          label="收藏商品"
          width="200">
        </el-table-column>
        <el-table-column
          prop="scdp"
          label="收藏店铺"
         >
        </el-table-column>
      </el-table>


    </div>

    <div class="biaoge2">
      <i class="el-icon-edit">
        <span>收货地址</span>
      </i>
      <el-table
        :data="tableData3"
        border
        style="width: 95%">
        <el-table-column
          prop="consignee"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          width="200">
        </el-table-column>
        <el-table-column
          prop="ad_detail"
          label="详细地址"
          width="500">
        </el-table-column>
        <el-table-column
          prop="postcode"
          label="邮政编码"
          width="200">
        </el-table-column>
        <el-table-column
          label="默认地址"
         >
          <template slot-scope="scope">
            <el-switch
              on-text ="是"
              off-text = "否"
              active-color="#13ce66" inactive-color="#CBD0D6"
              v-model="scope.row.status"
              disabled
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="biaoge2">
      <i class="el-icon-edit">
        <span>订单记录</span>
      </i>
      <el-table
        :data="tableData5"
        border
        style="width: 95%">
        <el-table-column
          prop="ordernumber"
          label="订单编号"
          width="250">
        </el-table-column>
        <el-table-column
          prop="creationtime"
          label="提交时间"
          width="250">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="用户账号"
          width="200">
        </el-table-column>
        <el-table-column
          label="订单金额（元）"
          width="120">
          <template slot-scope="scope">
            ￥{{scope.row.price}}
          </template>
        </el-table-column>

        <el-table-column
          prop="mode_payment"
          label="支付方式"
          width="150">
        </el-table-column>
        <el-table-column
          prop="order_source"
          label="订单来源"
          width="150">
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"

         >
          <template slot-scope="scope">
            <strong class="info" @click="handleClick(scope.row)">查看订单</strong>
          </template>
        </el-table-column>

      </el-table>

      <div style="margin-top: 20px;margin-left: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,40,50]"
          :page-size="pagesize"
          :total="coutnum"
          layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
</div>
</template>

<script>
  import { requestLogin } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  import {distribution} from "@/api/api.js" // export class api_user{}中的总名称
  let apiDistribution = new distribution(); // 给api_user另命名
  export default {
    data() {
      return {
        'coutnum':0,
        'pagesize':10,
        'currentPage':1,
        fans_num:'',
        'phone':'',
        'leve':'',
        'uid':this.$route.query.id,
        tableDatas: [],
        tableData2: [],
        tableData3: [],
        tableData4:[],
        tableData5:[],
        tableDatas:[],
        headingimg:'',
        sexs:'ggggggd',
        dialogVisible:false,
        fans_name:'',//粉丝名称
        tableData: [],
        pages2:{
          count:0,
          nowPages:1,//当前页数
          limit:10
        },
      }
    },
    mounted: function(){
      utils.setCookie("__user_token__","13ce42b1218b819fdfa3eba0331f80f3");
      this.getarr();
      /*this.getaddress();
      this.getOrderList();*/
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.pagesize=val;
        this.getOrderList();
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage =val;
        this.getOrderList();
        console.log(`当前页: ${val}`);
      },
      //个人评价
      getarr(){
        var _this=this
        let param={
          "uid":this.uid,
          "page":_this.currentPage,
          "limit":_this.pagesize
        };
       console.log(param)
        apiUser.somedate(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            this.$message(res['data']['msg']);

             _this.headingimg=res.data.data.userinfo.headimgurl
            console.log(res.data.data.fans_num)
           _this.fans_num=res.data.data.fans_num
            _this.phone =res.data.data.userinfo.phone
            _this.leve =res.data.data.userinfo.grade;

            var arr=[]
            arr.push(res.data.data.userinfo)
            _this.tableData=arr
            for(var i=0;i<_this.tableData.length;i++){
              if(_this.tableData[i].province==''){
                _this.tableData[i].province='暂无'
              }
              if(_this.tableData[i].identityid==undefined){
                _this.tableData[i].identityid='暂无'
              }
              if(_this.tableData[i].occupation==undefined){
                _this.tableData[i].occupation='暂无'
              }

            }
            _this.tableData2=arr
            var arr1=[]
            arr1.push( res.data.data.sum)
            _this.tableData4=arr1
            _this.tableDatas=arr1
            _this.tableData3=res.data.data.add
            console.log( _this.tableData3)
           for(var j=0;j<_this.tableData3.length;j++){
             var str=_this.tableData3[j].province ? _this.tableData3[j].province :''
             var str1=_this.tableData3[j].city ? _this.tableData3[j].city : ''
             var str2=_this.tableData3[j].district ? _this.tableData3[j].district : ''
             var str3=_this.tableData3[j].street ? _this.tableData3[j].street : ''
             var str4=_this.tableData3[j].postcode ? _this.tableData3[j].postcode :''
             var str5=_this.tableData3[j].detail_site ? _this.tableData3[j].detail_site : ''
             _this.tableData3[j].ad_detail=str+" "+str1+" "+str2+" "+str3+" " +str4+" "+str5
             if(_this.tableData3[j].status==2){
               _this.tableData3[j].status=true
             }if(_this.tableData3[j].status==0){
               _this.tableData3[j].status=false
             }
           }
            _this.tableData5=res.data.data.order_list
            _this.coutnum=res.data.count
            _this.getqubie()

          }

        });
      },
      //性别过滤
      xingbie(item){
        if(item==0){
            return '保密'
           }if(item==1){
          return '男'
           }if(item==2){
          return '女'
           }
      },
      getqubie(){
        var _this=this
        console.log(_this.tableData5)
        for (var i=0;i<_this.tableData5.length;i++){
          //订单状态
          if(_this.tableData5[i].status== 0){
            _this.tableData5[i].status="等待买家付款";
            _this.tableData5[i].root_name = 'orderstate'+'0';//路由为变量，等待买家付款是0
          }
          if (_this.tableData5[i].status == 1) {
            _this.tableData5[i].status="买家已付款";
            _this.tableData5[i].root_name = 'orderstate'+'1';//买家已付款是1
          }
          if (_this.tableData5[i].status == 2) {
            _this.tableData5[i].status="取消订单";
            _this.tableData5[i].root_name = 'orderstate'+'6';//取消订单即交易关闭，6
          }
          if (_this.tableData5[i].status == 3) {
            _this.tableData5[i].status="等待买家收货";
            _this.tableData5[i].root_name = 'orderstate'+'3';//等待收货是3
          }
          if (_this.tableData5[i].status == 4) {
            _this.tableData5[i].status="买家已经收货";
            _this.tableData5[i].root_name = 'orderstate'+'4';//已收货是4
          }
          if (_this.tableData5[i].status == 5) {
            _this.tableData5[i].status="交易成功";
            _this.tableData5[i].root_name = 'orderstate'+'5';//交易成功是5
          }
          if (_this.tableData5[i].status == 6) {
            _this.tableData5[i].status="交易关闭";
            _this.tableData5[i].root_name = 'orderstate'+'6';//交易关闭是6
          }
          if (_this.tableData5[i].status == 7) {
            _this.tableData5[i].status="退款受理";
            _this.tableData5[i].root_name = 'orderstate'+'7';//退款受理是7
          }
          if (_this.tableData5[i].status == 8) {
            _this.tableData5[i].status="退款成功";
            _this.tableData5[i].root_name = 'orderstate'+'7';//退款成功是7在页面显示退款成功
          }
          if (_this.tableData5[i].status== 9) {
            _this.tableData5[i].status="退货中";
            _this.tableData5[i].root_name = 'orderstate'+'7';//暂无退货中，//7
          }
          if (_this.tableData5[i].status==12) {
            _this.tableData5[i].status = "已评价";
            _this.tableData5[i].root_name = 'orderstate' + '5';//交易成功是5--12为已评价
          }
        }
        console.log(_this.tableData5)
      },
     /* getaddress() {
        let param={
          "uid":this.uid,
        };
        param = utils.filterJson(param);
        apiUser.getuidtoAddress(param).then(res => {
          console.log(res)
          this.$message(res['data']['msg']);
          this.tableData3 = res['data']['data']['data']['data'];
        });

      },*/
     //获取订单列表
      getOrderList() {
        var _this=this
        let param={
          "uid":this.uid,
          "page":this.currentPage,
          "limit":this.pagesize
        };
        param = utils.filterJson(param);
        apiUser.somedate(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            _this.tableData5=res.data.data.order_list
            _this.coutnum=res.data.count
            _this.getqubie()
          }

        });
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
       //查看订单详情
      handleClick(item){
        var id=item.id
        console.log(id)
        console.log(item.root_name)
        this.$router.push({path:item.root_name,query:{id:item.id}})
      },
      openFans(){
        if(this.fans_num>0){
          this.dialogVisible=true
          this.getFansList()
        }

      },
      //弹框确定
      handleClose(done) {
        this.dialogVisible=false
      },
      //搜索粉丝
      getSearchFans(){
        if(this.fans_name){
          this.getFansList()
        }else {
          this.$message('请输入粉丝名称')
        }
      },
      //获取粉丝列表
      getFansList:function(){

        /*  pages2:{
            count:0,
              nowPages:1,//当前页数
              limit:10
          },*/
        let param={
          search:this.fans_name,
          uid:this.tableData[0].id,
          page:this.pages2.nowPages,
          limit:this.pages2.limit
        }
        apiDistribution.getDistributionFansList(param).then(res => {
          if(res.cscode == "0"){
            this.pages2.count=res.count
            this.tableDatas=res.data.info

          }
          this.$message(res.data.msg)
        })
      },
      //弹框分页
      handleSizeChange2(limit){
        console.log(limit)
        this.pages2.limit = limit
        this.pages2.nowPages=1
        this.handleCurrentChange2(1)
      },
      handleCurrentChange2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },
      nextPages2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },
      prevPages2(index){
        this.pages2.nowPages = index
        this.getFansList()
      },

    },
    filters:{
      //性别处理
      sex:function(value){
        if(value==1){
          return '男'
        }else if(value==2){
          return '女'
        }else {
          return '保密'
        }
      }
    },
  }
</script>

<style scoped>
  @import url("../../assets/css/UserInfo.css");
  .el-breadcrumb{font-size: 14px}
 .UserInfo .cell strong{color: #13ce66}
</style>
