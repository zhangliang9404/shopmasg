<template>
	<div>
		<!--导航-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
			<el-breadcrumb-item>分类管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
		</el-breadcrumb>
		<p class="explanation">为不同类型的商品创建、修改不同的分类，方便您管理也方便顾客浏览</p>
		<!--表单-->
		<div class="form">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
				<div class="left">
          <el-form-item v-if="isSelectFenLei" label="一级分类：" prop="region">
            <div class="edit" v-if="isFenLeiEditAdd">
              <span class="editFenLei">{{editFenLeiVal}}</span>
              <span class="editTishi">不可修改</span>
            </div>
            <el-select v-if="!isFenLeiEditAdd" v-model="ruleForm.cat_id" placeholder="请选择所属分类" @change="changeFenlei">
              <el-option  v-for="(item,index) in selectList"
                          :key="index"
                          :label="item.cat_name"
                          :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model="ruleForm.cat_name"></el-input>
          </el-form-item>
					<el-form-item v-if="isPinLeiTuBiao" label="分类图标：" prop="ruleForm">
            <ul class="clearfix" v-if="ruleForm.cat_img?true:false">
              <li>
                <img :src="ruleForm.cat_img">
                <span class="el-icon-close" @click="delImgs_head"></span>
              </li>
            </ul>
            <div class="addImgs" v-if="ruleForm.cat_img?false:true">
              <input style="opacity: 0" class="upload" @change='add_img_head'  type="file">
              <span class="el-icon-plus"></span>
            </div>
						<!--<el-upload name="file_name" class="upload-demo" :action="rr" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList2" list-type="picture" :before-upload="beforeUpload">-->
							<!--<el-button size="small" type="primary">点击上传</el-button>-->
						<!--</el-upload>-->
					</el-form-item>
					<el-form-item label="货号前缀：" prop="first">
						<el-input v-model="ruleForm.cat_prefix"></el-input>
					</el-form-item>
          <el-form-item v-if="isPinLei" label="品类字段管理：" prop="type_val">
            <div class="manage">
              <div class="manage_box">
                <span v-for="(item,index) in  ruleForm.type_val" :key="index">
                {{item.cat_type}}
               </span>
              </div>
              <el-button style="display: block" type="success" plain icon="el-icon-edit"  @click="dialogTableVisibles=true">编辑品类字段</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">{{goodsMethods}}</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
				</div>
				<div class="right">
					<el-form-item label="URL重写名称：" prop="urlname">
						<el-input v-model="ruleForm.url_path"></el-input>
					</el-form-item>
					<el-form-item label="搜索标题：" prop="searchtitle">
						<el-input type="textarea" v-model="ruleForm.search_title"></el-input>
					</el-form-item>
					<el-form-item label="搜索关键字：" prop="keyword">
						<el-input type="textarea" v-model="ruleForm.search_keywords"></el-input>
					</el-form-item>
					<el-form-item label="搜索描述：" prop="searchdescribe">
						<el-input type="textarea" v-model="ruleForm.search_desc"></el-input>
					</el-form-item>
				</div>

				<!--弹出内容-->
				<el-dialog title="品类字段管理" :visible.sync="dialogTableVisibles" :close-on-click-modal=true width="40%">
					<el-table :data="ruleForm.type_val" border>
            <el-table-column label="字段分类" class="111" style="">
              <template slot-scope="scope">
                {{scope.row.cat_type}}
              </template>
            </el-table-column>
            <el-table-column label="字段值" class="111" style="">
              <template slot-scope="scope">
                {{scope.row.cat_type_val}}
              </template>
            </el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
                <el-button size="mini" @click="exitFiled(scope.$index,scope.row)">编辑</el-button>
                <el-button size="mini" @click="deleteFiled(scope.$index,scope.row)" type="danger">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="footer">
					<el-button type="primary" @click="addField">添加字段分类</el-button>
					<el-button @click="dialogTableVisibles=false" :disabled="setDisalbed">保存修改</el-button>
					</div>
				</el-dialog>

        <!--新增商品分类-->
        <div class="pinleier">
          <el-dialog title="编辑品类字段" :visible.sync="dialogFormVisibleEdit" >
            <el-form style="width: 300px!important;">
              <el-form-item label="字段分类">
                <el-input v-model="editsObjs.cat_type" placeholder="请输入字段分类" style="margin-left: 40px;width: 300px!important;"></el-input>
              </el-form-item>
              <el-form-item label="字段值">
                <el-input v-model="editsObjs.cat_type_val" placeholder="多个字段时以英文“,”隔开" style="margin-left: 40px;margin-top: 20px;width: 300px;display: inline-block"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">关 闭</el-button>
              <el-button type="primary" @click="AddField(1)">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="pinleier">
          <el-dialog title="添加品类字段" :visible.sync="dialogFormVisible" >
            <el-form style="width: 300px!important;">
              <el-form-item label="字段分类">
                <el-input class="FieldClassification" v-model="pinLeiKey" placeholder="请输入字段分类" style="margin-left: 40px;width: 300px!important;"></el-input>
              </el-form-item>
              <el-form-item label="字段值">
                <el-input class="FieldVal" v-model="pinLeiVal" placeholder="多个字段时以英文“,”隔开" style="margin-left: 40px;margin-top: 20px;width: 300px;display: inline-block"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">关 闭</el-button>
              <el-button type="primary" @click="AddField(2)">确 定</el-button>
            </div>
          </el-dialog>
        </div>

        <!--//品类编辑-->
        <div class="pinleier">
          <el-dialog title="添加品类字段" :visible.sync="dialogFormVisibleEditAdd" >
            <el-form style="width: 300px!important;">
              <el-form-item label="字段分类">
                <el-input v-model="editPinLeiKey" class="FieldClassificationEditAdd" placeholder="请输入字段分类" style="margin-left: 40px;width: 300px!important;"></el-input>
              </el-form-item>
              <el-form-item label="字段值">
                <el-input v-model="editPinLeiVal" class="FieldValEditAdd" placeholder="多个字段时以英文“,”隔开" style="margin-left: 40px;margin-top: 20px;width: 300px;display: inline-block"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleEditAdd = false">关 闭</el-button>
              <el-button type="primary" @click="gbpl(0)">确 定</el-button>
            </div>
          </el-dialog>
        </div>

        <div class="pinleier">
          <el-dialog title="编辑新增品类字段" :visible.sync="dialogFormVisibleEditAdds" >
            <el-form style="width: 300px!important;" :model="formAdd">
              <el-form-item label="字段分类">
                <el-input class="FieldClassificationEditAdd" v-model="formAdd.cat_type" placeholder="请输入字段分类" style="margin-left: 40px;width: 300px!important;"></el-input>
              </el-form-item>
              <el-form-item label="字段值">
                <el-input class="FieldValEditAdd" placeholder="多个字段时以英文“,”隔开" v-model="formAdd.cat_type_val"  style="margin-left: 40px;margin-top: 20px;width: 300px;display: inline-block"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleEditAdds = false">关 闭</el-button>
              <el-button type="primary" @click="gbpl(2)">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="pinleier">
          <el-dialog title="编辑原有品类字段" :visible.sync="dialogFormVisible1" >
            <el-form :model="form" style="width: 300px!important;">
              <el-form-item label="字段分类">
                <el-input v-model="form.cat_type" style="margin-left: 40px;width: 300px!important;"></el-input>
              </el-form-item>
              <el-form-item label="字段值">
                <ul>
                  <li v-for="(item,index) in form.children">
                    <el-input v-model="item.cat_type_val" style="margin-top: 20px;width: 300px;display: inline-block">
                    </el-input>
                    <span class="el-icon-error" @click="delpl(item,index)" style="float: right;margin-right: -70px;margin-top: -25px"></span>
                  </li>
                  <li><el-input v-model="itemone" style="margin-top: 10px;width: 300px"></el-input></li>
                </ul>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible1 = false">关 闭</el-button>
              <el-button type="primary" @click="gbpl(1)">确 定</el-button>
            </div>
          </el-dialog>
        </div>
			</el-form>
		</div>
	</div>

