<template xmlns="">
  <div class="goods">
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/recommended' }" v-if="$route.query.types=='recommended'">今日推荐</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/audit' }" v-if="$route.query.types=='audit'">商品审核</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <p>1.农场主信息</p>

      <div class=farm_list>

       <ul style="padding: 0">
         <li><img :src="ruleForm.imglist.userimg"/><span>农场主照片</span></li>
         <li><img :src="ruleForm.imglist.farm"/><span>证书照片</span></li>
         <li>
           <ul style="padding: 0">
             <li  v-for="(item) in ruleForm.imglist.ficate ">
               <img :src="item"/>
               <span>农场照片</span>
             </li>
           </ul>
         </li>
         <!--<li v-for="(item) in ruleForm.imglist.ficate"><img :src="item"/><span>农场照片</span></li>-->
       </ul>
      </div>
      <el-form-item label="农场主姓名" style="width: 800px">
        <el-input v-model="ruleForm.farmer_name" disabled></el-input>
      </el-form-item>
    <el-form-item label="商品产地" style="width: 800px">
      <el-input v-model="ruleForm.farmer_address" disabled></el-input>
    </el-form-item>
      <el-form-item label="联系方式" style="width: 800px">
        <el-input v-model="ruleForm.phone" disabled></el-input>
      </el-form-item>
      <el-form-item label="品质描述" style="width: 800px">
        <el-input v-model="ruleForm.pzms" type="textarea" disabled></el-input>
      </el-form-item>
    <!--农户名称-->

    <!--农户简介-->
    <el-form-item label="农场主简介" style="width: 800px">
      <el-input v-model="ruleForm.farmer_content" type="textarea" disabled></el-input>
    </el-form-item>
      <!--农场简介-->
      <el-form-item label="农场简介" style="width: 800px" >
        <el-input v-model="ruleForm.farm" type="textarea" disabled></el-input>
      </el-form-item>

    <!--第一步-->
      <p>2.商品分类</p>

      <el-form-item label="商品分类" style="width: 800px">
        <el-input v-model="ruleForm.classfy" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品标签"  >
          <el-checkbox label="特卖"   disabled  v-model="fir_check"></el-checkbox>
          <el-checkbox label="普通商品"  disabled v-model="sec_check"></el-checkbox>
          <el-checkbox label="优质农产"   disabled v-model="thir_check"></el-checkbox>
      </el-form-item>
      <el-form-item label="所属供应商" style="width: 800px" >
        <el-input v-model="ruleForm.supplier"disabled></el-input>
      </el-form-item>
       <p>3.商品基本信息</p>
      <el-form-item label="商品价格" style="width: 800px">
        <el-input v-model="ruleForm.price" disabled></el-input>
      </el-form-item>

      <el-form-item label="商品标题" style="width: 800px" >
        <el-input v-model="ruleForm.title" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品规格">
      <template>
        <el-table
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          style="width: 70%">
          <el-table-column
            type="index"
            label="序号"
            width="120">
          </el-table-column>
          <el-table-column
            property="sku_font"
            label="规格"
            width="250">
            <template  slot-scope="scope">
              <div v-if="scope.row.sku_font" >
                <p v-for="(item,index) in scope.row.sku_font" :key="index">
                  {{item.info}}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            property="goods_price"
            label="单买价"
            width="120">
            <template slot-scope="scope">
              {{'￥'+scope.row.goods_price}}
            </template>
          </el-table-column>
          <el-table-column
            property="group_price"
            label="团买价"
            width="120">
            <template slot-scope="scope">
              {{'￥'+scope.row.group_price}}
            </template>
          </el-table-column>
          <el-table-column
            label="原价"
            width="120">
            <template slot-scope="scope">
              {{'￥'+scope.row.cost_price}}
            </template>
          </el-table-column>
          <el-table-column
            property="stock"
            label="库存"
            width="120">
          </el-table-column>
          <el-table-column
            property="address"
            label="sku编码">
            <template slot-scope="scope">
              {{scope.row.sku_num ? scope.row.sku_num :'暂无'}}
            </template>
          </el-table-column>
        </el-table>
      </template>
      </el-form-item>
        <p>商品图片</p>
        <div class=farm_list>

          <ul style="padding: 0">
            <li v-for="item in newarr" ><img :src="item"/></li>
          </ul>
        </div>
      <p>品质检验</p>
      <div class=farm_list v-if="false">
        <ul style="padding: 0">
          <li><img src="../../assets/img/bao.jpg"/><span>品质介绍</span></li>
          <li><img src="../../assets/img/bao.jpg"/><span>材质选择</span></li>
          <li><img src="../../assets/img/bao.jpg"/><span>抗压试验</span></li>
          <li><img src="../../assets/img/bao.jpg"/><span>个性化设计</span></li>
        </ul>
      </div>
      <el-form-item label="商品描述" style="width: 75%">
       <div style="padding:20px;border: 1px solid #dcdfe6;border-radius: 4px;">
         <p><span style="margin-right: 20px">商品特点:</span>{{ruleForm.food_therapy}}</p>
         <p><span style="margin-right: 20px">种植过程:</span>{{ruleForm.growth_process}}</p>
         <p><span style="margin-right: 20px">商品好处:</span>{{ruleForm.gain_process}}</p>
       </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {api_user,evaluate} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    name: "goodsDetails",
    data() {
      return {
        fir_check:false,
        sec_check:false,
        thir_check:false,
        ruleForm: {
          imglist:{
            userimg:'',
            farm:'',
            ficate:''
          },
          farmer_name: "",                           // 农户名
          farmer_address: "",                        //  商品产地
          phone:'',                                  //联系方式
          pzms:'',                                    //品质描述
          farmer_content: "",                        //农场主简介
          farm:"",                                   //农场简介
          productlabe: [],
          classfy:'' ,                                  //商品分类
          type:'',
          applier:'',                                //所属供应商
          price:'',                                  //商品价格
          title:'',                                  //商品标题
          norms:[],                                  //商品规格
        },
        newarr:[],                                    //商品图片
        tableData: [],
        growth_process:'',
        food_therapy:'',
        gain_process:''
      }
    },
    //页面加载首先执行的方法
    mounted(){
      this.getData()
    },
    methods: {
      getData(){
        let  param={id:this.$route.query.id}
        apiUser.goodsDetail(param).then(res => {
            this.$message(res.data.msg)
            if(res.cscode==0){
                 this.ruleForm.imglist.userimg=res.data.data.farmer_photo
                 this.ruleForm.imglist.farm=res.data.data.business_license
                 this.ruleForm.imglist.ficate=JSON.parse(res.data.data.shop_img)
                 this.ruleForm.farmer_address=res.data.data.farmer_address
                 this.ruleForm.farmer_name=res.data.data.farmer_name
                 this.ruleForm.phone=res.data.data.manager_phone
                 this.ruleForm.pzms=res.data.data.remark
                 this.ruleForm.farmer_content=res.data.data.farmer_name_res
                 this.ruleForm.farm=res.data.data.farmer_res
                 this.ruleForm.classfy=res.data.data.cat_name
                 this.ruleForm.price=res.data.data.price+'￥'
                 this.ruleForm.title=res.data.data.name
                 this.ruleForm.growth_process=res.data.data.growth_process
                 this.ruleForm.food_therapy=res.data.data.food_therapy
                 this.ruleForm.gain_process=res.data.data.gain_process
                 this.tableData=res.data.data.sku
                 this.newarr=JSON.parse(res.data.data.shop_img)
              /*this.ruleForm.applier=res.data.data.manager_name                  */              //所属供应商
                 if(res.data.data.goods_type==0){this.fir_check=true}
                 if(res.data.data.goods_type==1){this.sec_check=true}
                 if(res.data.data.goods_type==2){this.thir_check=true}

           /* this.ruleForm.productlabe=res.data.data.manager_name
                                            //商品分类
              this.ruleForm.tag=res.data.data.manager_name

                                            //商品价格
                                          //商品标题
              */
            }
        })
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

  .farm_list{overflow: hidden}
  .farm_list li{width: 200px;height: 200px;float: left}
  .farm_list li img{width: 120px;height: 120px;margin: 0 auto;display: block}
  .farm_list li span{display: block;margin: 10px auto;text-align: center}
</style>
<style>
  .goods .el-input.is-disabled .el-input__inner,.goods .el-textarea.is-disabled .el-textarea__inner,.goods .el-checkbox__input.is-disabled .el-checkbox__inner{background: #fff}
  .goods .el-textarea.is-disabled .el-textarea__inner,.goods .el-input.is-disabled .el-input__inner,.goods .el-checkbox__input.is-disabled+span.el-checkbox__label{color: #000}
</style>
