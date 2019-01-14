<template xmlns="">
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>发布商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation">关于商城中所有的商品，您可以对商品进行搜索，也能对商品进行修改、发布操作</p>
    <div class="tips_box">
      <span class="tips_img">!</span>
      <span class="tips_text">发布流程：1.填写农场主信息。2.选择商品分类。3.输入商品基本信息（使用产品库快捷添加）。4.选择配送费模板。5.发布商品。</span>
    </div>
    <el-form :model="NewRuleForm" :rules="Elerules" ref="NewRuleForm" label-width="100px" class="demo-ruleForm">
      <p style="margin-top: 20px">1.请填写农场主信息</p>
      <div >
        <imgload  :title="'农场主照片'" :imgarr="NewRuleForm.farmer_photo" @loadimg="my_imgget"></imgload>
        <imgload  :title="'证书照片'" :imgarr="NewRuleForm.business_license"  @loadimg="business_licenseget"></imgload>
      </div>
      <div style="padding-bottom: 20px">
        <!--v-if="NewRuleForm.shop_img"-->
        <imgloadMore v-if="NewRuleForm.shop_img" :imgnum="imgnum" :title="shop_imgtitle" :imgarr="NewRuleForm.shop_img" @loadimg="shop_imgget"></imgloadMore>
      </div>
      <el-form-item hidden label="商户姓名" style="width: 800px" prop="manager_name">
        <el-input v-model="NewRuleForm.manager_name" placeholder="请输入商户名称"></el-input>
      </el-form-item>
      <el-form-item label="农户姓名" style="width: 800px" prop="farmer_name">
        <el-input v-model="NewRuleForm.farmer_name" placeholder="请输入农户名称"></el-input>
      </el-form-item>
    <el-form-item label="商品产地" style="width: 800px" prop="farmer_address">
      <el-input v-model="NewRuleForm.farmer_address" placeholder="请输入商品产地"></el-input>
    </el-form-item>
      <el-form-item label="联系方式" style="width: 800px" prop="manager_phone">
        <el-input v-model="NewRuleForm.manager_phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="品质描述" style="width: 800px" prop="remark">
        <el-input v-model="NewRuleForm.remark" placeholder="请输入品质描述"></el-input>
      </el-form-item>
    <el-form-item label="农户简介" style="width: 800px" prop="farmer_name_res">
      <el-input v-model="NewRuleForm.farmer_name_res" placeholder="请输入农户简介"></el-input>
    </el-form-item>
      <el-form-item label="农场简介" style="width: 800px" prop="farmer_res">
        <el-input v-model="NewRuleForm.farmer_res" placeholder="请输入农场简介"></el-input>
      </el-form-item>
    <!--第一步-->
    <p>2.选择商品分类</p>
      <el-form-item label="商品分类" style="width: 800px" prop="changelist">
        <el-select v-model="input1" placeholder="请选择一级商品分类"  @change="changeMenu(input1)">
          <el-option v-for="(item,index) in changelist"
                     :key="index"
                     :label="item.cat_name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="input1_son" placeholder="请选择二级商品分类"   @change="changeMenu_Son(input1_son,input1)">
          <el-option
            v-for="(item,index) in changelist_SonVal"
            :key="index"
            :label="item.cat_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品标签">
        <el-radio-group v-model="NewRuleForm.goods_tag">
          <!--<el-radio  label="特卖" name="type"></el-radio >-->
          <el-radio  :label="1" name="type">普通商品</el-radio >
          <el-radio  :label="2" name="type">优质农产</el-radio >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="三品一标" prop="goods_labels">
        <el-checkbox-group v-model="goods_labels">
          <el-checkbox :label="1" >地标</el-checkbox>   <!--地标-->
          <el-checkbox :label="2" >无公害</el-checkbox>  <!--无公害-->
          <el-checkbox :label="3" >绿色</el-checkbox>    <!--绿色-->
          <el-checkbox :label="4" >有机食品</el-checkbox>    <!--有机食品-->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="所属供应商" style="width: 800px" prop="supplier">
        <el-input v-model="ruleForm.supplier" placeholder="非必填 "></el-input>
      </el-form-item>
      <el-button style="margin-left: 100px;margin-bottom: 10px;" type="primary" icon="el-icon-plus" @click="$router.push('goodsadd')">新增商品分类</el-button>
      <!--第二步-->
      <p>3.商品基本信息</p>
      <el-form-item label="市场价格" style="width: 800px" prop="market_price">
        <el-input v-model="NewRuleForm.market_price" placeholder="请输入数字并且数字之间“-”隔开" @blur="price_fanwei"></el-input>
      </el-form-item>
      <!--商品标题-->
      <el-form-item label="商品标题" style="width: 800px" prop="name">
        <el-input v-model="NewRuleForm.name" placeholder="请输入商品名称" :maxlength="40"></el-input>
      </el-form-item>
      <!--规格参数-->
      <!--新增商品规格参数-->
      <el-form-item label="商品规格" style="width: 800px" prop="changelist">
        <el-select v-model="specificate" multiple placeholder="请选择" :multiple-limit="maxnumchoose" @change="changespec" @visible-change="changespechidden" @remove-tag="removespec">
          <el-option
            v-for="item in specoption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="two" label="规格参数" prop="tableDataAdd">
        <el-table
          :data="tableDataAdd"
          current-row-key="index"
          ref="table1"
          tooltip-effect="dark"
          border
          stripe
          style="width: 90%"
          :header-cell-class-name="musts"
          >
          <el-table-column label="序号"  type="index" width="60" align="center"></el-table-column>
          <el-table-column label="单买价" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.goods_price" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="团购价" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.group_price" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>


          <el-table-column v-if="$route.query.ids && tablecolumn" label="限时团购价" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.flashsale_gprice" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="$route.query.ids && tablecolumn" label="限时单买价" width="150" class="111" style="">
            <template slot-scope="scope">
              <el-input   v-model="scope.row.flashsale_price" placeholder="请输入出售价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="进货价" width="150">
            <template slot-scope="scope">
              <el-input  v-model="scope.row.cost_price" placeholder="请输入商品原价"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存" width="150">
            <template slot-scope="scope">
              <el-input  class="lelele" v-model="scope.row.stock" placeholder="请输入商品库存"></el-input>
            </template>
          </el-table-column>
            <el-table-column v-if="item.value !=1" v-for="(item,index) in newarr" :key="index" :label="item.value ==2?item.label+'(kg)':item.label"  width="150">
              <template slot-scope="scope">
                <!--{{scope.row.arr[index]}}-->
                <el-input v-if="item.value ==2 " ref="zhongliang" v-model="scope.row.arr[index].cat_type_val" :placeholder="'请输入'+item.label"></el-input>
                <el-input v-if="item.value !=2 " ref="zhongliang" v-model="scope.row.arr[index].cat_type_val" :placeholder="'请输入'+item.label"></el-input>
                <!--<el-input v-if="scope.row.arr[index]==" ref="zhongliang"> 无 </el-input>-->
              </template>
            </el-table-column>
          <el-table-column label="操作数据"  width="120">
            <template slot-scope="scope">
              <div v-if="tableDataAdd.length!=1">
                <span class="el-icon-remove" style="color: red;font-size: 24px" @click="removesku(scope.$index,scope.row)"></span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <span class="el-icon-circle-plus" style="width: 30px;display:block;font-size: 24px;color: #45af05;margin: 20px 90px;" @click="addskumore"></span>
      <!--新增产品参数-->
      <el-form-item  label="产品参数">
        <el-table
          :data="tableData1Add"
          current-row-key="index"
          ref="table1"
          tooltip-effect="dark"
          border
          stripe
          style="width: 90%"
         >
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

      <div>
        <span style="padding-left: 15px;font-size: 14px;color: #606266;"><em style="color: red;margin-right: 4px;font-style: normal;">*</em>商品图片</span>
        <span style="color: rgb(153, 153, 153)">上传图片的最佳尺寸：720像素*720像素，其他尺寸会影响页效果，格式png，jpeg，jpg，gif。大小不超过2M，商品图片一共可以上传5张，默认第一张为主图封面</span>
      </div>
      <div>
        <!--<imgloadMore v-if="NewRuleForm.good_img && $route.query.ids" :imgnum="imgnum" :title="imgmaintitle" :imgarr="NewRuleForm.good_img" @loadimg="good_imgget"></imgloadMore>-->
        <imgloadMore v-if="NewRuleForm.good_img" :imgnum="imgnum" :title="imgmaintitle" :imgarr="NewRuleForm.good_img" @loadimg="good_imgget"></imgloadMore>
      </div>
      <div>
        <span style="padding-left: 15px;font-size: 14px;color: #606266;"><em style="color: red;margin-right: 4px;font-style: normal;">*</em>品质检验</span>
        <span style="color: rgb(153, 153, 153)">上传的视频大小不能超过200M，视频时长不能超过5分钟。支持的视频格式： .wmv .avi .dat .asfReal Player: .rm .rmvb .ramMPEG视频： .mpg .mpeg手机视频：.3gpApple视频：.movSony视频： .mp4 .m4vDV视频： .dvix .dv其他常见视频：.dat .mkv .flv .vob .ram .qt .divx .cpk .fli .flc .mod</span>
      </div>
      <div style="padding-bottom: 30px">
        <videoComponent v-if="goodsvideo" :videonum="videonum" :videotitle="videotitle" :videoarr="videoarrsobj.good_video" @loadimgs="good_videoget"></videoComponent>
        <!--<imgloadMore v-if="goodsimg" :imgnum="imgnum" :title="videotitle" :imgarr="goodsimg"></imgloadMore>-->
      </div>
      <!--品质检验-->
      <!--商品描述-->
      <el-form-item hidden label="商品描述" prop="goodsdesc">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item  label="商品描述" prop="goodsdesc">
        <div style="padding-bottom: 20px">
          <imgload  :title="'生长照片'" :imgarr="NewRuleForm.img.growth" @loadimg="grown"></imgload>
          <imgload :title="'收获照片'" :imgarr="NewRuleForm.img.harvest"  @loadimg="harves"></imgload>
          <imgload  :title="'膳食照片'" :imgarr="NewRuleForm.img.therapy"  @loadimg="diet"></imgload>
        </div>
      </el-form-item>
      <el-form-item label="生长过程" style="width: 800px" prop="growth_process">
        <el-input v-model="NewRuleForm.growth_process" placeholder="请输入生长过程" :maxlength="300"></el-input>
      </el-form-item>
      <el-form-item label="收获过程" style="width: 800px" prop="gain_process">
        <el-input v-model="NewRuleForm.gain_process" placeholder="请输入收获过程" :maxlength="300"></el-input>
      </el-form-item>
      <el-form-item label="食疗功效" style="width: 800px" prop="food_therapy">
        <el-input v-model="NewRuleForm.food_therapy" placeholder="请输入食疗功效" :maxlength="300"></el-input>
      </el-form-item>
      3.配送服务
      <el-form-item label="拆单属性" prop="resource" class="peisong" hidden>
        <el-radio v-model="NewRuleForm.resource"  v-for="(items,index) in resourceList" :key="items.index" :label="items.id">{{items.name}}</el-radio>
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
            :value="items.id">
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
      <el-form-item label="团购要求" prop="region" class="peisongfei">
        <el-form-item style="margin-top: 10px" label="团购人数">
          <el-input style="width: 300px" v-model="NewRuleForm.group_mz_num" placeholder="团购人数"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px"  label="单次限量">
          <el-input style="width: 300px" v-model="NewRuleForm.limit_quantity" placeholder="单次限量"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px"  label="限购次数">
          <el-input style="width: 300px" v-model="NewRuleForm.limit_next" placeholder="限购次数"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item style="margin-top: 50px">
        <el-button  type="primary" @click="submitFormnew('ruleForm')"><span v-if="!$route.query.ids">发布商品</span> <span v-if="$route.query.ids">修改商品</span></el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as Qiniu from 'qiniu-js'
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'
  import imgloadMore from '@/views/common/imgloadMore'
  import videoComponent from '@/views/common/videoComponent'
  import imgload from '@/views/common/imgload'
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
        tablecolumn:true,
        goods_labels:[ ],
        shop_imgtitle:'农场照片',
        imgmaintitle:'商品主图',
        videotitle:'视频',
        NewRuleForm:{
          img:{
            growth:'',
            harvest:'',
            therapy:''
          },
          farmer_photo:'',
          business_license:'',
          shop_img:[],
          manager_name:"自营",
          farmer_address:'',
          manager_phone:'',
          remark:'',
          farmer_name_res:'',
          farmer_res:'',
          goods_type:'',
          cat_id:'',
          market_price:'',
          name:'',
          good_img:[],
          growth_process:'',
          gain_process:'',
          food_therapy:"",
          resource:'',
          goods_tag:1,
          goods_labels:[ ],
          group_mz_num:'',
          limit_quantity:'',
          limit_next:''
        },
        ruleForm: {
          imglist:{
            userimg:'http://tupian.qqjay.com/u/2017/1118/1_162252_8.jpg',
            farm:'http://tupian.qqjay.com/u/2017/1118/1_162252_8.jpg',
            ficate:'http://tupian.qqjay.com/u/2017/1118/1_162252_8.jpg'
          },
          farmer_address: "",                       //  商品产地
          farmer_name: "",                          // 农户名
          farmer_photo: "",                         // 农户头像
          farmer_content: "",
          farm:"",                                  //农场简介
          productlabe: [],
          type: [],
          goods_labels:[],                          //商品标签
          headers: "",                              //头像上传
          supplier:'',                              //所属供应商
          price: '',
          name: '',
          goodsdesc: "",
          resource: "",//拆单属性
          // resourceId:"",
        },
        //添加产品参数的计数
        num1:0,
        maxnumchoose:3,
        specificate:[2],
        specoption:[],
        newarr:[],
        //接收得到的sku编码
        againSkuRes:[],
        skutemparr:{},
        goodsimg:[],
        goodsvideo:[],
      //正则验证
        Verification:"",
        //动态循环出多个select
        selectsOptions:[],
        //保存规格后的渲染数据定义
        sku_font_guige:[],
        //文本编辑器传递给子组件的参数
        dat: {
          content: ''
        },
        //上传图片   后缀名格式定义判断
        imgData: {
          accept: 'image/gif, image/jpeg, image/png, image/jpg',
        },
        //选中过二级分类后得到的sku_res编码
        getSkuRes: "",
        shangchuan: rootUrl,//上传图片   调用接口路径

        //上传图片
        newArrImgs: [],
        //上传视频
        videoarr:[],
        videoarrsobj:{
          good_video:[],
        },
        //新增商品规格的显示隐藏
        isGuigeAdd: false,
        //配送模板的详情
        peiSongXiangQing: {},
        //新增商品规格参数
        tableDataAdd: [
          {goods_price:'',group_price:'',cost_price:'',stock:''}
        ],
        //新增商品规格参数   传参
        NewTableDataAdd: [],
        //定义选中二级分类的id值
        secondLevel: "",
        //  增加规格参数
        ProductSpecifications: [],
        //规格参数对象
        GuiGe: {},
        tableData1Add: [],
        //一级菜单
        input1: '',
        //二级菜单
        input1_son: '',
        //二级菜单分类
        input2: '',//运费模板
        //商品的一级分类
        changelist: [],
        //商品的二级分类
        changelist_SonVal: [],
        getTwoId: [],
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

        //配送费详情
        peisong: {},
        //切换同城、快递
        qiehuans: {},
        //模板的id
        muBanId: "",
        Elerules: {
          manager_name: [
            {
              required: true,
              message: '请输入商户名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 5,
              message: '标题长度在 1 到5 个字符',
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
          farmer_address: [
            {
              required: true,
              message: '请输入商品产地',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '标题长度在 2 到10个字符',
              trigger: 'blur'
            }
          ],
          manager_phone:[
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },

          ],
          remark: [
            {
              required: true,
              message: '请输入商品产地',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '标题长度在 10 到300个字符',
              trigger: 'blur'
            }
          ],
          farmer_name_res: [
            {
              required: true,
              message: '请输入农户简介',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '标题长度在 10 到300 个字符',
              trigger: 'blur'
            }
          ],
          farmer_res: [
            {
              required: true,
              message: '请输入农场简介',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '标题长度在 10 到300 个字符',
              trigger: 'blur'
            }
          ],
          market_price: [
            {
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
              max: 40,
              message: '标题长度在 1 到40 个字符',
              trigger: 'blur'
            }
          ],
          growth_process: [
            {
              required: true,
              message: '请填写生长描述',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '描述长度在 10 到 300 个字符',
              trigger: 'blur'
            }
          ],
          gain_process: [
            {
              required: true,
              message: '请填写收获描述',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '描述长度在 10 到 300 个字符',
              trigger: 'blur'
            }
          ],
          food_therapy: [
            {
              required: true,
              message: '请填写膳食描述',
              trigger: 'blur'
            },
            {
              min: 10,
              max: 300,
              message: '描述长度在 10 到 300 个字符',
              trigger: 'blur'
            }
          ],
          // goods_labels: [
          //   { type: 'array',
          //     required: true,
          //     message: '请至少选择一个商品标签',
          //     trigger: 'change' }
          // ],
          group_mz_num: [
            {
              required: true,
              message: '请输入团购人数',
              trigger: 'blur'
            }, {
              min: 1,
              message: '团购人数必须大于1人',
              trigger: 'blur'
            }],
          limit_quantity: [
            {
              required: true,
              message: '请输入限量数',
              trigger: 'blur'
            }, {
              min: 1,
              message: '限量数必须大于1',
              trigger: 'blur'
            }],
          limit_next: [
            {
              required: true,
              message: '请输入限购次数',
              trigger: 'blur'
            }, {
              min: 1,
              message: '限购数必须大于等于1',
              trigger: 'blur'
            }],
          headers:{
            required: true,
            message: '请上传头像',
            trigger: 'blur'
          },
          resource: [{
            required: true,
            message: '请选择拆单属性',
            trigger: 'change'
          }],
        },
        dialogImageUrl: '',
        dialogVisible: false,
        imgnum:5,
        videonum:4,
        imgtitle:'hah'
      }
    },
    //页面加载首先执行的方法
    mounted: function(){
      this.specmodel()
      this.getSelect();
      this.gettemateel()
      if (this.$route.query.ids){
        this.getgoodsmessage()
      }

    },
    methods: {
      submitFormnew(){
        var message = this.NewRuleForm
        let vm = this
        var goods_parm = JSON.stringify(this.tableData1Add)
        message.goods_labels = this.goods_labels
        if(!message.farmer_photo){
          vm.$message.error('请上传个人头像')
          return
        }
        if(!message.business_license){
          vm.$message.error('请上传证书照片')
          return
        }
        if(!message.shop_img){
          vm.$message.error('请上传农场照片')
          return
        }
        if(!message.farmer_address){
          vm.$message.error('请输入商品产地')
          return
        }
        if(!message.manager_phone){
          vm.$message.error('请输入手机号')
          return
        }
        if(!message.remark){
          vm.$message.error('请输入商品描述')
          return
        }
        if(!message.farmer_name_res){
          vm.$message.error('请输入农户简介')
          return
        }
        if(!message.farmer_res){
          vm.$message.error('请输入农场简介')
          return
        }
        if(!message.cat_id){
          vm.$message.error('请选择商品分类')
          return
        }
        if(!message.goods_tag){
          vm.$message.error('请选择商品标签')
          return
        }
        if(!message.goods_labels){
          vm.$message.error('请选择 三品一标')
          return
        }
        if(!message.market_price){
          vm.$message.error('请输入市场价')
          return
        }
        if(!message.name){
          vm.$message.error('请输入商品标题')
          return
        }
        if(!message.goods_type){
          vm.$message.error('请选择商品规格')
          return
        }
        if(!goods_parm){
          vm.$message.error('请输入商品参数')
          return
        }
        if(!message.good_img){
          vm.$message.error('上传商品主图')
          return
        }
        if(Object.values(this.NewRuleForm.img).indexOf('')!=-1){
          vm.$message.error('请补充完整商品描述图')
          return
        }
        if(!message.growth_process){
          vm.$message.error('请输入生长过程')
          return
        }
        if(!message.gain_process){
          vm.$message.error('请输入收获过程')
          return
        }
        if(!message.food_therapy){
          vm.$message.error('请输入食疗功效')
          return
        }
        if(!message.group_mz_num){
          vm.$message.error('请输入团购人数')
          return
        }
        if(!message.limit_quantity){
          vm.$message.error('请输入单次限量数')
          return
        }
        if(!message.limit_next){
          vm.$message.error('请输入限购次数')
          return
        }
        let pricearr = []
        this.tableDataAdd.forEach(function (item) {
          pricearr.push(item.group_price)
        })
        var minprice = Math.min.apply(null, pricearr)
        this.tableDataAdd.forEach(item=>{
          item.goods_name=vm.NewRuleForm.name
        })
        let skuflg = true
        this.tableDataAdd.forEach(function (item) {

         if(vm.$route.query.ids){
           delete item.goods_name
         }

          item.arr.forEach(function (newitem) {
            if (newitem.cat_type_id==2){
              if(newitem.cat_type_val.indexOf('kg')==-1){
                newitem.cat_type_val = newitem.cat_type_val+'kg'
              }
            }
            if(newitem.cat_type){
              delete newitem.cat_type;
            }
          })
        })
        if(vm.$route.query.ids){
          console.log("message");
          console.log(message);
          if(this.muBanId==''){
            this.$message.error('请选择运费模板')
            return
          }
          if(this.videoarrsobj.good_video=='[]'){
            this.videoarrsobj.good_video = ''
          }
          let editParams = {
            'uid':'308',
            "shop_id":'1',
            "goods_id":vm.$route.query.ids,
            "shop":{
              "manager_name":"自营",
              "manager_phone":message.manager_phone,
              "status":'4',
            },
            "goods":{
              "classify":message.cat_id,
              "name":message.name,
              "growth_process":message.growth_process,
              "gain_process":message.gain_process,
              "food_therapy":message.food_therapy,
              "goods_parm":goods_parm,
              "goods_type":message.goods_type,
              "farmer_name":message.farmer_name,
              "remark":message.remark,
              "farmer_address":message.farmer_address,
              "farmer_name_res":message.farmer_name_res,
              "farmer_res":message.farmer_res,
              "market_price":message.market_price,
              "farmer_photo":message.farmer_photo,
              "price":minprice,
              "business_license":message.business_license,
              "goods_tag":message.goods_tag,
              "cat_sku_id":message.goods_labels.join(','),
              "shop_img":message.shop_img,
              "img":JSON.stringify(Object.values(message.img)),
              "good_img":message.good_img,
              "group_mz_num":message.group_mz_num,
              "limit_quantity":message.limit_quantity,
              "limit_next":message.limit_next,
              "delivery_cost": this.muBanId,                     // 配送模板id
              video:this.videoarrsobj.good_video,   //视频

            },
            'sku':this.tableDataAdd,
            'admin_name':utils.getCookie('realname')
          };
          editParams = utils.filterJson(editParams);
          apiUser.editGoods(editParams).then(res=>{
            console.log(JSON.stringify(editParams))
            if(res.cscode==0){
              vm.$message.success(res.data.msg)
              vm.getgoodsmessage()
            }else {
              vm.$message.error(res.data.msg)
            }
          })
        }else {
          new Promise((resolve, reject) => {
            apiUser.getSepcId(this.tableDataAdd).then(res=>{
              if(res.cscode==0){
                resolve(res.data.data)
              }
            })
          }).then(res=>{
            if(this.videoarrsobj.good_video=='[]'){
              this.videoarrsobj.good_video = ''
            }
              let addParams = {
                'uid':'308',
                "shop":{
                  "manager_name":"自营",
                  "manager_phone":message.manager_phone,
                  "shop_id":'1',
                },
                "goods":{
                  "cat_id":message.cat_id,
                  "name":message.name,
                  "growth_process":message.growth_process,
                  "farmer_name":message.farmer_name,
                  "remark":message.remark,
                  "farmer_photo":message.farmer_photo,
                  "farmer_address":message.farmer_address,
                  "farmer_name_res":message.farmer_name_res,
                  "farmer_res":message.farmer_res,
                  "gain_process":message.gain_process,
                  "food_therapy":message.food_therapy,
                  "goods_parm":goods_parm,
                  "goods_type":message.goods_type,
                  "sku_ids":res,
                  "market_price":message.market_price,
                  "price":minprice,
                  "business_license":message.business_license,
                  "goods_tag":message.goods_tag,
                  "cat_sku_id":message.goods_labels.join(','),
                  "shop_img":message.shop_img,
                  "img":JSON.stringify(Object.values(message.img)),
                  "good_img":message.good_img,
                  "group_mz_num":message.group_mz_num,
                  "limit_quantity":message.limit_quantity,
                  "limit_next":message.limit_next,
                  "status":'1',
                  delivery_cost: this.muBanId, // 配送模板id
                  video:this.videoarrsobj.good_video,   //视频

                },
                'admin_name':utils.getCookie('realname')
              };
            addParams = utils.filterJson(addParams);
            apiUser.addGoods(addParams).then(res=>{
                if(res.cscode==0){
                  vm.$message.success(res.data.msg)
                }else {
                  vm.$message.error(res.data.msg)
                }
              })
          })
        }
      },
      musts(obj){
        if(obj.columnIndex == 3 || obj.columnIndex == 4 || obj.columnIndex == 5) {
          return 'must';
        }
      },
      my_imgget(val){
        this.NewRuleForm.farmer_photo = val
      },
      business_licenseget(val){
        this.NewRuleForm.business_license = val
      },
      shop_imgget(val){
        this.NewRuleForm.shop_img = JSON.stringify(val)
      },
      good_imgget(val){
        console.log(val);
        this.NewRuleForm.good_img = JSON.stringify(val)
      },
      good_videoget(val){
        console.log(val);
        this.videoarrsobj.good_video=JSON.stringify(val)
      },
      grown(val){
        this.NewRuleForm.img.growth = val
      },
      harves(val){
        this.NewRuleForm.img.harvest = val
      },
      diet(val){
        this.NewRuleForm.img.therapy = val
      },
      specmodel(){
        let vm =this
        let params = {}
        apiUser.getSkuRes(params).then(res=>{
          if(res.cscode==0){
            let oldarr = res.data.data
            let newarr = []
            oldarr.forEach(function (item,index) {
              newarr.push({'label':item.cat_type,"value":item.id})
            })
            vm.specoption = newarr
          }
        })
      },
      removespec(val){
        this.newarr.splice(Array.from(this.newarr,item=>item.value).indexOf(val),1)
      },
      changespec(val){
        let vm =this
        if(val.indexOf(2)==-1){
          vm.$message.error('重量必选')
        }
        if(val.indexOf(1) !=-1){
          vm.maxnumchoose=2
          vm.specificate=[2,1]
        }else {
          vm.maxnumchoose=3
        }
        if(val.findIndex(item=>item==1)!=-1){this.NewRuleForm.goods_type = 2}else {this.NewRuleForm.goods_type = 1}
      },
      changespechidden(val){
        let vm =this
        let newarr = []
        if(val==false){
          vm.specificate.forEach(function (item) {
            let index =  Array.from(vm.specoption,item=>item.value).indexOf(item)
            if(index !=-1){
              newarr.push(vm.specoption[index])
            }
          })
        }
        vm.newarr = newarr
        vm.tableDataAdd.forEach(function (item) {
          if(!item.arr){
            item.arr = []
          }
          newarr.forEach(function (newitem,index) {
            item.arr[index]={
                'cat_type_id':newitem.value,
                'cat_type_val':''
            }
          })
        })

      },
      addskumore(){
        let vm = this
        let temparr = vm.tableDataAdd[0]
        vm.skutemparr = temparr
        let addtargetarr = JSON.parse(JSON.stringify(this.skutemparr))
        for (let i in addtargetarr){
          if(i != 'arr'){
            addtargetarr[i]=''
          }else {
            addtargetarr.arr.forEach(item=>item.cat_type_val='')
          }
        }
        this.tableDataAdd.push(addtargetarr)
      },
      removesku(index,row){
        let params={
          sku_id:row.id
        }
        let vm =this
        this.$alert('', '确定删除此规格？', {
          confirmButtonText: '确定',
          callback: action => {
            apiUser.deletegoodssku(params).then(res => {
              if(res.cscode==0){
                vm.tableDataAdd.splice(index,1)
                vm.$message.success(res.data.msg)
              }else {
                vm.$message.error(res.data.msg)
              }
            })
          }
        });

      },
      getgoodsmessage(){
        let ids= this.$route.query.ids
        let vm =this
        new Promise((resolve, reject) => {
            apiUser.openGoods({"goods_id":ids}).then(res=>{
              console.log(res);
              if(res.cscode==0){
                resolve(res)
                this.videoarrsobj.good_video = res.data.data.goods.video
              }
            })
        }).then(res=>{
          let business_license = res.data.data.goods.business_license
          let shop_img = res.data.data.goods.shop_img
          vm.NewRuleForm = Object.assign(res.data.data.goods,res.data.data.shop)
          vm.NewRuleForm.business_license = business_license
          vm.NewRuleForm.cat_id = res.data.data.goods.classify
          let [specificate,newarr] =[[],[]]
          res.data.data.sku[0].arr.forEach(function (item) {
            specificate.push(item.cat_type_id)
            newarr.push({'label':item.cat_type,"value":item.cat_type_id})
          })
          vm.specificate = specificate
          vm.newarr = newarr
          vm.tableData1Add = JSON.parse(res.data.data.goods.goods_parm)
          vm.tableDataAdd = res.data.data.sku
          res.data.data.sku.forEach(x=>{
            if(!x.flashsale_gprice && !x.flashsale_price){
              vm.tablecolumn = false
            }else {
              vm.tablecolumn = true
            }
          })
          let goods_labels= []
          res.data.data.goods.cat_sku_id.forEach(function (item) {
            if(item.cat_sku_id!=0){
              goods_labels.push(item.cat_sku_id)
            }
          })
          vm.goods_labels =goods_labels
          vm.NewRuleForm.goods_tag = res.data.data.goods.goods_tag*1
          let [linshiimgarr,img] = [JSON.parse(vm.NewRuleForm.img),{}]
          img.growth = linshiimgarr[0]
          img.harvest = linshiimgarr[1]
          img.therapy = linshiimgarr[2]
          vm.NewRuleForm.img = img
          vm.NewRuleForm.shop_img = JSON.parse(shop_img)
          vm.NewRuleForm.good_img = JSON.parse(res.data.data.goods.good_img)
          var fatherindex = ''
          var sonindex = ''
          // vm.input2=47
          vm.changelist.forEach((item,index)=>{item.children.forEach((newitem,newindex)=>{
            if(res.data.data.goods.classify == newitem.id){
              sonindex = newindex
              fatherindex  = index
            }
          })})
          vm.input1 = vm.changelist[fatherindex].cat_name
          vm.input1_son = vm.changelist[fatherindex].children[sonindex].cat_name
        })
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
        for(let i=0;i<val.length;i++){
          if(!listVal.test(Number(val[i]))){
            _this.Verification = getVal;
            return _this.Verification;
          }
        }
      },
      //价格范围失去焦点
      price_fanwei(){

      },

      selectIndex(index){
        console.log( $(".two table tr").children("td").eq(index+1).children("div").children("select option:selected").attr('value') )
      },

      //保存规格中 删除规格参数事件
      removeReduceEdit(row, index) {
        var _this = this;
        row.splice(index, 1);
        _this.NewTableDataAdd = row;
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
          alert('请选择3M以内的图片   ！');
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
      gettemateel(){
        let vm =this
        let param={
          shop_id:1
        }
        apiUser.getDeliveryTemplate(param).then(res=>{
          if(res.cscode==0){
            vm.region = res.data.data
          }
        })






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
      //商品下拉分类
      getSelect() {
        var _this = this
        let param1 = {};
        //一级列表系列商品的所有信息
        apiUser.fabuShop(param1).then(res => {
          if (res.cscode == 0) {
            _this.changelist = res.data.data;
          } else {
            _this.$message.error(res.data.msg);
          }
        });
      },
      //商品一级下拉框值改变时候  二级分类列表跟着改变  进行change事件
      changeMenu(id) {
        var _this = this;
        //选中后  重新将二级分类列表   选中的值为空
        _this.input1_son = "";
        //获取数组的下标
        var indexList = 0;
        for (var i = 0; i < _this.changelist.length; i++) {
          if (id == _this.changelist[i].id) {
            indexList = i;
          }
        }
        //二级列表系列商品的所有信息
        if (_this.changelist[indexList].children == undefined) {
          _this.$message.error("没有该二级分类字段")
        } else if (_this.changelist[indexList].children.length <= 0) {
          _this.$message.error("没有二级分类商品")
        } else {
          _this.changelist_SonVal = _this.changelist[indexList].children;
        }
      },
      //商品二级下拉框值改变时候进行change事件
      changeMenu_Son(index, ids) {
        var _this = this;
        _this.secondLevel = index;
        _this.NewRuleForm.cat_id =index
      },
      //滑过时样式出现
      resetForm(formName) {
        this.NewRuleForm ={
          img:{
            growth:'',
              harvest:'',
              therapy:''
          },
          farmer_photo:'',
            business_license:'',
            shop_img:[],
            manager_name:"自营",
            farmer_address:'',
            manager_phone:'',
            remark:'',
            farmer_name_res:'',
            farmer_res:'',
            goods_type:'',
            cat_id:'',
            market_price:'',
            name:'',
            good_img:[],
            growth_process:'',
            gain_process:'',
            food_therapy:"",
            resource:'',
            goods_tag:1,
            goods_labels:[ ],
            group_mz_num:'',
            limit_quantity:'',
            limit_next:''
        }
        this.tableData1Add=[]
        this.specificate=[]
      },
      //点击  增加  列
      productAdd(column) {
      },

      removeReduce(row, index) {
        var _this = this;
        _this.num1--;
        row.splice(index, 1);
        _this.tableData = row;
      },
      addShop() {
        var _this = this;
        if(_this.num1==0){
          _this.num1++;
          let objProject = {
            productName: _this.productName,
            productVal: _this.productVal
          }
          _this.tableData1Add.push(objProject);
        }else{
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
          newSkuRes.push(arrays[i].sku_res);
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
        let newString = _this.selectsOptions.join(",");
        let newSkuRes = zongNewArr.join(",")
        let NexObjs = {};
        NexObjs.val = newString;
        NexObjs.id = _this.getTwoId.join(",");
        let params = NexObjs;
        apiUser.getSkuRess(params).then(res => {
          if (res.cscode == 0) {
            _this.againSkuRes=res.data.data;
            //得到商品价格范围
            let priceSection=[];
            for(let i=0;i<this.ruleForm.price.split("-").length;i++){
              priceSection.push(Number(this.ruleForm.price.split("-")[i]));
            }
            let goodsPrice=_this.tableDataAdd[0].goods_price;//商品出售价
            let goodsCostPrice=_this.tableDataAdd[0].cost_price;//商品原价
            let goodsStock=_this.tableDataAdd[0].stock;//商品库存
            let goodsWeight=_this.tableDataAdd[0].weight;//商品重量\
            //对保存的规格参数进行验证
            if(this.ruleForm.price==""){
              _this.$message.error("请出入商品的价格区间")
            }else if(_this.selectsOptions.length<_this.ProductSpecifications.length){
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
            }else if(_this.isArrayOnly(_this.NewTableDataAdd,goodsCostPrice,goodsPrice,goodsStock,goodsWeight,_this.againSkuRes)){
              _this.$message.error("保存的数据不能一致");
            }else{
              let param = NexObjs;
              apiUser.getSkuRess(param).then(res => {
                if (res.cscode == 0) {
                  _this.getSkuRes = res.data.data;
                  //将得到的sku编码重新赋值
                  _this.againSkuRes=res.data.data;
                  //赋值给字符串拼接
                  _this.GuiGe = {};
                  _this.GuiGe.sku_res = _this.getSkuRes;
                  _this.sku_font_guige = [];
                  for(let i=0;i<_this.selectsOptions.length;i++){
                    let obj=new Object();
                    obj.val=_this.selectsOptions[i];
                    obj.key=_this.ProductSpecifications[i].cat_type;
                    _this.sku_font_guige.push( obj );
                  }
                  _this.GuiGe.stock = _this.tableDataAdd[0].stock;
                  _this.GuiGe.weight = _this.tableDataAdd[0].weight;
                  _this.GuiGe.sku_num = "";
                  _this.GuiGe.cost_price = _this.tableDataAdd[0].cost_price;
                  _this.GuiGe.goods_price = _this.tableDataAdd[0].goods_price;
                  _this.GuiGe.sku_font=_this.sku_font_guige;
                  for(let i=0;i<_this.GuiGe.sku_font.length;i++){
                    delete _this.GuiGe.sku_font[i].key;//删除对象属性  key
                  }
                  _this.NewTableDataAdd.push(_this.GuiGe);
                  _this.selectsOptions=[];
                  _this.tableDataAdd[0].goods_price=undefined;//商品出售价
                  _this.tableDataAdd[0].cost_price=undefined;//商品原价
                  _this.tableDataAdd[0].stock=undefined;//商品库存
                  _this.tableDataAdd[0].weight=undefined;
                  _this.getSkuRes=undefined;
                } else {
                  _this.$message.error(res.data.msg)
                }
              });
            }
          }
        })
      },
      //拆单属性的选择
      changeDismantling(id) {
        var _this = this;
        _this.NewRuleForm.resource = _this.resourceList[id].id;
      },
      //产看运费模板详情  跳转页面
      lookXiangQing() {
        var _this = this;
        _this.$router.push({path: '/ordercarriage?', query: {'muBanId': _this.muBanId}})
      },

      //提交、修改商品信息
      submitForm() {
        var _this = this;
        _this.tableData1Add;
        //获取文本编辑器内容值
        console.log(_this.editor.txt.html())
        //得到二级商品分类的id
        if (_this.input1 == "") {
          _this.$message.error("请选择商品一级分类");
        }else if (_this.input1_son == "") {
          _this.$message.error("请选择商品二级分类");
        }else if (_this.ruleForm.farmer_address == "") {
          _this.$message.error("请输入商品产地");
        }else if (_this.ruleForm.farmer_name == "") {
          _this.$message.error("请输入农户名称");
        }else if (_this.ruleForm.farmer_content == "") {
          _this.$message.error("请输入商品简介");
        }else if (_this.headers=="") {
          _this.$message.error("请上传头像");
        }else if (_this.ruleForm.price == "") {
          _this.$message.error("请输入商品价格范围");
        }else if (_this.ruleForm.name == "") {
          _this.$message.error("请输入商品标题");
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
          _this.$message.error("请输入商品描述");
        }else if (_this.ruleForm.resource == "") {
          _this.$message.error("请选择拆单属性");
        }else if(_this.input2==""){
          _this.$message.error("请选择配送模板");
        }else {
          let sku_font_val=[];
          for(let i=0;i<_this.NewTableDataAdd.length;i++){
            sku_font_val.push(_this.NewTableDataAdd[i].sku_font)
            for(let j=0;j<_this.NewTableDataAdd[i].sku_font.length;j++){
              sku_font_val.push(_this.NewTableDataAdd[i].sku_font[j].val)
            }
          }
          let newStrings=[];
          for(let j=0;j<sku_font_val.length;j++){
            for(let m=0;m<sku_font_val[j].length;m++){
              let gets=[];
            }
          }
          //获取到的文本编辑器内容重新赋值给ruleFrom
          _this.ruleForm.goodsdesc = _this.editor.txt.html();
          let param = {
            shop_id: 1,
            cat_id: _this.input1_son,                  //             商品id
            goods_tag: 0,                     // 商品标签 0为特卖 1为不知道
            farmer_name: _this.ruleForm.farmer_name,//农户名称
            farmer_photo: _this.headers,//农户头像
            farmer_address: _this.ruleForm.farmer_address,//农户地址
            farmer_content: _this.ruleForm.farmer_content,//农户简介
            price: _this.ruleForm.price,                           // 商品价格
            name: _this.ruleForm.name,                       // 商品名称
            img: JSON.stringify(_this.newArrImgs),                  //商品图片地址
            video: "",                //商品视频地址
            remark: _this.ruleForm.goodsdesc,    //  商品详情描述
            goods_type: "",                        //商品特殊类型 0为普通商品 1为易碎商品
            delivery_cost: _this.muBanId,                     // 配送模板id
            dml_type: _this.ruleForm.resource,
            sku: [],
            goods_parm: JSON.stringify(_this.tableData1Add)//产品参数
          };
          param.sku = _this.NewTableDataAdd;
          apiUser.addShop(param).then(res => {
            if (res.cscode == 0) {
              this.$message("商品新增成功");
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.msg)
            }
          });
        }
      }
    },
    components:{
      imgloadMore,imgload,videoComponent
    },
    filters:{
      //金额锅过滤器
      myMoney:function(datas){
        return datas=datas+"元";
      },
      //重量过滤器
      myWeight:function(datas){
        return datas=datas+"kg";
      }
    },
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
