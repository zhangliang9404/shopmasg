<template>
  <div>
    <!--导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>在售商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <p class="explanation">商城中所有的商品，您可以对商品进行搜索，也能对商品进行编辑、上架、下架、入库操作</p>
    <!--搜索-->
    <div style="margin-right: 50px;overflow: hidden;margin-bottom: 30px;">
      <el-input placeholder="请输入商品名称" v-model="input1" class="input-with-select left" style="float: left">
        <el-select  @change="changeShop" v-model="select" slot="prepend" placeholder="请选择分类" class="elwidth">
          <el-option
            v-for="(item,index) in options"
            :label="item.label"
            :value="item.value"
            :key="index">
          </el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="adddepartment">搜索</el-button>
      </el-input>
      <el-button style="float: right" type="primary" icon="el-icon-plus" @click="$router.push('goodsupdate')">发布商品</el-button>
    </div>
    <!--表格-->
    <el-table ref="multipleTable" border :data="tableData1" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @select-all="checkAll">
      <el-table-column type="selection" width="55" >
      </el-table-column>
      <el-table-column label="商品名称" show-overflow-tooltip width="360">
        <template slot-scope="scope">
          <div style="position: relative">
            <span style="padding: 2px 6px;color: red; border-radius:20px;border: 1px solid red;position: absolute;left: 50px;z-index: 99"   v-if="scope.row.goods_ids!=null">满</span>
            <span style="padding: 2px 6px;color: red;border-radius:20px;border: 1px solid red;position: absolute;left: 50px;z-index: 99" v-if="scope.row.type==3">限</span>
            <img :src="JSON.parse(scope.row.good_img)[0]" style="width: 50px;height: 50px;position: absolute;left: 0">
            <span class="shopName">{{ scope.row.name }}</span>
            <div class="isPeiSong" style="position: absolute;left:-50px;top: 30px"> 支持配送：{{ scope.row.dml_type | myDmlType }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="classify" label="商品分类">
        <template slot-scope="scope">
          <div style="color: red;">{{ scope.row.cat_name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <div style=""><span  @click="changesku(scope.row,'price')" style="display: block">售价：￥{{ scope.row.price }}</span><span style="text-decoration:line-through;display: block">原价：￥{{scope.row.market_price}}</span></div>
        </template>
      </el-table-column>
      <el-table-column prop="repertory"label="总库存">
        <template slot-scope="scope">
          <div @click="changesku(scope.row,'stock')">{{ scope.row.stock }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="repertory"label="总销量">
        <template slot-scope="scope">
          <div>{{ scope.row.sale_num }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="repertory"label="规格" width="200" v-if="false">
        <template slot-scope="scope">
          <el-tooltip  v-for="(item,index) in scope.row.children" :key="index" class="item" effect="dark" :content="item.sku_font" placement="top">
            <p  @click="changesku(scope.row,'sku')" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item.sku_font}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <strong  style="color: #CBD066" @click="handleEdit(scope.$index, scope.row)">修改</strong>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <div style="float: right;">
        <el-pagination
          @size-change="handleSizeChange"
          :total="pagesShop.goods_num"
          :page-size="limits"
          @current-change="handleCurrentChange"
          @prev-click="prevPages"
          @next-click="nextPages"
          :current-page="currentPage"
          :page-sizes="[10,20,30,40,50]" layout="total, sizes, prev, pager, next, jumper" >
        </el-pagination>
      </div>
      <el-button type="info"  @click="soldout">上架</el-button>
      <el-button type="danger" @click="del">删除</el-button>
    </div>


    <el-dialog
      :title="iteminfo=='price'?'修改价格':'修改库存'"
      :visible.sync="modelchagesku">
      <el-table
        :data="tableDatasku"
        border
        style="width: 100%">
        <el-table-column
          prop="sku_font"
          label="规格"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="市场价"
          v-if="iteminfo=='price'"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.market_price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="原价"
          v-if="iteminfo=='price'"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.cost_price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="拼购价"
          v-if="iteminfo=='price'"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.group_price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="单买价"
          v-if="iteminfo=='price'"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.goods_price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="flashsale_gprice"
          label='限时团购价'
          v-if="iteminfo=='price' && tablecolumn"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.flashsale_gprice" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="限时单买价"
          v-if="iteminfo=='price' && tablecolumn"
          width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.flashsale_price" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="库存"
          v-if="iteminfo!='price'">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" placeholder="请输入价格"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modelchagesku = false">取 消</el-button>
    <el-button type="primary" @click="skuchagesure">确 定</el-button>
  </span>
    </el-dialog>
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
        //商品总条数
        //分页
        pagesShop:{
          goods_num:0
        },
        //搜索不同状态下的分页条件
        differenceStatus:false,
        //选择分类不同状态下的分页条件
        selectFemLei:false,
        //选择的id
        selectIds:"",
        countnum:0,
        limits:10,
        input1: '',
        select: '',
        currentPage: 1,
        //得到的商品的数据
        tableData1: [],
        //配送的是否显示
        options:[],
        multipleSelection: [],
        //删除商品id
        delShopId:[],
        firstcheck:true,
        secondcheck:false,

        iteminfo:'',
        modelchage:false,
        modelchagesku:false,
        tableDatasku:[],
        tablecolumn:true
      }
    },
    //过滤器dml_type
    filters:{
      myDmlType:function(datas){
        if(datas==0){
          datas="普通商品";
        }else if(datas==1){
          datas="单独配送商品"
        }else if(datas==2){
          datas="同城即时达"
        }
        return datas;
      }
    },
    methods: {
      changesku(row,what){
        let _this =this
        _this.modelchagesku=true
        if(what=='stock'){
          this.iteminfo= 'stock'
        }
        if(what=='price'){
          this.iteminfo= 'price'
        }
        if(what=='sku'){
          this.iteminfo= 'sku'
        }

        let param={
          goods_id:row.id
        }
        /*apiUser.getGoodssku(param).then((res)=>{
          console.log(res)
          if(res.cscode==0){
            vm.tableDatasku = res.data.info
            res.data.info.forEach(x=>{
              if(!x.flashsale_gprice && !x.flashsale_price){
                vm.tablecolumn = false
              }else {
                vm.tablecolumn = true
              }
            })
            vm.modelchagesku = true
          }
        })*/

      },
      skuchagesure(){
        let param={
          op:"edit",
          sku_arr:this.tableDatasku
        }
        let vm =this
        apiUser.changeGoodssku(param).then((res)=>{
          if(res.cscode==0){
            vm.$message.success(res.data.msg)
            vm.modelchagesku=false
          }else {
            vm.$message.error(res.data.msg)
          }

        })
      },
      //搜索查询
      adddepartment(){
        var _this = this;
        _this.differenceStatus=true;
        _this.selectFemLei=false;
        _this.firstcheck=false;
        _this.secondcheck=true,
          _this.firstcheck=false
        var checkstr=typeof(_this.select)
        var str=''
        if(checkstr=='number'){
          str=_this.select
        }

        if(_this.input1==""){
          _this.$message.error("请输入搜索内容")
        }else{
          let params = {
            goods_status:0,
            goods_name: _this.input1,
            classify:_this.selectIds,
            page:1,
            limit:_this.limits,
          }
          console.log(params)
          _this.searchInterface(params)
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {this.paginationShow = true;})
        }
      },

      //搜索查询接口
      searchInterface(param){
        var _this=this;
        apiUser.searGoods(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            _this.pagesShop.goods_num=res.data.count;
            _this.tableData1=res.data.data;
          }else {
            _this.$message.error(res.data.msg);
          }
        })
      },

      //不同情况下的  每页条数
      AllPagesNum(num){
        var _this=this;
        var firstId=_this.$route.query.fId;
        var secondId=_this.$route.query.sId
        _this.limits=num;
        var checkstr=typeof(_this.select)
        var str=''
        if(checkstr=='number'){
          str=_this.select
        }
        console.log(_this.select)
        if(firstId&&secondId){
          //初始化
          if(_this.firstcheck){
            let params={
              status:0,
              id:secondId,
              page:1,
              limit:num,
            };
            this.getOneList(params);
          }
          //搜索
          if(_this.secondcheck){
            let params={
              goods_status:0,
              page:1,
              limit:this.limits,
              classify:str,
              goods_name:_this.input1
            };
            console.log(params)
            _this.searchInterface(params);
          }
          //选择分类
          if(_this.selectFemLei){
            let param2 = {
              id:_this.selectIds,
              status:0,
              page:1,
              limit:num
            };
            console.log(param2)
            this.getOneList(param2);
          }
        }else{
          //初始化
          if(_this.secondcheck){
            let params = {
              goods_status:0,
              goods_name: _this.input1,
              classify:str,
              page:1,
              limit:num
            }
            _this.searchInterface(params);
          }
          //搜索
          if(_this.firstcheck){
            let param = {
              status:0,
              page:1,
              limit:num
            };
            _this.getOneListNoCan(param);
          }
          //选择分类
          if(_this.selectFemLei){
            let param2 = {
              id:_this.selectIds,
              status:0,
              page:1,
              limit:_this.limits
            };
            console.log(param2)
            this.getOneList(param2);
          }
        }
      },
      //不同情况下的  页码
      AllPagesPages(pages){
        var _this=this;
        _this.currentPage=pages;
        console.log(_this.limits)
        var firstId=_this.$route.query.fId;
        var secondId=_this.$route.query.sId;
        var checkstr=typeof(_this.select)
        var str=''
        if(checkstr=='number'){
          str=_this.select
        }
        if(firstId&&secondId){
          //初始化
          if(_this.firstcheck){
            let params={
              status:0,
              id:secondId,
              page:pages,
              limit:_this.limits
            };
            this.getOneList(params);
          }
          //搜索
          if(_this.secondcheck){
            let params={
              goods_status:0,
              goods_name:_this.input1,
              page:pages,
              classify:str,
              limit:_this.limits
            };
            console.log(params)
            _this.searchInterface(params);
          }
          //选择分类
          if(_this.selectFemLei){
            console.log(_this.select)
            let param2 = {
              id:_this.selectIds,
              status:0,
              page:pages,
              limit:_this.limits
            };
            console.log(param2)
            this.getOneList(param2);
          }
        }else{
          //搜索
          if(_this.secondcheck){
            let params = {
              goods_status:0,
              goods_name: _this.input1,
              classify:str,
              page:_this.currentPage,
              limit:_this.limits
            }
            _this.searchInterface(params);
          }
          //初始化
          if(_this.firstcheck){
            let param = {
              status:0,
              page:_this.currentPage,
              limit:_this.limits,
            };
            this.getOneListNoCan(param);
          }
          //选择分类
          if(_this.selectFemLei){
            console.log(_this.select)
            if(_this.selectIds==""){
              let param = {
                status:0,
                page:_this.currentPage,
                limit:_this.limits,
              };
              this.getOneListNoCan(param);
            }else{
              let param2 = {
                id:_this.selectIds,
                status:0,
                page:pages,
                limit:_this.limits
              };
              console.log(param2)
              this.getOneList(param2);
            }
          }
        }
      },



      //分页改变每页条数
      handleSizeChange(num) {
        var _this=this;
        _this.AllPagesNum(num)
      },

      //分页改变页数
      handleCurrentChange(pages) {
        var _this=this;
        _this.AllPagesPages(pages)
      },

      //分页上一页
      prevPages(index){
        var _this=this;
        _this.AllPagesPages(index)
      },

      //分页下一页
      nextPages(index){
        var _this=this;
        _this.AllPagesPages(index)
      },

      //单选
      handleSelectionChange(val) {
        var _this=this;
        _this.multipleSelection = val;
        var newArray=[];
        for(let i=0;i<_this.multipleSelection.length;i++){
          newArray.push(_this.multipleSelection[i].id);
        }
        _this.delShopId=newArray;
        console.log(_this.delShopId)
      },
      //全选
      checkAll(val){
        var _this=this;
        _this.multipleSelection = val;
        console.log(val)
        var newArray=[];
        for(let i=0;i<_this.multipleSelection.length;i++){
          newArray.push(_this.multipleSelection[i].id);
        }
        _this.delShopId=newArray;
        console.log(_this.delShopId)
      },

      getcheckid(){
        let id="";
        for(let element of this.multipleSelection){
          id+=element.id+",";
        }
        let newid=id.substring(0,id.length-1);
        return newid;
      },


      //没有传参
      getOneListNoCan(param){
        var _this=this;
        _this.tableData1=[];
        apiUser.getGoods(param).then(res => {
          if(res.cscode==0){
            _this.pagesShop.goods_num=res.data.count;
            _this.tableData1=res.data.data;
          }else{
            _this.$message.error(res.data.msg)
          }
        });
      },

      //传参
      getOneList(params){
        var _this=this;
        //二级列表系列商品的所有信息
        apiUser.getGoods(params).then(res => {
          if(res.cscode==0){
            if(this.selectIds==''){
              _this.pagesShop.goods_num=res.data.count;
              _this.tableData1=res.data.data;
            }else {
              _this.pagesShop.goods_num=res.data.goods_num;
              _this.tableData1=res.data.data.children;
            }
            for(let i=0;i<_this.tableData1.length;i++){
              if(_this.tableData1[i].max_price==_this.tableData1[i].min_price){
                _this.tableData1[i].shopPrice=_this.tableData1[i].max_price;
              }else {
                _this.tableData1[i].shopPrice=_this.tableData1[i].max_price+"-"+_this.tableData1[i].min_price;
              }
            }
          }else{
            _this.$message.error(res.data.msg);
          }
        });
      },
      //下架事件
      soldout(status) {
        var _this=this;
        this.$confirm('确定上架次商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let param1 = [];
          var arr=[]
          if(_this.delShopId.length<=0){
            alert("请选择要下架的商品")
          }else{
            let param1=[];
            for(let i=0;i<_this.delShopId.length;i++){
              param1.push(_this.delShopId[i])
            }
            let paramsnew={
              commodity_id : param1,
              status:'1'
            }
            apiUser.updateGoods(paramsnew).then(res => {
              console.log( res )
              if(res.cscode==0){
                _this.$message({
                  message:res.data.msg,
                  type: 'success'
                });
                //是否点击过搜索后   执行的调用接口就不同
                if(_this.differenceStatus==true){
                  let params = {
                    goods_status:0,
                    goods_name: _this.input1,
                    page:1,
                    limit:_this.limits
                  }
                  _this.searchInterface(params)
                }else{
                  let params={
                    status:0,
                    id:_this.$route.query.sId,
                    page:1,
                    limit:_this.limits
                  };
                  this.getOneList(params);
                }
              }else{
                _this.$message.error(res.data.msg)
              }
            });
          }

        }).catch(() => {
        });


      },

      //删除商品
      del(){
        var _this=this;
        let param1 = [];
        console.log(_this.delShopId)
        if(_this.delShopId.length<=0){
          alert("请选择要删除的商品")
        }else{
          let params1=[];
          for(let i=0;i<_this.delShopId.length;i++){
            param1.push(_this.delShopId[i])
          }
          apiUser.delOut(param1).then(res => {
            console.log( res )
            if(res.cscode==0){
              this.$message({
                message:res.data.msg,
                type: 'success'
              });
                 window.location.reload()
             /* let params={
                status:0,
                page:1,
                limit:_this.limits
              };
              this.getOneListNoCan(params);*/
            }else{
              this.$message.error(res.data.msg)
            }
          });
        }
      },
      //修改商品
      handleEdit(index,val){
        var _this=this;
        _this.$router.push({path:"/goodsupdate",query:{ids:val.id}})

        // if(_this.$route.query.fId){
        //   _this.$router.push({path:"/goodsmodify",query:{ids:val.id,fId:_this.$route.query.fId}})
        // }else{
        //   _this.$router.push({path:"/goodsmodify",query:{ids:val.id,fId:val.classify}})
        // }
      },
      //改变分类下拉选项的值  发生的事件
      changeShop(val){
        var _this=this;
        _this.selectFemLei=true;
        _this.firstcheck=false;
        _this.secondcheck=false;
        _this.input1=''

        if(val==""){
          console.log("aa")
          _this.selectIds="";
          let param2 = {
            status:0,
            page:1,
            limit:_this.limits
          };
          console.log(param2)
          param2.all = 'all'
          _this.getOneList(param2)
          // this.getOneListNoCan(param2);
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {this.paginationShow = true;})
        }else{
          let param2 = {
            id:val,
            status:0,
            page:1,
            limit:_this.limits
          };
          _this.select=val;
          _this.selectIds=val;
          console.log(param2)
          this.getOneList(param2);
          //页码初始化
          this.paginationShow = false
          this.handleCurrentChange(1)
          this.$nextTick(function () {this.paginationShow = true;})
        }
      },
    },


    //初始化
    mounted: function(){
      window.addEventListener("popstate", function(e) {  //回调函数中实现需要的功能
        // alert("我监听到了浏览器的返回按钮事件啦");
      }, false);
      // utils.setCookie("__user_token__","e0909c3a435ab57e50c4dfbe95fb2e81");
      var _this=this;
      var firstId=_this.$route.query.fId;
      var secondId=_this.$route.query.sId
      //一级列表的商品
      let param = {
        status:1
      };
      apiUser.getGoods(param).then(res => {
        if(res.cscode==0){
          console.log(res.data)
          _this.options=res.data.data;
          console.log(_this.options)
          let newName=[];
          let quchongName=[];
          let quchongobj={}
          for(let i=0;i<_this.options.length;i++){
            var obj={
              label:_this.options[i].cat_name,
              value:_this.options[i].classify
            }
            newName.push(obj);
          }
          //数组去重
          for(let j=0;j<newName.length;j++){
            if(!quchongobj[newName[j].value]){
              quchongName.push(newName[j]);
              quchongobj[newName[j].value]=true
            }
          }
          //将去重后的数据赋值给select  渲染到页面上
          _this.options=res.data.data;
          var obj1={
            label:'全部 ',
            value:''
          }
          _this.options.push(obj1)
          console.log( _this.options)
          let params={
            status:2,
            id:secondId,
            page:1,
            limit:_this.limits
          };
          if(this.$route.query.classfy){
            this.select=this.$route.query.classfy
            params.classfy = this.$route.query.classfy
            this.selectIds = this.$route.query.classfy
          }else {
            this.selectIds=''
          }

          this.getOneList(params);
        }
      });
    },
  }
</script>

<style scoped>
  @import url("../../assets/css/Goods1.css");
</style>
