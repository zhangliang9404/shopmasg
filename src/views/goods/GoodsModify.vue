<template xmlns="">
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation">关于商城中所有的商品，您可以对商品进行搜索，也能对商品进行修改操作</p>
    <!--第一步-->
    <p>1.选择商品分类</p>
    <el-form :model="ruleForm" :rules="Elerules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品分类" style="width: 800px">
        <template>
          <span>{{input1_queren}}</span>
        </template>
      </el-form-item>
      <el-button style="margin-left: 100px;margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="$router.push('goodsadd')">新增商品分类</el-button>
      <!--第二步-->
      <p>2.商品基本信息</p>
      <!--商品产地-->
      <el-form-item label="商品产地" style="width: 800px" prop="farmer_address">
        <el-input v-model="ruleForm.farmer_address" placeholder="请输入商品产地"></el-input>
      </el-form-item>
      <!--农户名称-->
      <el-form-item label="农户名称" style="width: 800px" prop="farmer_name">
        <el-input v-model="ruleForm.farmer_name" placeholder="请输入农户名称"></el-input>
      </el-form-item>
      <!--农户简介-->
      <el-form-item label="农户简介" style="width: 800px" prop="farmer_content">
        <el-input v-model="ruleForm.farmer_content" placeholder="请输入农户简介"></el-input>
      </el-form-item>
      <!--上传头像-->
      <el-form-item label="上传头像" style="width:400px" prop="headers">
        <ul class="clearfix">
          <li v-if="headers==''?false:true">
            <img :src="headers">
            <span class="el-icon-close" @click="delImgs_head"></span>
          </li>
        </ul>
        <div class="addImgs"   v-if="headers==''?true:false">
          <input style="opacity: 0" class="upload" @change='add_img_head'  type="file">
          <span class="el-icon-plus"></span>
        </div>
      </el-form-item>
      <!--商品价格-->
      <el-form-item label="价格范围" style="width: 800px" prop="price">
        <el-input v-model="ruleForm.price" placeholder="请输入数字并且数字之间“-”隔开" @blur="price_fanwei"></el-input>
      </el-form-item>
      <!--商品标题-->
      <el-form-item label="商品标题" style="width: 800px" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" :maxlength="30"></el-input>
      </el-form-item>
      <!--新增商品规格参数-->
      <el-form-item class="two" label="规格参数" v-if="isGuigeAdd">
        <el-table
          :data="tableDataAdd"
          current-row-key="index"
          ref="table1"
          tooltip-effect="dark"
          border
          stripe
          style="width: 90%"
          :header-cell-class-name="musts"
          @selection-change='selectRow'>
          <!--<el-table-column type="selection" width="45" align="center"></el-table-column>-->
          <el-table-column label="序号"  type="index" width="60" align="center"></el-table-column>
          <el-table-column align="center" width="150"  v-for="(items,index2) in ProductSpecifications" :key="items.id" :label="items.cat_type" :value="items.id">
          <template slot-scope="scope">
            <el-select placeholder="请选择规格" v-model="selectsOptions[index2]">
              <el-option
                v-for="(item,keys) in items.children"
                :key="item.index"
                :label="item.cat_type_val"
                :value="item.cat_type_val">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
          <el-table-column label="出售价" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input  ref="chushoujia" v-model="scope.row.goods_price" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="原价" width="150">
            <template slot-scope="scope">
              <el-input ref="yuanjia" v-model="scope.row.cost_price" placeholder="请输入商品原价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存" width="150">
            <template slot-scope="scope">
              <el-input ref="kucun" class="lelele" v-model="scope.row.stock" placeholder="请输入商品库存"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="重量（kg)" width="150">
            <template slot-scope="scope">
              <el-input ref="zhongliang" v-model="scope.row.weight" placeholder="请输入重量"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="sku编码" width="100">
            <template slot-scope="scope">
              {{getSkuRes}}
            </template>
          </el-table-column>
          <el-table-column label="操作数据"  width="120">
            <template slot-scope="scope">
              <div>
                <span style="display: block;border-radius: 4px;width: 50px;line-height: 35px;text-align: center;background: #2D64B3;color: whitesmoke"  @click="sitData(scope.$index)">保存</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!--新增商品规格参数保存本地的数据-->
      <el-form-item label="保存规格" v-if="isGuigeAdd">
        <el-table
          :data="NewTableDataAdd"
          current-row-key="index"
          ref="table1"
          tooltip-effect="dark"
          border
          stripe
          style="width: 90%"
          @selection-change='selectRow'>
          <!--<el-table-column type="selection" width="45" align="center"></el-table-column>-->
          <el-table-column label="序号"  type="index" width="60" align="center"></el-table-column>
          <el-table-column align="center" label="规格" width="150">
            <template slot-scope="scope" >
              {{scope.row.sku_font}}
            </template>
          </el-table-column>
          <el-table-column label="出售价"  ref="chushoujia" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goods_price" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="原价" width="150">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.cost_price" placeholder="请输入商品原价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock" placeholder="请输入商品库存"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="重量（kg)" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight" placeholder="请输入商品重量"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="sku编码" width="100     ">
            <template slot-scope="scope">
              {{scope.row.sku_res}}
            </template>
          </el-table-column>
          <el-table-column label="删除数据"  width="80">
            <template slot-scope="scope">
              <span class="el-icon-remove" style="color: red;font-size: 24px" @click="removeReduceEdit(NewTableDataAdd,scope.$index)"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!--新增产品参数-->
      <el-form-item label="产品参数" v-if="isGuigeAdd">
        <el-table
          :data="tableData1Add"
          current-row-key="index"
          ref="table1"
          tooltip-effect="dark"
          border
          stripe
          style="width: 90%"
          @selection-change='selectRow'>
          <!--<el-table-column type="selection" width="45" align="center"></el-table-column>-->
          <el-table-column label="0"  type="index" width="60" align="center"></el-table-column>
          <el-table-column  label="产品参数名" align="center" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.productName" placeholder="请输入产品参数名"></el-input>
            </template>
          </el-table-column>
          <el-table-column  label="产品参数值" align="center" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.productVal" placeholder="请输入产品参数值"></el-input>
            </template>
          </el-table-column>
          <el-table-column header-click="productAdd(1)"  label="" width="60">
            <template slot-scope="scope">
              <div>
                <span class="el-icon-remove" style="color: red;font-size: 24px" @click="removeReduce(tableData1Add,scope.$index)"></span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <span class="el-icon-circle-plus" style="width: 30px;display:block;font-size: 24px;color: #45af05;margin: 20px 0;" @click="addShop"></span>
      </el-form-item>
      <!--添加商品-->
      <div class="addImg_bigBox">
        <span style="">上传图片</span>
        <ul class="clearfix">
          <li v-for='(item ,index ) in newArrImgs'>
            <img :src="item">
            <span class="el-icon-close" @click="delImgs(index)"></span>
          </li>
        </ul>
        <div class="addImgs"  v-if="newArrImgs.length>3?false:true">
          <input style="opacity: 0" class="upload" @change='add_img'  type="file">
          <span class="el-icon-plus"></span>
        </div>
      </div>
      <!--商品描述-->
      <el-form-item label="商品描述" prop="goodsdesc">
        <!--<Uediter :value="ueditor.value" :config="ueditor.config" ref="ue"></Uediter>-->
        <div id="editor"></div>
        <!--<div style="float: right;"><span @click="saveRichText">保存</span></div>-->
      </el-form-item>
      3.配送服务
      <el-form-item label="拆单属性" prop="resource" class="peisong">
        <el-radio v-model="ruleForm.resource"  v-for="(items,index) in resourceList" :key="items.index" :label="items.id">{{items.name}}</el-radio>
      </el-form-item>
      <!--配送费-->
      <el-form-item label="配送费" prop="region" class="peisongfei">
        <el-select class="one"  @change="checkMuBan(input2)"
                   v-model="input2"
                   placeholder="请选择模板">
          <el-option
            v-for="items in region"
            :key="items.id"
            :label="items.temp_name"
            :value="items.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!--模板-->
      <div class="muban">
        <div class="muban_lists">
          <div class="tongcheng_kuaidi">
            <div class="tongcheng">
              <span @click="qiehuan(0)">同城配送</span>
              <span class="kuaidi"  @click="qiehuan(1)">快递物流</span>
            </div>
            <div class="chakan">
              <span @click="lookXiangQing">查看详情</span>
            </div>
          </div>
          <p>默认运费：1件内{{qiehuans.def_freight}}元。每增加1件加{{qiehuans.def_add_freight}}元</p>
        </div>
        <div class="zhiding">
          <p>制定区域运费</p>
          <p>香港、澳门、台湾1件内35.00，每增加1件，加12.00元</p>
        </div>
      </div>

      <el-form-item style="margin-top: 50px">
        <el-button type="primary" @click="submitForm('ruleForm')">修改商品</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as Qiniu from 'qiniu-js'
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'

  import * as config from '../../common/config.js'
  import * as http from '../../common/http.js'
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  let rootUrl = config.default.apiUrl+"/uploadfile/uploadfile/shop";
  document.onreadystatechange = function(){
    if(document.readyState=="complete"){
      var arr= $(".has-gutter").children("tr").children("th")
      for(var i=0;i<arr.length;i++){
        if(i==1||i==2||i==4||i==5){
          $(".has-gutter").children("tr").children("th").eq(i).children("div").append("<span class='bixuan' style='color: red'>*</span>");
        }
      }
    }
  }
  export default {
    data() {
      return {
        //计算产品参数条数
        num1:0,
      //正则验证
        Verification:"",

        //动态循环出多个select
        selectsOptions:[],

        //文本编辑器传递给子组件的参数
        dat: {
          content: ''
        },

        //上传图片时候的后缀名定义
        imgData: {
          accept: 'image/gif, image/jpeg, image/png, image/jpg',
        },
        //选中过二级分类后得到的sku_res编码
        getSkuRes: "",
        shangchuan: rootUrl,
        //头像上传
        headers: "",
        newArrImgs: [],//上传图片
        //规格参数
        //新增商品规格、产品参数的显示隐藏
        isGuigeAdd: false,
        //配送模板的详情
        peiSongXiangQing: {},
        //新增商品规格参数
        tableDataAdd: [],
        //新增商品规格参数   传参
        NewTableDataAdd: [],
        OriginalNewTableDataAdd:[],
        AddNewTableDataAdd:[],
        //定义选中二级分类的id值
        secondLevel: "",
        //sku动态商品规格参数
        ProductSpecifications: [],
        //规格参数对象
        GuiGe: {},
        tableData1Add: [],
        //增加商品  传递给后台参数
        goods_parm: [],
        selectlistRow: [],
        //修改商品 所属分类
        input1_queren: '',
        input2: '',//运费模板

        getTwoIdEdit: [],

        //得到商品的二级分类的id
        cat_ids: "",

        region: [],//配送费
        resourceList: [
          {
            id: 1,
            name: "普通商品"
          },
          {
            id: 2,
            name: "单独配送商品：特殊商品需要独立配送，提交订单时该商品分包裹单独计算邮费。"
          },
          {
            id: 3,
            name: "同城即时达：即时性商品，提交订单时此类商品分包裹单独计算邮费，仅支持同城配送（建议生鲜、快餐食品等商品使用该属性）。"
          }
        ],
        ruleForm: {
          farmer_address: "",                     //  商品产地
          farmer_name: "",                         // 农户名
          farmer_photo: "",                        // 农户头像
          farmer_content: "",
          productlabe: [],
          type: [],
          price: '',
          name: '',
          goodsdesc: "",
          resource: "",//拆单属性
          // resourceId:"",
        },
        //配送费详情
        peisong: {},
        //切换同城、快递
        qiehuans: {},
        //模板的id
        muBanId: "",
        Elerules: {
          farmer_address: [
            {
              required: true,
              message: '请输入商品产地',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '标题长度在 1 到20 个字符',
              trigger: 'blur'
            }
          ],
          farmer_name: [
            {
              required: true,
              message: '请输入农户名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 5,
              message: '标题长度在 1 到5 个字符',
              trigger: 'blur'
            }
          ],
          farmer_content: [
            {
              required: true,
              message: '请输入农户简介',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 60,
              message: '标题长度在 1 到60 个字符',
              trigger: 'blur'
            }
          ],
          price: [{
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }, {
            min: 1,
            message: '商品价格必须大于1元',
            trigger: 'blur'
          }],
          name: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 60,
              message: '标题长度在 1 到60 个字符',
              trigger: 'blur'
            }
          ],
          goodsdesc: [
            {
              required: true,
              message: '请填写商品描述',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 300,
              message: '描述长度在 1 到 300 个字符',
              trigger: 'blur'
            }
          ],
          resource: [{
            required: true,
            message: '请选择拆单属性',
            trigger: 'change'
          }],
        },
      }
    },
    //页面加载首先执行的方法
    mounted: function(){
      var _this=this;
      document.title="修改商品";
      _this.editor = new Editor("#editor");
      // 允许上传到七牛云存储
      _this.editor.customConfig.uploadImgServer = 'https://api.zhisoufangdichan.com/api/v1/uploadfile/wangup'
      _this.editor.customConfig.uploadImgHooks = {
      }
      _this.editor.create()
      utils.setCookie("__user_token__","e0909c3a435ab57e50c4dfbe95fb2e81");
      //配送费   DistributionFeeMuBan
      var param={}
      $(".tongcheng>span").eq(0).css("background","#409EFF").css("color","white").css("border","1px solid #409Eff");
      //由于调用接口是异步   所以  在得到成功返回_this.region数据后太执行   其它事件
      apiUser.DistributionFeeMuBan(param).then(res => {
        if(res.cscode==0){
        _this.region=res.data.data;
        //根据判断是否确认商品进行   修改和新增商品的编辑
        _this.isGuigeAdd=true;
          //获取商品分类发布商品
          let AddObjectGuige = {
            sku_res: _this.sku_res,//sku id
            sku_font: "",//sku文字集合
            stock: _this.stock,//库存
            weight: _this.weight,//重量
            goods_price: _this.goods_price,//出售价,
            sku_num: "",//sku编码
            cost_price: _this.cost_price//原价
          }
          _this.tableDataAdd.push(AddObjectGuige);

          var param={
            goods_id:_this.$route.query.ids
          }
          apiUser.editShop(param).then(res => {
            if(res.cscode==0){
              console.log(res)
              _this.cat_ids=res.data.data.classify;//二级分类的id
              let params={
                id:_this.cat_ids
              }
              _this.getsecondLevel(params);
              //文本编辑器的默认值
              //将获取的内容 设置到文本编辑器中
              _this.editor.txt.html(res.data.data.describe)
              _this.ruleForm.goodsdesc = res.data.data.describe;
              _this.ruleForm.price=res.data.data.price;
              _this.ruleForm.name=res.data.data.name;
              _this.ruleForm.farmer_address=res.data.data.farmer_address;
              _this.ruleForm.farmer_content=res.data.data.farmer_content;
              _this.ruleForm.farmer_name=res.data.data.farmer_name;
              _this.headers=res.data.data.farmer_photo;
              for(let i=0;i<JSON.parse(res.data.data.img).length;i++){
                _this.newArrImgs.push(JSON.parse(res.data.data.img)[i])
              }
              console.log(_this.newArrImgs)
              console.log(_this.newArrImgs.length)

                console.log(typeof _this.newArrImgs)
              //规格参数的渲染
              for(let i=0;i<res.data.data.sku_res.length;i++){
                let objs={};
                objs.sku_res = res.data.data.sku_res[i].sku_res;
                objs.stock = String(res.data.data.sku_res[i].stock);
                objs.weight = String(res.data.data.sku_res[i].weight);
                objs.sku_num = "";
                objs.cost_price = String( res.data.data.sku_res[i].cost_price);
                objs.goods_price = String(res.data.data.sku_res[i].goods_price) ;
                objs.sku_font= res.data.data.sku_res[i].sku_font;
                objs.id= _this.$route.query.ids;
                _this.NewTableDataAdd.push(objs);
                //修改商品时候，初始化获得的规格参数数据
                _this.OriginalNewTableDataAdd.push(objs);
              }
              console.log(_this.NewTableDataAdd)
              //产品参数的渲染
              _this.tableData1Add=JSON.parse(res.data.data.goods_parm);
              _this.num1=_this.tableData1Add.length;//修改商品  的产品参数条数赋值
              //配送模板的id
              _this.muBanId=res.data.data.delivery_cost;
              //得到修改商品时配送模板的详情
              let editMuBanId="";
              for(let i=0;i<_this.region.length;i++){
                if(_this.muBanId==_this.region[i].id){
                  editMuBanId=i;
                }
              }
              _this.peiSongXiangQing=_this.region[Number(editMuBanId)];
              _this.input2=_this.region[Number(editMuBanId)].temp_name;//修改配送模板重新赋值
              //修改商品   配送模板  默认同城配送
              _this.qiehuans=_this.peiSongXiangQing.children[0];
              _this.input1_queren=res.data.data.cat_name;//修改所属分类
              var lele=JSON.parse(res.data.data.goods_parm);
              _this.tableData=res.data.data.sku_res;
              //初始化图片加载
              _this.newArr=JSON.parse(res.data.data.img);
              //循环遍历sku
              let newSku='';
              for(let i=0;i<_this.tableData.length;i++){
                newSku=_this.tableData[i].sku_font;
              }
              let splitNewSku=newSku.split(',')//字符串转化成数组
              console.log(splitNewSku)

              //拆单属性的默认值
              _this.ruleForm.resource=res.data.data.dml_type;
            }else{
              _this.$message.error(data.msg);
            }
          });
        }else{
          _this.$message.error(res.data.msg);
        }
      });
      //配送费默认值
    },
    methods: {
      //改变  保存的动态规格参数值
      editReduceEdit(value,index){
        var _this=this;
        console.log(index)
        console.log(value)
        let changeEdit=[];
        for(let i=0;i<value.sku_font.length;i++){
          let objs={};
          objs.val=value.sku_font[i].val;
          objs.id=value.sku_res.split(",")[i];
          objs.cat_type_id=value.sku_font[i].cat_type_id;
          changeEdit.push(objs);
        }
        console.log(changeEdit);
      },

      musts(obj){
        if(obj.columnIndex == 3 || obj.columnIndex == 4 || obj.columnIndex == 5) {
          return 'must';
        }
      },

      //正则验证 价格区间
      PriceRange(testVal,testKey,getVal){
        var _this=this;
        if(!testKey.test(testVal)) {
          _this.Verification = getVal;
          return _this.Verification;
        }
      },
      //验证价格输入
      priceNumber(val,listVal,getVal){
        var _this=this;
        console.log(val);
        for(let i=0;i<val.length;i++){
          if(!listVal.test(Number(val[i]))){
            _this.Verification = getVal;
            return _this.Verification;
          }
        }
      },
      //价格范围失去焦点
      price_fanwei(){
        var _this=this;
        if(_this.ruleForm.price==""){
          _this.$message.error("价格范围不能为空");
        }else if(_this.ruleForm.price.indexOf("-")==-1){
          _this.$message.error("输入的价格区间使用“-”隔开");
        }else{
          if(_this.priceNumber(_this.ruleForm.price.split("-"),/^(\-)?\d+(\.\d{1,2})?$/,"输入得价格区间必须为数字")){
            _this.$message.error(_this.Verification);
          }else{
            if(_this.ruleForm.price.split("-").length>2){
              _this.$message.error("价格区间输入两个数字");
            }else if(Number(_this.ruleForm.price.split("-")[0])>=Number(_this.ruleForm.price.split("-")[1])){
              _this.$message.error("前面的数字必须小于后面的数字");
            }
          }
        }
      },
      selectIndex(index){
        console.log( $(".two table tr").children("td").eq(index+1).children("div").children("select option:selected").attr('value') )
      },

      //得到二级分类后  规格接口
      getsecondLevel(params) {
        var _this = this;
        apiUser.getTwoGuiGe(params).then(res => {
          if (res.cscode == 0) {
            console.log(res)
            //将sku编码渲染到页面
            var newString = "";
            var newArr = [];
            for (let i = 0; i < res.data.data.children.length; i++) {
              for (let j = 0; j < res.data.data.children[i].children.length; j++) {
                newArr.push(res.data.data.children[i].children[j].cat_type_val);
              }
              _this.getTwoIdEdit.push(res.data.data.children[i].id);
            }
            _this.ProductSpecifications = [];
            _this.ProductSpecifications = res.data.data.children;
          } else {
            this.$message.error(res.data.mag)
          }
        });
      },
      //上传头像
      add_img_head(event) {
        var imgN = 0;
        var code = 'shop';
        let reader = new FileReader();
        let file = event.target.files[0];
        let type = file.type;//文件的类型，判断是否是图片??????????????
        let size = file.size;//文件的大小，判断图片的大小????????????
        if (this.imgData.accept.indexOf(type) == -1) {
          alert('请选择我们支持的图片格式！');
          return false;
        } else if (size > 2063990) {
          alert('请选择2M以内的图片！');
          return false;
        } else {
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
                this.headers = data.imgurl;
              } else {
                this.$message.error(data.msg);
              }
            })
            .catch(error => {
              this.$message.error(error);
            });
        }
      },
      //上传图片
      add_img(event) {
        console.log(event)
        var imgN = 0;
        var code = 'shop';
        let reader = new FileReader();
        let file = event.target.files[0];
        let type = file.type;//文件的类型，判断是否是图片??????????????
        let size = file.size;//文件的大小，判断图片的大小????????????
        if (this.imgData.accept.indexOf(type) == -1) {
          alert('请选择我们支持的图片格式！');
          return false;
        }
        if (size > 2090000) {
          lert('请选择3M以内的图片   ！');
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
              this.newArrImgs.push(data.imgurl);
              console.log(this.newArrImgs)
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(error => {
            this.$message.error(error);
          });
      },
      //删除头像
      delImgs_head() {
        var _this = this;
        _this.headers = "";
      },
      //删除图片
      delImgs(index) {
        var _this = this;
        _this.newArrImgs.splice(index, 1)
      },
      //选择配送费模板
      checkMuBan(index) {
        var _this = this;
        var peisongId = 0;
        for (var i = 0; i < _this.region.length; i++) {
          if (index == _this.region[i].id) {
            _this.peiSongXiangQing = _this.region[i];
            peisongId = i;
          }
        }
        _this.muBanId = _this.region[peisongId].id;
        _this.qiehuans = _this.peiSongXiangQing.children[0];
        // _this.muBanId=_this.qiehuan.
      },
      //切换费用
      qiehuan(index) {
        var _this = this;
        $(".tongcheng>span").eq(index).css("background", "#409EFF").css("color", "white").css("border", "1px solid #409Eff");
        $(".tongcheng>span").eq(index).siblings("span").css("background", "white").css("color", "#409Eff").css("border", "1px solid #409Eff");


        for (var i = 0; i < _this.peiSongXiangQing.children.length; i++) {
          if (index == Number(_this.peiSongXiangQing.children[i].city_express)) {
            _this.qiehuans = _this.peiSongXiangQing.children[i];
          }
        }
      },
      //滑过时样式出现
      resetForm(formName) {
        var _this = this;
        _this.$refs[formName].resetFields();
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      //点击  增加  列
      productAdd(column) {
      },
      selectRow(val) {
        this.selectlistRow = val
      },
      removeReduceEdit(row, index) {
        var _this = this;
        console.log(row)
        row.splice(index, 1);
        _this.NewTableDataAdd = row;
      },
      removeReduce(row, index) {
        var _this = this;
        _this.num1--;
        console.log(_this.num1)
        row.splice(index, 1);
        _this.tableData = row;
      },
      //新增产品参数
      addShop() {
        var _this = this;
        console.log(_this.num1)
        if(_this.num1==0){
          _this.num1++;
          console.log(_this.num1)
          let objProject = {
            productName: _this.productName,
            productVal: _this.productVal
          }
          _this.tableData1Add.push(objProject);
        }else{
          console.log(_this.num1)
          console.log(_this.tableData1Add)
          if(_this.tableData1Add[_this.num1-1].productName==undefined){
            _this.$message.error("请将新增的产品参数名补充完整");
          }else if(_this.tableData1Add[_this.num1-1].productVal==undefined){
            _this.$message.error("请将新增的产品参数值补充完整");
          }else{
            _this.num1++;
            let objProject = {
              productName: _this.productName,
              productVal: _this.productVal
            }
            _this.tableData1Add.push(objProject);
          }
        }
      },

      //检测数组对象中的值是否是唯一的
      isArrayOnly(arrays,TestingVal1,TestingVal2,TestingVal3,TestingVal4,TestingVal5){
        TestingVal5=TestingVal5.join(",");
        let newCostPrice=[];
        let newGoodPrice=[];
        let newWeight=[];
        let newStock=[];
        let newSkuRes=[];
        for(let i=0;i<arrays.length;i++){
          newCostPrice.push(arrays[i].cost_price);
          newGoodPrice.push(arrays[i].goods_price);
          newWeight.push(arrays[i].weight);
          newStock.push(arrays[i].stock);
          newSkuRes.push(arrays[i].sku_font);
        }
        if(newCostPrice.indexOf(TestingVal1)!=-1&&newGoodPrice.indexOf(TestingVal2)!=-1&&newStock.indexOf(TestingVal3)!=-1&&newWeight.indexOf(TestingVal4)!=-1&&newSkuRes.indexOf(TestingVal5)!=-1){
          return true;
        }else{
          return false;
        }
      },
      //保存事件
      sitData(index) {
        var _this = this;
        let newArr = [];
        let newSkuResArr = [];
        let skuRes = [];//sku编码数组
        let zongNewArr = [];
        // var stringTan="";
        //获取每一行tr
        //得到动态渲染的数据
        console.log(_this.selectsOptions)
        let newString = _this.selectsOptions.join(",");
        let newSkuRes = zongNewArr.join(",")
        let NexObjs = {};
        NexObjs.val = newString;
        NexObjs.id = _this.getTwoIdEdit.join(",");
        let params = NexObjs;
        console.log(params)
        apiUser.getSkuRess(params).then(res => {
            if (res.cscode == 0) {
              console.log(res)
              _this.getSkuRes = res.data.data;
              //将得到的sku编码重新赋值
              console.log(_this.getSkuRes);

              //得到商品价格范围
              let priceSection=[];
              for(let i=0;i<this.ruleForm.price.split("-").length;i++){
                priceSection.push(Number(this.ruleForm.price.split("-")[i]));
              }
              let goodsPrice=_this.tableDataAdd[0].goods_price;//商品出售价
              let goodsCostPrice=_this.tableDataAdd[0].cost_price;//商品原价
              let goodsStock=_this.tableDataAdd[0].stock;//商品库存
              let goodsWeight=_this.tableDataAdd[0].weight;//商品重量\

              console.log(_this.selectsOptions.join(","))

              //对保存的规格参数进行验证
              if(_this.selectsOptions.length<_this.ProductSpecifications.length){
                _this.$message.error("请选择规格参数值")
              }else if(goodsPrice==undefined){
                _this.$message.error("请输入出售价")
              }else if(goodsPrice<priceSection[0]||goodsPrice>priceSection[1]){
                _this.$message.error("输入的出售价必须在区间范围内");
              }else if(_this.PriceRange(Number(goodsPrice),/^(\-)?\d+(\.\d{1,2})?$/,"出售价输入必须为数字")){
                _this.$message.error(_this.Verification);
              }else if(goodsCostPrice==undefined){
                _this.$message.error("请输入原价")
              }else if(_this.PriceRange(Number(goodsCostPrice),/^(\-)?\d+(\.\d{1,2})?$/,"原价输入必须为数字")){
                _this.$message.error(_this.Verification);
              }else if(goodsStock==undefined){
                _this.$message.error("请输入库存")
              }else if(_this.PriceRange(Number(goodsStock),/^\d{1,}$/,"库存输入必须为正整数")){
                _this.$message.error(_this.Verification);
              }else if(goodsWeight==undefined){
                _this.$message.error("请输入重量")
              }else if(_this.PriceRange(Number(goodsWeight),/^(\-)?\d+(\.\d{1,2})?$/,"重量输入必须为数字")){
                _this.$message.error(_this.Verification);
              }else if(_this.isArrayOnly(_this.NewTableDataAdd,goodsCostPrice,goodsPrice,goodsStock,goodsWeight,_this.selectsOptions)){
                console.log(_this.againSkuRes)
                console.log(_this.NewTableDataAdd)
                _this.$message.error("保存的数据不能一致");
              }else{
                console.log(_this.NewTableDataAdd)
                //赋值给字符串拼接
                _this.GuiGe = {};
                _this.GuiGe.sku_res = _this.getSkuRes;
                _this.GuiGe.stock = _this.tableDataAdd[0].stock;
                _this.GuiGe.weight = _this.tableDataAdd[0].weight;
                _this.GuiGe.sku_num = "";
                _this.GuiGe.cost_price = _this.tableDataAdd[0].cost_price;
                _this.GuiGe.goods_price = _this.tableDataAdd[0].goods_price;
                _this.GuiGe.sku_font=_this.selectsOptions.join(",");
                _this.GuiGe.goods_id=_this.$route.query.ids;
                _this.NewTableDataAdd.push(_this.GuiGe);
                //添加的规格参数与数据
                _this.AddNewTableDataAdd.push(_this.GuiGe);
                console.log(_this.NewTableDataAdd);
                _this.selectsOptions=[];
                _this.tableDataAdd[0].goods_price=undefined;//商品出售价
                _this.tableDataAdd[0].cost_price=undefined;//商品原价
                _this.tableDataAdd[0].stock=undefined;//商品库存
                _this.tableDataAdd[0].weight=undefined;
                _this.getSkuRes=undefined;
              }
            }else{
              _this.$message.error(res.data.msg);
            }
        })
      },
      //拆单属性的选择
      changeDismantling(id) {
        var _this = this;
        _this.ruleForm.resource = _this.resourceList[id].id;
      },
      //查看运费模板详情  跳转页面
      lookXiangQing() {
        var _this = this;
        _this.$router.push({path: '/ordercarriage?', query: {'muBanId': _this.muBanId}})
      },

      //对提交商品时，进行保存后的规格参数进行去重
      SpecificationsDuplicateRemoval(value){
        let newSpecifications=[];
        let flag;
        for(let i=0;i<value.length;i++){
          for(let j=0;j<newSpecifications.length;j++){
            if(newSpecifications[j].cost_price==value[j].cost_price&&newSpecifications[j].goods_price==value[j].goods_price&&newSpecifications[j].stock==value[j].stock&&newSpecifications[j].weight==value[j].weight&&newSpecifications[j].sku_res==value[j].sku_res){
              flag=false;
            }
          }
        }
        return flag;
      },

      //提交商品信息
      submitForm() {
        var _this = this;
        _this.tableData1Add;
        //获取文本编辑器内容值
        //获取到的文本编辑器内容重新赋值给ruleFrom
        // _this.ruleForm.goodsdesc = _this.editor.txt.html()
        // // //得到二级商品分类的id
        console.log(_this.newArrImgs[0])
        console.log(typeof _this.newArrImgs);

        if (_this.ruleForm.farmer_address == "") {
          _this.$message.error("请输入商品产地")
        }else if (_this.ruleForm.farmer_name == "") {
          _this.$message.error("请输入农户名称")
        }else if (_this.ruleForm.farmer_content == "") {
          _this.$message.error("请输入商品简介")
        }else if (_this.headers=="") {
          _this.$message.error("请上传头像")
        }else if (_this.ruleForm.price == "") {
          _this.$message.error("请输入商品价格")
        }else if (_this.ruleForm.name == "") {
          _this.$message.error("请输入商品标题")
        }else if(_this.NewTableDataAdd.length<=0){
          _this.$message.error("请输入商品规格参数并保存");
        }else if(_this.tableData1Add.length<=0){
          _this.$message.error("请添加产品参数");
        }else if(_this.tableData1Add[_this.num1-1].productName==undefined){
          _this.$message.error("请将新增产品参数名补充完整");
        }else if(_this.tableData1Add[_this.num1-1].productVal==undefined){
          _this.$message.error("请将新增产品参数值补充完整");
        }else if (_this.newArrImgs.length<=0) {
          _this.$message.error("请输入上传图片");
        }else if (_this.editor.txt.html() == "<p><br></p>") {
          _this.$message.error("请输入商品描述")
        }else{
          let sku_font_val=[];
          for(let i=0;i<_this.NewTableDataAdd.length;i++){
            sku_font_val.push(_this.NewTableDataAdd[i].sku_font)
            for(let j=0;j<_this.NewTableDataAdd[i].sku_font.length;j++){
              sku_font_val.push(_this.NewTableDataAdd[i].sku_font[j].val)
            }
          }

          let param = {
            goods_res: {
              id: Number(_this.$route.query.ids),                  //             商品id
              goods_tag: 0,                     // 商品标签 0为特卖 1为不知道
              price: _this.ruleForm.price,                           // 商品价格
              name: _this.ruleForm.name,                       // 商品名称
              img: JSON.stringify(_this.newArrImgs),                  //商品图片地址
              video: "",                //商品视频地址
              describe: _this.editor.txt.html(),    //  商品详情描述
              goods_type: "",                        //商品特殊类型 0为普通商品 1为易碎商品
              delivery_cost: _this.muBanId,                     // 配送模板id
              farmer_address: _this.ruleForm.farmer_address,                     //  商品产地
              farmer_name: _this.ruleForm.farmer_name,                         // 农户名
              farmer_photo: _this.headers,                        // 农户头像
              farmer_content: _this.ruleForm.farmer_content,                        // 农户简介
              dml_type: _this.ruleForm.resource,//拆单属性 0为普通商品 1为单独配送商品 2为同城即时达
              goods_parm: JSON.stringify(_this.tableData1Add)//产品参数
            },
            sku_res: [],
            add_sku_res: [],
          };
          param.sku_res = _this.OriginalNewTableDataAdd;//修改商品时候，初始化获得的规格参数数据
          param.add_sku_res = _this.AddNewTableDataAdd;//修改商品时候，初始化获得的规格参数数据

          console.log(param)
          // param = utils.filterJson(param);
          apiUser.submitShop(param).then(res => {
            if (res.cscode == 0) {
              this.$message("商品编辑成功");
              this.$router.go(-1)
            } else {
              this.$message.error(res.data.mag)
            }
          });
        }
      }
    }
  }
