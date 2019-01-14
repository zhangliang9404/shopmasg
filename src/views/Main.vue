<template>
  <div class="Main">
    <el-container style="height: 97.5vh;">
      <!--头部导航-->
      <el-header>
        <el-row :gutter="24">
          <el-col :span="5">
            <span class="logo">
              <img src="../assets/img/logo.png" /> 智搜</span>
            <span class="text">	品牌好货不剁手</span>
          </el-col>
          <el-col :span="12">
            <el-menu :default-active="activeTop" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="1-1">首页</el-menu-item>
              <el-menu-item index="2-1" @click="$router.push('userlist')">用户</el-menu-item>
              <el-menu-item index="3-1" @click="$router.push('group')">营销</el-menu-item>
              <el-menu-item index="4-1" @click="$router.push('chatList')">客服</el-menu-item>
              <el-menu-item index="5-1" @click="$router.push('goodsclassify')">商品</el-menu-item>
              <el-menu-item index="6-1" @click="$router.push('goodswarehousing')">库存</el-menu-item>
              <el-menu-item index="7-1" @click="$router.push('orderlist')">订单</el-menu-item>
              <el-menu-item index="8-1" @click="$router.push('userquery')">权限</el-menu-item>
              <el-menu-item index="9-1" @click="$router.push('disSet')">财务</el-menu-item>
              <el-menu-item index="10-1" @click="$router.push('disSet')">分销</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="4"  class="userinfo">
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link userinfo-inner">
                <img v-if="head_imgurl != null" :src="head_imgurl" />
                                <img v-else :src="head_imgurl1" />
                  <span class="welcome">欢迎你，</span>
                {{head_name}}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="this.isNewInfo != '0'">
                  <router-link to="/chatList"><el-badge is-dot class="item">我的消息</el-badge></router-link>
                </el-dropdown-item>
                <el-dropdown-item v-else><router-link to="/chatList">我的消息</router-link></el-dropdown-item>
                <el-dropdown-item ><span @click="LogoutBtn">退出登录</span> </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <!--左侧内容底部-->
      <el-container>
        <!--左侧导航-->
        <el-aside width="15%" style="background-color:rgb(84, 92, 100);">
          <!--<el-menu :default-openeds="['1', '3']">-->
          <el-menu ref='side_menu' :default-active="activeLeft" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="isopened">
            <!--首页-->
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-menu"></i>首页</template>
              <el-submenu index="1-1">
                <template slot="title">首页推荐</template>
                <el-menu-item index="1-1-1" @click="$router.push('recommended')">
                  <router-link to="/recommended">今日推荐</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="1-2">
                <template slot="title">控制面板</template>
                <el-menu-item index="1-2-1" @click="$router.push('statisticsData')">
                  <router-link to="/statisticsData">数据统计</router-link>
                </el-menu-item>
              </el-submenu>
              <!--<el-submenu index="1-3">-->
              <!--<template slot="title">数据库设置</template>-->
              <!--<el-menu-item index="1-3-1">数据库恢复</el-menu-item>-->
              <!--<el-menu-item index="1-3-2">数据库备份</el-menu-item>-->
              <!--</el-submenu>-->
            </el-submenu>
            <!--用户-->
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-menu"></i>用户</template>
              <el-submenu index="2-1">
                <template slot="title">用户列表</template>
                <el-menu-item index="2-1-1" @click="$router.push('userlist')">
                  <router-link to="/userlist">用户列表</router-link>
                </el-menu-item>
                <!--<el-menu-item index="2-1-2" @click="$router.push('userlog')">登录日志</el-menu-item>-->
              </el-submenu>
              <el-submenu index="2-2">
                <template slot="title">商户列表</template>
                <el-menu-item index="2-2-1" @click="$router.push('merchantslist')">
                  <router-link to="/merchantslist">商户列表</router-link>
                </el-menu-item>
                <el-menu-item index="2-2-2" @click="$router.push('merchantsadd')">
                  <router-link to="/merchantsadd">商户新增</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2-3">
                <template slot="title">推广人员列表</template>
                <el-menu-item index="2-3-1" @click="$router.push('employee')">
                  <router-link to="/employee">推广人考核</router-link>
                </el-menu-item>
                <!-- <el-menu-item index="2-3-2" @click="$router.push('EmployeeRedact')">
                   <router-link to="/EmployeeRedact">添加</router-link>
                 </el-menu-item>-->
              </el-submenu>
            </el-submenu>
            <!--营销-->
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-menu"></i>营销</template>
              <!--<el-submenu index="3-1">-->
              <!--<template slot="title">促销活动</template>-->
              <!--<el-menu-item index="3-1-1" @click="$router.push('group')">团购</el-menu-item>-->
              <!--</el-submenu>-->
              <el-submenu index="3-2">
                <template slot="title">活动管理</template>
                <el-menu-item index="3-2-1" @click="$router.push('activeList')">
                  <router-link to="/activeList">活动列表</router-link>
                </el-menu-item>
                <!--<el-menu-item index="3-1-2" @click="$router.push('scareBuying')">限时抢购</el-menu-item>-->
              </el-submenu>
              <el-submenu index="3-3">
                <template slot="title">商品促销</template>
                <el-menu-item index="3-3-1" @click="$router.push('promotion')">
                  <router-link to="/promotion">限时优惠</router-link>
                </el-menu-item>
                <el-menu-item index="3-3-1" @click="$router.push('fullreduction')">
                  <router-link to="/fullreduction">满减优惠</router-link>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
            <!--客服-->
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-menu"></i>客服</template>
              <!--<el-submenu index="4-1">-->
              <!--<template slot="title">建议反馈 账户审核问题</template>-->
              <!--<el-menu-item index="4-1-1">问题回复页面客服处理页面</el-menu-item>-->
              <!--<el-menu-item index="4-1-2">问题回复页面</el-menu-item>-->
              <!--<el-menu-item index="4-1-3">回电</el-menu-item>-->
              <!--</el-submenu>-->
              <el-menu-item index="4-1" @click="$router.push('chatList')">
                <router-link to="/chatList">官方客服列表</router-link>
              </el-menu-item>
              <el-menu-item index="4-2" @click="$router.push('chatListGoods')">
                <router-link to="/chatListGoods">商品客服列表</router-link>
              </el-menu-item>
              <el-submenu index="4-3">
                <template slot="title">建议反馈</template>
                <!--<el-menu-item index="4-3-1" @click="$router.push('feedback')">问题回复</el-menu-item>-->
                <el-menu-item index="4-3-2" @click="$router.push('processing')">
                  <router-link to="/processing">客服处理</router-link>
                </el-menu-item>
              </el-submenu>
              <!--<el-menu-item index="4-4" @click="$router.push('supply')">-->
              <!--<router-link to="/supply">代理商聊天</router-link>-->
              <!--</el-menu-item>-->
              <el-menu-item index="4-5" @click="$router.push('merchant')">
                <router-link to="/merchant">商户聊天</router-link>
              </el-menu-item>
              <el-submenu index="4-6">
                <template slot="title">售后</template>
                <el-menu-item index="4-6-1" @click="$router.push('sale_list')">
                  <router-link to="/sale_list">售后列表</router-link>
                </el-menu-item>
                <el-menu-item index="4-6-2" @click="$router.push('afterSale1')">售后订单取消1</el-menu-item>
                <el-menu-item index="4-6-3" @click="$router.push('afterSale2')">售后订单取消2</el-menu-item>
                <el-menu-item index="4-6-4" @click="$router.push('afterSale3')">售后订单取消3</el-menu-item>
                <el-menu-item index="4-6-5" @click="$router.push('drawback1')">售后仅退款1</el-menu-item>
                <el-menu-item index="4-6-6" @click="$router.push('drawback2')">售后仅退款2</el-menu-item>
                <el-menu-item index="4-6-7" @click="$router.push('drawback3')">售后仅退款3</el-menu-item>
                <!-- <el-menu-item index="4-6-8" @click="$router.push('changeGoods1')">售后换货1</el-menu-item>
                 <el-menu-item index="4-6-8" @click="$router.push('changeGoods2')">售后换货2</el-menu-item>
                 <el-menu-item index="4-6-8" @click="$router.push('changeGoods3')">售后换货3</el-menu-item>-->
              </el-submenu>
            </el-submenu>
            <!--商品-->
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-goods"></i>商品</template>
              <el-submenu index="5-1">
                <template slot="title">分类管理</template>
                <el-menu-item index="5-1-1" @click="$router.push('goodsclassify')">
                  <router-link to="/goodsclassify">商品分类管理</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="5-2">
                <template slot="title">商品管理</template>
                <el-menu-item index="5-2-1" @click="$router.push('goodsonsale')">
                  <router-link to="/goodsonsale">在售商品管理</router-link>
                </el-menu-item>
                <el-menu-item index="5-2-2" @click="$router.push('goodssoldout')">
                  <router-link to="/goodssoldout">下架商品管理</router-link>
                </el-menu-item>

              </el-submenu>
              <el-submenu index="5-3">
                <template slot="title">商品评价管理</template>
                <el-menu-item index="5-3-1" @click="$router.push('evaluatelist')">
                  <router-link to="/evaluatelist">商品评价</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="5-4">
                <template slot="title">商品问答管理</template>
                <el-menu-item index="5-4-1" @click="$router.push('answerlist')">
                  <router-link to="/answerlist">商品问答</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="5-5">
                <template slot="title">商品审核</template>
                <el-menu-item index="5-4-1" @click="$router.push('audit')">
                  <router-link to="/audit">商品审核</router-link>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
            <!--库存-->
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-goods"></i>库存</template>
              <el-menu-item index="6-1" @click="$router.push('goodswarehousing')">
                <router-link to="/goodswarehousing">商品入库</router-link>
              </el-menu-item>
              <el-menu-item index="6-2" @click="$router.push('goodsoutbound')">
                <router-link to="/goodsoutbound">商品出库</router-link>
              </el-menu-item>
            </el-submenu>
            <!--订单-->
            <el-submenu index="7">
              <template slot="title"><i class="el-icon-goods"></i>订单</template>
              <el-submenu index="7-1">
                <template slot="title">订单信息</template>
                <el-menu-item index="7-1-1" @click="$router.push('orderlist')">
                  <router-link to="/orderlist">订单列表</router-link>
                </el-menu-item>
                <el-menu-item index="7-1-2" @click="$router.push('orderset')">
                  <router-link to="/orderset">订单设置</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="7-2">
                <template slot="title">退款</template>
                <el-menu-item index="7-2-1" @click="$router.push('returnmoney')">
                  <router-link to="/returnmoney">退款申请单</router-link>
                </el-menu-item>
                <!--<el-menu-item index="7-2-2" @click="$router.push('returncargo')">-->
                <!--<router-link to="/returncargo">退货申请单</router-link>-->
                <!--</el-menu-item>-->
                <!--<el-menu-item index="7-2-3" @click="$router.push('tradecargo')">-->
                <!--<router-link to="/tradecargo">换货申请单</router-link>-->
                <!--</el-menu-item>-->
              </el-submenu>
              <el-submenu index="7-3">
                <template slot="title">单据管理</template>
                <el-menu-item index="7-3-1" @click="$router.push('receipt')">
                  <router-link to="/receipt">收款单</router-link>
                </el-menu-item>
                <el-menu-item index="7-3-2" @click="$router.push('refundorder')">
                  <router-link to="/refundorder">退款单</router-link>
                </el-menu-item>
                <el-menu-item index="7-3-3" @click="$router.push('dispatchbill')">
                  <router-link to="/dispatchbill">发货单</router-link>
                </el-menu-item>
                <!--<el-menu-item index="7-3-4" @click="$router.push('Returned')">-->
                <!--<router-link to="/Returned">退货单</router-link>-->
                <!--</el-menu-item>-->
              </el-submenu>
              <el-submenu index="7-4">
                <template slot="title">运费管理</template>
                <el-menu-item index="7-4-1" @click="$router.push('ordercarriage')">
                  <router-link to="/ordercarriage">运费模板</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="7-5">
                <template slot="title">供应商管理</template>
                <el-submenu index="7-5-1">
                  <template slot="title">商品供应管理</template>
                  <el-menu-item index="7-5-1-1" @click="$router.push('supplierlist')">
                    <router-link to="/supplierlist">供应商列表</router-link>
                  </el-menu-item>
                  <el-menu-item index="7-5-1-2" @click="$router.push('supplieradd')">
                    <router-link to="/supplieradd">新增供应商</router-link>
                  </el-menu-item>
                </el-submenu>
                <!--<el-menu-item index="7-5-2" @click="$router.push('ordercarall')">合作物流</el-menu-item>-->
              </el-submenu>

            </el-submenu>
            <!--权限-->
            <el-submenu index="8">
              <template slot="title"><i class="el-icon-menu"></i>权限</template>
              <el-submenu index="8-1" @select="handleOpen">
                <template slot="title">用户管理</template>
                <el-menu-item index="8-1-1" @click="$router.push('userquery')">
                  <router-link to="/userquery">用户账号查询</router-link>
                </el-menu-item>
                <el-menu-item index="8-1-2" @click="$router.push('useradd')">
                  <router-link to="/useradd">添加新用户</router-link>
                </el-menu-item>
                <el-menu-item index="8-1-3" @click="$router.push('userlog')">
                  <router-link to="/userlog">权限人员登录日志</router-link>
                </el-menu-item>
              </el-submenu>
              <!--<el-submenu index="8-2">-->
              <!--<template slot="title">部门管理</template>-->
              <!--<el-menu-item index="8-2-1" @click="$router.push('departmentquery')">-->
              <!--<router-link to="/departmentquery">部门查询</router-link>-->
              <!--</el-menu-item>-->
              <!--<el-menu-item index="8-2-2" @click="$router.push('departmentadd')">-->
              <!--<router-link to="/departmentadd">添加新部门</router-link>-->
              <!--</el-menu-item>-->
              <!--</el-submenu>-->
              <el-submenu index="8-3">
                <template slot="title">角色管理</template>
                <el-menu-item index="8-3-1" @click="$router.push('rolequery')">
                  <router-link to="/rolequery">角色查询</router-link>
                </el-menu-item>
                <el-menu-item index="8-3-2" @click="$router.push('roleadd')">
                  <router-link to="/roleadd">绑定角色</router-link>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="8-4">
                <template slot="title">权限设置</template>
                <el-menu-item index="8-4-1" @click="$router.push('powerquery')">
                  <router-link to="/powerquery">权限查询</router-link>
                </el-menu-item>
                <el-menu-item index="8-4-2" @click="$router.push('poweradd')">
                  <router-link to="/poweradd">添加新权限</router-link>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
            <!--财务-->
            <el-submenu index="9">
              <template slot="title"><i class="el-icon-date"></i>财务</template>
              <el-submenu index="9-1">
                <template slot="title">综合统计</template>
                <el-submenu index="9-1-1">
                  <template slot="title">商城综合统计</template>
                  <el-menu-item index="9-1-1-1" @click="$router.push('statisticalTable')">
                    <router-link to="/statisticalTable">统计表</router-link>
                  </el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-submenu index="9-2">
                <template slot="title">对账管理</template>
                <el-menu-item index="9-2-1" @click="$router.push('accountList')">
                  <router-link to="/accountList">对账列表</router-link>
                </el-menu-item>
                <!--<el-menu-item index="9-2-2" @click="$router.push('accountDetailsNotOutofAccount')">对账详情未出账</el-menu-item>-->
                <!--<el-menu-item index="9-2-3" @click="$router.push('AccountStatementAlreadyReconciled')">对账详情已出账</el-menu-item>-->
                <!--<el-menu-item index="9-2-4" @click="$router.push('AccountStatementabnormal')">对账详情异常</el-menu-item>-->
                <!--<el-menu-item index="9-2-5" @click="$router.push('AccountStatementHavebeencorrected')">对账详情已冲中</el-menu-item>-->
                <!--<el-menu-item index="9-2-6" @click="$router.push('wechatReconciliationDetails')">微信对账详情</el-menu-item>-->
                <el-menu-item index="9-2-7" @click="$router.push('WeChatStatement')">
                  <router-link to="/WeChatStatement">微信对账单</router-link>
                </el-menu-item>
                <el-menu-item index="9-2-8" @click="$router.push('withdrawal')">
                  <router-link to="/withdrawal">提现列表</router-link>
                </el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="10">
              <template slot="title"><i class="el-icon-date"></i>分销</template>
              <!--<template slot="title" style="position: relative;"><i class="iconfont icon-shangcheng icon_posi"></i><em class="title_posi"></em></template>-->
              <el-menu-item index="10-1" @click="$router.push('disSet')">
                <router-link to="/disSet">分销设置</router-link>
              </el-menu-item>
              <el-menu-item index="10-2" @click="$router.push('distManagement')">
                <router-link to="/distManagement">分销商管理</router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!--内容与底部-->
        <el-container>
          <el-main>
            <router-view @refreshList="onRefresList"></router-view>
          </el-main>
        </el-container>
      </el-container>
      <!--底部-->
      <el-footer align="center">智搜农牧</el-footer>
    </el-container>
  </div>
