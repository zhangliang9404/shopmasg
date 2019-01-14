<template>
  <div class="AnswerDetail">
    <!--导航-->
    <div class="header">
      <div class="title">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="top">
          <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/answerlist' }">商品问答管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品问答详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <!--按钮-->
    <div class="DetailTitle">
      <span class="border"><span class="borderTitle">问答详情</span></span>
      <el-button icon="el-icon-close" class="borderBtn" @click="$router.back(-1)">关闭</el-button>
      <el-button icon="el-icon-refresh" @click="refresh()">刷新</el-button>
    </div>
    <!--内容-->
    <div class="content">
      <div class="con_left" style="width: 25%;">
        <div class="con_left_block">
         <img :src="own.header"/>
          <p>{{own.header_name==null||own.header_name==undefined||own.header_name==''?'暂无昵称':own.header_name}}</p>
          <ul>
            <li><span class="list_name">商品：</span><span class="list_content" style="color: #1abc9c;">{{own.goods_name}}</span></li>
            <li><span class="list_name">规格：</span><span class="list_content">{{own.specification}}</span></li>
            <li><span class="list_name">提问日期：</span><span class="list_content">{{own.add_time}}</span></li>
            <li><span class="list_name">更新日期：</span><span class="list_content">{{own.up_time}}</span></li>
          </ul>
        </div>
      </div>
      <div class="con_right" style="width: 64.8%">
        <span class="con_right_top">商品销量：<span class="num">{{salenum}}</span></span>
        <span class="con_right_top">问答数：<span class="num">{{ansernum}}</span></span>
        <div class="text_right">
          <p class="ask">提问的问题：{{own.text}}</p>
          <div class="answer">
            <p class="title">全部回复 :{{ansernum}}</p>
            <ul v-if="all_list.length>0">
              <li v-for="(item,index) in all_list" :key="index">
                <div>
                  <img :src="item.headimgurl" alt="">
                </div>
                <div>
                  <p>{{item.nickname}}<span class="status">已买</span></p>
                  <p>回复{{own.header_name==null||own.header_name==undefined||own.header_name==''?'暂无昵称':own.header_name}}：{{item.content}}</p>
                  <p>
                    <span>{{item.add_time}}</span>
                    <span class="answerBtn1" v-if="item.is_show==0" @click="yincang(item.id,1)">显示</span>
                    <span class="answerBtn1"  v-if="item.is_show==1" @click="yincang(item.id,0)">隐藏</span>
                    <span class="answerBtn1" @click="del(item.id)">删除</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <el-pagination class="page" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="pages.nowPages"
                         :page-sizes="[10,20,30]"
                         :page-size="limit"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="pages.count"
                         @next-click="nextPages"
                         @prev-click="prevPages">
          </el-pagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {api_active,evaluate} from "@/api/api.js"
  let apiEvaluate=new evaluate();
    export default {
        name: "AnswerDetail",
      data(){
          return{
            salenum:0,//商品销量
            ansernum:'',//问答数
            allnums:0,//评论个数
            starnums:0,//星星数量
            own:{//个人评价参数
              header:'',
              header_name:'',
              goods_name:'',
              specification:'',
              add_time:'',
              up_time:'',
              text:''
            },

            all_list:[],

            page:1,
            limit:10,
            //分页数据
            pages:{
              count:0,
              nowPages:0//当前页数
            },
          }
      },
      mounted(){
         this.getlist(); // 获取列表信息
      },
      methods:{
          // 刷新
        refresh(){
          location.reload();
        },
        // 获取列表信息
        getlist(){
          var _this=this;
          let param={
            id:_this.$route.query.ass_id,
            page:_this.page,
            limit:_this.limit
          };
          apiEvaluate.answerDetail(param).then(res => {
            if(res.cscode==0){
              console.log(res)
              var str=res.data.goods.name;
              _this.own.header=res.data.user_msg.headimgurl;
              _this.own.header_name=res.data.user_msg.nickname;
              _this.own. goods_name=str;
              _this.salenum=res.data.sale_num;
              _this.ansernum=res.data.count
              _this.own.specification=res.data.answers.specification
              _this.own.add_time=res.data.answers.add_time
              _this.own.up_time=res.data.answers.up_time
              _this.own.text=res.data.answers.title
             //回复列表


              _this.all_list=res.data.data

              _this.allnums=res.data.count
              _this.pages.count=res.data.count
            }else {
              _this.$message.error(res.data.msg);
             // _this.$router.replace("/evaluatelist")
            }
          })
        },
        //分页内容
        getapply(param){
          var _this=this
          console.log(param)
          apiEvaluate.answerDetail(param).then(res => {
            _this.all_list=res.data.data
          })
        },

        //隐藏
        yincang(id,type){
          var _this=this
          console.log(id)
          let param={
            id:id,
            type:type
          }
          apiEvaluate.cal_answer(param).then(res => {
            console.log(res)
            if(res.cscode==0){
              _this.$message({
                showClose: true,
                message: '状态更改成功',
                type: 'success'
              });
             var param1={
                page:_this.page,
                limit:_this.limit,
                id:_this.$route.query.ass_id,
              }
              _this.getapply(param1)
            }
          })

        },
        //删除
        del(id){
          var _this=this
          let param={
            id:id
          }
          apiEvaluate.del_answer(param).then(res => {
            console.log(res)
            if(res.cscode==0){
              _this.$message(res.data.msg);
              var param1={
                page:_this.page,
                limit:_this.limit,
                id:_this.$route.query.ass_id,
              }
              _this.getapply(param1)
            }else {
              _this.$message(res.data.msg);
            }
          })
        },
        //分页
        handleSizeChange(val) {
          console.log(val)
          var _this=this
          _this.limit=val
          var param={
            page:_this.page,
            limit:_this.limit,
            id:_this.$route.query.ass_id
          }
          _this.getapply(param)

        },
        handleCurrentChange(val) {
          var _this=this
          _this.page=val
          var param={
            page:_this.page,
            limit:_this.limit,
            id:_this.$route.query.ass_id
          }
          _this.getapply(param)
        },
      //分页事件
      //下一页
      nextPages(index){
        var _this=this;
        _this.page=index
        var param={
          page:_this.page,
          limit:_this.limit,
          id:_this.$route.query.ass_id
        }
        _this.getapply(param)
      },
      //上一页
      prevPages(index){
        var _this=this;
        _this.page=index
        var param={
          page:_this.page,
          limit:_this.limit,
          id:_this.$route.query.ass_id
        }
        _this.getapply(param)
      },
      }

    }
</script>

<style scoped>
  @import url("../../assets/css/Goods.css");
  .trtr span{
    margin-left: 20px;
    color: rgb(19, 206, 102)!important;
  }

.AnswerDetail .list_content{width: 200px!important;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;}
</style>
