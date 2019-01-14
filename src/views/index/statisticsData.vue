<template>
    <div class="statisticsData">
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 10px">
          <el-breadcrumb-item>首页：</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">控制面板</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/accountList' }">数据统计</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="condition">
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          @change="change_timer">
          </el-date-picker>
       <!-- <el-button style="float: right">app</el-button>
        <el-button style="float: right">web</el-button>-->
      </div>
      <div class="content">
        <div class="top_one">
          <div class="item">
            <p>普通用户</p>
            <p class="it">新增用户:<span>{{user_res.newuser}}</span></p>
            <p class="it">访问用户:<span>{{user_res.visit}}</span></p>
            <p class="it">用户总数:<span>{{user_res.sumuer}}</span></p>

          </div>
          <div class="item">
            <p>总支付</p>
            <p class="it">支付卖家数:<span>{{document.buy_num}}</span></p>
            <p class="it">支付订单:<span>{{document.order_num}}</span></p>
            <p class="it">支付金额:<span>{{document.payment ? document.payment :'暂无'}}</span></p>

          </div>
          <div class="item">
            <p>总商品</p>
            <p class="it">上架商品总数:<span>{{commdity.up_num}}</span></p>
            <p class="it">下架商品总数:<span>{{commdity.below_num}}</span></p>
            <p class="it">总商品数:<span>{{commdity.count_sum}}</span></p>

          </div>
          <div class="item">
            <p>总售后</p>
            <p class="it">退款笔数:<span>{{after.refund_num}}</span></p>
            <p class="it">退款金额:<span>{{after.refund_money ? after.refund_money :'暂无'}}</span></p>
            <p class="it">总退款数:<span>{{after.sum_money}}</span></p>

          </div>
          <div class="item">
            <p>总订单</p>
            <p class="it">有效笔数:<span>{{order_res.valid_num}}</span></p>
            <p class="it">无效笔数:<span>{{order_res.vain}}</span></p>
            <p class="it">总成交数:<span>{{order_res.sum_make}}</span></p>
          </div>

        </div>
        <div class="top_one">
          <div class="item">
            <p>商户</p>
            <p class="it">新增商户:<span>{{form.new_shop}}</span></p>
            <p class="it">封禁商户:<span>{{form.closure_shop}}</span></p>
            <p class="it">商户总数:<span>{{form.all_shop}}</span></p>

          </div>
          <div class="item">
            <p>一级代理</p>
            <p class="it">新增一级代理:<span>{{form.new_shop_one}}</span></p>
            <p class="it">封禁一级代理:<span>{{form.closure_shop_one}}</span></p>
            <p class="it">一级代理总数:<span>{{form.all_shop_one}}</span></p>

          </div>
          <div class="item">
            <p>二级代理</p>
            <p class="it">新增二级代理:<span>{{form.new_shop_two}}</span></p>
            <p class="it">封禁二级代理:<span>{{form.closure_shop_two}}</span></p>
            <p class="it">二级代理总数:<span>{{form.all_shop_two}}</span></p>

          </div>
          <div class="item">
            <p>普通代理</p>
            <p class="it">新增普通代理:<span>{{form.new_shop_ordinary}}</span></p>
            <p class="it">封禁普通代理:<span>{{form.closure_shop_ordinary}}</span></p>
            <p class="it">普通代理总数:<span>{{form.all_shop_ordinary}}</span></p>

          </div>
          <div class="item">
            <p>自营商品</p>
            <p class="it">上架商品数:<span>{{form.upper_goods}}</span></p>
            <p class="it">下架商品数:<span>{{form.lower_goods}}</span></p>
            <p class="it">总商品数:<span>{{form.all_goods}}</span></p>
          </div>
        </div>
        <div class="statistics">
          <div class="left">
            <ul>
              <li>
                <el-button @click="changdata(1)">12月</el-button>
              </li>
              <li>
                <el-button @click="changdata(2)">30天</el-button>
              </li>
              <li>
                <el-button @click="changdata(3)">7天</el-button>
              </li>
              <li>
                <el-button @click="changdata(4)">今日</el-button>
              </li>
            </ul>
            <div id="myChart" :style="{width: '100%', height: '300px'}" style="overflow: hidden"></div>
          </div>
          <div class="right">
            <p class="dai">待办事宜</p>
            <div>
              <el-badge :value="bage_count"  class="item">
                <el-button size="small">当前</el-button>
              </el-badge>
              <div class="lists">
               <ul v-if="onecheck" v-for="">
                 <li v-for="(item,index) in deal_list" :key="index">
                   <p>
                    <em>.</em> {{item.item}}<span>:</span>{{item.items}}
                   </p>

                 </li>

                 </ul>
               <ul v-if="twocheck" class="scro">
                 <li v-for="(item,index) in deal_all_list" :key="index">
                   <p> <em style="margin-right: 5px">.</em>{{item.item}}<span>:</span>{{item.items}}</p>

                 </li>
                </ul>

                <p style="margin: 0;padding-left: 50px" @click="morelist" v-if="onecheck">更多>></p>
                <p style="margin: 0;padding-left: 60px" @click="backlist" v-if="twocheck">返回</p>
              </div>
              <div style="clear: both"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="diff">
            <p class="bottom_title">商品热销排行榜</p>
            <ul>

              <li>
                <el-button @click="changeSort(1,0)">今日排行</el-button>
              </li>
              <li>
                <el-button @click="changeSort(1,7)">七日排行</el-button>
              </li>
              <li>
                <el-button @click="changeSort(1,30)">月排行</el-button>
              </li>
            </ul>
            <div style="margin-top: 20px">
              <template>
                <el-table
                  :data="tableData1"
                  style="width: 100%;">
                  <el-table-column
                    label="排名"
                    type="index"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="商品"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="collect"
                    label="收藏"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="deal_num"
                    label="成交数"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="deal_price"
                    label="成交金额">
                    <template slot-scope="scope">
                      {{scope.row.deal_price!=0 ? '￥'+ scope.row.deal_price : scope.row.deal_price}}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
          <div class="diff" style="margin-left: 30px">
            <p class="bottom_title">付款转化率排行榜</p>
            <ul>
              <li>
                <el-button @click="changeSort(2,0)">今日排行</el-button>
              </li>
              <li>
                <el-button @click="changeSort(2,7)">七日排行</el-button>
              </li>
              <li>
                <el-button @click="changeSort(2,30)">月排行</el-button>
              </li>
            </ul>
            <div style="margin-top: 20px">
              <template>
                <el-table
                  :data="tableData2"
                  style="width: 100%;">
                  <el-table-column
                    prop="date"
                    label="排名"
                    type="index"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="商品"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="pay_rate"
                    label="付款率"
                  >
                    <template slot-scope="scope">
                      {{scope.row.pay_rate!=0 ? toPercent(scope.row.pay_rate) : scope.row.pay_rate}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="deal_num"
                    label="成交数"
                  >
                  </el-table-column>
                  <el-table-column

                    label="成交金额">
                    <template slot-scope="scope">
                      {{scope.row.deal_price!=0 ? '￥'+ scope.row.deal_price : scope.row.deal_price}}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>


        </div>

      </div>
    </div>
</template>

<script>
  import { api_user } from "@/api/api.js"
  let apiuser = new api_user();
    export default {
        name: "statisticsData",
        data(){
          return{
            value6: '',
            startTime:'',
            endTime:'',
            onecheck:true,
            twocheck:false,
            user_res:{},//普通用户
            after:{},//售后
            order_res:{},//总订单
            document:{},//总支付
            commdity:{},//总商品
            form:{},
            tableData1:[], //商品热销排行榜
            tableData2:[],  //付款转化率排行榜
            tableData: [{
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }],
            //商品热销排行榜
            goods:{
              startTime:'',
              endTime:''
            },
            //付款转化率排行榜
            goodsRate:{
              startTime:'',
              endTime:''
            },
            currentPage4:1,
            data_title:['今天统计','昨天统计'],
            x_data:["0点","1点","2点","3点","4点","5点","6点","7点","8点","9点","10点","11点","12点","13点","14点","15点","16点","17点","18点","19点","20点","21点","22点","23点"],
            y_data:[],
            y1_data:[],
            /*年*/
            data_title1:['今年','去年'],
            x_data1:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            /*月*/
            data_title2:['最近一个月','上个月'],
            x_data2:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15",
             "16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32"],
            /*星期*/
            data_title3:['最近一个星期','上个星期'],
            x_data3:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],

            /*日*/
            data_title4:['今天统计','昨天统计'],
            x_data4:["0点","1点","2点","3点","4点","5点","6点","7点","8点","9点","10点","11点","12点","13点","14点","15点","16点","17点","18点","19点","20点","21点","22点","23点"],
            deal_list:[],//
            deal_all_list:[],
            bage_count:''
          }


        },
        mounted(){
          this.lineHour();//获取数据

          this.getMoreData();
          this.get_tableData();
          this.get_tablealRate();
          this.getDealList()
        },
        methods: {
          getMoreData(){
            let param={
              start_time:this.startTime,
              end_time:this.endTime
            }
            apiuser.statisticUser(param).then(res => {
              if(res.cscode==0){
                this.$message({type: 'success',message:'获取成功', showClose: true,})
                this.user_res=res.data.data.user_res
                this.after=res.data.data.after
                this.order_res=res.data.data.order_res
                this.document=res.data.data.document
                this.commdity=res.data.data.commdity
              }else {
                this.$message.error('暂无数据')
              }
            })
            apiuser.statisticShop(param).then(res => {
              if(res.cscode==0){
                this.$message({type: 'success',message:'获取成功', showClose: true,})
               this.form=res.data.data
              }else{
                this.$message.error('暂无数据')
              }
            })

          },
          //改变时间
          change_timer(){
            if(this.value6){
              this.startTime= Number(String(this.value6[0].getTime()).slice(0,10))
              this.endTime=Number(String(this.value6[1].getTime()).slice(0,10))
              this.getMoreData()
            }
          },
          //商品热销排行榜
          get_tableData(){
            let param={
              start_time:this.goods.startTime,
              end_time:this.goods.endTime,

            }
            apiuser.getsShopGoods(param).then(res => {
              if(res.cscode==0){
                this.tableData1=res.data.data.slice(0,5)
              }

            })
          },
          //改变商品热销排行榜
          changeSort(type,num){
           /* //商品热销排行榜
            goods:{
              startTime:'',
                endTime:''
            },
            //付款转化率排行榜
            goodsRate:{
              startTime:'',
                endTime:''
            },*/
            if(type==1){
              if(num==0){
                this.goods.startTime=''
                this.goods.endTime=''
              }else if(num==7){
                var myDate = new Date();
                this.goods.endTime= Number(String(new Date().getTime()).slice(0,10))
                this.goods.startTime=Number(String(new Date().getTime()- 3600 * 1000 * 24 * 7).slice(0,10))
              }else if(num==30){
                var myDate = new Date();
                this.goods.endTime= Number(String(new Date().getTime()).slice(0,10))
                this.goods.startTime=Number(String(new Date().getTime()- 3600 * 1000 * 24 * 30).slice(0,10))
              }
              this.get_tableData()
            }else {
              if(num==0){
                this.goodsRate.startTime=''
                this.goodsRate.endTime=''
              }else if(num==7){
                var myDate = new Date();
                this.goodsRate.endTime= Number(String(new Date().getTime()).slice(0,10))
                this.goodsRate.startTime=Number(String(new Date().getTime()- 3600 * 1000 * 24 * 7).slice(0,10))
              }else if(num==30){
                var myDate = new Date();
                this.goodsRate.endTime= Number(String(new Date().getTime()).slice(0,10))
                this.goodsRate.startTime=Number(String(new Date().getTime()- 3600 * 1000 * 24 * 30).slice(0,10))
              }
              this.get_tablealRate()
            }
          },
          //付款转化率排行榜
          get_tablealRate(){
            let param={
              start_time:this.goodsRate.startTime,
              end_time:this.goodsRate.endTime,

            }
            apiuser.getsShopRate(param).then(res => {
              if(res.cscode==0){
                this.tableData2=res.data.data.slice(0,5)
              }

            })
          },
          // 转换百分数保留两位小数
           toPercent(point){
              var str=Number(point*100).toFixed(2);
              str+="%";
              return str;
            },
          //更多信息
          morelist(){
            this.onecheck=false
            this.twocheck=true;

          },
          backlist(){
            this.onecheck=true
            this.twocheck=false;
          },
          drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
              title: { text: '订单量统计' },
              tooltip: {  trigger: 'axis'},
              legend: {
                data:this.data_title
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                data: this.x_data
              },
              yAxis: { type: 'value'},
              series: [
                {  name: this.data_title[0],
                  type: 'line',
                  itemStyle: {
                    // 点的颜色。
                    color: '#f6b83f'
                  },
                  lineStyle:{
                    color:'#f6b83f'
                  },
                  data: this.y_data,
                  markPoint: {
                    data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                    ]
                  },
                  markLine: {
                    data: [
                      {type: 'average', name: '平均值'}
                    ]
                  }
                },
                {  name: this.data_title[1],
                  type: 'line',
                  itemStyle: {
                    // 点的颜色。
                    color: '#669cde'
                  },
                  lineStyle:{
                    color:'#669cde'
                  },
                  data: this.y1_data,
                  markPoint: {
                    data: [
                      {type: 'max', name: '最大值'},
                      {type: 'min', name: '最小值'}
                    ]
                  },
                  markLine: {
                    data: [
                      {type: 'average', name: '平均值'}
                    ]
                  }
                },
              ]
            });
          },
          lineHour(num){
            let param={}
            apiuser.lineHour(param).then(res => {
              if(res.cscode==0){
                this.y_data=res.data.data
                this.y1_data=res.data.res
                this.drawLine();
              }
            })
          },
          changdata(num){
            let param={}
            if(num==1){
              this.x_data=this.x_data1
              this.data_title= this.data_title1
              apiuser.lineYear(param).then(res => {
                if(res.cscode==0){

                  this.y_data=res.data.data
                  this.y1_data=res.data.res
                  this.drawLine()
                }
              })
            }else if(num==2){
              this.x_data=this.x_data2
              this.data_title= this.data_title2
              apiuser.lineMonth(param).then(res => {
                if(res.cscode==0){
                  this.y_data=res.data.data
                  this.y1_data=res.data.res
                  this.drawLine()
                }
              })
            }else if(num==3){
              this.x_data=this.x_data3
              this.data_title= this.data_title3
              apiuser.lineweek(param).then(res => {
                if(res.cscode==0){
                  this.y_data=res.data.data
                  this.y1_data=res.data.res
                  this.drawLine()
                }
              })

            }else if(num==4){
              this.x_data=this.x_data4
              this.data_title= this.data_title4
              apiuser.lineHour(param).then(res => {
                if(res.cscode==0){
                  this.y_data=res.data.data
                  this.y1_data=res.data.res
                  this.drawLine()
                }
              })

            }

          },
          //待办事项
          getDealList(){
            let param={}
            var arr=[]
            apiuser.getDealList(param).then(res => {
              if(res.cscode==0){
                if(res.data.info.fahuo!=0){
                  this.bage_count=res.data.count
                  var obj={
                    item:'待发货订单',
                    items:'您还有'+res.data.info.fahuo+'笔订单未发货'
                  }
                  arr.push(obj)
                }
                if(res.data.info.shouli!=0){
                  var obj={
                    item:'售后待处理',
                    items:'您还有'+res.data.info.shouli+'笔售后未处理'
                  }
                  arr.push(obj)
                }
                if(res.data.info.tixian!=0){
                  var obj={
                    item:'代理店铺',
                    items:'您有'+res.data.info.tixian+'家代理店铺提现申请待处理'
                  }
                  arr.push(obj)
                }
                if(res.data.info.shenhe!=0){
                  var obj={
                    item:'商品待审核',
                    items:'您有'+res.data.info.shenhe+'件商品待审核'
                  }
                  arr.push(obj)
                }
                if(res.data.info.shenqing!=0){
                  var obj={
                    item:'商户入驻待审核',
                    items:'您有'+res.data.info.shenqing+'家商户入驻待审核（保证金）'
                  }
                  arr.push(obj)
                }
                if(res.data.info.buzu.length>0){
                  var arr1=res.data.info.buzu
                  for(var j=0;j<arr1.length;j++){
                    var obj={
                      item:'商品库存报警',
                      items:arr1[j].names+'库存已低于10件'
                    }
                    arr.push(obj)
                  }
                }
                console.log(arr)
                this.deal_all_list=arr
                this.deal_list=arr.slice(0,3);

              }
            })

          }
        },
    }
</script>

<style scoped>
  @import url("../../assets/css/statisticsData.css");
</style>
<style>
  .statisticsData .content .statistics .right>div .el-badge__content.is-fixed{top: 18px;right: 40px}
  .statisticsData .content .statistics .right>div .el-button--small, .el-button--small.is-round{width: 140px;
    padding: 10px;font-size: 16px}
  .statisticsData .content .statistics .right>div .el-badge{left: 40%;width: 140px;background: deeppink}
  .statisticsData .content .statistics .right>div .el-button{border-radius: 0}
  .statisticsData .content .bottom ul li .el-button{border-radius: 0}
  .statisticsData .content .bottom .el-pagination{margin-top: 10px}
  .statisticsData .content .statistics .left .el-button{border-radius: 0}
</style>
