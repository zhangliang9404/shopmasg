<template>
  <div class="merchantDetails" >
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'merchantDetails' }">商户客服</el-breadcrumb-item>
      <el-breadcrumb-item>商户客服</el-breadcrumb-item>
    </el-breadcrumb>
    <!--商品信息及用户名称-->
    <hr/>
    <div class="main">
      <div class="m-message">
        <div style="overflow:hidden;margin-bottom: 10px; border-bottom: 1px solid #99a9bf; ">
          <p class="content">张三（合作商家）/王五（一级代理/二级代理）</p>
        </div>
        <p class="title">商家回复：</p><span class="name">{{goodsInfo.nickname}}</span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="limit"
                       small style="float: right"
                       background layout="total, prev, pager, next, jumper" :total="count" class="card-btn card-pad" >
        </el-pagination>
        <!--聊天内容-->
        <ul class="chatList" v-for="(site,index) in chatContent" :key="index">
          <!--用户的消息-->
          <li v-if="site.user_id == goodsInfo.user_id" class="chatTitle-user">
            <span class="chatTitle">{{goodsInfo.nickname}}</span>
            <span class="sign">：</span>
            <!--1为文字，2为图片，3为录音-->
            <span v-if="site.type == '1'" class="chatContent">{{site.message}}</span>
            <span v-else-if="site.type == '2'">
               <img class="content-img" @click="bigImage(site.message)" :src="site.message"/>
            </span>
            <span class="chat-time">{{site.create_time}}</span>
          </li>
          <!--客服的消息-->
          <li v-else-if="site.user_id == '1'" class="chatTitle-my">
            <span class="chatTitle">智搜农牧</span>
            <span class="sign">：</span>
            <!--1为文字，2为图片，3为录音-->
            <span v-if="site.type == '1'" class="chatContent">{{site.message}}</span>
            <span v-else>
               <img class="content-img" @click="bigImage(site.message)" :src="site.message"/>
            </span>
            <span class="chat-time">{{site.create_time}}</span>
          </li>
        </ul>
      </div>
      <!--实时发送-->
      <div class="m-text">
        <span class="title">回复：</span>
        <el-radio v-model="radio" label="1">文字</el-radio>
        <el-radio v-model="radio" label="2">图片</el-radio>
        <div class="m-text-content" v-if="radio === '1'" >
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-input type="textarea" :rows="3" placeholder="在此输入回复的内容，点击回复或enter发送消息" v-model="textarea"
                    @keyup.enter.native="sendMessage()" class="textarea"></el-input>
          <el-button type="info" plain class="chat-btn" @click="sendMessage">回复</el-button>
        </div>
        <div class="m-text-content" v-else>
          <el-upload
            class="upload-demo"
            :class="{disabled:uploadDisabled}"
            name="file_name"
            :limit="1"
            :action="uplodeimg"
            list-type="picture-card"
            :before-upload="beforeUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            ref="upload"
            :file-list="fileList"
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <div slot="tip" class="el-upload__tip" style="float: left">只能发送一张jpg/png的文件，且不超过500kb</div>
          <el-button type="info" plain class="chat-btn" @click="submitUpload">回复</el-button>
        </div>
      </div>
    </div>
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
    name: "merchantDetails",
    data () {
      return {
        goodsInfo: [],//商品信息,
        chatContent: [],//聊天内容
        radio: '1',//单选
        textarea: '',//文字
        websock: '', // websocket会话
        currentPage:1,//当前页码
        limit:10,//每页条数
        count: 0,//总条数
        fileList: [],//图片列表
        uplodeimg:rootUrl,//上传图片的路径
        contentImg:'',//上传之后的图片路径
        dialogImageUrl: '',
        dialogVisible: false,
        getInfo: '',//获得信息存在数组中
      };
    },
    //页面预加载执行
    mounted: function(){
      this.getCount();//获取聊天条数以及页码
      this.inits();//循环刷新
    },
    beforeDestroy: function () {
      // 页面离开时断开连接,清除定时器
      // this.disconnect();
      clearInterval(this.timer);
    },

    methods: {
      //获取聊天条数以及页码
      getCount() {
        let _this = this;
        let param = {
          id: _this.$route.query.id,//url的id
          type: 2,
        };
        param = utils.filterJson(param);
        apiChat.getshopcontent(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            res.data.goods[0].img = JSON.parse(res.data.goods[0].img);//图片转数组
            _this.count = res.data.count;//总数量
            _this.currentPage = Math.ceil(_this.count/10);//向上取整
            this.getlist();//获取详细信息
          }
        });
      },
      //获取详细信息
      getlist() {
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit,//每页多少条数据
          id: _this.$route.query.id,//url的id
          type: 2,
        };
        param = utils.filterJson(param);
        apiChat.getshopcontent(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            res.data.goods[0].img = JSON.parse(res.data.goods[0].img);//图片转数组
            _this.goodsInfo = res.data.goods[0];//商品列表
            _this.chatContent = res.data.data;//聊天内容
            _this.count = res.data.count;//总数量
          }else if(res.cscode === "2"){
            console.log("空数值")
          }else{
            res.data.goods[0].img = JSON.parse(res.data.goods[0].img);//图片转数组
            _this.goodsInfo = res.data.goods[0];//商品列表
            // this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
          }
        });
      },
      // 点击发送按钮
      sendMessage:function(){
        if (this.textarea == "\n" || this.textarea == "" ) {
          this.$alert('发送内容不能为空，请重新输入！', '提示', {
            confirmButtonText: '确定',
          });
        }else{
          let param = {
            user_id: this.goodsInfo.user_id,//发送的用户id
            content: this.textarea,//发送的文字
            types: 1,
          };
          console.log(param);
          this.inits(param);//调用方法
          this.textarea = '';//发送之后输入框为空
        }
      },
      //接收信息查询是否链接成功
      inits:function(data){
        let This = this;
        if (this.websock.readyState === 1) {// this.websock.readyState = 1 表示连接成功，可以立即发送信息
          this.websocketSend(data);//发送信息
        }else if (this.websock.readyState === 0) { // 表示正在连接，设置300ms后发送信息
          setTimeout(function () {
            This.websocketSend(data);//3秒后重连-发送信息
          }, 300);
        } else {
          this.websochetInit();// 连接未创建或者创建失败，则重新创建连接，并设置500ms后发送信息
          setTimeout(function () {
            This.websocketSend(data);//重连的方法
          }, 500);
        }
      },
      /* websochet发送信息--连接成功 */
      websocketSend (data) {
        apiChat.sendChatContent(data).then(res=>{
          console.log(res);
          if(res.data != null){//判断data中是否有数据，若不等于空，有数据则执行下面的赋值。
            let data = {//将发送的数据push到需要渲染的数组中
              message:res.data.data.input,//内容
              create_time:res.data.data.sendtime,//创建时间
              type:res.data.data.types,//类型
              user_id: "1",//id
            };
            this.chatContent.push(data);
          }

        })
      },
      /* 初始化websochet--未连接--重连 */
      websochetInit () {
        let ip = '39.104.128.172';
        this.websock = new WebSocket('ws://'+ip+':7272');
        this.websock.onmessage = this.websocketMessage;//接收服务器返回的信息
      },
      /* websochet接收--服务器返回的信息 */
      websocketMessage (e) {
        this.getInfo = JSON.parse(e.data);
        var data = JSON.parse(e.data);
        console.log(data);
        //var data = eval("("+e.data+")");
        switch(data['type']){
          // 服务端ping客户端
          case 'ping':
            this.websock .send('{"type":"pong"}');
            break;
          // 登录 更新用户列表
          case 'login':
            this.say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
            if(data['client_list']){
              client_list = data['client_list'];
            } else {
              client_list[data['client_id']] = data['client_name'];
            }
            this.flush_client_list();
            console.log(data['client_name']+"登录成功");
            break;
          // 发言
          case 'say':
            this.say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
            break;
          // 用户退出 更新用户列表
          case 'logout':
            this.say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
            delete client_list[data['from_client_id']];
            this.flush_client_list();
            break;
          //类型为信息时
          case 'message':
            this.say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
            break;
          //类型为图片时
          case 'image':
            this.say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
            break;
          case 'init':
            console.log(data.client_id);
            let param = {
              client_id:data.client_id,//发送给谁
              user_id:'8888',//客服id
            };
            apiChat.bindChatContent(param).then(res=>{
              console.log(res);
            });
            break;
        }
      },
      // 发言
      say:function(from_client_id, from_client_name, content, time){
        //解析新浪微博图片
        content = content.replace(/(http|https):\/\/[\w]+.sinaimg.cn[\S]+(jpg|png|gif)/gi, function(img){
          return "<a target='_blank' href='"+img+"'>"+"<img src='"+img+"'>"+"</a>";}
        );
        //解析url
        content = content.replace(/(http|https):\/\/[\S]+/gi, function(url){
            if(url.indexOf(".sinaimg.cn/") < 0)
              return "<a target='_blank' href='"+url+"'>"+url+"</a>";
            else
              return url;
          }
        );
        //将接收到的信息push到数组中
        let data = {
          type: this.getInfo.type,//类型
          message: this.getInfo.content,//内容
          user_id: this.getInfo.from_client_id,//id
          create_time: this.getInfo.time,//创建时间
        };
        //1信息，2图片
        if(data.type === "message"){
          data.type = 1
        }else if(data.type === "image"){
          data.type = 2
        }
        this.chatContent.push(data);
      },
      // 刷新用户列表框
      flush_client_list:function(){
        //获取用户列表框
      },
      //分页
      handleSizeChange(val) {
        let _this = this;
        _this.limit = val;
        _this.getlist();
      },
      //分页
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
        _this.getlist();
      },

      //上传商品图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeUpload(file) {
        let _this = this;
        var imgN=0;
        var code = 'shop';
        let fd = new FormData();//通过form数据格式来传
        fd.append("file_name", file); //传文件
        fd.append("shop_code", code); //传其他参数
        var url =  rootUrl;
        http.uplodPic(file,url, '', '')
          .then(res => {
            let data = res.data;
            console.log(data);

            _this.contentImg = res.data.imgurl;
            if (data.msg === "上传成功") {
              imgN++;
              _this.img();//上传成功之后调用发送图片
            } else {
              _this.$message.error(data.msg);
            }
          })
          .catch(error => {
            _this.$message.error(error);
          });

        if(imgN>2){
          this.$message.error("上传的图片不能超过3张");
        }
      },
      //图片回复上传
      submitUpload() {
        this.$refs.upload.submit();
      },
      //图片上传的接口
      img(){
        let _this = this;
        let param = {
          user_id: _this.goodsInfo.user_id,//发送的用户id
          content: _this.contentImg,//发送的图片
          types: 2,//文字是1，图片是2，语音是3
        };
        console.log(param);
        _this.inits(param);//调用方法
        this.$refs.upload.clearFiles();//回复成功之后清除图片
      },
      //放大图片
      bigImage :function(image){
        //将图片路径在点击方法的时候传过来--使dialogImageUrl的路径地址=传过来的地址，弹出框=true
        this.dialogImageUrl = image;
        this.dialogVisible = true;
      }
    },
    computed: {
      //监听列表长度，隐藏加号，未成功。
      uploadDisabled:function() {
        console.log(this.fileList.length);
        return this.fileList.length >0;
      },
    },
  }
</script>

<style scoped>
  @import url("../../../assets/css/Chat.css");
</style>
<style>
  .el-main {padding-bottom: 0}
  .upload-demo {height: 75px;}
  .chatService .el-upload--picture-card {width: 75px; height: 75px;line-height: 75px;}
  .chatService .el-upload-list--picture-card .el-upload-list__item {width: 75px;height: 75px;}
  .el-upload-list--picture-card .el-upload-list__item {margin-bottom: 0;border: 0}
  .disabled .chatService .el-upload--picture-card {display: none;}
  .chatService .el-dialog__header {background: none;}
</style>
