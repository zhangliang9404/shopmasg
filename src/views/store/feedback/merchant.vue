<template>
  <div class="chatList">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">客服</el-breadcrumb-item>
      <el-breadcrumb-item>商户聊天</el-breadcrumb-item>
      <el-breadcrumb-item>商户聊天列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片查询-->
    <el-card class="card-search">
      <div slot="header" class="clearfix">
        <span>筛选查询</span>
        <el-button type="text" class="card-btn" @click="onSubmit">查询</el-button>
      </div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!--<el-form-item label="输入搜索：">-->
          <!--<el-input v-model="formInline.goods_name" placeholder="商品名称"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="商户昵称：">
          <el-input v-model="formInline.shopname" placeholder="输入商户昵称"></el-input>
        </el-form-item>
        <el-form-item label="最后聊天时间：">
          <el-date-picker v-model="formInline.up_time" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <!--聊天列表-->
    <el-card class="card-list">
      <!--头部-->
      <div slot="header" class="clearfix">
        <span>数据列表</span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="limit"
                       layout="sizes" :total="count" class="card-btn" >
        </el-pagination>
      </div>
      <!--表格-->
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="group_id" show-overflow-tooltip label="编号" width="160">
          <template slot-scope="scope">
            <!--1是未读，0是已读-->
            <div v-if="scope.row.is_reads == 1">
              <el-badge is-dot class="item" style="height: 50px;line-height: 50px" >
                <span>{{ scope.row.group_id }}</span>
              </el-badge>
            </div>
            <div v-else>
              <span>{{ scope.row.group_id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" show-overflow-tooltip label="商户昵称" width="160"></el-table-column>
        <el-table-column prop="headimgurl" label="商户头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl" style="width: 50px;height: 50px">
          </template>
        </el-table-column>
        <!--<el-table-column prop="goods_name" show-overflow-tooltip label="商品名称" :formatter="formatter">-->

        <!--</el-table-column>-->
        <el-table-column prop="up_time" show-overflow-tooltip label="最后聊天时间" sortable >
          <template slot-scope="scope">
          <span>{{ scope.row.up_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="304">
          <template slot-scope="scope">
            <el-button type="text" @click="getInfo(scope.row.group_id)"><span style="color: #3baf22">查看</span></el-button>
            <el-button type="text" @click="handleDelete(scope.row.group_id)"><span style="color: #af180e" >删除</span></el-button>
            <el-button type="text" @click="messageCeilings(scope.row.group_id)"><span style="color: #af180e" >置顶</span></el-button>
            <el-button type="text" @click="cancelMessageTop(scope.row.group_id)"><span style="color: #af180e" >取消置顶</span></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--底部-->
      <div class="bottom clearfix">
        <el-button type="text" @click="toggleSelect(tableData)">全选</el-button>
        <el-button type="text" @click="batchDeleting(multipleSelection)">批量删除</el-button>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="limit"
                       background layout="total, prev, pager, next, jumper" :total="count" class="card-btn card-pad" >
        </el-pagination>

      </div>
    </el-card>
  </div>
</template>

<script>
  import * as utils from "@/common/utils.js"
  import {api_Chat} from "@/api/api.js"//export class api_Chat{}中的总名称
  let apiChat = new api_Chat();//给api_Chat另命名
  export default {
    name: "chatList",
    data() {
      return {
        formInline: {//筛选查询
          goods_name : '',//商品名称
          shopname: '',//用户昵称
          up_time: '',//最后聊天时间
        },
        currentPage:1,//当前页码
        limit:10,//每页条数
        count:0,//总条数
        tableData: [],//表格数据
        multipleSelection: [],//所选中表格的数组
        websock: '', // websocket会话
      }
    },
    //页面预加载执行
    mounted: function(){
      this.getchatlist();//获取商户数据列表表
      this.inits();//循环刷新
    },
    methods: {
      //获取商户数据列表
      getchatlist() {
        let _this = this;
        let param = {
          page:_this.currentPage,//当前页码
          limit:_this.limit//每页多少条数据
        };
        param = utils.filterJson(param);
        apiChat.shopsocketList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            _this.tableData = res.data.data;//客服数据的列表
            _this.count = res.data.count;//总数量
          }else{
            // _this.$alert(res.data.msg, '提示信息', {
            //   confirmButtonText: '确定'
            // });
          }
        });
        // setTimeout(function () {
        //   _this.getchatlist();//秒后重连-发送信息
        // }, 60000);

      },
      //提交筛选信息
      onSubmit() {
        //标准格式转化为日期格式，日期格式转化为时间戳
        var up_time = new Date(this.formInline.up_time);
        var up_times = up_time.getFullYear() + '-' + (up_time.getMonth() + 1) + '-' + up_time.getDate() + ' ' + up_time.getHours() + ':' + up_time.getMinutes() + ':' + up_time.getSeconds();
        var up_timess = new Date( up_times.replace(/-/g,"/")).getTime();//时间转为时间戳
        var up_timesss = up_timess/1000;
        let param = {
          page: this.currentPage,//当前页码
          limit: this.limit,//每页多少条数据
          shop_name:  this.formInline.shopname,  //商户名     【主要是搜索】
          up_time: up_timesss,   //最后修改时间 【主要是搜索】
          // goods_name: this.formInline.goods_name, //商品名称    【主要是搜索】
        };
        console.log(param);
        param = utils.filterJson(param);
        apiChat.shopsocketList(param).then(res => {
          console.log(res);
          if(res.cscode === "0"){
            this.tableData = res.data.data;//客服数据的列表
            this.count = res.data.count;//总数量
          }else{
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定'
            });
            this.tableData = res.data.data;//客服数据的列表
          }
        });
      },
      //分页
      handleSizeChange(val) {
        let _this = this;
        _this.limit = val;
        _this.getchatlist();
      },
      //分页
      handleCurrentChange(val) {
        let _this = this;
        _this.currentPage = val;
        _this.getchatlist();
      },
      //排序表格的时间
      formatter(row, column) {
        return row.goods_name;
      },
      //选择表格
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //查看详情
      getInfo(id){
        this.$router.push({
          path:'/merchantDetails',
          query: {
            id: id,
          }
        })
      },
      // 删除表格数据
      handleDelete:function(id){
        this.$confirm('执行此操作将会删除本条聊天记录, 是否继续?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            // status:'1',//判断单条删除或批量删除
            id:id,//根据id删除
          };
          apiChat.shopsocketmsgdel(param).then(res=>{
            console.log(res);
            if(res.cscode === "0"){
              this.getchatlist();
            }else{
              this.$alert(res.data.msg, '提示信息', {
                confirmButtonText: '确定',
              })
            }
          })
        }).catch(() => {
        });
      },
      //全选
      toggleSelect(rows){
        console.log(rows);
        if (rows) {
          rows.forEach(row => {
            console.log(row);
            this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
          });
          this.allSelect = !this.allSelect;
        }
      },
      // 批量删除
      batchDeleting:function(rows){
        if(rows.length>0){
          this.$confirm("确定删除吗", '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let ids = [];
            console.log(rows)
            for (var i = 0;i<rows.length;i++){
              ids.push(rows[i].group_id)
            }
            console.log('ids')
            console.log(ids)
            this.handleDelete(ids)
          }).catch(() => {
          })
        }else {
          this.$alert("请选择要删除的内容", '提示信息', {
            confirmButtonText: '确定',
          })
        }
      },
      //消息置顶
      messageCeilings(id){
          let _this = this
        this.$confirm("确定要置顶吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            type :'1',
            id:id
          }
          apiChat.shopstick(param).then(res=>{
            console.log(res);
            if(res.cscode == 0){
              _this.getchatlist()
            }

          })
        })
      },
      // 取消置顶
      cancelMessageTop(id){
        let _this = this
        this.$confirm("确定要取消置顶吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            type :'0',
            id:id
          }
          apiChat.shopstick(param).then(res=>{
            console.log(res);
            if(res.cscode == 0){
              _this.getchatlist()
            }

          })
        })
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
      /* 初始化websochet--未连接--重连 */
      websochetInit () {
        let ip = '39.104.128.172';
        this.websock = new WebSocket('ws://'+ip+':7272');
        this.websock.onmessage = this.websocketMessage;//接收服务器返回的信息
      },
      /* websochet发送信息--连接成功 */
      websocketSend (data) {
        // apiChat.sendChatContent(data).then(res=>{
        //   this.getchatlist();
        // })
      },
      /* websochet接收--服务器返回的信息 */
      websocketMessage (e) {

        var data = JSON.parse(e.data);
        console.log(data)
        //var data = eval("("+e.data+")");
        switch(data['type']){
          // 服务端ping客户端
          case 'ping':
            this.websock .send('{"type":"pong"}');
            break;
          // 登录 更新用户列表
          case 'login':
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
            break;
          // 用户退出 更新用户列表
          case 'logout':
            delete client_list[data['from_client_id']];
            this.flush_client_list();
            break;
          //类型为信息时
          case 'message':
            this.getchatlist();//获取聊天列表
            break;
          //类型为图片时
          case 'image':
            this.getchatlist();//获取聊天列表
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
    }
  }
</script>
<style scoped>
  @import url("../../../assets/css/Chat.css");
</style>
<style>
  .chatList .cell {text-align: center;}
  .chatList .card-list .el-card__body {padding: 0}
  .chatList .card-list .el-card__header {border-bottom: 0}
  .chatList .card-list .el-badge__content.is-fixed {top: 10px;}
</style>
