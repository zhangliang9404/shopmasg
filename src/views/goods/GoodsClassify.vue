
<template>
  <div>
    <!--导航-->
    <div style="position: relative">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="position: relative">
        <el-breadcrumb-item :to="{ path: '/' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="refreshs" type="primary"  @click="RefreshGoodsClassify">刷新</el-button>
    </div>

    <p class="explanation">管理商城的商品分类.您可以添加、编辑、删除商品分类</p>
    <!--输入-->
    <el-input class="search" @change="changeInput" placeholder="请输入商品一级名称" v-model="filterText">
    </el-input>
    <el-button slot="append" icon="el-icon-search" @click="adddepartment(1,5)">搜索</el-button>
    <el-button type="primary"  icon="el-icon-plus"  @click="dialogVisible=true">新增商品分类</el-button>
    <el-dialog class="gaoji" title="选择新增分类类别" :visible.sync="dialogVisible" width="30%" top="30vh" :close-on-click-modal=true>
      <div class="ordernotes">
        <!--行一-->
        <el-radio-group class="ordernotes_checked" v-model="classificationChecked">
          <el-radio :label="1">一级分类</el-radio>
          <el-radio :label="2">二级分类</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible=false">取消</el-button>
			    <el-button type="primary" @click="SureAddFenlei">确定</el-button>
  			</span>
    </el-dialog>
    <!--更新按钮-->
    <div class="update-button">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-up" @click="Raise(ind)" :disabled="isDisabled">排序上调</el-button>
        <el-button type="primary" icon="el-icon-arrow-down" @click="Downregulation(ind)" :disabled="isDisabled">排序下调</el-button>
        <el-button type="primary" :disabled="isDisabled1" @click="keeplist">保存排序</el-button>
      </el-button-group>
    </div>
    <!--分类列表-->
    <div class="update-list">
      <div class="update-list_left">
        <p><span>一级目录:</span><em><span @click="addskip(1)">增加</span><span @click="delepm(ischildren)">删除</span></em></p>
        <ul ref="ulleft" class="datas_left">
          <li v-for="(item,index) in data4" @click="checkPi(item,index)"  :class="index == aaaa ? 'active':' '">
            {{item.cat_name}}
            <span class="el-icon-arrow-right"></span>
          </li>
        </ul>
      </div>
      <div class="update-list_center" ref="toRight"><img src="../../assets/img/u4815.png" alt=""></div>
      <div class="update-list_right">
        <p><span>二级目录:</span><em><span @click="addskip(2)">增加</span><span @click="delecl(ischildren)">删除</span></em></p>
        <ul  v-if="isShow">
          <li v-for="(item,index) in data5" :class="index == bbbb ? 'active':' '" @click="checkCi(item,index)">
            {{item.cat_name}}
            <span class="el-icon-arrow-right"></span>
          </li>
        </ul>
        <p v-else="isShow" class="Noshow">{{NoShuju}}</p>
      </div>
      <div style="clear:both"></div>
    </div>
    <!--商品详情-->
    <div class="goods-info">
      <el-table   :data="tableData"   border   style="width: 100%">
        <el-table-column label="商品一级分类名称" width="180">
          <template slot-scope="scope" style="position: relative">
            <img style="width:30px;height:30px; position: absolute;left: 15px;overflow: hidden" :src="scope.row.firstImg"/>
            <span style="margin-left: 50px">{{ scope.row.firstMenu}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品二级分类名称"  prop="date" width="180">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>一级分类名称: {{ scope.row.firstMenu }}</p>
              <p>二级分类名称: {{ scope.row.secondMenu}}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.secondMenu }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.shopName" placement="top">
              <span class="shopNames">{{ scope.row.shopName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="出售中的商品" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px;display: block" @click="loachref(scope.row)">{{ scope.row.sta_on }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下架中的商品" width="180">
          <template slot-scope="scope">
            <span style="display: block;margin-left: 10px" @click="tosold(scope.row)">{{ scope.row.sta_off}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <strong class="update" @click="handleEdit(scope.row.firstId,scope.row,scope.row.secondId)">修改</strong>
            <strong class="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</strong>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div class="goodsclassify_paging">
      <el-pagination
        v-if="isResault"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.nowPages"
        :page-sizes="[10,20,30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.count"
        @next-click="nextPages"
        @prev-click="prevPages">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { requestLogin } from '@/api/api';
  import * as utils from "@/common/utils.js"
  import {api_user} from "@/api/api.js"
  let apiUser = new api_user();
  export default {
    // watch: {
    //    filterText(val) {
    //      this.$refs.tree2.filter(val);
    //    }
    //  },
    data() {
      return {
        //页码是否重置
        isResault:true,

        //新增商品分类  弹框是否显示
        dialogVisible:false,
        classificationChecked:"",
        ischildren:'',
        filterText: '',
        input1: "",
        data4: [],
        data5:[],
        tableData: [],
        ind:0,
        chiInd:0,
        ischk:false,
        isChildchk:false,
        plistop:false,
        aaa:true,
        aaaa:0,
        bbbb:0,
        parId:0,
        childId:0,
        currParIndex:0,
        pnum:0,
        chunum:0,//初始
        //上调、下调的禁用状态
        isDisabled:true,
        isDisabled1:true,
        //当没有二级数据时候
        isShow:true,
        NoShuju:"暂无二级目录",
        subsetId:'',//子集id
        page:1,
        limit:10,
        //分页数据
        pages:{
          count:0,
          nowPages:0//当前页数
        },
        firstcheck:true,
        secondcheck:false,

      }
    },
    *
    created(){
      this.$emit('refreshList');//触发父类的事件，写法
    },
    mounted: function(){
      this.mountedget()
    },
    methods: {

      mountedget(){
        utils.setCookie("__user_token__","e0909c3a435ab57e50c4dfbe95fb2e81");
        if(this.ind>=0){
          this.isDisabled=false
        }
        this.getlist();
        console.log(1111)
        var param2={
          page:this.page,
          limit: this.limit
        }
        this.gettype(param2);
      },
      //刷新页面
      RefreshGoodsClassify(){
        // location.reload()
        this.mountedget()
      },

      //新增商品分类按钮弹框 确认按钮
      SureAddFenlei(){
        var _this=this;
        console.log(_this.classificationChecked)
        if(_this.classificationChecked){
          _this.dialogVisible=false;
          _this.$router.push({'path':'/GoodsAdd',query:{classification:_this.classificationChecked}});
        }else{
          _this.$message.error("请选择你所需要添加的分类级别")
        }
      },

      //输入商品名称 input值改变时候发生的事件
      changeInput(){
        var _this = this
        if(_this.filterText==""){
          this.$message.error("请输入商品分类")
        }else{
          let param = {
            cat_name: _this.filterText,
            page:_this.page,
            limit: _this.limit
          }
          apiUser.searchGoods(param).then(res => {
            console.log(res)
            this.pages.count=res.data.cat_count;
            if(res.cscode==0){
              _this.tableData=[];
              console.log(res.data.data)

              for(let i=0;i<res.data.data.children.length;i++){
                var objSearch={
                  firstMenu:res.data.data.children[i].max_cat_name,
                  firstImg:res.data.data.children[i].cat_img,
                  firstId:res.data.data.children[i].pid,
                  secondId:res.data.data.children[i].id,
                  secondMenu:res.data.data.children[i].cat_name,
                  shopName:res.data.data.children[i].name,
                  sta_on:res.data.data.children[i].sale_goods_num,
                  sta_off:res.data.data.children[i].down_goods_num
                }
                _this.tableData.push(objSearch);
              }
              console.log(_this.tableData)
            }else{
              _this.$message.error(res.data.msg)
            }
          })
        }
      },
      //点击搜索
      adddepartment() {
        var _this = this
        _this.firstcheck=false
        _this.secondcheck=true
        console.log(_this.filterText)
        if(_this.filterText==""){
          this.$message.error("请输入商品分类");
          var param2={
            page:this.page,
            limit: this.limit
          }
          this.gettype(param2);
        }else{
          let param = {
            cat_name: _this.filterText,
            page:_this.page,
            limit: _this.limit
          }
          _this.getlists(param)
        }
      },
      //点击搜索
      getlists(param){
        var _this=this;
        //let param={cat_name: _this.filterText, page:_this.page,limit: _this.limit }
        apiUser.searchGoods(param).then(res => {
          this.pages.count=res.data.cat_count
          if(res.cscode==0){
            _this.tableData=[];
            console.log(res.data.data)
            // for
            for(var i=0;i<res.data.data.children.length;i++){
              console.log(res.data.data.children[i].max_cat_name)
              var objSearch={
                firstMenu:res.data.data.children[i].max_cat_name,
                firstImg:res.data.data.children[i].cat_img,
                firstId:res.data.data.children[i].pid,
                secondId:res.data.data.children[i].id,
                secondMenu:res.data.data.children[i].cat_name,
                shopName:res.data.data.children[i].name,
                sta_on:res.data.data.children[i].sale_goods_num,
                sta_off:res.data.data.children[i].down_goods_num
              }
              console.log(objSearch)
              _this.tableData.push(objSearch);
            }
            console.log(_this.tableData)
            _this.filterText="";//input变为空字符
          }else{
            _this.$message.error(res.data.msg)
          }
        })
      },

      addskip(OneOrTwo){
        this.$router.push({path: '/GoodsAdd',query:{classification:OneOrTwo}});
      },
      //初始化
      getlist(){
        var _this=this;
        let param = {
          // status:""
        };
        apiUser.getOneTwoFenLei(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            console.log(res)
            // console.log(res.data.data[0])
            _this.data4 = res.data.data;
            console.log(_this.data4)
            var centers=document.getElementsByClassName(this.$refs.toRight.className)[0];
            centers.style.height=(this.data4.length*32+85)+"px";
            var childItem=[]
            //父级排序
            var arrlist=_this.data4;
            var arrlistno=[];
            //对新添加一级目录的sort进行重新定义
            var shuzu=[];
            for(var i1=0;i1<_this.data4.length;i1++){
              console.log(_this.data4[i1])
              if(_this.data4[i1].sort==null){
                var obj=arrlist.splice(i1,1)[0]
                console.log(obj);
                i1--
                arrlistno.push(obj)
                console.log(arrlistno)
              }else{
                console.log(_this.data4[i1].sort)
                shuzu.push(_this.data4[i1].sort);
              }
            }

            _this.data4=arrlistno;
            console.log(_this.data4)

            let arrlist_sort=[]
            console.log(arrlist_sort)
            console.log(arrlist)
            // 循环新增数据
            console.log(arrlist.length);
            for (var i=0;i<arrlist.length;i++) {
              console.log(arrlist[i])
              arrlist_sort[arrlist[i].sort-1] = arrlist[i];
            }
            console.log(arrlist_sort)

            Array.prototype.notempty = function() {
              var arr = [];
              this.map(function(val, index) {
                //过滤规则为，不为空串、不为null、不为undefined，也可自行修改
                if (val !== "" && val != undefined) {
                  arr.push(val);
                }
              });
              return arr;
            }
            arrlist_sort=arrlist_sort.notempty();
            console.log(arrlist_sort)

            var i2num=0
            if (arrlist_sort[arrlist_sort.length-1].sort) {
              i2num=arrlist_sort[arrlist_sort.length-1].sort
            }
            console.log(arrlist_sort)
            for(var i2=0;i2<arrlistno.length;i2++){
              i2num++
              arrlistno[i2].sort=i2num
            }
            console.log(arrlist_sort)

            var listall=arrlist_sort.concat( arrlistno)
            console.log("1111111111");
            console.log(listall);
            _this.data4=listall;

            let isBaoHan="";
            for(let i=0;i<_this.data4.length;i++){
              //_this.data4[i]. hasOwnProperty("children")   判断该数组中是否包含children
              // if(_this.data4[i]. hasOwnProperty("children")==false){
              //   isBaoHan=i;
              //   _this.$message.error("没有二级分类")
              // }
            }
            console.log(_this.data4)
            _this.parId=_this.data4[0].id;
            var xianList=_this.data4[0].children;


            if(_this.data4[0].children.length<=0){
              _this.$message.error(_this.data4[0].cat_name+'没有二级分类')
            }else{
              _this.data5=_this.data4[0].children;
              console.log(_this.data5)
              _this.subsetId = _this.data5[0].id;
              console.log(_this.subsetId)
            }

            console.log(xianList)
            // var listchild=[]
            for(var g=0;g<xianList.length;g++){
              console.log(xianList[g].cat_name);
            }

            if(xianList.length>0){
              _this.isShow =true;
              _this.data5=xianList
            }else {
              _this.isShow =false;
            }
            // console.log( _this.data5)
            // _this.subsetId = _this.data5[0].id;
            // console.log(_this.subsetId)

            //子集
            for(var j=0;j<_this.data5.length;j++){
              if(_this.data5[j].sort==1){
                _this.parId=_this.data5[j].id;
              }
              var second_data =_this.data5
              var childlist=[]
              //子集排序
              if(second_data.length>0){
                for(var jj=0;jj<second_data.length;jj++)
                {
                  if(second_data[jj].sort==undefined){
                    var childobj=second_data.splice(jj,1)[0]
                    jj--
                    childlist.push(childobj)
                    console.log(childobj)
                  }
                }
                let childlist_sort=[]
                if(second_data.length>0){
                  for (var kk=0;kk<second_data.length;kk++)
                  {
                    childlist_sort[kk] = second_data[kk];
                  }
                  var i3num=0
                  if (childlist_sort[childlist_sort.length-1].sort) {
                    i3num=childlist_sort[childlist_sort.length-1].sort
                  }
                  for(var i3=0;i3<childlist.length;i3++){
                    i3num++
                    childlist[i3].sort=i3num
                  }
                  var child_listall=childlist_sort.concat( childlist)
                  _this.data5 = child_listall;
                }else{
                  for(var i3=0;i3<childlist.length;i3++){
                    childlist[i3].sort=i3+1
                  }
                  _this.data5 = childlist;
                }
              }
            }
          }else{
            _this.$message.error("没有商品分类信息");
          }
        });
      },

      //根据一级目录改变二级目录的值
      checkPi(item,index){
        console.log(item)
        $(".datas_left li").eq(index).addClass("active").siblings().removeClass("active");
        var _this=this;
        _this.ischildren = item;
        _this.isChildchk=false
        _this.ischk=true
        _this.ind=index
        _this.aaaa = index
        _this.currParIndex = index
        _this.chi=item.id
        _this.parId=item.id;
        //当选中一个的时候
        console.log(item)
        var pI=item.id;
        var childItem=[]

        if(item.children.length<=0){
          _this.$message.error(item.cat_name+"没有二级分类");
          _this.data5=[]
        }else{
          if(item.children.length>0){
            _this.isShow=true
            for(var i=0;i<item.children.length;i++){
              // var childObj={
              //   cat_name:item.children[i].cat_name,
              //   id:item.children[i].id
              // }
              childItem=item.children;
            }
          }else{
            _this.isShow=false
          }
          _this.data5=childItem;
          console.log(_this.data5)
        }
      },

      //子集目录
      checkCi(item,index){
        var _this=this
        _this.ischildren = item
        _this.bbbb=index
        _this.isChildchk=true
        _this.ind = index
        _this.chiInd=index
        _this.subsetId = item.id;
      },

      //保存排序
      keeplist(){
        var _this=this
        var list=[]
        for(var i=0;i<_this.data4.length;i++){
          var pId=_this.data4[i].id
          var pSort=_this.data4[i].sort?_this.data4[i].sort:i
          var child=_this.data4[i].children
          var childrens=[]
          if(child){
            for(var j=0;j<child.length;j++){
              var cId=child[j].id
              var cSort=child[j].sort?cSort=child[j].sort:j
              var childObj={
                id:cId,
                sort:cSort
              }
              childrens.push(childObj)
            }
            var pObj={
              id:pId,
              sort:pSort,
              children:childrens
            }
            list.push(pObj)
          }else{
            var obj={
              id:pId,
              sort:pSort,
            }
            list.push(obj)
          }

        }
        let param = list
        console.log(param)
        param = utils.filterJson(param);
        apiUser.changeList(param).then(res => {
          console.log(res);
          if(res.cscode==0){
            this.$alert(res.data.msg, '提示信息', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }

        })

      },

      //排序上调
      Raise(index){
        var _this=this
        if(index <=0)
        {
          alert("已经是最上一级");
          return;
        }

        if(!_this.isChildchk){
          this.aaaa = index-1;
          let tmp = this.data4[index-1];
          this.data4[index-1] = this.data4[index];
          this.data4[index] =  tmp;

          _this.sortList()
          _this.ind = index-1;
          _this.isDisabled1=false
          console.log(_this.data4)
        }else{
          this.bbbb = index-1;
          let tmp = this.data5[index-1];
          this.data5[index-1] = this.data5[index];
          this.data5[index] =  tmp;
          _this.chisortList()
          _this.ind = index-1;
          _this.isDisabled1=false

        }
      },

      sortList(){
        var _this=this
        for(var i=0;i<_this.data4.length;i++){
          _this.data4[i].sort=i+1
        }
        console.log(_this.data4)
      },
      chisortList(){
        var _this=this
        for(var i=0;i<_this.data5.length;i++){
          _this.data5[i].sort=i+1
        }
        _this.data4[_this.currParIndex].children = _this.data5;
      },

      //排序下调
      Downregulation(index){
        var _this=this
        if(!_this.isChildchk) {
          if (index+1 >= _this.data4.length) {
            alert("已经是最后一级");
            return;
          }
          this.aaaa = index+1;
          let tmp = this.data4[index+1];
          this.data4[index+1] = this.data4[index];
          this.data4[index] =  tmp;
          _this.sortList();
          _this.ind = index+1;
          _this.isDisabled1=false
        }else{
          if (index+1 >= _this.data5.length) {
            alert("已经是最后一级");
            return;
          }

          this.bbbb = index+1;
          let tmp = this.data5[index+1];
          this.data5[index+1] = this.data5[index];
          this.data5[index] =  tmp;
          _this.chisortList();
          _this.ind = index+1;
          _this.isDisabled1=false
        }
      },


      //一级删除
      delepm(isdata){
        var _this=this
        _this.deletingClassification(isdata)//_this.parId

      },


      //二级删除
      delecl(isdata){
        var _this=this
        _this.deletingClassification(isdata)//_this.subsetId
      },


      // 删除弹框  是否执行下一步
      deletingClassification:function(id){
        var _this=this
        console.log(id)
        this.$confirm("确定删除吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(id.children.length!=0){
            _this.$message.error("分类下有商品不可删除")
          }else {
            let param = {
              cat_id: id.id
            }
            console.log(param)
            apiUser.delClassification(param).then(res=>{
              console.log(res)
              if(res.cscode == "0"){
                this.$alert(res.data.mag, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.mountedget()
                    // location.reload()
                    // var param2={
                    //   page:_this.page,
                    //   limit: _this.limit
                    // }
                    // this.gettype(param2)
                    // this.getlist()
                  }
                })
              }
            })
          }
        }).catch(() => {
          this.$alert("取消删除", '提示信息', {
            confirmButtonText: '确定',
          })
        })
      },
      gettype(param){
        var _this=this
        _this.tableData=[];
        console.log(param)
        apiUser.getClassifyGroup(param).then(res => {
          console.log(res)
          if(res.cscode==0){
            _this.pages.count=res.data.count
            var total=res.data.data;
            console.log(total)
            //console.log(total)
            var objMenu=[]
            for(var i=0;i<total.length;i++){
              var obj={}
              var parentMenu=total[i].max_cat_name;
              var img=total[i].cat_img;
              var obj={
                firstMenu:parentMenu,
                firstImg:img,
                firstId:total[i].max_cat_id,
                secondId:total[i].classify,
                secondMenu:total[i].cat_name,
                shopName:total[i].name,
                sta_on:total[i].sale_goods_num,
                sta_off:total[i].down_goods_num
              }
              console.log(obj);
              _this.tableData.push(obj);
            }
          }else{
            this.$message.error(res.data.msg);
          }
        });
      },


      // //点击商品列表的每一行进行的事件操作
      loachref(row) {
        console.log(row)
        this.$router.push({path:'/goodsonsale',query:{fId:row.firstId,sId:row.secondId,classfy:row.secondMenu}});
      },

      //修改商品事件
      handleEdit(firstId,val,secondId){
        var _this=this;
        //阻止事件冒泡
        window.event? window.event.cancelBubble = true : e.stopPropagation();
        // _this.$router.push({path:"/goodsupdate",query:{ids:val.id,fId:_this.$route.query.fId}})
        console.log(firstId)
        console.log(val)
        if(val.secondMenu=="请添加二级分类"){
          _this.$message.error("请添加二级分类")
        }else{
          _this.$router.push({path:'/goodsadd',query:{ids:firstId,fId:val.secondId}});
        }
      },

      //删除商品分类事件
      handleDelete(index,val){
        var _this=this;
        //阻止事件冒泡
        window.event? window.event.cancelBubble = true : e.stopPropagation();
        console.log(val)
        this.$confirm("确定删除吗", '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(Number(val.sta_on)>0||Number(val.sta_off)>0){
            _this.$message.error("只可删除没有商品的分类")
          }else{
            let param = {
              cat_id: val.secondId
            }
            console.log(param)
            apiUser.delClassification(param).then(res=>{
              console.log(res)
              if(res.cscode == "0"){
                this.$alert(res.data.mag, '提示信息', {
                  confirmButtonText: '确定',
                  callback: action => {
                    var param2={
                      page:_this.page,
                      limit: _this.limit
                    }
                    this.gettype(param2)
                    this.getlist()
                  }
                })
              }
            })
          }
        }).catch(() => {
          this.$alert("取消删除", '提示信息', {
            confirmButtonText: '确定',
          })
        })
      },
      //跳转下架
      tosold(row){
        var _this=this;
        //阻止事件冒泡
        window.event? window.event.cancelBubble = true : e.stopPropagation();
        this.$router.push({path:'/GoodsSoldOut',query:{fId:row.firstId,sId:row.secondId,classfy:row.secondMenu}});
        console.log("eeeee")
      },
      handleSizeChange(val) {
        var _this=this
        if(_this.firstcheck){
          var param={
            page:_this.page,
            limit:val,
          }
          console.log(param)
          _this.gettype(param)
        }
        if(secondcheck){
          var param={
            page:_this.page,
            limit:val,
            cat_name: _this.filterText,
          }
          _this.getlists(param)
        }
       /* var _this=this
        var param={
          page:1,
          limit:val,
        }
        _this.getapply(param)*/

      },
      handleCurrentChange(val) {
        var _this=this
        if(_this.firstcheck){
          var param={
            page:val,
            limit:_this.limit,
          }

          console.log(val)
          _this.gettype(param)
        }
        if(_this.secondcheck){
          var param={
            page:val,
            limit:_this.limit,
            cat_name: _this.filterText,
          }
          _this.getlists(param)
        }

      },
      //分页事件
      //下一页
      nextPages(index){
        var _this=this
        if(_this.firstcheck){
          var param={
            page:index,
            limit:_this.limit,
          }
          _this.gettype(param)
        }
        if(_this.secondcheck){
          var param={
            page:index,
            limit:_this.limit,
            cat_name: _this.filterText,
          }
          _this.getlists(param)
        }
      },
      //上一页
      prevPages(index){
        var _this=this;
        if(_this.firstcheck){
          var param={
            page:index,
            limit:_this.limit,
          }
          _this.gettype(param)
        }
        if(_this.secondcheck){
          var param={
            page:index,
            limit:_this.limit,
            cat_name: _this.filterText,
          }
          _this.getlists(param)
        }
      },
    },
  };
</script>

<style scoped>
  @import url("../../assets/css/Goods.css");
  .goodsclassify_paging{
    width: 600px;
    float: right;
  }

  .refreshs{
    position: absolute;
    top: -15px;
    left: 500px;

  }

  .ordernotes_checked{
    display: flex;
    justify-content: center;
  }
  .ordernotes_checked>label{
    display: block;
    width: 24%;
  }

  .shopNames{
    margin-left: 10px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .update{margin-left: 10px;color: #CBD066;}
  .delete{margin-left: 10px;color: #CBD0D6;}
</style>
