<template>
    <div class="feedback">
      <!--导航-->
      <div class="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
          <el-breadcrumb-item>建议反馈</el-breadcrumb-item>
          <el-breadcrumb-item>问题详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="feeed_con">
        <p style="margin-top: 0">建议反馈信息内容</p>
        <p>用户名称：{{chatContents.nickname}}</p>
        <p>提交时间：2019年10月12号 22：22：34</p>
        <p>意见建议: <span style="padding-left: 12px;">{{chatContents.problem}}</span></p>
        <!--<p style="margin-top: 30px">我的回复：你好，您反馈的问题，已经处理</p>-->
      </div>
      <!--<div class="feed_text">-->
        <!--<div class="top">回复：</div>-->
        <!--<el-input type="textarea" :rows="3" placeholder="在此输入回复的内容，点击回复或enter发送消息" v-model="textarea"-->
                  <!--@keyup.enter.native="sendMessage(chatContents.id)" class="textarea"></el-input>-->
        <!--<el-button type="info" plain class="chat-btn" @click="sendMessage">回复</el-button>-->
      <!--</div>-->
    </div>
</template>

<script>
  import * as config from '../../../common/config.js'
  import * as http from '../../../common/http.js'
  import * as utils from "@/common/utils.js"
  import {api_Chat} from "@/api/api.js"//export class api_user{}中的总名称
  let apiChat = new api_Chat();//给api_user另命名
  let rootUrl = config.default.apiUrl+"/uploadfile/uploadfile/shop";//路径地址
    export default {
        name: "feedback",
        data(){
            return{
              textarea:'',
              chatContents:{},//问题内容
            }
        },
        mounted(){
          this.getchatinfodetails()
        },
        methods:{
          // 获取详情
          getchatinfodetails(){
            let _this = this
            let param = {
              id : _this.$route.query.id,//获取url的id
            }
            apiChat.open_problem(param).then(res=>{
              console.log(res);
              if(res.cscode==0){
                _this.chatContents = res.data.data
              }
            })
          },
          // // 点击发送按钮
          // sendMessage:function(id){
          //
          //   if (this.textarea == "\n" || this.textarea == "" ) {
          //     this.$alert('发送内容不能为空，请重新输入！', '提示', {
          //       confirmButtonText: '确定',
          //     });
          //   }else{
          //    let param = {
          //       id: this.chatContents.id,//发送的用户id
          //      reply: this.textarea,//发送的文字
          //     };
          //     apiChat.reply(param).then(res=>{
          //       console.log(res);
          //     })
          //     this.textarea = '';//发送之后输入框为空
          //   }
          // },
        }

    }
</script>

<style scoped>
  .feedback .header{
    height: 30px;
    border-bottom: 1px solid #eee;

  }
  .feedback .feeed_con{min-height: 500px;}
  .feedback .feed_text .top{width: 5%}
  .feedback .feed_text .el-textarea{margin-top: -20px;margin-left:5%;width: 80%}
  .feedback .feed_text .el-button--info.is-plain{display: block;margin-left: 80.5%;margin-top: 20px}
</style>