</template>
<script>
  import * as utils from "@/common/utils.js"
  import {api_Chat} from "@/api/api.js"//export class api_Chat{}中的总名称
  import '../assets/css/icon/iconfont.css'
  let apiChat = new api_Chat();//给api_Chat另命名
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    data() {
      return {
        activeTop: '', // 头部栏默认值
        activeLeft: '',//左侧默认值
        isopened: true,//是否只保持一个子菜单的展开
        head_imgurl:require('../assets/img/Headportrait.png'),
        head_imgurl1:require('../assets/img/Headportrait.png'),
        head_name:'',
        websock: '', // websocket会话
        isNewInfo: '',//是否有新消息
      };
    },
    //页面预加载执行
    mounted(){
      this.getown();
      this.inits();//循环刷新
      this.getNewInfo();//获取新信息
      this.getCookies();
    },
    methods: {
      getCookies(){
        this.activeTop = utils.getCookie("activeIndexTop"); // 定义头部cookie便于判断
        this.activeLeft = utils.getCookie("activeIndexLeft"); // 定义左侧cookie便于判断
      },
      // 顶部导航栏选择
      handleSelect(key, keyPath) {
        utils.setCookie("activeIndexTop",key); // 存cookie
        // this.$store.state.oldadminleftnavnum = this.$store.state.adminleftnavnum;
        // this.$store.state.adminleftnavnum = key;
      },
      //打开左侧导航栏
      handleOpen(key, keyPath) {
        utils.setCookie("activeIndexLeft",key+'-1'); // 存cookie
      },
      //关闭左侧导航栏
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      getNavType(){
        this.navselected = this.$store.state.adminleftnavnum;
      },
      onRefresList(){
        this.$refs.side_menu.close(this.$store.state.oldadminleftnavnum);
        this.$refs.side_menu.open(this.$store.state.adminleftnavnum);
      },
      //获取头像信息
      getown(){
        let param={
          id:sessionStorage.getItem("token1")
        };
        apiUser.getowndate(param).then(res=>{
          console.log(res);
          if(res.cscode == "0"){
            this.head_name = res.data.data.realname;
            this.head_imgurl = res.data.data.head_img;
          }
        })
      },
      //接收信息查询是否链接成功
      inits:function(data){
        let This = this;
        if (this.websock.readyState == 1) {// this.websock.readyState = 1 表示连接成功，可以立即发送信息
          this.websocketSend(data);//发送信息
        }else if (this.websock.readyState == 0) { // 表示正在连接，设置300ms后发送信息
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
        this.websock= new WebSocket("wss://api.zhisoufangdichan.com:7272");
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
            this.getNewInfo();//获取新信息
            break;
          //类型为图片时
          case 'image':
            this.getNewInfo();//获取新信息
            break;
          case 'init':
            let param = {
              client_id:data.client_id,//发送给谁
              user_id:1,//客服id
            };
            apiChat.bindChatContent(param).then(res=>{
              console.log(res);
            });
            break;
        }
      },

      // 获取时候有未读消息或者新消息
      getNewInfo:function(){
        let param ={};
        apiChat.hMsgCount(param).then(res=>{
          if(res.cscode == "0"){
            this.isNewInfo = res.data.data;//是否有新消息
          }
        })
      },

      // 点击退出登录按钮退出
      LogoutBtn(){
        this.$alert('您的操作将退出当前系统，是否要退出', '退出', {
          confirmButtonText: '确定',
          callback: action => {
            utils.setCookie("token", '');
            utils.setCookie("token_time", '');
            this.$router.push({
              path:'/login'
            })
          }
        });





      }
    },
    watch:{
      '$store.state.adminleftnavnum':'getNavType'
    },

  }
</script>
<style>
  @import url("../assets/css/Main_elm.css");
</style>
<style scoped>
  @import url("../assets/css/Main.css");
</style>
