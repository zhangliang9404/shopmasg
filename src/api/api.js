import * as http from '@/common/http.js'
import axios from 'axios'
import storedata from "@/common/data.js"
import * as config from '../common/config.js'
let rootUrl = config.default.apiUrl;
let res ='';
//登陆
export class api_login {
  //登陆
  login(param) {
    return http.postJson('/login/backstageuser_login', param, rootUrl).then(res => {
      return res;
    });
  };
}
//用户
export class api_user {
  //推荐列表
  recommendedList(param){
    return http.postJson("/commodity/recommend_list",param, rootUrl).then(res=>{
      return res;
    })
  };
  //是否推荐
  recommendChange(param){
    return http.postJson("/commodity/recommend_change",param, rootUrl).then(res=>{
      return res;
    })
  };
  //选择商品
  chooseGoods(param){
    return http.postJson("/commodity/recommend_choose",param, rootUrl).then(res=>{
      return res;
    })
  }

  //审核人员列表
  saleList(param){
    return http.postJson("/sales/sales_list",param, rootUrl).then(res=>{
      return res;
    })
  };
  //数据统计
  statisticUser(param) {
    return http.postJson('/statistics/usersum', param, rootUrl).then(res => {
      return res;
    });
  };
  statisticShop(param) {
    return http.postJson('/admin/shop_statistics', param, rootUrl).then(res => {
      return res;
    });
  };
  //折线图今天事实数据
  lineHour(param){
    return http.postJson('/admin/line_chart_hour', param, rootUrl).then(res => {
      return res;
    });
  }
  //折线图本周每天数据
  lineweek(param){
    return http.postJson('/admin/line_chart_week', param, rootUrl).then(res => {
      return res;
    });
  }
  //折线图本月数据
  lineMonth(param){
    return http.postJson('/admin/line_chart_mouth', param, rootUrl).then(res => {
      return res;
    });
  }
  //折线图本年数据
  lineYear(param){
    return http.postJson('/admin/line_chart_year', param, rootUrl).then(res => {
      return res;
    });
  }
  //待办事宜
   getDealList(param){
     return http.postJson('/admin/deal_trans', param, rootUrl).then(res => {
       return res;
     });
   }
  //商品热销排行榜
  getsShopGoods(param){
    return http.postJson('/admin/goods_sales_list', param, rootUrl).then(res => {
      return res;
    });
  };
  //付款转化率排行榜
  getsShopRate(param){
    return http.postJson('/admin/goods_pay_rate', param, rootUrl).then(res => {
      return res;
    });
  };
  //添加审核人员列表
  addSaler(param){
    return http.postJson("/sales/add_sale",param, rootUrl).then(res=>{
      return res;
    })
  };

  //删除审核人员列表
  deleteSaler(param){
    return http.postJson("/sales/del_sale",param, rootUrl).then(res=> {
      return res;
      })
    }
  //审核人员状态启用
   upd_sales_status(param){
     return http.postJson("/sales/upd_sales_status",param, rootUrl).then(res=> {
       return res;
     })
   }
  //审核人员详情
  salerDetail(param){
    return http.postJson("/sales/open_sale_detail",param, rootUrl).then(res=>{
      return res;
    })
  };
  //编辑详情
  editDetail(param){
    return http.postJson("/sales/edit_sale",param, rootUrl).then(res=>{
      return res;
    })
  };
  //改变用户状态
  changestatus(param){
    return http.postJson("/sales/upd_sales_status",param, rootUrl).then(res=>{
      return res;
    })
  };

