<template>
	<div class="userlist_backgruad">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
			<el-breadcrumb-item>列表</el-breadcrumb-item>
		</el-breadcrumb>

			<div class="user_list">
					<!--筛选查询
					<el-button>查询结果</el-button>
					<el-button>高级检索</el-button>-->
				<el-card class="box-card">
					<div slot="header" class="userlist_clearfix">
						<span style="float: left; font-size: 22px;">筛选查询</span>
						<el-button style="float: right;"  @click="chaxun()">查询结果</el-button>
            <el-button style="float: right;margin-right: 20px;" @click="dialogTableVisible">高级检索</el-button>
					</div>
          <el-dialog title="高级检索" :visible.sync="dialogTableVisibles">
            <div class="chunk">
              <span style="margin-right: 6px">用户账号</span>
              <el-input clearable placeholder="用户ID/账号" style="width: 217px" v-model="yhzh" ></el-input>

              <span style="margin-left: 18px;margin-right: 6px">用户昵称</span>
              <el-input clearable placeholder="用户昵称" style="width: 217px" v-model="yhnc"></el-input>
            </div>
            <div class="chunk" style="margin: 20px auto">
              <span style="margin-right: 6px">用户来源</span>

              <el-select v-model="yhly_item" clearable placeholder="全部">
                <el-option
                  v-for="(item,index) in yhly"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span style="margin-left: 18px;margin-right: 6px">用户等级</span>
              <el-select v-model="yhdj_item" clearable placeholder="全部">
                <el-option
                  v-for="(item,index) in yhdj"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="chunk" style="margin: 20px auto">
              <span style="margin-right: 6px">用户标签</span>

              <el-select v-model="yhbq_item" clearable placeholder="全部">
                <el-option
                  v-for="(item,index) in yhbq"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span style="margin-left: 18px;margin-right: 6px">注册时间</span>
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="datevalue2"
                type="date"
                placeholder="注册时间">
              </el-date-picker>
            </div>
            <div class="chunk_foot" style="margin-top: 20px;margin-left: 70px">

              <el-button type="primary" style=" width: 100px" @click="reset_search">重置</el-button>
              <el-button type="primary" style="width: 100px" @click="start_search">开始检索</el-button>

            </div>
          </el-dialog>
					<div class="userlist_1">
						<el-form :inline="true" :model="formInline" >
						  <el-form-item label="用户账号：">
						    <el-input v-model="formInline.phone" placeholder="用户账号："></el-input>
						  </el-form-item>
						   <el-form-item label="用户昵称：">
						    <el-input v-model="formInline.nickname" placeholder="用户昵称："></el-input>
						  </el-form-item>
						  <el-form-item label="注册时间 :">
							    <el-date-picker
							    value-format="yyyy-MM-dd"
						    	v-model="formInline.registertime"
						    	type="date"
						    	placeholder="注册时间">
								</el-date-picker>
						  </el-form-item>
						</el-form>
					</div>
				</el-card>
			</div>
 <hr />
			<!--数据列表-->
			<div>
					<!--筛选查询
					<el-button>查询结果</el-button>
					<el-button>高级检索</el-button>-->

					<div slot="header" class="clearfix">
						<span style="width: 40%;float: left;">数据列表</span>
							<!--显示条数-->
							<div >
							<!--导入数据-->
							<div class="label">
								<el-popover
								  placement="right"
								  width="60%"
								  trigger="click">
							  	<el-card class="box-card">
								  	<!--<div slot="header" class="clearfix">-->
								    <!--<span>导入数据</span>-->
								    <!--<el-button style="float: right; padding: 3px 5px" type="text">导入</el-button>-->
								  	<!--</div>-->
									<div class="userlist_3" style="border-color: #333333">
										<el-upload
										  class="upload-demo"
										  name="file"
										  :action="upurl"
										  :headers = "header"
										  :on-preview="handlePreview"
										  :on-remove="handleRemove"
										  :before-remove="beforeRemove"
										  :on-success="upsuccess"
										  multiple
										  :limit="3"
										  :on-exceed="handleExceed"
										  :file-list="fileList">
										  <el-button size="small" type="primary">点击上传</el-button>
										  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
										</el-upload>
									</div>
								</el-card>

								<!--<el-button slot="reference" style="float: right;">导入数据</el-button>-->
								</el-popover>
                <el-tooltip class="item" effect="dark" content="请选择用户" placement="top">
                  <el-button style="float: right;" @click="dialogVisible = true">发送系统消息</el-button>
                </el-tooltip>

							</div>
						</div>

					</div>
					<!--用户详情列表-->
					<div class="userlist_3" style="border-color: #333333">
						<el-table ref="multipleTable" border :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55">
							</el-table-column>
							<el-table-column label="用户id" width="180">
								<template slot-scope="scope">{{ scope.row.id }}</template>
							</el-table-column>
							<el-table-column prop="phone" label="用户账号" width="200" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="nickname" label="用户昵称" width="200" show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="会员等级" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{/*user_dengji(scope.row.grade)*/ '暂无'}}</template>
							</el-table-column>

							<el-table-column label="消费金额" width="150" show-overflow-tooltip>
                <template slot-scope="scope">￥{{ scope.row.ord_money }}</template>
							</el-table-column>
							<el-table-column prop="ord_num" label="订单数量" width="200" show-overflow-tooltip>
							</el-table-column>


							<el-table-column label="账户状态" width="150" show-overflow-tooltip>
                <template slot-scope="scope">{{user_statu(scope.row.status)}}</template>
							</el-table-column>
								<el-table-column label="操作">
								      <template slot-scope="scope">
								      	<strong class="info"
								          @click="seeinfo(scope.row.id, scope.row)">查看</strong>
								        <strong class="update"
								          @click="handleEdit(scope.row.id, scope.row)">编辑</strong>
								        <!--<strong class="delete"
								          @click="handleDelete(scope.row.id, scope.row)">删除</strong>-->
								      </template>
						    </el-table-column>

						</el-table>
            <!--<div style="margin-top: 20px">
              <el-button size="mini" :disabled="selectDisabled" @click="allSelectStock(tableData3)">全选</el-button>
              <el-button size="mini" :disabled="clearDisabled" @click="CleatAllSelectStock(tableData3)">取消全选</el-button>
              <el-button size="mini" @click="allDelete(multipleSelection)">删除</el-button>
            </div>-->

						<div style="margin-top: 20px">
							<el-pagination
                v-if="paginationShow"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="countnum"
                :current-page="currentPage"
                :page-sizes="[10,20,30,40,50]"
                @prev-click="prevPages"
                @next-click="nextPages"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper">
							</el-pagination>
						</div>
					</div>

			</div>
		<template v-if="ok">
			 <!--//发送系统消息-->
	   <el-dialog title="发送系统消息" :visible.sync="dialogVisible" width="40%">
				<p>
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="news_content">
					</el-input>
				</p>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="sendnews">确 定</el-button>
  			</span>
		</el-dialog>
	</template>
	</div>
