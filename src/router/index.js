import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import constants from '../common/constants'
import login from '@/views/Login'
import main from '../views/Main.vue'
Vue.use(Router);

const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: resolve => require(['../views/Login.vue'], resolve)
  },{
    path: '/',
    component: main,
    children: [{
      path: '/recommended', //首页-首页推荐-今日推荐
      name: 'recommended',
      component: resolve => require(['../views/index/Recommended.vue'], resolve)
    },{
      path: '/orderlistcopy', //订单-订单信息-订单列表
      name: 'orderlistcopy',
      component: resolve => require(['../views/order/OrderListCopy.vue'], resolve)
    },{
      path: '/statisticsData', //首页-首页推荐-数据统计
      name: 'statisticsData',
      component: resolve => require(['../views/index/statisticsData.vue'], resolve)
    },{
      path: '/userquery', //权限-用户管理-用户账号查询
      name: 'userquery',
      component: resolve => require(['../views/power/UserQuery.vue'], resolve)
    },{
      path: '/useradd', //权限-用户管理-添加新用户
      name: 'useradd',
      component: resolve => require(['../views/power/UserAdd.vue'], resolve)
    },{
      path: '/userupdate', //权限-用户管理-修改用户信息
      name: 'userupdate',
      component: resolve => require(['../views/power/UserUpdate.vue'], resolve)
    },{
      path: '/userlog', //权限-用户管理-权限人员登录日志
      name: 'userlog',
      component: resolve => require(['../views/power/UserLog.vue'], resolve)
    },{
      path: '/poweruserlog', //用户日志（待定，有可能未使用，2018-10-16）
      name: 'poweruserlog',
      component: resolve => require(['../views/power/PowerUserLog.vue'], resolve)
    },{
      path: '/departmentquery', //权限-部门管理-部门查询
      name: 'departmentquery',
      component: resolve => require(['../views/power/DepartmentQuery.vue'], resolve)
    },{
      path: '/departmentadd', //权限-部门管理-添加新部门
      name: 'departmentadd',
      component: resolve => require(['../views/power/DepartmentAdd.vue'], resolve)
    },{
      path: '/departmentupdate', //权限-部门管理-修改部门
      name: 'departmentupdate',
      component: resolve => require(['../views/power/DepartmentUpdate.vue'], resolve)
    },{
      path: '/rolequery', //权限-角色管理-角色查询
      name: 'rolequery',
      component: resolve => require(['../views/power/RoleQuery.vue'], resolve)
    },{
      path: '/roleadd', //权限-角色管理-添加新角色
      name: 'roleadd',
      component: resolve => require(['../views/power/RoleAdd.vue'], resolve)
    },{
      path: '/roleupdate', //权限-角色管理-修改角色
      name: 'roleupdate',
      component: resolve => require(['../views/power/RoleUpdate.vue'], resolve)
    },{
      path: '/powerquery', //权限-权限设置-权限查询
      name: 'powerquery',
      component: resolve => require(['../views/power/PowerQuery.vue'], resolve)
    },{
      path: '/poweradd', //权限-权限设置-添加新权限
      name: 'poweradd',
      component: resolve => require(['../views/power/PowerAdd.vue'], resolve)
    },{
      path: '/powerupdate', //权限-权限设置-修改权限
      name: 'powerupdate',
      component: resolve => require(['../views/power/PowerUpdate.vue'], resolve)
    },{
      path: '/userlist', //用户-用户列表-用户列表
      name: 'userlist',
      component: resolve => require(['../views/user/UserList.vue'], resolve)
    },{
      path: '/userinfo', //用户-用户列表-用户详情
      name: 'userinfo',
      component: resolve => require(['../views/user/UserInfo.vue'], resolve)
    },{
      path: '/userredact', //用户-用户列表-编辑资料
      name: 'userredact',
      component: resolve => require(['../views/user/UserRedact.vue'], resolve)
    },{
      path: '/merchantslist', //用户-商户列表-商户列表
      name: 'merchantslist',
      component: resolve => require(['../views/user/MerchantsList.vue'], resolve)
    },{
      path: '/merchantsadd', //用户-商户列表-新增商户
      name: 'merchantsadd',
      component: resolve => require(['../views/user/MerchantsAdd.vue'], resolve)
    },{
      path: '/merchantsupdate', //用户-商户列表-编辑商户或详情
      name: 'merchantsupdate',
      component: resolve => require(['../views/user/MerchantsUpdate.vue'], resolve)
    },{
      path: '/merchantsinfo', //用户-商户列表-编辑详情
      name: 'merchantsinfo',
      component: resolve => require(['../views/user/MerchantsInfo.vue'], resolve)
    },{
      path: '/goodsclassify', //商品-分类管理-商品分类管理
      name: 'goodsclassify',
      component: resolve => require(['../views/goods/GoodsClassify.vue'], resolve)
    },{
      path: '/goodsadd', //商品-分类管理-商品分类管理-商品新增
      name: 'goodsadd',
      component: resolve => require(['../views/goods/GoodsAdd.vue'], resolve)
    },
      {
      path: '/goodsonsale', //商品-商品管理-在售商品管理
      name: 'goodsonsale',
      component: resolve => require(['../views/goods/GoodsOnSale.vue'], resolve)
    },{
      path: '/goodssoldout', //商品-商品管理-下架商品管理
      name: 'goodssoldout',
      component: resolve => require(['../views/goods/GoodsSoldOut.vue'], resolve)
    },{
      path: '/goodsupdate', //商品-商品管理-发布商品
      name: 'goodsupdate',
      component: resolve => require(['../views/goods/GoodsUpdate.vue'], resolve)
    },{
      path: '/goodsmodify', //商品-商品管理-发布商品
      name: 'goodsmodify',
      component: resolve => require(['../views/goods/GoodsModify.vue'], resolve)
    },{
      path: '/evaluatelist', //商品-商品评价管理-商品评价
      name: 'evaluatelist',
      component: resolve => require(['../views/goods/evaluatelist.vue'], resolve)
    },{
      path: '/answerlist', //商品-商品问答管理-商品问答
      name: 'answerlist',
      component: resolve => require(['../views/goods/AnswerList.vue'], resolve)
    },{
      path: '/answerdetail', //商品-商品问答管理-商品问答详情
      name: 'answerdetail',
      component: resolve => require(['../views/goods/AnswerDetail.vue'], resolve)
    },{
      path: '/evadetail', //商品-商品评价管理-商品评价-商品评价详情
      name: 'evadetail',
      component: resolve => require(['../views/goods/evadetail.vue'], resolve)
    },{
      path: '/returnmoney', //订单-退换货（款）-退款申请单
      name: 'returnmoney',
      component: resolve => require(['../views/ruturns/ReturnMoney.vue'], resolve)
    },{
      path: '/returncargo', //订单-退换货（款）-退货申请单
      name: 'returncargo',
      component: resolve => require(['../views/ruturns/ReturnCargo.vue'], resolve)
    },{
      path: '/tradecargo', //订单-退换货（款）-换货申请单
      name: 'tradecargo',
      component: resolve => require(['../views/ruturns/TradeCargo.vue'], resolve)
    },{
      path: '/receipt', //订单-单据管理-收款单
      name: 'receipt',
      component: resolve => require(['../views/voucher/Receipt.vue'], resolve)
    },{
      path: '/refundorder', //订单-单据管理-退款单
      name: 'refundorder',
      component: resolve => require(['../views/voucher/RefundOrder.vue'], resolve)
    },{
      path: '/dispatchbill', //订单-单据管理-发货单
      name: 'dispatchbill',
      component: resolve => require(['../views/voucher/DispatchBill.vue'], resolve)
    },{
      path: '/returned', //订单-单据管理-退货单
      name: 'returned',
      component: resolve => require(['../views/voucher/Returned.vue'], resolve)
    },{
      path: '/supplierlist', //订单-供应管理-供应商列表
      name: 'supplierlist',
      component: resolve => require(['../views/voucher/SupplierList.vue'], resolve)
    },{
      path: '/supplieradd', //订单-供应管理-供应商新增
      name: 'supplieradd',
      component: resolve => require(['../views/voucher/SupplierAdd.vue'], resolve)
    },{
      path: '/supplierinfo', //订单-供应管理-供应商详情
      name: 'supplierinfo',
      component: resolve => require(['../views/voucher/SupplierInfo.vue'], resolve)
    },{
      path: '/supplierupdate', //订单-供应管理-供应商修改
      name: 'supplierupdate',
      component: resolve => require(['../views/voucher/SupplierUpdate.vue'], resolve)
    },{
      path: '/orderlist', //订单-订单信息-订单列表
      name: 'orderlist',
      component: resolve => require(['../views/order/OrderList.vue'], resolve)
    },{
      path: '/orderset', //订单-订单信息-订单设置
      name: 'orderset',
      component: resolve => require(['../views/order/OrderSet.vue'], resolve)
    },{
      path: '/orderstate00', //订单-订单信息-订单列表-订单状态-买家已付款（退款受理）
      name: 'orderstate00',
      component: resolve => require(['../views/order/OrderState00.vue'], resolve)
    },{
      path: '/orderstate0', //订单-订单信息-订单列表-订单状态-等待买家付款
      name: 'orderstate0',
      component: resolve => require(['../views/order/OrderState0.vue'], resolve)
    },{
      path: '/orderstate1', //订单-订单信息-订单列表-订单状态-买家已付款(正常付款)
      name: 'orderstate1',
      component: resolve => require(['../views/order/OrderState1.vue'], resolve)
    },{
      path: '/orderstate3', //订单-订单信息-订单列表-订单状态-等待买家收货
      name: 'orderstate3',
      component: resolve => require(['../views/order/OrderState3.vue'], resolve)
    },{
      path: '/orderstate4', //订单-订单信息-订单列表-订单状态-买家已收货（退/换货受理）
      name: 'orderstate4',
      component: resolve => require(['../views/order/OrderState4.vue'], resolve)
    },{
      path: '/orderstate5', //订单-订单信息-订单列表-订单状态-交易成功
      name: 'orderstate5',
      component: resolve => require(['../views/order/OrderState5.vue'], resolve)
    },{
      path: '/orderstate6', //订单-订单信息-订单列表-订单状态-交易关闭
      name: 'orderstate6',
      component: resolve => require(['../views/order/OrderState6.vue'], resolve)
    },{
      path: '/orderstate7', //订单-订单信息-订单列表-订单状态-买家已付款（退款受理）
      name: 'orderstate7',
      component: resolve => require(['../views/order/OrderState7.vue'], resolve)
    },{
      path: '/ordercarriage', //订单-运费管理-运费模板
      name: 'ordercarriage',
      component: resolve => require(['../views/order/OrderCarriage.vue'], resolve)
    },{
      path: '/ordercaradd', //订单-运费管理-新增运费模板
      name: 'ordercaradd',
      component: resolve => require(['../views/order/OrderCarAdd.vue'], resolve)
    },{
      path: '/ordercarupdate', //订单-运费管理-修改运费模板
      name: 'ordercarupdate',
      component: resolve => require(['../views/order/OrderCarUpdate.vue'], resolve)
    },{
      path: '/ordercarall', //订单-物流供应商管理-合作物流
      name: 'ordercarall',
      component: resolve => require(['../views/order/OrderCarAll.vue'], resolve)
    },{
      path: '/goodswarehousing', //库存-商品入库
      name: 'goodswarehousing',
      component: resolve => require(['../views/inventory/goodswarehousing.vue'], resolve)
    },{
      path: '/goodsoutbound', //库存-商品出库
      name: 'goodsoutbound',
      component: resolve => require(['../views/inventory/goodsoutbound.vue'], resolve)
    },{
      path: '/group', //营销-促销活动-团购
      name: 'group',
      component: resolve => require(['../views/promotion/group.vue'], resolve)
    },
      ,{
        path: '/promotion', //营销-促销活动-团购
        name: 'promotion',
        component: resolve => require(['../views/promotion/promotion.vue'], resolve)
      },
      ,{
        path: '/fullreduction', //营销-促销活动-团购
        name: 'fullreduction',
        component: resolve => require(['../views/promotion/fullreduction.vue'], resolve)
      },


      {
      path: '/addGroup', //营销-促销活动-添加团购
      name: 'addGroup',
      component: resolve => require(['../views/promotion/addGroup.vue'], resolve)
    },{
      path: '/updateGroup', //营销-促销活动-修改团购
      name: 'updateGroup',
      component: resolve => require(['../views/promotion/updateGroup.vue'], resolve)
    },{
      path: '/scareBuying', //营销-促销活动-抢购
      name: 'scareBuying',
      component: resolve => require(['../views/promotion/scareBuying.vue'], resolve)
    },{
      path: '/addScareGroup', //营销促销活动-添加抢购
      name: 'addScareGroup',
      component: resolve => require(['../views/promotion/addScareGroup.vue'], resolve)
    },{
      path: '/statisticalTable', //财务-综合统计-商城综合统计-统计表
      name: 'statisticalTable',
      component: resolve => require(['../views/finance/comprehensiveStatistics/statisticalTable.vue'], resolve)
    },{
      path: '/accountList', //财务-对账管理-对账列表
      name: 'accountList',
      component: resolve => require(['../views/finance/accountManagement/accountList.vue'], resolve)
    },{
      path: '/accountDetailsNotOutofAccount', //财务-对账管理-对账列表-对账详情未出账
      name: 'accountDetailsNotOutofAccount',
      component: resolve => require(['../views/finance/accountManagement/accountDetailsNotOutofAccount.vue'], resolve)
    },{
      path: '/AccountStatementAlreadyReconciled', //财务-对账管理-对账列表-对账详情已出账
      name: 'AccountStatementAlreadyReconciled',
      component: resolve => require(['../views/finance/accountManagement/AccountStatementAlreadyReconciled.vue'], resolve)
    },{
      path: '/AccountStatementabnormal', //财务-对账管理-对账列表-对账详情异常
      name: 'AccountStatementabnormal',
      component: resolve => require(['../views/finance/accountManagement/AccountStatementabnormal.vue'], resolve)
    },{
      path: '/AccountStatementHavebeencorrected', //财务-对账管理-对账列表-对账详情已冲正
      name: 'AccountStatementHavebeencorrected',
      component: resolve => require(['../views/finance/accountManagement/AccountStatementHavebeencorrected.vue'], resolve)
    },{
      path: '/WeChatStatement', //财务-对账管理-微信对账单
      name: 'WeChatStatement',
      component: resolve => require(['../views/finance/accountManagement/WeChatStatement.vue'], resolve)
    },{
      path: '/wechatReconciliationDetails', //财务-对账管理-微信对账单-微信对账单详情
      name: 'wechatReconciliationDetails',
      component: resolve => require(['../views/finance/accountManagement/wechatReconciliationDetails.vue'], resolve)
    },{
        path: '/withdrawal', //商品详情
        name: 'withdrawal',
        component: resolve => require(['../views/finance/accountManagement/withdrawal.vue'], resolve)
    },{
      path: '/chatList', //客服-聊天客服列表
      name: 'chatList',
      component: resolve => require(['../views/chat/chatList.vue'], resolve)
    },{
      path: '/chatService', //客服-聊天客服详情
      name: 'chatService',
      component: resolve => require(['../views/chat/chatService.vue'], resolve)
    },{
        path: '/chatListGoods', //客服-聊天客服列表-商户
        name: 'chatListGoods',
        component: resolve => require(['../views/chat/chatListGoods.vue'], resolve)
      },{
        path: '/chatServiceGoods', //客服-聊天客服详情-商户
        name: 'chatServiceGoods',
        component: resolve => require(['../views/chat/chatServiceGoods.vue'], resolve)
      },{
        path: '/text', //测试专用页面
      name: 'text',
      component: resolve => require(['../views/order/text.vue'], resolve)
    },
    {
        path: '/disSet', //分销管理设置

        name: 'disSet',
        component: resolve => require(['../views/distribution/disSet.vue'], resolve)
      },
      {
        path: '/distManagement', //分销管理设置
        name: 'distManagement',
        component: resolve => require(['../views/distribution/distManagement.vue'], resolve)
      },
      {
        path: '/distributionDetails', //分销详情
        name: 'distributionDetails',
        component: resolve => require(['../views/distribution/distributionDetails.vue'], resolve)
      },
      {
        path: '/feedback', //客服回复
        name: 'feedback',
        component: resolve => require(['../views/store/feedback/feedback.vue'], resolve)
      },
      {
        path: '/processing', //客服处理
        name: 'processing',
        component: resolve => require(['../views/store/feedback/processing.vue'], resolve)
      },
      {
        path: '/supply', //代理商聊天
        name: 'supply',
        component: resolve => require(['../views/store/feedback/supply.vue'], resolve)
      },
      {
        path: '/merchant', //商户聊天列表
        name: 'merchant',
        component: resolve => require(['../views/store/feedback/merchant.vue'], resolve)
      },
      {
        path: '/merchantDetails', //商户聊天详情
        name: 'merchantDetails',
        component: resolve => require(['../views/store/feedback/merchantDetails.vue'], resolve)
      },
      {
        path: '/sale_list', //售后列表
        name: 'sale_list',
        component: resolve => require(['../views/store/sale/sale_list.vue'], resolve)
      },
      {
        path: '/afterSale1', //售后订单取消（买家申请取消订单）
        name: 'afterSale1',
        component: resolve => require(['../views/store/sale/afterSale1.vue'], resolve)
      },
      {
        path: '/afterSale2', //售后订单取消（买家申请取消订单）
        name: 'afterSale2',
        component: resolve => require(['../views/store/sale/afterSale2.vue'], resolve)
      },
      {
        path: '/afterSale3', //售后订单取消（买家申请取消订单）
        name: 'afterSale3',
        component: resolve => require(['../views/store/sale/afterSale3.vue'], resolve)
      },
      {
        path: '/drawback1', //售后仅退款1
        name: 'drawback1',
        component: resolve => require(['../views/store/sale/drawback1.vue'], resolve)
      },
     {
        path: '/drawback2', //售后仅退款2
        name: 'drawback2',
        component: resolve => require(['../views/store/sale/drawback2.vue'], resolve)
      },
      {
        path: '/drawback3', //售后仅退款3
        name: 'drawback3',
        component: resolve => require(['../views/store/sale/drawback3.vue'], resolve)
      },
      {
        path: '/changeGoods1', //售后换货1
        name: 'changeGoods1',
        component: resolve => require(['../views/store/sale/changeGoods1.vue'], resolve)
      },
      {
        path: '/changeGoods2', //售后换货2
        name: 'changeGoods2',
        component: resolve => require(['../views/store/sale/changeGoods2.vue'], resolve)
      },
      {
        path: '/changeGoods3', //售后换货2
        name: 'changeGoods3',
        component: resolve => require(['../views/store/sale/changeGoods3.vue'], resolve)
      },
      {
        path: '/audit', //商品审核
        name: 'audit',
        component: resolve => require(['../views/goods/audit.vue'], resolve)
      },
      {
        path: '/goodsDetails', //商品详情
        name: 'goodsDetails',
        component: resolve => require(['../views/goods/goodsDetails.vue'], resolve)
      },
      //考核列表
      {
        path: '/employee', //商品详情
        name: 'employee',
        component: resolve => require(['../views/user/employee.vue'], resolve)
      },
      //考核列表详情
      {
        path: '/EmployeeInfo', //商品详情
        name: 'EmployeeInfo',
        component: resolve => require(['../views/user/EmployeeInfo.vue'], resolve)
      },
      //考核列表编辑
      {
        path: '/EmployeeRedact', //商品详情
        name: 'EmployeeRedact',
        component: resolve => require(['../views/user/EmployeeRedact.vue'], resolve)
      },
      //活动列表
      {
        path: '/activeList', //商品详情
        name: 'activeList',
        component: resolve => require(['../views/promotion/activeList.vue'], resolve)
      },
      //编辑活动
      {
        path: '/redactActive', //商品详情
        name: 'redactActive',
        component: resolve => require(['../views/promotion/redactActive.vue'], resolve)
      },
      //活动添加
      {
        path: '/addActive', //商品详情
        name: 'addActive',
        component: resolve => require(['../views/promotion/addActive.vue'], resolve)
      },

    ]
    },
  ],
  mode:'history'//取消地址栏的#
});

//导航后置守卫，可以在确定导航到目标页面时再更改title
router.afterEach((to, from) => {
  window.document.title = constants[to.name];
});

export default router;