</template>

<script>
  import * as config from '../../common/config.js'
  import * as http from '../../common/http.js'
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  let rootUrl = config.default.apiUrl+"/uploadfile/uploadfile/shop";
  console.log(rootUrl)

  export default {
		data() {
			return {
			  //添加品类字段
        pinLeiKey:"",
        pinLeiVal:"",
        //点击添加字段 后  的编辑品类字段
        indexEdit:0,
        //添加品类字段
        editPinLeiKey:"",
        editPinLeiVal:"",
			  //绑定的新增所有增加品类字段管理
        addPinLei:[],
        //绑定的编辑所有增加品类字段管理
        editPinLel:[],
			  //点编辑  获取  到  点击的下标
        clickEditIndex:"",
			  //选择的一级分类的id
        oneFenLeiId:"",
			  //新增  编辑品类字段  id
        editsObjs:{},
			  //确定是修改还是发布
        isFaBuOrEdit:false,
			  //图标是否显示
        isPinLeiTuBiao:true,
        //品类字段管理是否显示
        isPinLei:false,
        //是否选择所属分类
        isSelectFenLei:false,
        //所属分类的  修改 添加显示不同状态
        isFenLeiEditAdd:false,
        //修改状态下的所属分类
        editFenLeiVal:"",
			  //select name属性
        selectName:"",
			  //是  增加分类   还是修改分类
        goodsMethods:"",
        check:false,
        foledObj:{},//添加  一次字段分类
        selectList:[],//品类下拉列表
        setDisalbed:true,//保存修改  是否禁用
        rr: rootUrl,//添加图标接口路径
        fileList2:[],//上传图标
				dialogTableVisibles: false,//编辑品类字段  弹框是否显示
        dialogFormVisible:false,//添加字段分类
        dialogFormVisibleEdit:false,//添加字段 中带有  编辑
        dialogFormVisible1:false,//编辑
        dialogFormVisibleEditAdd:false,//编辑  添加品类字段
        dialogFormVisibleEditAdds:false,//编辑新增品类字段
        itemone:'',
        formLabelWidth: '120px',
        itemdd:[1,2,3],
        //提交、修改 传递的参数
				ruleForm: {
          cat_name: '',//分类名称
          cat_id: '',//所属分类
          cat_img: '',//分类图标
          cat_prefix: '',//货号前缀
          url_path: '',//URL重写名称
          search_title: '',//搜索标题
          search_keywords:'',//搜索关键词
          search_desc: '',//搜索描述
          type_val: [],//添加  字段类别
				},
        form:{},//修改 原有字段分类
        formAdd:{},//修改 新增字段分类
				rules: {
          cat_name: [{
							required: true,
							message: '请输入分类名称',
							trigger: 'blur'
						},
						{
							min: 3,
							message: '长度最少3位字符',
							trigger: 'blur'
						}
					],
          cat_prefix: [{
							required: true,
							message: '请输入货号前缀',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 5,
							message: '长度在 1 到 5 个字符，且必须为字母',
							trigger: 'blur'
						}
					],
          url_path: [{
						required: true,
						message: '请输入URL重写名称',
						trigger: 'blur'
					}],
          search_title: [{
							required: true,
							message: '请输入搜索',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 100,
							message: '长度在 1 到 100 个字符',
							trigger: 'blur'
						}
					],
          search_keywords: [{
							required: true,
							message: '请输入搜索关键字描述',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 160,
							message: '长度在 1 到 160 个字符',
							trigger: 'blur'
						}
					],
          search_desc: [{
							required: true,
							message: '请输入搜索描述',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 240,
							message: '长度在 1 到 240 个字符',
							trigger: 'blur'
						}
					]
				}
			};
		},
    beforeCreate(){
		  var _this=this;
    },
    mounted(){
      var _this=this;
      _this.getSelect();//获取下拉框的分类信息
      if(_this.$route.query.ids&&_this.$route.query.fId){
        _this.isFaBuOrEdit=true;
        _this.goodsMethods="修改分类";
        //所有品类字段管理的集合
        _this.isPinLei=true;
        _this.isPinLeiTuBiao=true;
        //修改与添加状态下的所属分类
        _this.isFenLeiEditAdd=true;
        _this.Initialization();
      }else{
        _this.isFaBuOrEdit=false;
        console.log(_this.$route.query.classification)
        _this.goodsMethods="发布分类";
        let isClassification=Number(_this.$route.query.classification);
        console.log(typeof isClassification)
        if(isClassification==1){
          _this.isSelectFenLei=false;
        }else if(isClassification==2){
          _this.isSelectFenLei=true;
          _this.isPinLeiTuBiao=false;
          _this.isPinLei=true;
        }
      }
    },
    computed: {
      pokerHistory() {
        return this.ruleForm.region
      }
    },
    watch:{
      pokerHistory(newValue, oldValue) {
        if(newValue!=''){
          this.check=true
        }
      }
    },
		methods: {
      changeFenlei(ids) {
        var _this = this;
        for (var i = 0; i < _this.selectList.length; i++) {
          if (_this.selectList[i].id == ids) {
            _this.selectName = _this.selectList[i].cat_name;
            _this.oneFenLeiId=i;
          }
        }
        console.log(_this.selectName)
      },
      //商品下拉分类
      getSelect() {
        var _this = this
        let param = {
          status: ""
        };
        apiUser.getOneTwoFenLei(param).then(res => {
          if (res.cscode == 0) {
            console.log(res)
            _this.selectList=res.data.data;
          } else {
            _this.$message.error("获取所属分类失败");
            _this.isSelectFenLei = false;
          }
        });
      },
      //初始化接口调用
      Initialization(){
        var _this=this;
        var paramsGet = {
          id: _this.$route.query.fId,
          fid: _this.$route.query.ids
        }
        apiUser.getsClassifyGroup(paramsGet).then(res => {
          if (res.cscode == 0) {
            console.log(res.data);
            console.log(res.data.data.fname);
            _this.ruleForm.cat_id = "",
              _this.ruleForm.cat_name = res.data.data.cat_name;
            _this.ruleForm.cat_img = res.data.data.f_img;
            _this.ruleForm.url_path = res.data.data.url_path;
            _this.ruleForm.search_title = res.data.data.search_title;
            _this.ruleForm.search_keywords = res.data.data.search_keywords;
            _this.ruleForm.search_desc = res.data.data.search_desc;
            _this.ruleForm.cat_prefix = res.data.data.cat_prefix;
            console.log(_this.ruleForm)
            console.log(res.data.data.children)
            _this.ruleForm.type_val = res.data.data.children;
            //所有编辑页面的品类字段管理的集合
            for(let i=0;i<_this.ruleForm.type_val.length;i++){
              _this.editPinLel.push(_this.ruleForm.type_val[i].cat_type);
            }
            console.log(_this.editPinLel)
            // _this.selectName=res.data.fid_name
            _this.ruleForm.cat_id = res.data.data.fname
            console.log(res.data.data.fname)
            _this.editFenLeiVal = res.data.data.fname;//修改所属分类
            console.log(_this.ruleForm.type_val)
            for (var i = 0; i < _this.ruleForm.type_val.length; i++) {
              _this.ruleForm.type_val[i].cat_type_val = _this.ruleForm.type_val[i].res;
            }
          } else {
            _this.$message.error(res.data.msg)
          }
        });
      },
      //添加商品分类
      submitForm() {
        var _this = this;
        //console.log(_this.ruleForm.icon)
        var cat_arr = [];
        if (_this.$route.query.ids&&_this.$route.query.fId) {
          if(_this.ruleForm.cat_name == "") {
            _this.$message.error("请输入分类名称");
          }else if (_this.ruleForm.cat_name.length < 2) {
            _this.$message.error("商品分类至少输入2位字符");
          }else if (_this.ruleForm.url_path == "") {
            _this.$message.error("请输入url重写名称");
          } else if (_this.ruleForm.cat_img == "") {
            _this.$message.error("请上传图标");
          } else if (_this.ruleForm.search_title == "") {
            _this.$message.error("请输入搜索标题");
          } else if (_this.ruleForm.search_keywords == "") {
            _this.$message.error("请输入搜索关键字");
          } else if (_this.ruleForm.cat_prefix == "") {
            _this.$message.error("请输入货号前缀");
          } else if (_this.ruleForm.search_desc == "") {
            _this.$message.error("请输入搜索描述");
          } else if(_this.ruleForm.type_val.length<=0){
            _this.$message.error("请添加品类字段管理");
          }else {
            var parameter = _this.ruleForm;
            parameter.cat_id = _this.$route.query.fId;
            parameter.fid = _this.$route.query.ids
            console.log(                       )
            apiUser.editClassifyGroup(parameter).then(res => {
              console.log(res)
              if (res.cscode == 0) {
                console.log(res.data.msg)
                _this.$message(res.data.msg)
                _this.$router.push("/goodsclassify")
              } else {
                _this.$message(res.data.msg)
                _this.$router.replace("/goodsclassify");
              }
            })
          }
        } else {
          //新增一级分类
          if (Number(_this.$route.query.classification) == 1) {
            if(_this.ruleForm.cat_name == "") {
              _this.$message.error("请输入分类名称");
            }else if (_this.ruleForm.cat_name.length < 2) {
              _this.$message.error("商品分类至少输入2位字符");
            }else if (_this.ruleForm.url_path == "") {
              _this.$message.error("请输入url重写名称");
            } else if (_this.ruleForm.search_title == "") {
              _this.$message.error("请输入搜索标题");
            } else if (_this.ruleForm.search_keywords == "") {
              _this.$message.error("请输入搜索关键字");
            } else if (_this.ruleForm.cat_prefix == "") {
              _this.$message.error("请输入货号前缀");
            } else if (_this.ruleForm.search_desc == "") {
              _this.$message.error("请输入搜索描述");
            } else if (_this.ruleForm.cat_img == "") {
              _this.$message.error("请上传图标");
            } else {
              var parameter = _this.ruleForm;
              console.log(parameter)
              apiUser.addClassifyGroup(parameter).then(res => {
                console.log(res)
                if (res.cscode == 0) {
                  console.log(res.data.msg)
                  _this.$message(res.data.msg)
                  _this.$router.push("/goodsclassify")
                } else {
                  _this.$message(res.data.msg)
                  _this.$router.replace("/goodsclassify");
                }
              })
            }
          } else if (Number(_this.$route.query.classification) == 2) {
            if(_this.ruleForm.cat_id == "") {
              _this.$message.error("请选择一级分类");
            }else if (_this.ruleForm.url_path == "") {
              _this.$message.error("请输入url重写名称");
            }else if (_this.ruleForm.cat_name == "") {
              _this.$message.error("请输入分类名称");
            }else if (_this.ruleForm.cat_name.length < 2) {
              _this.$message.error("商品分类至少输入2位字符");
            }else if (_this.ruleForm.search_title == "") {
              _this.$message.error("请输入搜索标题");
            }else if (_this.ruleForm.cat_prefix == "") {
              _this.$message.error("请输入货号前缀");
            }else if (_this.ruleForm.search_keywords == "") {
              _this.$message.error("请输入搜索关键字");
            }else if(_this.ruleForm.type_val.length<=0){
              _this.$message.error("请添加品类字段");
            }else if (_this.ruleForm.search_desc == "") {
              _this.$message.error("请输入搜索描述");
            }else {
              var parameter = _this.ruleForm;
              console.log(parameter)
              apiUser.addClassifyGroup(parameter).then(res => {
                console.log(res)
                if (res.cscode == 0) {
                  console.log(res.data.msg)
                  _this.$message(res.data.msg)
                  _this.$router.replace("/goodsclassify");
                } else {
                  _this.$message(res.data.msg)
                  location.reload();
                }
              })
            }
          }
        }
      },
      //分类重置
      resetForm(formName) {
        let _this=this;
        if (_this.$route.query.ids&&_this.$route.query.fId) {
          console.log(111)
          _this.ruleForm.cat_name = "";
          _this.ruleForm.url_path = "";
          _this.ruleForm.cat_img = "";
          _this.ruleForm.search_title = "";
          _this.ruleForm.search_keywords = "";
          _this.ruleForm.cat_prefix = "";
          _this.ruleForm.search_desc ="";
          _this.ruleForm.type_val=[];
          _this.editPinLel=[];

          console.log(_this.ruleForm.type_val);
        } else {
          //新增一级分类
          if (Number(_this.$route.query.classification) == 1) {
            _this.ruleForm.cat_name="";
            _this.ruleForm.url_path="";
            _this.ruleForm.search_keywords="";
            _this.ruleForm.cat_prefix="";
            _this.ruleForm.search_title="";
            _this.ruleForm.cat_img="";
            _this.ruleForm.search_desc="";
          } else if (Number(_this.$route.query.classification) == 2) {
            _this.ruleForm.cat_id="";
            _this.ruleForm.url_path="";
            _this.ruleForm.cat_name="";
            _this.ruleForm.search_title="";
            _this.ruleForm.cat_prefix="";
            _this.ruleForm.search_keywords="";
            _this.ruleForm.type_val=[];
            _this.ruleForm.search_desc="";
          }
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //字段类别增加
      addField() {
        var _this = this;
        if(_this.$route.query.ids && _this.$route.query.fId){
          _this.dialogFormVisibleEditAdd = true;
        }else{
          _this.dialogFormVisible = true;
        }
      },
      //字段类别编辑
      exitFiled(index, row) {
        var _this = this;
        _this.clickEditIndex=index;
        if (_this.$route.query.ids && _this.$route.query.fId) {
          console.log(row)
          var arr = [];
          //判断编辑的是否是   已有的数据还是新增的数据
          if (row.children) {
            this.dialogFormVisible1= true;//控制编辑字段管理  新增字段页面  显示
            for (var i = 0; i < row.children.length; i++) {
              var obj = {
                id: row.children[i].id,
                cat_type_val: row.children[i].cat_type_val
              }
              arr.push(obj)
            }
          }else{
            _this.dialogFormVisibleEditAdds=true;//控制编辑字段管理  编辑字段页面  显示
            _this.formAdd=row;
            console.log(_this.formAdd)
          }
          console.log(arr)
          var obj1 = {
            cat_id: row.cat_id,
            id: row.id,
            cat_type: row.cat_type,
            children: arr
          }
          this.form = obj1
          console.log(this.form)
        } else {
          this.dialogFormVisibleEdit = true;
          _this.editsObjs=row;
        }
      },

      // 增加分类 确定
      AddField(index){
        var _this=this;
        //添加品类字段
        if (index == 2) {
          if(_this.pinLeiKey == "") {
            _this.$message.error("字段分类不能为空")
          }else if (_this.pinLeiVal.indexOf(',') == -1) {
            _this.$message.error("字段分类值拼接使用“,”隔开")
          }else if(_this.addPinLei.indexOf(_this.pinLeiKey)!=-1){
            _this.$message.error("品类字段分类名称不能重复")
          }else {
            let objs={};
            objs.cat_type=_this.pinLeiKey;
            objs.cat_type_val=_this.pinLeiVal;
            _this.ruleForm.type_val.push(objs);
            _this.addPinLei.push(_this.pinLeiKey);
            console.log(_this.addPinLei)
            _this.pinLeiKey="";
            _this.pinLeiVal="";
            _this.dialogFormVisible = false;
            _this.setDisalbed = false;
          }
        }else if(index==1){// 编辑品类字段
          console.log(_this.editsObjs)
          console.log(index);
          _this.indexEdit=index;
          if(_this.addPinLei.indexOf(_this.editsObjs.cat_type)!=-1){
            _this.$message.error("修改的字段分类名称不能与其他分类名臣一致");
          }else{
            _this.ruleForm.type_val[_this.indexEdit]=_this.editsObjs;
            console.log(_this.ruleForm.type_val)
            _this.dialogFormVisibleEdit=false;
          }
        }
      },
      //增加分类、编辑分类 确定 事件
      gbpl(index) {
        var _this = this;
        if (index == 0) {
          if(_this.editPinLeiKey == "") {
            _this.$message.error("字段分类不能为空")
          }else if (_this.editPinLeiVal.indexOf(',') == -1) {
            _this.$message.error("字段分类值拼接使用“,”隔开")
          }else if(_this.editPinLel.indexOf(_this.editPinLeiKey)!=-1){
            _this.$message.error("品类字段分类名称不能重复")
          }else {
            let objs={};
            objs.cat_type=_this.editPinLeiKey;
            objs.cat_type_val=_this.editPinLeiVal;
            console.log(_this.ruleForm.type_val)
            _this.ruleForm.type_val.push(objs);
            console.log(_this.ruleForm.type_val)
            _this.editPinLel.push(_this.editPinLeiKey);
            console.log(_this.editPinLel)
            _this.editPinLeiKey="";
            _this.editPinLeiVal="";
            _this.dialogFormVisibleEditAdd = false;
            _this.setDisalbed = false;
          }
        }else if(index==1){
          console.log(_this.form.children)
          console.log(_this.itemone)
          var arr = _this.form.children;
          if (this.itemone != '') {
            console.log(arr)
            arr.push({cat_type_val: this.itemone})
          }
          console.log(arr)
          _this.form.children = arr;
          _this.itemone = ''
          if(_this.form.cat_type==""){
            _this.$message.error("字段分类不能为空");
          }else if(_this.form.children.length<=0){
            _this.$message.error("请添加字段分类值");
          }else if(_this.editPinLel.indexOf(_this.form.cat_type)!=-1){
            _this.$message.error("字段分类名称不能重复");
          }else{
            let param = _this.form;
            console.log(param)
            apiUser.editcat_type(param).then(res => {
              if (res.cscode == 0) {
                _this.$message(res.data.msg);
                console.log(res)
                let newStringVal=[];
                let newStringKey=param.cat_type;
                for(let i=0;i<param.children.length;i++){
                  newStringVal.push(param.children[i].cat_type_val);
                }
                console.log(newStringVal)
                // clickEditIndex
                _this.ruleForm.type_val[_this.clickEditIndex].cat_type_val=newStringVal.join(",");
                _this.ruleForm.type_val[_this.clickEditIndex].cat_type=newStringKey;
                console.log(_this.ruleForm.type_val);
                _this.dialogFormVisible1=false;
              }
              console.log(res)
            })
          }
        }else if(index==2){
          if(_this.formAdd.cat_type == "") {
            _this.$message.error("字段分类不能为空");
          }else if (_this.formAdd.cat_type_val.indexOf(',') == -1) {
            _this.$message.error("字段分类值拼接使用“,”隔开");
          }else if(_this.editPinLel.indexOf(_this.formAdd.cat_type)!=-1){
            _this.$message.error("品类字段分类名称不能重复");
          }else {
            let objs={};
            objs=_this.formAdd;
            _this.ruleForm.type_val[_this.clickEditIndex]=objs;
            _this.editPinLel.push(_this.pinLeiKey);
            console.log(_this.editPinLel)
            _this.editPinLeiKey="";
            _this.editPinLeiVal="";
            _this.dialogFormVisibleEditAdds = false;
            _this.setDisalbed = false;
          }
        }
      },

      delpl(item, index) {
        var _this = this
        if (_this.$route.query.ids && _this.$route.query.fId) {
          console.log(item.id)
          let param = {
            id: item.id
          }
          apiUser.delcat_type(param).then(res => {
            if (res.cscode == 0) {
              _this.$message(res.data.msg)
              // location.reload()
            }
          })
          console.log(_this.form)
          var arr = _this.form.children
          arr.splice(index, 1)

          _this.form.children = arr

        } else {


//没有参数执行

        }
      },
      //新增商品分类，字段类别删除
      deleteFiled(index, row) {
        var num = 0;
        var _this = this;
        console.log(index);
        console.log(row)
        if (_this.$route.query.ids && _this.$route.query.fId) {
          if(row.hasOwnProperty("cat_id")){
            let param = {
              id: row.id
            }
            console.log(param)
            apiUser.delcat_typename(param).then(res => {
              if (res.cscode == 0) {
                _this.$message(res.data.msg);
                _this.ruleForm.type_val.splice(index, 1);
              }
            })
          }else{
            _this.ruleForm.type_val.splice(index, 1);
            console.log(_this.editPinLel);
          }
          _this.editPinLel.splice(index,1);
        } else {
//没有参数执行
          _this.ruleForm.type_val.splice(index, 1);
          _this.addPinLei.splice(index,1);
          console.log(_this.addPinLei)
        }
      },
      //字段升序
      ascedFiled(index, row) {
        console.log(row)
        console.log(index)
        if (index == 0) {
          alert("已经是最顶级")
        } else {
          var num = 0
          for (var i = 0; i < this.ruleForm.type_val.length; i++) {
            if (this.ruleForm.type_val[i].classify == row.classify) {
              num = i
            }
          }
          if (num != 0) {
            var foledObje = this.ruleForm.type_val[num]
            var foledObjeMin = this.ruleForm.type_val[num - 1]
            this.ruleForm.type_val.splice(num, 1, foledObjeMin)
            this.ruleForm.type_val.splice(num - 1, 1, foledObje)


          }
        }

      },
      //字段降序
      sequenceFiled(row) {
        var num = 0
        for (var i = 0; i < this.ruleForm.type_val.length; i++) {
          if (this.ruleForm.type_val[i].classify == row.classify) {
            num = i
          }
        }
        if (num != this.ruleForm.type_val.length - 1) {
          var foledObje = this.ruleForm.type_val[num]
          var foledObjeMax = this.ruleForm.type_val[num + 1]
          this.ruleForm.type_val.splice(num, 1, foledObjeMax)
          this.ruleForm.type_val.splice(num + 1, 1, foledObje)
        }
      },
      //上传图标
      add_img_head(event) {
        var imgN = 0;
        var code = 'shop';
        console.log(event)
        let reader = new FileReader();
        let file = event.target.files[0];
        let type = file.type;//文件的类型，判断是否是图片??????????????
        let size = file.size;//文件的大小，判断图片的大小????????????
        // if(this.imgData.accept.indexOf(type)==-1){
        //   alert('请选择我们支持的图片格式！');
        //   return false;
        // }
        if (size > 3145728) {
          lert('请选择3M以内的图片！');
          return false;
        }
        var url = rootUrl;
        let form = new FormData();
        form.append('file_name', file);
        form.append("shop_code", code); //传其他参数

        http.uplodPic(file, url, '', '')
          .then(res => {
            let data = res.data;
            if (res.cscode == 0) {
              imgN++;
              this.$message(data.msg);
              this.ruleForm.cat_img = data.imgurl;
              console.log(this.headers)
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },

      //删除图标
      delImgs_head() {
        var _this = this;
        _this.ruleForm.cat_img = "";

      },
    }
	}
</script>

<style scoped>
	@import url("../../assets/css/Goods.css");
  .manage{
    width: 200px;
  }
  .manage_box{
    overflow: hidden;
  }
  .manage span{
    float: left;
    display: block;
    width: 100px;
    line-height: 45px;
    text-align: center;
  }

  .clearfix{
    padding: 0;
    margin: 0;
    float: left;
    list-style: none;
    overflow: hidden;
    /*width: ;*/
  }
  .clearfix>li{
    position: relative;
    width: 148px;
    height: 148px;
    float: left;
    margin-right: 10px;
  }
  .clearfix>li>img{
    border: 1px solid #c0ccda;
    width: 146px;
    height: 146px;
  }
  .clearfix>li>span{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 20px;
    color: red;
  }

  .addImgs{
    float: left;
    position: relative;
    border: 1px dashed #c0ccda;
    border-radius: 5px;
    width: 146px;
    height: 146px;
    background: #fbfdff;
  }
  .addImgs>input{
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 148px;
    height: 148px;
    overflow: hidden;
  }
  .addImgs>span{
    display: block;
    width: 148px;
    height: 148px;
    text-align: center;
    line-height: 148px;
    color: #8c939d;
    font-size: 28px;
  }

  /*修改状态下的所属分类样式*/
  .edit{
    overflow: hidden;
  }
  .editFenLei{
    float: left;
    width: 200px;
    border-radius: 4px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    padding: 0 15px;
  }
  .editTishi{
    float: left;
    line-height: 40px;
    color: #99a9bf;
    margin: 0 0 0 20px;
  }
  .pinleier ul,.pinleier ul li{
   list-style: none;
  }
</style>