</template>

<script>
	import { requestLogin } from '@/api/api';
	import * as utils from "@/common/utils.js"
	import {api_user} from "@/api/api.js"
	let apiUser = new api_user();
	export default {
		data() {
			return {
        dialogTableVisibles:false,
        paginationShow:true,
        yhzh:'',
        yhnc:'',
        yhly_item:'',
        yhly:[],
        yhdj_item:'',
        yhdj:[
          {label:'黄金',value:1},
          {label:'铂金',value:2},
          {label:'钻石',value:3},
          {label:'星耀',value:4},
          {label:'王者',value:5},
        ],
        yhbq_item:'',
        yhbq:[],
        datevalue2:'',
				ok:true,
				fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
				//发送消息
				dialogVisible: false,
        isDisabled1:true,
				news_content:'',
				checkid:"",
				upurl:"http://shop_api.com/api/v1/user/daoru",
				header:{
					"token":utils.getCookie("__user_token__"),
				},
				fileList: [],
				//时间
				pagesize:10,
				countnum:0,
				userscurs:'用户来源',
				userlable:'用户标签',
				userleve:'用户等级',
//				推送内容
				activeName2: 'first',
				total: '0',
				currentPage: 1,
				multipleSelection: [],
//				推送表单
				 ruleForm: {
				 	desc:''
		  		 },
		        formInline: {
		          phone: '',
		          nickname: '',
		          registertime:''
		        },
        selectDisabled: false,
        clearDisabled: true, // 取消全选,
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				tableData3: [],
				multipleSelection: [],
        p_zhutimes:'',
        firstcheck:true,//初始化
        secondcheck:false,//点击搜索
        thirdcheck:false//高级检索
			}
		},
    mounted: function(){
      utils.setCookie("__user_token__","e7e576c082c66dabbb0e9fe3295f3263");
      let param={
        "page":this.currentPage,
        "limit":this.pagesize,
      };
      this.getuserlist(param);
    },
		methods: {
      // 点击高级检索弹出对话框
      dialogTableVisible:function(){

        let _this  =this
        _this.firstcheck=false
        _this.secondcheck=false
        _this.thirdcheck=true
        _this.dialogTableVisibles =true
      },
			toggleSelection(rows) {
				if(rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},//时间选择
			 getCity: function (city) {
			    console.log(city);
			    console.log(this.selectCity)
			 },
			 upsuccess() {
			 	this.$message("导入成功");
			 },
			 handleEdit(id) {
			 	this.$router.push({path:'/UserRedact',query:{id:id}});
			 },
      //发送消息
			 sendnews() {
			 	this.checkid=this.getcheckid();
			 	if(this.checkid.length==0){
          this.$message("请选择要发送的用户");
        }else {
          let param={
            uid:this.checkid,
            news_content:this.news_content
          }
          param = utils.filterJson(param);
          apiUser.SendSystemMessages(param).then(res => {
            console.log(res);
            if(res['cscode'] == '0') {
              this.ok=false;
               this.$message("发送成功");
               location.reload()
            }else{
              return this.$message(res['data']['msg']);
            }
          });
          console.log(param)
        }

			 },
    //详情
			 seeinfo(id) {
	 			this.$router.push({path:'/UserInfo',query:{id:id}});
			 },
      handleSelectionChange(val) {
        var _this = this;
        _this.multipleSelection = val;
        if (_this.multipleSelection.length < _this.tableData3.length) {
          _this.selectDisabled = false;
          _this.clearDisabled = true
        } else {
          _this.selectDisabled = true;
          _this.clearDisabled = false
        }
      },
			handleSizeChange(val) {
			  var _this=this
        this.pagesize = val;
			  if(_this.firstcheck){
          let param={
            page:1,
            limit:this.pagesize,
          };
          this.getuserlist(param);
        }
        if(_this.secondcheck){
          let param={
            page:1,
            limit:_this.pagesize,
            phone:_this.formInline.phone,
            nick_name:_this.formInline.nickname,
            time: _this.formInline.registertime,
          };
          _this.chaxun_bao(param)
        }
        if(_this.thirdcheck){
          let param={
            search:_this.yhzh,
            nick_name:_this.yhnc,
            time:_this.datevalue2,
            grade:_this.yhdj_item,
            page:1,
            limit:_this.pagesize,
          }
          _this.starch_bozhuang(param)
        }

				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
        var _this=this
        this.currentPage=val;
        if(_this.firstcheck){
          let param={
            page:this.currentPage,
            limit:this.pagesize,
          };
          this.getuserlist(param);
        }
        if(_this.secondcheck){
          let param={
            page:_this.currentPage,
            limit:_this.pagesize,
            phone:_this.formInline.phone,
            nick_name:_this.formInline.nickname,
            time: _this.formInline.registertime,
          };
          _this.chaxun_bao(param)
        }
        if(_this.thirdcheck){
          let param={
            search:_this.yhzh,
            nick_name:_this.yhnc,
            time:_this.datevalue2,
            grade:_this.yhdj_item,
            page:_this.currentPage,
            limit:_this.pagesize,
          }
          _this.starch_bozhuang(param)
        }

				console.log(`当前页: ${val}`);
			},
      //分页上一页
      prevPages(index){
			  var _this=this
        _this.currentPage=index
			  if(_this.firstcheck){
          let param = {
            page:this.currentPage,
            limit:this.pagesize,
          }
          this.getuserlist(param);
        }
        if(_this.secondcheck){
          let param={
            page:_this.currentPage,
            limit:_this.pagesize,
            phone:_this.formInline.phone,
            nick_name:_this.formInline.nickname,
            time: _this.formInline.registertime,
          };
          _this.chaxun_bao(param)
        }
        if(_this.thirdcheck){
          let param={
            search:_this.yhzh,
            nick_name:_this.yhnc,
            time:_this.datevalue2,
            grade:_this.yhdj_item,
            page:_this.currentPage,
            limit:_this.pagesize,
          }
          _this.starch_bozhuang(param)
        }
      },
      //分页下一页
      nextPages(index){
        var _this=this
        _this.currentPage=index
        if(_this.firstcheck){
          let param = {
            page:this.currentPage,
            limit:this.pagesize,
          }
          this.getuserlist(param);
        }
        if(_this.secondcheck){
          let param={
            page:_this.currentPage,
            limit:_this.pagesize,
            phone:_this.formInline.phone,
            nick_name:_this.formInline.nickname,
            time: _this.formInline.registertime,
          };
          _this.chaxun_bao(param)
        }
        if(_this.thirdcheck){
          let param={
            search:_this.yhzh,
            nick_name:_this.yhnc,
            time:_this.datevalue2,
            grade:_this.yhdj_item,
            page:_this.currentPage,
            limit:_this.pagesize,
          }
          _this.starch_bozhuang(param)
        }
      },

			handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //点击查询
			chaxun(){
			   var _this=this
        _this.firstcheck=false
        _this.secondcheck=true
        _this.thirdcheck=false
        if(this.formInline.phone=="" && this.formInline.nickname=="" && this.formInline.registertime==""){
          this.$message("请输入搜索条件")
        }else {
          let param={
            "page":1,
            "limit":this.pagesize,
            "phone":this.formInline.phone,
            "nick_name":this.formInline.nickname,
            "time": this.formInline.registertime,
          };
          _this.chaxun_bao(param)
          _this.paginationShow = false

          _this.handleCurrentChange(1)
          _this.$nextTick(function () {

            _this.paginationShow = true;

          })
        }

			},
      //查询包装
      chaxun_bao(param){
			   var _this=this
        apiUser.searchuseroarr(param).then(res=>{
          if(res.cscode==0){
            _this.$message(res.data.msg)
            _this.countnum=res.data.count
            _this.tableData3=res.data.data
          }else{
            _this.$message(res.data.msg)
            _this.$message.error(res['data']['msg']);
            _this.tableData3=res.data.data
          }
          console.log(res)
        })
      },
      getsearch(param){
        apiUser.qusergetuidtoarr(param).then(res => {
          console.log(res)
          this.tableData3 = res['data']['userinfo'];
          this.countnum = res['data']['countnum'];
        });
      },
			getuserlist(param) {
				console.log("aa")
        console.log(param)
				param = utils.filterJson(param);
				apiUser.qusergetuidtoarr(param).then(res => {
          console.log(res)
				  if(res.cscode==0){
            this.tableData3 = res['data']['data'];
            this.countnum = res['data']['count'];
          }
				});
			},//获取点击id
      //注册时间
      accounttime(val){
        /*if(val){
          this.accounttimes=Number(String(val.getTime()).slice(0,10))
        }*/
        console.log(this.accounttimes)
      },
      //高级检索
      start_search() {
        var _this = this
       /* _this.firstcheck = false
        _this.secondcheck = false
        _this.thirdcheck = true*/

        let param={
          search:_this.yhzh,
          nick_name:_this.yhnc,
          time:_this.datevalue2,
          grade:_this.yhdj_item,
          page:1,
          limit:_this.pagesize,
        }
        console.log(param)
        if (_this.yhzh == "" && _this.yhnc == "" && _this.yhly_item == "" && _this.yhdj_item == "" && _this.yhbq_item == "" && _this.datevalue2 == "") {
          _this.$message("请输入搜索条件")
        }else{
          //console.log(_this.datevalue2)
          apiUser. user_heightsearch(param).then(res => {
            if(res.cscode==0){
              _this.tableData3 = res['data']['data'];
              _this.countnum = res['data']['count'];
            }else {
              _this.$message(res.data.msg)
            }

            console.log(res)
          })
          _this.paginationShow = false

          _this.handleCurrentChange(1)
          _this.$nextTick(function () {

            _this.paginationShow = true;

          })
        }

        _this.dialogTableVisibles=false
      },

      starch_bozhuang(param){
			   var _this=this
        apiUser. user_heightsearch(param).then(res => {
          if(res.cscode==0){
            _this.tableData3 = res['data']['data'];
            _this.countnum = res['data']['count'];
          }else {
            _this.$message(res.data.msg)
          }

          console.log(res)
        })
      },
      //重置
      reset_search(){
        var _this=this
        _this.yhzh=""
        _this.yhnc=""
        _this.yhly_item=""
        _this.yhdj_item=""
        _this.yhbq_item=""
        _this.datevalue2=""

      },
			getcheckid(){
				let id="";
				 for(let element of this.multipleSelection){
		        		id+=element.id+",";
		          }
				 let new_id=id.substring(0,id.length-1);
				return new_id;
			},
      //用户状态
      user_statu(statu){
			   if(statu==0){
			     return '锁定'
         }
         if(statu==1){
           return '正常'
         }
      },
      //用户等级
      user_dengji(dengji){
			   if(dengji==1){
			     return '黄金'
         }
        if(dengji==2){
          return '铂金'
        }
        if(dengji==3){
          return '钻石'
        }
        if(dengji==4){
          return '星耀'
        }
        if(dengji==5){
          return '王者'
        }

      },
      //全选事件
      allSelectStock(rows) {

        var _this = this;
        _this.multipleSelection = rows;
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, _this.allSelect);
        });
      },
      //取消全选事件
      CleatAllSelectStock(rows) {
        var _this = this;
        _this.multipleSelection = rows;
        console.log(rows)
        this.$refs.multipleTable.clearSelection();
      },
      //删除
      handleDelete(id) {
        this.delete(id)
      },
      delete(id){
        this.$confirm("确定删除吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param ={
            sale_id:id, // 批量传递一维数组，单独的传递ID
          };
          console.log(param);
        /*  apiUser.deleteSaler(param).then(res => {
            if(res.cscode==0){
              this.$message({type: 'success',message:res.data.msg, showClose: true,})
              this.get_list()
            }else {
              this.$message(res.data.msg)
            }

          })*/
        }).catch(()=>{})
      },
      //批量删除
      allDelete:function(rows){
        let ids = [];
        for (var i = 0;i<rows.length;i++){
          ids.push(rows[i].id)
        }
        let idss = ids.join(",");
        this.delete(idss)
      },
		},

	}
</script>

<style scoped>
@import url("../../assets/css/UserList.css");
</style>
