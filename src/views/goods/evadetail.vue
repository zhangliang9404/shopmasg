<template>
  <div class="goofoutb_backgroud">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/evaluatelist' }">商品评价管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品评价详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="button_top">
      <el-button type="primary" icon="el-icon-close" style="margin-left: 70%;" @click="$router.back(-1)">删除</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="shua">刷新</el-button>
    </div>
    <div class="content">
      <div class="con_left">
        <div class="con_left_block">
         <img :src="own.header"/>
          <p>{{own.header_name==null||own.header_name==undefined||own.header_name==''?'暂无昵称':own.header_name}}</p>
          <ul>
            <li><span class="list_name">商品：</span><span class="list_content" style="color: #1abc9c;">{{own.goods_name}}</span></li>
            <li><span class="list_name">购买：</span><span class="list_content">{{own.go_nums}}</span></li>
            <li><span class="list_name">评价：</span><span class="list_content">
                      <el-rate
                        v-model="starnums"
                        disabled
                        text-color="#ff9900"
                      >
                      </el-rate>

            </span></li>
            <li><span class="list_name">日期：</span><span class="list_content">{{own.eva_date}}</span></li>
            <li><span class="list_name">ip地址：</span><span class="list_content">{{own.ip}}</span></li>
          </ul>

        </div>
      </div>
      <div class="con_right">
        <p class="shoucang">商品收藏数：<span style="margin-left: 10px">{{allnum}}</span></p>
        <div class="text_right">
          <div class="content_text">
            <p style="min-height: 30px">{{own.text}}</p>
            <ul v-if="imgurl">
              <li v-for="(item,index) in imgurl" :key="index"> <img :src="item"/></li>
            </ul>
          </div>
          <div class="huifu">
            <p>回复评价</p>
            <el-form :model="ruleForm2" status-icon  ref="ruleForm2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input  v-model="ruleForm2.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="回复内容" prop="txt">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 8, maxRows: 10}"

                  placeholder="请输入内容"

                  v-model="ruleForm2.textarea">
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm">回复</el-button>
                <span style="margin-left: 10px">注意：管理员回复内容会在前台显示</span>
              </el-form-item>
            </el-form>
          </div>
          <div class="hui_list">
            <p>全部评论：<span style="margin-left: 10px">{{allnums}}</span></p>

            <ul v-if="all_list">
              <li v-for="(item,index) in all_list" :key="index">
                <div class="hui_left"><img :src="item.headimgurl"/></div>
                <div class="hui_right">
                  <p style="margin-bottom: 30px">{{item.reply_admin}}</p>
                  <p>回复<span style="margin-right: 20px">{{item.nickname}}:</span>{{item.reply_body}}</p>
                  <p class="trtr">{{chuan(item.reply_time)}}<span v-if="item.reply_status==2" @click="yincang(item)">隐藏</span><span v-if="item.reply_status==1" @click="yincang(item)">显示</span><span @click="del(item)">删除</span></p>
                </div>

              </li>
            </ul>
          </div>
          <el-pagination style="float: right"
                         @size-change="handleSizeChange"
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
  let apiEvaluate=new evaluate()
    export default {
        name: "evadetail",
      data(){
          return{
            allnum:0,//收藏次数
            allnums:0,//评论个数
            starnums:0,//星星数量
            own:{//个人评价参数
              header:'',
              header_name:'',
              goods_name:'',
              go_nums:'',
              eva_date:'',
              ip:'',
              text:''
            },
            imgurl:[],
            all_list:[],
            ruleForm2:{
              username:'',
              txt:'',
              textarea:''
            },
            // rules2:{
            //   txt: [
            //     { required: true, message: '请输入内容', trigger: 'blur' },
            //   ],
            // },
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
         this.getlist()
      },
      methods:{
        shua(){
          location.reload()
        },
        //初始化
        getlist(){
          var _this=this
          let param={
            ass_id:_this.$route.query.ass_id,
            goods_id:_this.$route.query.goods_id,
            page:1,
            limit: _this.limit
          }
          console.log(param)
          _this.ruleForm2.username=sessionStorage.getItem("token2")
          apiEvaluate.evalu_detail(param).then(res => {
            if(res.cscode==0){
              console.log(res)
              var str=res.data.res.name;
              _this.own.header=res.data.res.headimgurl;
              _this.own.header_name=res.data.res.nickname;
              _this.own. goods_name=str;
              _this.starnums=res.data.res.star_nums
              _this.own. go_nums=res.data.res.goods_sku+'';
              _this.own. eva_date=_this.chuan(res.data.res.create_time);
              _this.own. ip=res.data.res.ip;
              _this.own.text=res.data.res.assess;
              var str1=res.data.res.assess_img;
              var arrimg=[]
              if(str1!=null){
                arrimg=str1.split(",")
              }
              _this.imgurl= arrimg;
              console.log(_this.imgurl)
              _this.all_list=res.data.data

              _this.allnum=res.data.res.goods_num;
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
          apiEvaluate.evalu_detail(param).then(res => {
            console.log(res)
            _this.all_list=res.data.data
            _this.allnum=res.data.res.goods_num;
            _this.allnums=res.data.count
            _this.pages.count=res.data.count
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
        //回复
        submitForm() {
          var _this=this
     if(_this.ruleForm2.textarea== ""){
     _this.$message({
         showClose: true,
         message: '请输入回复内容',
         type: 'warning'
       });
     }else {
       let param={
         ass_id:_this.$route.query.ass_id,
         reply_body:_this.ruleForm2.textarea,
         reply_admin:sessionStorage.getItem("token2")

       }
       console.log(param)
       apiEvaluate.evalu_apply(param).then(res => {
         if(res.cscode==0){
           _this.$message(res.data.msg)
           _this.ruleForm2.textarea=''
           _this.getlist()
         }else{
           _this.$message(res.data.msg)
         }

       })

     }

        },
        //隐藏
        yincang(item){
          var _this=this
        console.log(item)
          let param={
            ass_id:item.id,

          }
          apiEvaluate. yi_apply(param).then(res => {
            console.log(res)
            if(res.cscode==0){
              _this.$message({
                showClose: true,
                message: '状态更改成功',
                type: 'success'
              });
              var param={
                page:_this.page,
                limit:_this.limit,
                ass_id:_this.$route.query.ass_id,
                goods_id:_this.$route.query.goods_id

              }
              _this.getapply(param)
            }
          })

        },
        //删除
        del(item){
          var _this=this
          console.log(item)
          let param={
            ass_id:item.id
          }
          apiEvaluate. del_apply(param).then(res => {
            console.log(res)
            if(res.cscode==0){
              _this.$message(res.data.msg);
            location.reload()
            }else {
              _this.$message(res.data.msg);
            }
          })
        },
        //分页
        handleSizeChange(val) {
          var _this=this
          var param={
            page:1,
            limit:val,
            ass_id:_this.$route.query.ass_id,
            goods_id:_this.$route.query.goods_id,

          }
         _this.getapply(param)

        },
        handleCurrentChange(val) {
          var _this=this
          var param={
            page:val,
            limit:_this.limit,
            ass_id:_this.$route.query.ass_id,
            goods_id:_this.$route.query.goods_id,
          }
          _this.getapply(param)
        },
  //分页事件
  //下一页
  nextPages(index){
    var _this=this;
    var param={
      page:index,
      limit:_this.limit
    }
   // _this.getEvaluateList(param);
  },
  //上一页
  prevPages(index){
    var _this=this;
    var param={
      page:index,
      limit:_this.limit
    }
   // _this.getEvaluateList(param);
  },
      }

    }
</script>

<style scoped>
  @import url("../../assets/css/evadetail.css");
  .trtr span{
    margin-left: 20px;
    color: rgb(19, 206, 102)!important;
  }


</style>