</script>
<style scoped>
  @import url("../../assets/css/Goods.css");
  /*新增的input*/
  .addInputVal,.addInputName{
    display: inline-block;
    border: none;
    width: 74%;
    height: 40px;
    line-height: 40px;
    padding:0 15px;
    margin: 16px auto;
    border-radius: 4px;
    background: white;
    outline:0;
    border: 1px solid #dcdfe6;
  }
  .addInputVal::placeholder,.addInputName::placeholder{
    color: #99a9bf;
  }

  .cell{
    position: relative;
  }
  .el-icon-remove-outline{
    font-size: 20px !important;
    position: absolute;
    right: 40px;
    top:2px;
    color: blue;
    display: none;
    cursor: pointer;
    color: #606266;
    border: 1px solid #dcdfe6;
  }
  .cell:hover .el-icon-remove-outline{
    display: block;
  }
  .el-icon-circle-plus-outline{
    position: absolute;
    top: 25px;
    left: 0;
    color: blue;
    z-index: 333555;
    font-size: 20px;
    cursor: pointer;
  }
  .el-table{
    padding-left: 30px!important;
    border: 0;
  }
  table{
    border: 1px solid #eee;
    border-collapse: collapse;
  }
  table cell:nth-of-type(6){
    width: 30px!important;
  }
  .el-table{
    padding-left: 0!important;
  }


  /*上传的图片*/
  .addImg_bigBox{
    margin: 20px 0;
    overflow: hidden;
    width: 100%;
  }
  .addImg_bigBox>span{
    display:block;
    padding: 0 12px 0 0;
    font-size: 14px;
    width: 88px;
    text-align: right;
    float: left;
    color: #606266;
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

  .chakan>span:hover{
    cursor: pointer;
  }

  table th.musts div:before {
    content: '*';
    color: #ff1818;
  }

</style>