  //查找店铺
 searchAuditShop(param){
    return http.postJson("/sales/get_shop_res",param, rootUrl).then(res=>{
      return res;
    })
  };
  /*//添加审核人员
  saleCheck(param){
    return http.postJson("/shop_core/sale_check",param, rootUrl).then(res=>{
      return res;
    })
  };*/
  //部门信息
  departmentgetuidtoarr(param) {
    return http.postJson('/department/getidtoarr', param, rootUrl).then(res => {
      return res;
    });
  };
  //删除部门
  getdepartmentidtodeldm(param) {
    return http.postJson('/department/getdepartmentidtodeldm', param, rootUrl).then(res => {
      return res;
    });
  };
  //锁定部门
  getdepartmentidtolocking(param) {
    return http.postJson('/department/getdepartmentidtolocking', param, rootUrl).then(res => {
      return res;
    });
  }
  //解锁部门
  getdepartmentidtounlock(param) {
    return http.postJson('/department/getdepartmentidtounlock', param, rootUrl).then(res => {
      return res;
    });
  }
  //条件查询部门
  getwheretoarr(param) {
    return http.postJson('/department/getwheretoarr', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取部门名和id
  getallidname(param) {
    return http.postJson('/department/getallidname', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取用户
  usergetuidtoarr(param) {
    return http.postJson('/backstageuser/getuidtoarr', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除用户
  getuidtodeluser(param) {
    return http.postJson('/backstageuser/getuidtodeluser', param, rootUrl).then(res => {
      return res;
    });
  }
  //锁定用户
  getuidtolocking(param) {
    return http.postJson('/backstageuser/getuidtolocking', param, rootUrl).then(res => {
      return res;
    });
  }
  //解锁用户
  getuidtounlock(param) {
    return http.postJson('/backstageuser/getuidtounlock', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取角色
  rolegetidtoarr(param) {
    return http.postJson('/role/getidtoarr', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除角色
  getroleidtodelrole(param) {
    return http.postJson('/role/getroleidtodelrole', param, rootUrl).then(res => {
      return res;
    });
  }
  //锁定角色
  getroleidtolocking(param) {
    return http.postJson('/role/getroleidtolocking', param, rootUrl).then(res => {
      return res;
    });
  }
  //解锁角色
  getroleidtounlock(param) {
    return http.postJson('/role/getroleidtounlock', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取角色名和id
  getallroleidname(param) {
    return http.postJson('/role/getallroleidname', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取权限列表-新-何
  getActionList(param) {
    return http.postJson('/jurisdiction/actionlist ', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除权限-新-何
  delJurisdiction(param) {
    return http.postJson('/jurisdiction/deljurisdiction', param, rootUrl).then(res => {
      return res;
    });
  }
  //编辑查询详情权限-新-何
  getJurisdictionDetail(param) {
    return http.postJson('/jurisdiction/msgroute', param, rootUrl).then(res => {
      return res;
    });
  }
  //编辑权限-新-何
  updateJurisdiction(param) {
    return http.postJson('/jurisdiction/editroute', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取角色列表-新-何
  getDepartmentList(param) {
    return http.postJson('/jurisdiction/departmentlist ', param, rootUrl).then(res => {
      return res;
    });
  }
  // 修改查询角色列表-新-何
  getListDetail(param) {
    return http.postJson('/jurisdiction/msglist', param, rootUrl).then(res => {
      return res;
    });
  }
  // 修改角色列表-新-何
  updateList(param) {
    return http.postJson('/jurisdiction/uplist', param, rootUrl).then(res => {
      return res;
    });
  }
  // 绑定角色列表-新-何
  UserRole(param) {
    return http.postJson('/jurisdiction/userrole', param, rootUrl).then(res => {
      return res;
    });
  }
  // 添加用户-新-何
  AddRole(param) {
    return http.postJson('/jurisdiction/addrole', param, rootUrl).then(res => {
      return res;
    });
  }
  // 修改用户-新-何
  UpdateRole(param) {
    return http.postJson('/jurisdiction/useruprole', param, rootUrl).then(res => {
      return res;
    });
  }
  // 删除用户-新-何
  AdminDel(param) {
    return http.postJson('/jurisdiction/admindel', param, rootUrl).then(res => {
      return res;
    });
  }
  // 添加权限-控制器-新-何
  NewAddJurisdiction(param) {
    return http.postJson('/jurisdiction/newaddjurisdiction', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取权限列表
  jurisdictiongetidtoarr(param) {
    return http.postJson('/jurisdiction/getidtoarr', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除权限
  getjurisdictionidtodeldm(param) {
    return http.postJson('/jurisdiction/getjurisdictionidtodeldm', param, rootUrl).then(res => {
      return res;
    });
  }
  //解锁权限
  getjurisdictionidtounlock(param) {
    return http.postJson('/jurisdiction/getjurisdictionidtounlock', param, rootUrl).then(res => {
      return res;
    });
  }
  //锁定权限
  getjurisdictionidtolocking(param) {
    return http.postJson('/jurisdiction/getjurisdictionidtolocking', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取部门所有一级部门
  getparentdepartment(param) {
    return http.postJson('/department/getparentdepartment', param, rootUrl).then(res => {
      return res;
    });
  }
  //部门添加
  setarrtodepartment(param) {
    return http.postJson('/department/setarrtodepartment', param, rootUrl).then(res => {
      return res;
    });
  }

  //获取所有权限名称
  jurisdictiongetallname(param) {
    return http.postJson('/jurisdiction/getallname', param, rootUrl).then(res => {
      return res;
    });
  }
  //添加角色
  setarrtoderole(param) {
    return http.postJson('/role/setarrtoderole', param, rootUrl).then(res => {
      return res;
    });
  }
  //添加权限
  setarrtojurisdiction(param) {
    return http.postJson('/jurisdiction/setarrtojurisdiction', param, rootUrl).then(res => {
      return res;
    });
  }
  //用户添加
  useradd(param) {
    return http.postJson('/backstageuser/useradd', param, rootUrl).then(res => {
      return res;
    });
  }
  //部门修改
	uparrtodepartment(param) {
		return http.postJson('/department/uparrtodepartment', param, rootUrl).then(res => {
			return res;
		});
	}
	//获取角色对应的权限
	getroleidtojname(param) {
		return http.postJson('/role/getroleidtojname', param, rootUrl).then(res => {
			return res;
		});
	}
	//获取角色对应的权限
	uparrtoderole(param) {
		return http.postJson('/role/uparrtoderole', param, rootUrl).then(res => {
			return res;
		});
	}
	//添加新权限
	uparrtoderole(param) {
		return http.postJson('/jurisdiction/newaddjurisdiction', param, rootUrl).then(res => {
			return res;
		});
	}
	//用户修改
	userupdate(param) {
		return http.postJson('/backstageuser/userupdate', param, rootUrl).then(res => {
			return res;
		});
	}
	//用户日志
	loggetuidtoarr(param) {
		return http.postJson('/backstageusertoken/getuidtoarr', param, rootUrl).then(res => {
			return res;
		});
	}
  // //用户-用户列表-用户日志
  loginJournal(param) {
    return http.postJson('/backstageuser/login_journal', param, rootUrl).then(res => {
      return res;
    });
  }
	//获取前台用户信息
	qusergetuidtoarr(param) {
		return http.postJson('/user/user_list', param, rootUrl).then(res => {
			return res;
		});
	}
	//用户高级查询
  user_heightsearch(param) {
    return http.postJson('/user/height_search', param, rootUrl).then(res => {
      return res;
    });
  }
	//查找前台用户信息
  searchuseroarr(param) {
    return http.postJson('/user/searchUser', param, rootUrl).then(res => {
      return res;
    });
  }
  //查找个人用户
  searone(param) {
    return http.postJson('/user/getonefind', param, rootUrl).then(res => {
      return res;
    });
  }
	//删除前台用户信息
	qgetuidtodeluser(param) {
		return http.postJson('/user/getuidtodeluser', param, rootUrl).then(res => {
			return res;
		});
	}
	//获取用户收货地址
	getuidtoAddress(param) {
		return http.postJson('/receiverAddress/getuidtoAddress', param, rootUrl).then(res => {
			return res;
		});
	}
	//获取用户订单
	getOrderList(param) {
		return http.postJson('/customerOrder/getOrderList', param, rootUrl).then(res => {
			return res;
		});
	}
	//获取订单详情
  getOrderInfo(param) {
    return http.postJson('/customerOrder/ordermsg', param, rootUrl).then(res => {
      return res;
    });
  }
  // 判断订单的按钮
  getJudgeButton(param) {
    return http.postJson('/customerOrder/check_orderstyle', param, rootUrl).then(res => {
      return res;
    });
  }
  //批量删除
  delOrder(param) {
    return http.postJson('/customerOrder/delete', param, rootUrl).then(res => {
      return res;
    });
  }
  //取消订单
  updateOrder(param) {
    return http.postJson('/customerOrder/updateOrder', param, rootUrl).then(res => {
      return res;
    });
  }
  //马上发货-按钮获取子订单遍历
  sendOut(param) {
    return http.postJson('/customerOrder/serachord', param, rootUrl).then(res => {
      return res;
    });
  }
  //生成发货单
  addInvoice(param) {
    return http.postJson('/customerOrder/adddispatch', param, rootUrl).then(res => {
      return res;
    });
  }
  //物流信息录入--传值编号，获取物流公司
  getExpress(param) {
    return http.postJson('/customerOrder/codeexpress', param, rootUrl).then(res => {
      return res;
    });
  }
  //物流信息录入--供应商
  addExpressSupplier(param){
    return http.postJson('/customerOrder/addexpress', param, rootUrl).then(res => {
      return res;
    });
  }
  //物流信息录入
  addExpress(param){
    return http.postJson('/customerOrder/eorderSend', param, rootUrl).then(res => {
      return res;
    });
  }
		//获取用户订单
	quserupdate(param) {
		return http.postJson('/user/userupdate', param, rootUrl).then(res => {
			return res;
		});
	}
	//更改用户状态
 update_userStatu(param) {
    return http.postJson('/user/upstatus  ', param, rootUrl).then(res => {
      return res;
    });
  }
	//获取用户信息
  somedate(param) {
    return http.postJson('/user/getusermsg', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取头像
  getowndate(param) {
    return http.postJson('/user/getadmin', param, rootUrl).then(res => {
      return res;
    });
  }
	//发送系统消息
	SendSystemMessages(param) {
		return http.postJson('/news/sendnews', param, rootUrl).then(res => {
			return res;
		});
	}
	 	//获取商品
	getCommodity(param) {
		return http.postJson('/commodity/getonlineCommodity', param, rootUrl).then(res => {
			return res;
		});
	}
		//获取商品分类
	getClassifyGroup(param) {
		return http.postJson('/commodity/getCat', param, rootUrl).then(res => {
			return res;
		});
	}

	//获取sku_res值
  getSkuRess(param) {
    return http.postJson('/commodity/get_sku_id', param, rootUrl).then(res => {
      return res;
    });
  }
  // 获取总体sku
  //获取规格id
  getSepcId(param) {
    return http.postJson('/shop_core/get_sku_id', param, rootUrl).then(res => {
      return res;
    });
  }
  //发布商品
  addGoods(param){
    return http.postJson('/admin/add_goods', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品规格类型
  getSkuRes(param){
    return http.postJson('/commodity/get_sku_res', param, rootUrl).then(res => {
      return res;
    });
  }

  //添加、修改sku_res值
  editAddSkuId(param) {
    return http.postJson('/commodity/upd_sku_id', param, rootUrl).then(res => {
      return res;
    });
  }

  //修改页面  获取规格参数
  getGuiGe(param) {
    return http.postJson('/commodity/open_add_sku_res', param, rootUrl).then(res => {
      return res;
    });
  }

  ////修改页面  添加规格参数提交
  getSkuResAdd(param) {
      return http.postJson('/commodity/get_sku_res_add', param, rootUrl).then(res => {
        return res;
      });
    }

	//打开商品编辑页面
  editShop(param) {
    return http.postJson('/commodity/open_edit_goods', param, rootUrl).then(res => {
      return res;
    });
  }
  //打开商品修改页面
  openGoods(param) {
    return http.postJson('/admin/open_edit_goods', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除规格
  deletegoodssku(param) {
    return http.postJson('/admin/del_sku_res', param, rootUrl).then(res => {
      return res;
    });
  }
  //打开修改
  editGoods(param) {
    return http.postJson('/admin/edit_goods', param, rootUrl).then(res => {
      return res;
    });
  }

  //商品编辑页面   删除规格参数
  delSpecifications(param){
    return http.postJson('/commodity/del_sku_id', param, rootUrl).then(res => {
      return res;
    });
  }

  //商品编辑后提交
  submitShop(param) {
    return http.postJson('/commodity/editGoods', param, rootUrl).then(res => {
      return res;
    });
  }

//商品添加页面   获取一级、二级商品目录
  fabuShop(param){
    return http.postJson('/commodity/openAddGoods', param, rootUrl).then(res => {
      return res;
    });
  }
//获取选中二级目录时，得到的规格
  getTwoGuiGe(param) {
    return http.postJson('/commodity/open_add_goods', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品新增后提交
  addShop(param) {
    return http.postJson('/commodity/addGoods', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取一级和二级分类目录
  getOneTwoFenLei(param) {
    return http.postJson('/commodity/get_cat_res', param, rootUrl).then(res => {
      return res;
    });
  }
  //增加商品分类
  addClassifyGroup(param) {
    return http.postJson('/commodity/addGoodsCategory', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取需要修改商品分类的信息
  getsClassifyGroup(param) {
    return http.postJson('/commodity/open_edit_category', param, rootUrl).then(res => {
      return res;
    });
  }
  //提交修改商品分类的信息
  editClassifyGroup(param) {
    return http.postJson('/commodity/edit_category', param, rootUrl).then(res => {
      return res;
    });
  }
//编辑商品字段
  editcat_type(param) {
    return http.postJson('/commodity/edit_cat_type', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除品类字段值
 delcat_type(param) {
    return http.postJson('/commodity/del_cat_type_val', param, rootUrl).then(res => {
      return res;
    });
  }
//删除整个品类
  delcat_typename(param) {
    return http.postJson('/commodity/del_cat_type', param, rootUrl).then(res => {
      return res;
    });
  }
  //配送费模板
  DistributionFeeMuBan(param) {
    return http.postJson('/delivery/getDeliveryTemplate', param, rootUrl).then(res => {
      return res;
    });
  }
  //改变排序
  changeList(param){
    return http.postJson('/commodity/setCatSort', param, rootUrl).then(res => {
      return res;
    });
  }
//商品分类
  getGoods(param){
    return http.postJson('/commodity/getGoods', param, rootUrl).then(res => {
      return res;
    });
  }

  //商品分类获取规格
  getGoodssku(param){
    return http.postJson('/commodity/sellinggoods_edit', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品编辑规格
  changeGoodssku(param){
    return http.postJson('/commodity/sellinggoods_edit', param, rootUrl).then(res => {
      return res;
    });
  }

  // 删除商品分类
  delClassification(param){
    return http.postJson('/commodity/delCategory', param, rootUrl).then(res => {
      return res;
    });
  }
  //查找商品
  searchGoods(param){
    return http.postJson('/commodity/searchCategory', param, rootUrl).then(res => {
      return res;
    });
  }
  //查找商品名称
  searGoods(param){
    return http.postJson('/commodity/searchGoods', param, rootUrl).then(res => {
      return res;
    });
  }
  //更改产品状态

  updateGoods(param){
    return http.postJson('/commodity/updGoods', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品审核列表
  audit_list(param){
    return http.postJson('/commodity/auditlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //查看商品详情
  goodsDetail(param){
    return http.postJson('/commodity/auditmsg', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品审核
  audit_up(param){
    return http.postJson('/commodity/audit', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品问答
  answerlist(param){
    return http.postJson('/answers/lists', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除商品问答
  deleteanser(param){
    return http.postJson('/answers/ansdel', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除和商品提问
  deleteQuestion(param){
    return http.postJson('/answers/del_ask_answer', param, rootUrl).then(res => {
      return res;
    });
  }
  //商品提问的显示与隐藏
  displayQuestion(param){
    return http.postJson('/answers/show_ask', param, rootUrl).then(res => {
      return res;
    });
  }
	//订单设置
  orderSetting(param){
    return http.postJson('/customerOrder/getOrderSetList', param, rootUrl).then(res => {
      return res;
    });
  }
  // 提交订单设置
  getorderSetting(param){
    return http.postJson('/customerOrder/getOrderSet', param, rootUrl).then(res => {
      return res;
    });
  }
	//下架
	soldOut(param) {
		return http.postJson('/commodity/soldOut', param, rootUrl).then(res => {
			return res;
		});
	}
  //删除商品
  delOut(param) {
    return http.postJson('/commodity/delGoods', param, rootUrl).then(res => {
      return res;
    });
  }
	//获取所有二级分类下的商品
	getchildtypem(param) {
		return http.postJson('/commodity/getchildtypem', param, rootUrl).then(res => {
			return res;
		});
	}

		//获取运费模板
	getDeliveryTemplate(param) {
		return http.postJson('/delivery/getDeliveryTemplate', param, rootUrl).then(res => {
			return res;
		});
	}
  //获取待修改运费模板
  getupdateDeliveryTemplate(param) {
    return http.postJson('/delivery/edit_temp', param, rootUrl).then(res => {
      return res;
    });
  }
  //修改运费模板
  updateDeliveryTemplate(param) {
    return http.postJson('/delivery/edit_temp_res', param, rootUrl).then(res => {
      return res;
    });
  }

}
//购物车
export class api_cart {
}

//活动
export class api_active {
  //添加团购
  addGroup (param){
    return http.postJson('/activity/addGroupPurchase', param, rootUrl).then(res => {
      return res;
    });
  }

  //添加满减优惠
  discount(param){
    return http.postJson('/reduction/addhotlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //优惠列表
  activeList(param){
    return http.postJson('/reduction/listhotlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除活动
  deleteActive(param){
    return http.postJson('/reduction/delhotlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //查看活动
 getDataActive(param){
    return http.postJson('/reduction/serachhotlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //编辑活动
  editActive(param){
    return http.postJson('/reduction/uphotlist', param, rootUrl).then(res => {
      return res;
    });
  }
  getgoodslimt(param){
    return http.postJson('/commodity/flashsale_list', param, rootUrl).then(res => {
      return res;
    });
  }


  changegoodslimt(param){
    return http.postJson('/commodity/flashsale_change', param, rootUrl).then(res => {
      return res;
    });
  }
  getgoodsoplist(param){
    return http.postJson('/commodity/flashsale_addshow', param, rootUrl).then(res => {
      return res;
    });
  }
  getgoodsprice(param){
    return http.postJson('/commodity/flashsale_sku', param, rootUrl).then(res => {
      return res;
    });
  }

  fullgoodsprice(param){
    return http.postJson('/reduction/manjianmsg', param, rootUrl).then(res => {
      return res;
    });
  }
  fullchangeprice(param){
    return http.postJson('/reduction/manjianup', param, rootUrl).then(res => {
      return res;
    });
  }

  goodschange(param){
    return http.postJson('/commodity/flashsale_change', param, rootUrl).then(res => {
      return res;
    });
  }

  changeactive(param){
    return http.postJson('/commodity/flashsale_change', param, rootUrl).then(res => {
      return res;
    });
  }
  deleteactive(param){
    return http.postJson('/commodity/flashsale_edit', param, rootUrl).then(res => {
      return res;
    });
  }
  sortgoods(param){
    return http.postJson('/commodity/flashsale_sort', param, rootUrl).then(res => {
      return res;
    });
  }

  fullgoodslist(param){
    return http.postJson('/reduction/manjianlist', param, rootUrl).then(res => {
      return res;
    });
  }
  fullchoosegoodslist(param){
    return http.postJson('/reduction/goodslist', param, rootUrl).then(res => {
      return res;
    });
  }
  fullchooseactive(param){
    return http.postJson('/reduction/reductionlist', param, rootUrl).then(res => {
      return res;
    });
  }
  fulladdactive(param){
    return http.postJson('/reduction/dispose', param, rootUrl).then(res => {
      return res;
    });
  }
  fullchangetime(param){
    return http.postJson('/reduction/manjianup', param, rootUrl).then(res => {
      return res;
    });
  }
  fulldeletegoods(param){
    return http.postJson('/reduction/manjiandel', param, rootUrl).then(res => {
      return res;
    });
  }
  //查商品详情--sku
  getGroupSku (param){
    return http.postJson('/activity/groupsku', param, rootUrl).then(res => {
      return res;
    });
  }
  //查看团购
  getGroupList (param){
    return http.postJson('/activity/orderlist', param, rootUrl).then(res => {
      return res;
    });
  }
  //检测团购
  checkGroup (param){
    return http.postJson('/activity/verification', param, rootUrl).then(res => {
      return res;
    });
  }
  //团购排序
  updateSort (param){
    return http.postJson('/activity/upsort', param, rootUrl).then(res => {
      return res;
    });
  }
  //删除
  delGroup (param){
    return http.postJson('/activity/delgroup', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取商品分类列表
  getCategory (param){
    return http.postJson('/activity/category', param, rootUrl).then(res => {
      return res;
    });
  }
  //获取商品评价列表
  getEvaluate (param){
    return http.postJson('/assess/assess_list', param, rootUrl).then(res => {
      return res;
    });
  }
  //查询团购的商品列表
  searchShopping (param){
    return http.postJson('/activity/searchshopping', param, rootUrl).then(res => {
      return res;
    });
  }
  //查询待修改的团购商品
  getGroup (param){
    return http.postJson('/activity/getgroup', param, rootUrl).then(res => {
      return res;
    });
  }
  //修改的团购商品
  upGroupPurchase (param){
    return http.postJson('/activity/upgrouppurchase', param, rootUrl).then(res => {
      return res;
    });
  }
}
//订单
export class api_order {
  // 单据管理收款单
  documentManagement_Receivables(param){
    return http.postJson('/documnets/list', param, rootUrl).then(res => {
      return res;
    });
  }
  // 发货单-12.5修改
  getInvoice(param){
    return http.postJson('/orderexcel/order_excel', param, rootUrl).then(res => {
      return res;
    });
  }
  // 单据管理收款单删除以及批量删除
  documentManagement_Receivablesdel(param){
    return http.postJson('/documnets/delete', param, rootUrl).then(res => {
      return res;
    });
  }
  // 单据管理收款单查看详情
  documentManagement_ViewTheDetails(param){
    return http.postJson('/documnets/msg', param, rootUrl).then(res => {
      return res;
    });
  }
  // 单据管理发货单-修改地址
  editAddress(param){
    return http.postJson('/documnets/address_edit', param, rootUrl).then(res => {
      return res;
    });
  }
  // 导出数据表格
  documentManagement_exportDatas(param){
    return http.get('/documnets/inputexcel', param, rootUrl).then(res => {
      return res;
    });
  }
  // 获取物流信息
  logisticsTrack(param){
    return http.postJson('/logistics/logisticsTrack', param, rootUrl).then(res => {
      return res;
    });
  }
  // 新增运费模板
  addnewFreightformwork(param){
    return http.postJson('/delivery/addTemplate', param, rootUrl).then(res => {
      return res;
    });
  }
  // 删除运费模板
  delFreightformwork(param){
    return http.postJson('/delivery/delSendTemp', param, rootUrl).then(res => {
      return res;
    });
  }
  // 根据模板名称查询
  searchSendTemp(param){
    return http.postJson('/delivery/searchSendTemp', param, rootUrl).then(res => {
      return res;
    });
  }
}
export class api_finance{
  //商城综合统计
  getZongHe(param){
    return http.postJson('/finance/finance', param, rootUrl).then(res => {
      return res;
    });
  }
  // 对账列表
  getAccountListData(param){
    return http.postJson('/finance/finance_list', param, rootUrl).then(res => {
      return res;
    });
  }
  // 查看详情
  viewTheDetails(param){
    return http.postJson('/finance/finance_detail', param, rootUrl).then(res => {
      return res;
    });
  }  // 搜索
  financeRemark(param){
    return http.postJson('/finance/searchFinanceList ', param, rootUrl).then(res => {
      return res;
    });
  }
  //冲正处理
  finance_Remark(param){
    return http.postJson('/finance/financeRemark ', param, rootUrl).then(res => {
      return res;
    });
  }
  //对账列表高级检索
  searchHeightview(param){
    return http.postJson('/finance/finance_height_search', param, rootUrl).then(res => {
      return res;
    });
  }
  //对账列表批量
  batch(param){
    return http.postJson('/finance/upd_finList', param, rootUrl).then(res => {
      return res;
    });
  }
  //对账列表排序
  sortBatch(param){
    return http.postJson('/finance/finance_sort', param, rootUrl).then(res => {
      return res;
    });
  }
  //微信对账列表
  getAcountList(param){
    return http.postJson('/finance/weChat_list', param, rootUrl).then(res => {
      return res;
    });
  }
  //微信对账列表详情
  getAcountListDetail(param){
    return http.postJson('/finance/weChat_detail', param, rootUrl).then(res => {
      return res;
    });
  }
  //微信对账单查找
  searchAcountList(param){
    return http.postJson('/finance/searchFinance', param, rootUrl).then(res => {
      return res;
    });
  }
  //状态列表
  getstatusList(param){
    return http.postJson('/finance/wx_status', param, rootUrl).then(res => {
      return res;
    });
  }
  //微信对账高级查找
searchHeightWx(param){
  return http.postJson('/finance/height_search', param, rootUrl).then(res => {
    return res;
     });
   }
  // 分销提现列表
  getCashList(param){
    return http.postJson('/embody/cashList', param, rootUrl).then(res => {
      return res;
    });
  }
  // 通过或拒绝提现列表
  cashExamine(param){
    return http.postJson('/embody/cashExamine', param, rootUrl).then(res => {
      return res;
    });
  }
  // 更改提现打款与否
  cashChange(param){
    return http.postJson('/embody/cashChange', param, rootUrl).then(res => {
      return res;
    });
  }
}
//库存
export class api_Invertory{
  //所有库存
  allStockRes(param){
    return http.postJson("/StockSystemRes/all_stock_res",param, rootUrl).then(res=>{
      return res;
    })
  };
  //出库接口
  OutOfTheTreasuryStockRes(param){
    return http.postJson("/StockSystemRes/get_send_stock",param, rootUrl).then(res=>{
      return res;
    })
  };
  //入库接口
  WarehousingStockResold(param){
    return http.postJson("/StockSystemRes/get_add_stock",param, rootUrl).then(res=>{
      return res;
    })
  };
  WarehousingStockRes(param){
    return http.postJson("/StockSystemRes/stock_list",param, rootUrl).then(res=>{
      return res;
    })
  };
  //获得操作人员接口
  getPeople(param){
    return http.postJson("/StockSystemRes/get_admin",param, rootUrl).then(res=>{
      return res;
    })
  };
  //查询库存
  searchStockResold(param){
    return http.postJson("/StockSystemRes/searchStk",param, rootUrl).then(res=>{
      return res;
    })
  };
  searchStockRes(param){
    return http.postJson("/StockSystemRes/stock_list",param, rootUrl).then(res=>{
      return res;
    })
  };
  //高级查询
  HeightSearchold(param){
    return http.postJson('/StockSystemRes/height_search', param, rootUrl).then(res => {
      return res;
    });
  }
  HeightSearch(param){
    return http.postJson('/StockSystemRes/stock_list', param, rootUrl).then(res => {
      return res;
    });
  }
  //降序、升序
  stockSort(param){
    return http.postJson("/StockSystemRes/stock_sort",param, rootUrl).then(res=>{
      return res;
    })
  };
  //删除选中的库存数据
  delStockRes(param){
    return http.postJson("/StockSystemRes/del_stock_system",param, rootUrl).then(res=>{
      return res;
    })
  }
}
//聊天
export class api_Chat{
  //聊天列表
  allChatList(param){
    return http.postJson("/messagesocket/msglist",param, rootUrl).then(res=>{
      return res;
    })
  };
  //聊天列表的删除
  delChatList(param){
    return http.postJson("/messagesocket/msgdel",param, rootUrl).then(res=>{
      return res;
    })
  };
  //聊天列表-内容
  getChatContent(param){
    return http.postJson("/messagesocket/content",param, rootUrl).then(res=>{
      return res;
    })
  };
  //聊天列表-判断是否有新消息
  hMsgCount(param){
    return http.postJson("/messagesocket/hmsgcount",param, rootUrl).then(res=>{
      return res;
    })
  };
  //聊天-1-发送
  sendChatContent(param){
    return http.postJson("/messagesocket/send",param, rootUrl).then(res=>{
      return res;
    })
  };
  //聊天-2-发送
  bindChatContent(param){
    return http.postJson("/messagesocket/bind",param, rootUrl).then(res=>{
      return res;
    })
  };
    // 商户聊天
  shopsocketList(param){
    return http.postJson("/shopsocket/msglist",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户聊天列表删除
  shopsocketmsgdel(param){
    return http.postJson("/shopsocket/msgdel",param, rootUrl).then(res=>{
      return res;
    })
  };
  //商户聊天列表置顶
  shopstick(param){
    return http.postJson("/shopsocket/stick",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户聊天详情
  getshopcontent(param){
    return http.postJson("/shopsocket/content",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户聊天详情回复
  getshopsend(param){
    return http.postJson("/shopsocket/send",param, rootUrl).then(res=>{
      return res;
    })
  };
// 客服意见列表
  suggest_index(param){
    return http.postJson("/admin/suggest_index",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 客服意见列表删除
  del_suggest(param){
    return http.postJson("/admin/del_suggest",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 客服意见列表详情
  open_problem(param){
    return http.postJson("/admin/open_problem",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 客服意见回复
  reply(param){
    return http.postJson("/admin/reply",param, rootUrl).then(res=>{
      return res;
    })
  };
}
//评价
export class evaluate{
  //查看分类
  get_cat_assess(param){
    return http.postJson("/assess/open_cat_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //搜索评价
  search_assess(param){
    return http.postJson("/assess/search_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //评价排序
  sort_assess(param){
    return http.postJson("/assess/assess_sort",param, rootUrl).then(res=>{
      return res;
    })
  }
  //是否显示评价
  xianshi_assess(param){
    return http.postJson("/assess/show_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //是否批量显示评价
  xianshi_Allassess(param){
    return http.postJson("/assess/batch_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //评价详情
  evalu_detail(param){
    return http.postJson("/assess/assess_detail",param, rootUrl).then(res=>{
      return res;
    })
  }
  //问答详情
  answerDetail(param){
    return http.postJson("/answers/listsmsg",param, rootUrl).then(res=>{
      return res;
    })
  }
  //回复的隐藏与现实
  cal_answer(param){
    return http.postJson("/answers/msgconceal",param, rootUrl).then(res=>{
      return res;
    })
  }
  //删除回复
  del_answer(param){
    return http.postJson("/answers/msgdel",param, rootUrl).then(res=>{
      return res;
    })
  }
  //删除评价
  del_eva(param){
    return http.postJson("/assess/del_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //回复
  evalu_apply(param){
    return http.postJson("/assess/reply_assess",param, rootUrl).then(res=>{
      return res;
    })
  }
  //隐藏回复
  yi_apply(param){
    return http.postJson("/assess/hid_reply",param, rootUrl).then(res=>{
      return res;
    })
  }
  //删除回复
  del_apply(param){
    return http.postJson("/assess/del_reply",param, rootUrl).then(res=>{
      return res;
    })
  }
}
// 分销
export class distribution {
  // 分销-分销设置
  setDistribution(param){
    return http.postJson("/admin/distributor_set",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-获取分销信息
  getDistribution(param){
    return http.postJson("/admin/distributor_info",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-获取分销管理
  getDistributionManage(param){
    return http.postJson("/admin/distributorer_manage",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-删除分销管理
  delDistributionManage(param){
    return http.postJson("/admin/distributorer_delete",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-改变分销管理状态
  changeDistributionManage(param){
    return http.postJson("/admin/change_status",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-、查看分销管理
  infoDistributionManage(param){
    return http.postJson("/admin/distributorer_info",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-查看分销管理-佣金明细
  getDistributionManageCommission(param){
    return http.postJson("/admin/commission_detail",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-查看分销管理-佣金明细下线详情
  getDistributionManageSub(param){
    return http.postJson("/admin/sub_detail",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 分销-历史订单分销管理
  orderDistributionManage(param){
    return http.postJson("/admin/order_history",param, rootUrl).then(res=>{
      return res;
    })
  };
}

// 商户管理
export class business {
  // 商户-商户增加
  addBusiness(param){
    return http.postJson("/business/business_add",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表
  listBusiness(param){
    return http.postJson("/business/business_list",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表删除
  delBusiness(param){
    return http.postJson("/business/business_delete",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表修改状态
  updateBusiness(param){
    return http.postJson("/business/change_status",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表信息
  infoBusiness(param){
    return http.postJson("/business/business_detail",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表信息-修改
  editBusiness(param){
    return http.postJson("/business/business_edit",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表信息-修改
  delGoodsBusiness(param){
    return http.postJson("/business/goods_delete",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表详情中的经营数据
  dateBusiness(param){
    return http.postJson("/business/business_management",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 商户-商户列表详情中的经营数据绑定数据
  bindBusiness(param){
    return http.postJson("/business/business_bindgoods",param, rootUrl).then(res=>{
      return res;
    })
  };
}

// 供应商管理
export class supplier {
  // 供应商-供应商增加或修改
  editSupplier(param){
    return http.postJson("/supplier/edit",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 供应商-绑定商品列表
  suppliergoods_list(param){
    return http.postJson("/supplier/goods_list",param, rootUrl).then(res=>{
      return res;
    })
  };// 供应商-列表
  supplier_list(param){
    return http.postJson("/supplier/supplier_list",param, rootUrl).then(res=>{
      return res;
    })
  };// 删除供应商-列表
  supplier_delete(param){
    return http.postJson("/supplier/supplier_delete",param, rootUrl).then(res=>{
      return res;
    })
  };// 查看供应商-列表
  supplier_info(param){
    return http.postJson("/supplier/info",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 查看供应商-启用停用
  supplier_status(param){
    return http.postJson("/supplier/supplier_status",param, rootUrl).then(res=>{
      return res;
    })
  };
  // 查看供应商-绑定商品
  goods_edit(param){
    return http.postJson("/supplier/goods_edit",param, rootUrl).then(res=>{
      return res;
    })
  };
}
