<template>
	<div class="redact" align="center">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">用户</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/Employee' }">考核列表</el-breadcrumb-item>
			<el-breadcrumb-item>编辑资料</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :model="ruleForm2">

      <ul>
        <li class="chare1" style="position: relative">
          <span style="position: absolute;left: 0;top:4rem">头像：</span>
          <div style="width: 240px;padding-left: 20px">
            <imgload  :imgarr="sale_img" @loadimg="my_imgget"></imgload>
          </div>
        </li>
        <li class="chare1">
          <span>手机号码 : </span>
          <div>
            <el-input v-model="ruleForm2.mobile" placeholder="请输入内容"></el-input>
          </div>
        </li>
        <li class="chare1">
          <span>姓名 : </span>
          <div>
            <el-input v-model="ruleForm2.sale_name" placeholder="请输入内容"></el-input>
          </div>
        </li>
       <!-- <li class="chare1">
          <span>推广员等级 :</span>
         <div>
           <el-select v-model="ruleForm2.grade" clearable placeholder="请选择" style="    width: 260px;">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </div>
        </li>-->
        <li class="chare1">
          <span>性别:</span>
         <div>
            <span class="gender">
        <el-radio-group v-model="ruleForm2.sex">
      <el-radio  label="3">保密</el-radio>
      <el-radio  label="1">男</el-radio>
      <el-radio  label="2">女</el-radio>
  </el-radio-group>
				</span>
         </div>
        </li>
        <li class="chare1" >
          <span>城市:</span>
          <div>
            <el-input v-if="$route.query.id" v-model="ruleForm2.address" placeholder="请输入内容"></el-input>
            <el-form-item class="shengs"  label="" v-else>
              <el-select  style="width: 125px"
                          v-model="selectProv"
                          placeholder="请选择省份"
                          v-on:change="getProv($event)">
                <el-option
                  v-for="(item,index) in provs"
                  :label="item.label"
                  :value="item.value"
                  :key="index">
                </el-option>
              </el-select>
              <el-select  style="width: 125px"
                          v-if="selectProv!=''"
                          v-model="selectCity"
                          placeholder="请选择城市"
                          v-on:change="getCity($event)">
                <el-option
                  v-for="(item,index) in citys"
                  :label="item.label"
                  :value="item.value"
                  :key="index">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
        </li>
        <li class="chare1">
          <span>身份证:</span>
          <div>
            <el-input v-model="ruleForm2.name_num" placeholder="请输入内容"></el-input>
          </div>
        </li>
        <!--<li class="chare1">
          <span>总订单:</span>
         <div>
           <el-input v-model="ruleForm2.ord_num" placeholder="请输入内容"></el-input>
         </div>
        </li>-->
        <!--<li class="chare1">
          &lt;!&ndash;<i class="login_icon i-pwd"></i>&ndash;&gt;
         <span>考核状态:</span>
         <div>
           <el-select v-model="ruleForm2.chk" clearable placeholder="请选择" style="    width: 260px;">
             <el-option
               v-for="item in chelist"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </div>
        </li>-->
        <li class="chare1">
          <!--<i class="login_icon i-pwd"></i>-->
          <span>开户行</span>
         <div>
           <el-input v-model="ruleForm2.bank_address" placeholder="请输入内容"></el-input>
         </div>
        </li>
        <li class="chare1">
          <!--<i class="login_icon i-pwd"></i>-->
          <span>银行卡号</span>
          <div>
            <el-input v-model="ruleForm2.bank_num" placeholder="请输入内容"></el-input>
          </div>
        </li>
        <li class="chare1">
          <span>用户启用状态:</span>
          <el-switch
            v-model="ruleForm2.status"
            active-color="#13ce66"
            inactive-color="#E8EAED"
            style="text-align: left;margin-left: 20px;"
            @change="update_status(status)"

          >
            {{ruleForm2.status}}
          </el-switch>
        </li>
      </ul>
			<div class="button">
				<el-button @click="skip" style="font-size: 14px">提交</el-button>
			</div>
		</el-form>
	</div>

</template>

<script>
  import { requestLogin } from '@/api/api';
	import * as utils from "@/common/utils.js"
	import {api_user} from "@/api/api.js"
  import imgload from '@/views/common/imgload'
	let apiUser = new api_user();
  export default {
  data() {
    return {
         sale_img: "",                          // 农户头像
        'uid':this.$route.query.id,
        provs:[{label:"北京市",value:"北京市"},
       {label:"天津市",value:"天津市"},
       {label:"河北省",value:"河北省"},
       {label:"山西省",value:"山西省"},
       {label:"内蒙古自治区",value:"内蒙古自治区"},
       {label:"辽宁省",value:"辽宁省"},
       {label:"吉林省",value:"吉林省"},
       {label:"黑龙江省",value:"黑龙江省"},
       {label:"上海市",value:"上海市"},
       {label:"江苏省",value:"江苏省"},
       {label:"浙江省",value:"浙江省"},
       {label:"安徽省",value:"安徽省"},
       {label:"福建省",value:"福建省"},
       {label:"江西省",value:"江西省"},
       {label:"山东省",value:"山东省"},
       {label:"河南省",value:"河南省"},
       {label:"湖北省",value:"湖北省"},
       {label:"湖南省",value:"湖南省"},
       {label:"广东省",value:"广东省"},
       {label:"广西壮族自治区",value:"广西壮族自治区"},
       {label:"海南省",value:"海南省"},
       {label:"重庆市",value:"重庆市"},
       {label:"四川省",value:"四川省"},
       {label:"贵州省",value:"贵州省"},
       {label:"云南省",value:"云南省"},
       {label:"西藏自治区",value:"西藏自治区"},
       {label:"陕西省",value:"陕西省"},
       {label:"甘肃省",value:"甘肃省"},
       {label:"青海省",value:"青海省"},
       {label:"宁夏回族自治区",value:"宁夏回族自治区"},
       {label:"新疆维吾尔自治区",value:"新疆维吾尔自治区"},
       {label:"台湾省",value:"台湾省"},
       {label:"香港特别行政区",value:"香港特别行政区"},
       {label:"澳门特别行政区",value:"澳门特别行政区"}] ,
        citys: [],
        selectProv: '',
        selectCity: '',
        radio2: 3,
        value1: true,
        status: false,
        weizhi:false,
        nan:false,
        nv:false,
        ruleForm2:{
           sale_img:'',
           mobile:'',
           sale_name:'',
          /* grade:'',*/
           sex:'',
           name_num:'',
          /* ord_num:'',*/
          /* chk:'',*/
           bank_address:'',
           bank_num:'',
           address:'',
           status:true},
        chelist:[{
           label:'未考核',
           value:2,
        },
          {
            label:'以考核',
            value:1,
          }],
        options: [{
            value: '1',
            label: '黄金'
          }, {
            value: '2',
            label: '铂金'
          }, {
            value: '3',
            label: '钻石'
          }, {
            value: '4',
            label: '星耀'
          }, {
            value: '5',
            label: '王者'
          }],
          leve: '',
          birthday: '',
    }
  },
   methods: {
   	 getProv: function (prov) {
    let tempCity=[];
    this.citys=[];
    this.selectCity='';
    let allCity=[
    {
     prov: "北京市",
     label: "东城区 "
    },{
     prov: "北京市",
     label: "西城区"
    },{
     prov: "北京市",
     label: "海淀区"
    },{
     prov: "北京市",
     label: "朝阳区"
    },{
     prov: "北京市",
     label: "朝阳区"
    },{
     prov: "北京市",
     label: "石景山区"
    },{
     prov: "北京市",
     label: "通州区"
    },{
     prov: "北京市",
     label: "顺义区"
    },{
     prov: "北京市",
     label: "房山区"
    },{
     prov: "北京市",
     label: "大兴区"
    },{
     prov: "北京市",
     label: "昌平区"
    },{
     prov: "北京市",
     label: "怀柔区"
    },{
     prov: "北京市",
     label: "平谷区"
    },{
     prov: "北京市",
     label: "门头沟区"
    },{
     prov: "北京市",
     label: "密云县"
    },{
     prov: "北京市",
     label: "延庆县"
    },{
     prov: "天津市",
     label: "和平区"
    },{
     prov: "天津市",
     label: "河东区"
    },{
     prov: "天津市",
     label: "南开区"
    },{
     prov: "天津市",
     label: "河北区"
    },{
     prov: "天津市",
     label: "红桥区"
    },{
     prov: "天津市",
     label: "天津市"
    },{
     prov: "天津市",
     label: "塘沽区"
    },{
     prov: "天津市",
     label: "汉沽区"
    },{
     prov: "天津市",
     label: "大港区"
    },{
     prov: "天津市",
     label: "天津经济技术开发区"
    },{
     prov: "天津市",
     label: "天津港保税区"
    },{
     prov: "天津市",
     label: "天津港"
    },{
     prov: "天津市",
     label: "东丽区"
    },{
     prov: "天津市",
     label: "津南区"
    },{
     prov: "天津市",
     label: "西青区"
    },{
     prov: "天津市",
     label: "北辰区"
    },{
     prov: "天津市",
     label: "武清区"
    },{
     prov: "天津市",
     label: "宝坻区"
    },{
     prov: "河北省",
     label: "石家庄市"
    }, {
     prov: "河北省",
     label: "唐山市"
    }, {
     prov: "河北省",
     label: "秦皇岛市"
    }, {
     prov: "河北省",
     label: "邯郸市"
    }, {
     prov: "河北省",
     label: "邢台市"
    }, {
     prov: "河北省",
     label: "保定市"
    }, {
     prov: "河北省",
     label: "张家口市"
    }, {
     prov: "河北省",
     label: "承德市"
    }, {
     prov: "河北省",
     label: "沧州市"
    }, {
     prov: "河北省",
     label: "廊坊市"
    }, {
     prov: "河北省",
     label: "衡水市"
    }, {
     prov: "山西省",
     label: "太原市"
    }, {
     prov: "山西省",
     label: "大同市"
    }, {
     prov: "山西省",
     label: "阳泉市"
    }, {
     prov: "山西省",
     label: "长治市"
    }, {
     prov: "山西省",
     label: "晋城市"
    }, {
     prov: "山西省",
     label: "朔州市"
    }, {
     prov: "山西省",
     label: "晋中市"
    }, {
     prov: "山西省",
     label: "运城市"
    }, {
     prov: "山西省",
     label: "忻州市"
    }, {
     prov: "山西省",
     label: "临汾市"
    }, {
     prov: "山西省",
     label: "吕梁市"
    }, {
     prov: "内蒙古自治区",
     label: "呼和浩特市"
    }, {
     prov: "内蒙古自治区",
     label: "包头市"
    }, {
     prov: "内蒙古自治区",
     label: "乌海市"
    }, {
     prov: "内蒙古自治区",
     label: "赤峰市"
    }, {
     prov: "内蒙古自治区",
     label: "通辽市"
    }, {
     prov: "内蒙古自治区",
     label: "鄂尔多斯市"
    }, {
     prov: "内蒙古自治区",
     label: "呼伦贝尔市"
    }, {
     prov: "内蒙古自治区",
     label: "巴彦淖尔市"
    }, {
     prov: "内蒙古自治区",
     label: "乌兰察布市"
    }, {
     prov: "内蒙古自治区",
     label: "兴安盟"
    }, {
     prov: "内蒙古自治区",
     label: "锡林郭勒盟"
    }, {
     prov: "内蒙古自治区",
     label: "阿拉善盟"
    }, {
     prov: "辽宁省",
     label: "沈阳市"
    }, {
     prov: "辽宁省",
     label: "大连市"
    }, {
     prov: "辽宁省",
     label: "鞍山市"
    }, {
     prov: "辽宁省",
     label: "抚顺市"
    }, {
     prov: "辽宁省",
     label: "本溪市"
    }, {
     prov: "辽宁省",
     label: "丹东市"
    }, {
     prov: "辽宁省",
     label: "锦州市"
    }, {
     prov: "辽宁省",
     label: "营口市"
    }, {
     prov: "辽宁省",
     label: "阜新市"
    }, {
     prov: "辽宁省",
     label: "辽阳市"
    }, {
     prov: "辽宁省",
     label: "盘锦市"
    }, {
     prov: "辽宁省",
     label: "铁岭市"
    }, {
     prov: "辽宁省",
     label: "朝阳市"
    }, {
     prov: "辽宁省",
     label: "葫芦岛市"
    }, {
     prov: "吉林省",
     label: "长春市"
    }, {
     prov: "吉林省",
     label: "吉林市"
    }, {
     prov: "吉林省",
     label: "四平市"
    }, {
     prov: "吉林省",
     label: "辽源市"
    }, {
     prov: "吉林省",
     label: "通化市"
    }, {
     prov: "吉林省",
     label: "白山市"
    }, {
     prov: "吉林省",
     label: "松原市"
    }, {
     prov: "吉林省",
     label: "白城市"
    }, {
     prov: "吉林省",
     label: "延边朝鲜族自治州"
    }, {
     prov: "黑龙江省",
     label: "哈尔滨市"
    }, {
     prov: "黑龙江省",
     label: "齐齐哈尔市"
    }, {
     prov: "黑龙江省",
     label: "鸡西市"
    }, {
     prov: "黑龙江省",
     label: "鹤岗市"
    }, {
     prov: "黑龙江省",
     label: "双鸭山市"
    }, {
     prov: "黑龙江省",
     label: "大庆市"
    }, {
     prov: "黑龙江省",
     label: "伊春市"
    }, {
     prov: "黑龙江省",
     label: "佳木斯市"
    }, {
     prov: "黑龙江省",
     label: "七台河市"
    }, {
     prov: "黑龙江省",
     label: "牡丹江市"
    }, {
     prov: "黑龙江省",
     label: "黑河市"
    }, {
     prov: "黑龙江省",
     label: "绥化市"
    }, {
     prov: "黑龙江省",
     label: "大兴安岭地区"
    }, {
     prov: "上海市",
     label: "黄浦区"
    },{
     prov: "上海市",
     label: "卢湾区"
    },{
     prov: "上海市",
     label: "徐汇区"
    },{
     prov: "上海市",
     label: "长宁区"
    },{
     prov: "上海市",
     label: "静安区"
    },{
     prov: "上海市",
     label: "普陀区"
    },{
     prov: "上海市",
     label: "闸北区"
    },{
     prov: "上海市",
     label: "虹口区"
    },{
     prov: "上海市",
     label: "杨浦区"
    },{
     prov: "上海市",
     label: "闵行区"
    },{
     prov: "上海市",
     label: "宝山区"
    },{
     prov: "上海市",
     label: "嘉定区"
    },{
     prov: "上海市",
     label: "浦东新区"
    },{
     prov: "上海市",
     label: "金山区"
    },{
     prov: "上海市",
     label: "松江区"
    },{
     prov: "上海市",
     label: "青浦区"
    },{
     prov: "上海市",
     label: "奉贤区"
    },{
     prov: "上海市",
     label: "南汇区"
    },{
     prov: "上海市",
     label: "崇明县"
    }, {
     prov: "江苏省",
     label: "南京市"
    }, {
     prov: "江苏省",
     label: "无锡市"
    }, {
     prov: "江苏省",
     label: "徐州市"
    }, {
     prov: "江苏省",
     label: "常州市"
    }, {
     prov: "江苏省",
     label: "苏州市"
    }, {
     prov: "江苏省",
     label: "南通市"
    }, {
     prov: "江苏省",
     label: "连云港市"
    }, {
     prov: "江苏省",
     label: "淮安市"
    }, {
     prov: "江苏省",
     label: "盐城市"
    }, {
     prov: "江苏省",
     label: "扬州市"
    }, {
     prov: "江苏省",
     label: "镇江市"
    }, {
     prov: "江苏省",
     label: "泰州市"
    }, {
     prov: "江苏省",
     label: "宿迁市"
    }, {
     prov: "浙江省",
     label: "杭州市"
    }, {
     prov: "浙江省",
     label: "宁波市"
    }, {
     prov: "浙江省",
     label: "温州市"
    }, {
     prov: "浙江省",
     label: "嘉兴市"
    }, {
     prov: "浙江省",
     label: "湖州市"
    }, {
     prov: "浙江省",
     label: "绍兴市"
    }, {
     prov: "浙江省",
     label: "金华市"
    }, {
     prov: "浙江省",
     label: "衢州市"
    }, {
     prov: "浙江省",
     label: "舟山市"
    }, {
     prov: "浙江省",
     label: "台州市"
    }, {
     prov: "浙江省",
     label: "丽水市"
    }, {
     prov: "安徽省",
     label: "合肥市"
    }, {
     prov: "安徽省",
     label: "芜湖市"
    }, {
     prov: "安徽省",
     label: "蚌埠市"
    }, {
     prov: "安徽省",
     label: "淮南市"
    }, {
     prov: "安徽省",
     label: "马鞍山市"
    }, {
     prov: "安徽省",
     label: "淮北市"
    }, {
     prov: "安徽省",
     label: "铜陵市"
    }, {
     prov: "安徽省",
     label: "安庆市"
    }, {
     prov: "安徽省",
     label: "黄山市"
    }, {
     prov: "安徽省",
     label: "滁州市"
    }, {
     prov: "安徽省",
     label: "阜阳市"
    }, {
     prov: "安徽省",
     label: "宿州市"
    }, {
     prov: "安徽省",
     label: "六安市"
    }, {
     prov: "安徽省",
     label: "亳州市"
    }, {
     prov: "安徽省",
     label: "池州市"
    }, {
     prov: "安徽省",
     label: "宣城市"
    }, {
     prov: "福建省",
     label: "福州市"
    }, {
     prov: "福建省",
     label: "厦门市"
    }, {
     prov: "福建省",
     label: "莆田市"
    }, {
     prov: "福建省",
     label: "三明市"
    }, {
     prov: "福建省",
     label: "泉州市"
    }, {
     prov: "福建省",
     label: "漳州市"
    }, {
     prov: "福建省",
     label: "南平市"
    }, {
     prov: "福建省",
     label: "龙岩市"
    }, {
     prov: "福建省",
     label: "宁德市"
    }, {
     prov: "江西省",
     label: "南昌市"
    }, {
     prov: "江西省",
     label: "景德镇市"
    }, {
     prov: "江西省",
     label: "萍乡市"
    }, {
     prov: "江西省",
     label: "九江市"
    }, {
     prov: "江西省",
     label: "新余市"
    }, {
     prov: "江西省",
     label: "鹰潭市"
    }, {
     prov: "江西省",
     label: "赣州市"
    }, {
     prov: "江西省",
     label: "吉安市"
    }, {
     prov: "江西省",
     label: "宜春市"
    }, {
     prov: "江西省",
     label: "抚州市"
    }, {
     prov: "江西省",
     label: "上饶市"
    }, {
     prov: "山东省",
     label: "济南市"
    }, {
     prov: "山东省",
     label: "青岛市"
    }, {
     prov: "山东省",
     label: "淄博市"
    }, {
     prov: "山东省",
     label: "枣庄市"
    }, {
     prov: "山东省",
     label: "东营市"
    }, {
     prov: "山东省",
     label: "烟台市"
    }, {
     prov: "山东省",
     label: "潍坊市"
    }, {
     prov: "山东省",
     label: "济宁市"
    }, {
     prov: "山东省",
     label: "泰安市"
    }, {
     prov: "山东省",
     label: "威海市"
    }, {
     prov: "山东省",
     label: "日照市"
    }, {
     prov: "山东省",
     label: "莱芜市"
    }, {
     prov: "山东省",
     label: "临沂市"
    }, {
     prov: "山东省",
     label: "德州市"
    }, {
     prov: "山东省",
     label: "聊城市"
    }, {
     prov: "山东省",
     label: "滨州市"
    }, {
     prov: "山东省",
     label: "菏泽市"
    }, {
     prov: "河南省",
     label: "郑州市"
    }, {
     prov: "河南省",
     label: "开封市"
    }, {
     prov: "河南省",
     label: "洛阳市"
    }, {
     prov: "河南省",
     label: "平顶山市"
    }, {
     prov: "河南省",
     label: "安阳市"
    }, {
     prov: "河南省",
     label: "鹤壁市"
    }, {
     prov: "河南省",
     label: "新乡市"
    }, {
     prov: "河南省",
     label: "焦作市"
    }, {
     prov: "河南省",
     label: "濮阳市"
    }, {
     prov: "河南省",
     label: "许昌市"
    }, {
     prov: "河南省",
     label: "漯河市"
    }, {
     prov: "河南省",
     label: "三门峡市"
    }, {
     prov: "河南省",
     label: "南阳市"
    }, {
     prov: "河南省",
     label: "商丘市"
    }, {
     prov: "河南省",
     label: "信阳市"
    }, {
     prov: "河南省",
     label: "周口市"
    }, {
     prov: "河南省",
     label: "驻马店市"
    }, {
     prov: "河南省",
     label: "省直辖县级行政区划"
    }, {
     prov: "湖北省",
     label: "武汉市"
    }, {
     prov: "湖北省",
     label: "黄石市"
    }, {
     prov: "湖北省",
     label: "十堰市"
    }, {
     prov: "湖北省",
     label: "宜昌市"
    }, {
     prov: "湖北省",
     label: "襄阳市"
    }, {
     prov: "湖北省",
     label: "鄂州市"
    }, {
     prov: "湖北省",
     label: "荆门市"
    }, {
     prov: "湖北省",
     label: "孝感市"
    }, {
     prov: "湖北省",
     label: "荆州市"
    }, {
     prov: "湖北省",
     label: "黄冈市"
    }, {
     prov: "湖北省",
     label: "咸宁市"
    }, {
     prov: "湖北省",
     label: "随州市"
    }, {
     prov: "湖北省",
     label: "恩施土家族苗族自治州"
    }, {
     prov: "湖北省",
     label: "省直辖县级行政区划"
    }, {
     prov: "湖北省",
     label: "仙桃市"
    }, {
     prov: "湖北省",
     label: "潜江市"
    }, {
     prov: "湖北省",
     label: "天门市"
    }, {
     prov: "湖北省",
     label: "神农架林区"
    }, {
     prov: "湖南省",
     label: "长沙市"
    }, {
     prov: "湖南省",
     label: "株洲市"
    }, {
     prov: "湖南省",
     label: "湘潭市"
    }, {
     prov: "湖南省",
     label: "衡阳市"
    }, {
     prov: "湖南省",
     label: "邵阳市"
    }, {
     prov: "湖南省",
     label: "岳阳市"
    }, {
     prov: "湖南省",
     label: "常德市"
    }, {
     prov: "湖南省",
     label: "张家界市"
    }, {
     prov: "湖南省",
     label: "益阳市"
    }, {
     prov: "湖南省",
     label: "郴州市"
    }, {
     prov: "湖南省",
     label: "永州市"
    }, {
     prov: "湖南省",
     label: "怀化市"
    }, {
     prov: "湖南省",
     label: "娄底市"
    }, {
     prov: "湖南省",
     label: "湘西土家族苗族自治州"
    }, {
     prov: "广东省",
     label: "广州市"
    }, {
     prov: "广东省",
     label: "韶关市"
    }, {
     prov: "广东省",
     label: "深圳市"
    }, {
     prov: "广东省",
     label: "珠海市"
    }, {
     prov: "广东省",
     label: "汕头市"
    }, {
     prov: "广东省",
     label: "佛山市"
    }, {
     prov: "广东省",
     label: "江门市"
    }, {
     prov: "广东省",
     label: "湛江市"
    }, {
     prov: "广东省",
     label: "茂名市"
    }, {
     prov: "广东省",
     label: "肇庆市"
    }, {
     prov: "广东省",
     label: "惠州市"
    }, {
     prov: "广东省",
     label: "梅州市"
    }, {
     prov: "广东省",
     label: "汕尾市"
    }, {
     prov: "广东省",
     label: "河源市"
    }, {
     prov: "广东省",
     label: "阳江市"
    }, {
     prov: "广东省",
     label: "清远市"
    }, {
     prov: "广东省",
     label: "东莞市"
    }, {
     prov: "广东省",
     label: "中山市"
    }, {
     prov: "广东省",
     label: "潮州市"
    }, {
     prov: "广东省",
     label: "揭阳市"
    }, {
     prov: "广东省",
     label: "云浮市"
    }, {
     prov: "广西壮族自治区",
     label: "南宁市"
    }, {
     prov: "广西壮族自治区",
     label: "柳州市"
    }, {
     prov: "广西壮族自治区",
     label: "桂林市"
    }, {
     prov: "广西壮族自治区",
     label: "梧州市"
    }, {
     prov: "广西壮族自治区",
     label: "北海市"
    }, {
     prov: "广西壮族自治区",
     label: "防城港市"
    }, {
     prov: "广西壮族自治区",
     label: "钦州市"
    }, {
     prov: "广西壮族自治区",
     label: "贵港市"
    }, {
     prov: "广西壮族自治区",
     label: "玉林市"
    }, {
     prov: "广西壮族自治区",
     label: "百色市"
    }, {
     prov: "广西壮族自治区",
     label: "贺州市"
    }, {
     prov: "广西壮族自治区",
     label: "河池市"
    }, {
     prov: "广西壮族自治区",
     label: "来宾市"
    }, {
     prov: "广西壮族自治区",
     label: "崇左市"
    }, {
     prov: "海南省",
     label: "海口市"
    }, {
     prov: "海南省",
     label: "三亚市"
    }, {
     prov: "海南省",
     label: "三沙市"
    }, {
     prov: "海南省",
     label: "省直辖县级行政区划"
    }, {
     prov: "海南省",
     label: "五指山市"
    }, {
     prov: "海南省",
     label: "琼海市"
    }, {
     prov: "海南省",
     label: "儋州市"
    }, {
     prov: "海南省",
     label: "文昌市"
    }, {
     prov: "海南省",
     label: "万宁市"
    }, {
     prov: "海南省",
     label: "东方市"
    }, {
     prov: "海南省",
     label: "定安县"
    }, {
     prov: "海南省",
     label: "屯昌县"
    }, {
     prov: "海南省",
     label: "澄迈县"
    }, {
     prov: "海南省",
     label: "临高县"
    }, {
     prov: "海南省",
     label: "白沙黎族自治县"
    }, {
     prov: "海南省",
     label: "昌江黎族自治县"
    }, {
     prov: "海南省",
     label: "乐东黎族自治县"
    }, {
     prov: "海南省",
     label: "陵水黎族自治县"
    }, {
     prov: "海南省",
     label: "保亭黎族苗族自治县"
    }, {
     prov: "海南省",
     label: "琼中黎族苗族自治县"
    }, {
     prov: "重庆市",
     label: "重庆市"
    }, {
     prov: "四川省",
     label: "成都市"
    }, {
     prov: "四川省",
     label: "自贡市"
    }, {
     prov: "四川省",
     label: "攀枝花市"
    }, {
     prov: "四川省",
     label: "泸州市"
    }, {
     prov: "四川省",
     label: "德阳市"
    }, {
     prov: "四川省",
     label: "绵阳市"
    }, {
     prov: "四川省",
     label: "广元市"
    }, {
     prov: "四川省",
     label: "遂宁市"
    }, {
     prov: "四川省",
     label: "内江市"
    }, {
     prov: "四川省",
     label: "乐山市"
    }, {
     prov: "四川省",
     label: "南充市"
    }, {
     prov: "四川省",
     label: "眉山市"
    }, {
     prov: "四川省",
     label: "宜宾市"
    }, {
     prov: "四川省",
     label: "广安市"
    }, {
     prov: "四川省",
     label: "达州市"
    }, {
     prov: "四川省",
     label: "雅安市"
    }, {
     prov: "四川省",
     label: "巴中市"
    }, {
     prov: "四川省",
     label: "资阳市"
    }, {
     prov: "四川省",
     label: "阿坝藏族羌族自治州"
    }, {
     prov: "四川省",
     label: "甘孜藏族自治州"
    }, {
     prov: "四川省",
     label: "凉山彝族自治州"
    }, {
     prov: "贵州省",
     label: "贵阳市"
    }, {
     prov: "贵州省",
     label: "六盘水市"
    }, {
     prov: "贵州省",
     label: "遵义市"
    }, {
     prov: "贵州省",
     label: "安顺市"
    }, {
     prov: "贵州省",
     label: "毕节市"
    }, {
     prov: "贵州省",
     label: "铜仁市"
    }, {
     prov: "贵州省",
     label: "黔西南布依族苗族自治州"
    }, {
     prov: "贵州省",
     label: "黔东南苗族侗族自治州"
    }, {
     prov: "贵州省",
     label: "黔南布依族苗族自治州"
    }, {
     prov: "云南省",
     label: "昆明市"
    }, {
     prov: "云南省",
     label: "曲靖市"
    }, {
     prov: "云南省",
     label: "玉溪市"
    }, {
     prov: "云南省",
     label: "保山市"
    }, {
     prov: "云南省",
     label: "昭通市"
    }, {
     prov: "云南省",
     label: "丽江市"
    }, {
     prov: "云南省",
     label: "普洱市"
    }, {
     prov: "云南省",
     label: "临沧市"
    }, {
     prov: "云南省",
     label: "楚雄彝族自治州"
    }, {
     prov: "云南省",
     label: "红河哈尼族彝族自治州"
    }, {
     prov: "云南省",
     label: "文山壮族苗族自治州"
    }, {
     prov: "云南省",
     label: "西双版纳傣族自治州"
    }, {
     prov: "云南省",
     label: "大理白族自治州"
    }, {
     prov: "云南省",
     label: "德宏傣族景颇族自治州"
    }, {
     prov: "云南省",
     label: "怒江傈僳族自治州"
    }, {
     prov: "云南省",
     label: "迪庆藏族自治州"
    }, {
     prov: "西藏自治区",
     label: "拉萨市"
    }, {
     prov: "西藏自治区",
     label: "昌都地区"
    }, {
     prov: "西藏自治区",
     label: "山南地区"
    }, {
     prov: "西藏自治区",
     label: "日喀则地区"
    }, {
     prov: "西藏自治区",
     label: "那曲地区"
    }, {
     prov: "西藏自治区",
     label: "阿里地区"
    }, {
     prov: "西藏自治区",
     label: "林芝地区"
    }, {
     prov: "陕西省",
     label: "西安市"
    }, {
     prov: "陕西省",
     label: "铜川市"
    }, {
     prov: "陕西省",
     label: "宝鸡市"
    }, {
     prov: "陕西省",
     label: "咸阳市"
    }, {
     prov: "陕西省",
     label: "渭南市"
    }, {
     prov: "陕西省",
     label: "延安市"
    }, {
     prov: "陕西省",
     label: "汉中市"
    }, {
     prov: "陕西省",
     label: "榆林市"
    }, {
     prov: "陕西省",
     label: "安康市"
    }, {
     prov: "陕西省",
     label: "商洛市"
    }, {
     prov: "甘肃省",
     label: "兰州市"
    }, {
     prov: "甘肃省",
     label: "嘉峪关市"
    }, {
     prov: "甘肃省",
     label: "金昌市"
    }, {
     prov: "甘肃省",
     label: "白银市"
    }, {
     prov: "甘肃省",
     label: "天水市"
    }, {
     prov: "甘肃省",
     label: "武威市"
    }, {
     prov: "甘肃省",
     label: "张掖市"
    }, {
     prov: "甘肃省",
     label: "平凉市"
    }, {
     prov: "甘肃省",
     label: "酒泉市"
    }, {
     prov: "甘肃省",
     label: "庆阳市"
    }, {
     prov: "甘肃省",
     label: "定西市"
    }, {
     prov: "甘肃省",
     label: "陇南市"
    }, {
     prov: "甘肃省",
     label: "临夏回族自治州"
    }, {
     prov: "甘肃省",
     label: "甘南藏族自治州"
    }, {
     prov: "青海省",
     label: "西宁市"
    }, {
     prov: "青海省",
     label: "海东市"
    }, {
     prov: "青海省",
     label: "海北藏族自治州"
    }, {
     prov: "青海省",
     label: "黄南藏族自治州"
    }, {
     prov: "青海省",
     label: "海南藏族自治州"
    }, {
     prov: "青海省",
     label: "果洛藏族自治州"
    }, {
     prov: "青海省",
     label: "玉树藏族自治州"
    }, {
     prov: "青海省",
     label: "海西蒙古族藏族自治州"
    }, {
     prov: "宁夏回族自治区",
     label: "银川市"
    }, {
     prov: "宁夏回族自治区",
     label: "石嘴山市"
    }, {
     prov: "宁夏回族自治区",
     label: "吴忠市"
    }, {
     prov: "宁夏回族自治区",
     label: "固原市"
    }, {
     prov: "宁夏回族自治区",
     label: "中卫市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "乌鲁木齐市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "克拉玛依市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "吐鲁番地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "哈密地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "昌吉回族自治州"
    }, {
     prov: "新疆维吾尔自治区",
     label: "博尔塔拉蒙古自治州"
    }, {
     prov: "新疆维吾尔自治区",
     label: "巴音郭楞蒙古自治州"
    }, {
     prov: "新疆维吾尔自治区",
     label: "阿克苏地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "克孜勒苏柯尔克孜自治州"
    }, {
     prov: "新疆维吾尔自治区",
     label: "喀什地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "和田地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "伊犁哈萨克自治州"
    }, {
     prov: "新疆维吾尔自治区",
     label: "塔城地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "阿勒泰地区"
    }, {
     prov: "新疆维吾尔自治区",
     label: "自治区直辖县级行政区划"
    }, {
     prov: "新疆维吾尔自治区",
     label: "石河子市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "阿拉尔市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "图木舒克市"
    }, {
     prov: "新疆维吾尔自治区",
     label: "五家渠市"
    }, {
     prov: "台湾省",
     label: "台北市"
    }, {
     prov: "台湾省",
     label: "高雄市"
    }, {
     prov: "台湾省",
     label: "基隆市"
    }, {
     prov: "台湾省",
     label: "台中市"
    }, {
     prov: "台湾省",
     label: "台南市"
    }, {
     prov: "台湾省",
     label: "新竹市"
    }, {
     prov: "台湾省",
     label: "嘉义市"
    }, {
     prov: "台湾省",
     label: "省直辖"
    }, {
     prov: "香港特别行政区",
     label: "香港岛"
    }, {
     prov: "香港特别行政区",
     label: "九龙"
    }, {
     prov: "香港特别行政区",
     label: "新界"
    }, {
     prov: "澳门特别行政区",
     label: "澳门半岛"
    }, {
     prov: "澳门特别行政区",
     label: "澳门离岛"
    }, {
     prov: "澳门特别行政区",
     label: "无堂区划分区域"
    }];
    for (var val of allCity){
     if (prov == val.prov){
      console.log(val);
      tempCity.push({label: val.label, value: val.label})
     }
    }
    this.citys = tempCity;
   },
     getCity: function (city) {
    console.log(city);
    console.log(this.selectCity)
   },
     my_imgget(val){
       this.ruleForm2.sale_img = val
     },
     //更改用户状态
     update_status(status){
       console.log(status)
       var sta=''
       /*if(status){
         this.ruleForm2.status=1
       }else {
         this.ruleForm2.status=2
       }*/
     /*  console.log(sta)
       let param={
         id:this.uid,
         status:sta
       }*/
      /* apiUser.update_userStatu(param).then(res => {
         console.log(res)
         this.$message(res.data.msg)

       })*/
     },
     skip(){
   	    if(this.ruleForm2.sale_img=='' || this.ruleForm2.sale_img==null){
           this.$message("请上传个人头像")
           return
         }
         //手机号处理
         var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
         var phone=this.ruleForm2.mobile
         if (!phoneReg.test(phone) ||  phone=='') {
           this.$message("请输入有效手机号")
           return
         }
         if (this.ruleForm2.sale_name=='') {
           this.$message("请输入推广人员姓名")
           return
         }
         if (this.ruleForm2.grade=='') {
           this.$message("请选择推广员等级")
           return
         }
         if (this.ruleForm2.sex=='') {
           this.$message("请选择您的性别")
           return
         }
         if (this.ruleForm2.sex=='') {
           this.$message("请选择您的性别")
           return
         }
         var str=''
         if(this.$route.query.id){
           str=this.ruleForm2.address
         }else {
           str=this.selectProv+this.selectCity
         }
         if (str=='') {
           this.$message("请选择您的地址")
           return
         }
         //身份证号识别
         var id_reg= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
         if(this.ruleForm2.name_num==''){
           this.$message("请输入您的身份证号")
           return
         }
         if(id_reg.test(this.ruleForm2.name_num)===false){
           this.$message("身份证号格式不正确")
           return
         }
         let obj =this.ruleForm2
          obj.address=str
         if(obj.status){
           obj.status=1
         }else {
           obj.status=2
         }
         let param= obj
         console.log(param)
       if(this.$route.query.id){
          param.id=this.$route.query.id
       apiUser.editDetail(param).then(res => {
         this.getDetail()
           console.log(res)
           if(res.cscode==0){

             this.$message(res.data.msg)
           }else {
             this.$message.error(res.data.msg)

           }
         })
       }else {
         apiUser.addSaler(param).then(res => {
           console.log(res)
           if(res.cscode==0){
             this.$message(res.data.msg)
             for(var item in this.ruleForm2){
               this.ruleForm2[item]=''
             }
             this.sale_img=[]
             this.selectCity=''
             this.selectProv=''
           }else {
             this.$message.error(res.data.msg)

           }
         })
       }


     },
     //展示信息
     getDetail(){
   	   let param={
         sale_id:this.$route.query.id
       }
       apiUser. salerDetail(param).then(res => {
           console.log(res.data.data)
           if(res.cscode==0){
              /*this.ruleForm2=res.data.data*/
             for(var item1 in this.ruleForm2){
               for(var item in res.data.data){
                 if(item1==item){
                   this.ruleForm2[item1]=res.data.data[item]
                   if(item=='status'){
                     if(this.ruleForm2[item1]==null ||  this.ruleForm2[item1]==1){
                       this.ruleForm2[item1]=true

                     } else if(this.ruleForm2[item1]==2){
                       this.ruleForm2[item1]=false
                     }
                   }
                 }



               }
             }
             this.sale_img=this.ruleForm2.sale_img
             console.log(this.sale_img)
             console.log(this.ruleForm2)

           }

           console.log(this.ruleForm2)
       })
     },
  },
  mounted: function () {
   if(this.$route.query.id){
     console.log(this.sale_img)
     this.getDetail()
   }else {
     console.log("aa")

   }
  },
    components:{
      imgload
    },
 }
</script>

<style scoped>
  ul li{
    list-style: none;
    width: 100%;
  }
  ul li>span{
    width: 130px;
    display: inline-block;
    text-align: right;
  }
  ul li>div{
    display: inline-block;
    width: 260px;

  }
  .el-form{
    width: 25rem!important;
  }
  .shengs{
    display: inline-block;
  }
  .el-input{
    width: 100% !important;
  }
	.redact{
	height: 100%;
	width: 450px;
	padding: 0 4px;
	font-size: 20px;
	display: block;
	/*margin: auto;*/
	vertical-align:middle;/*表单控件上下居中对齐*/
}
.gender{
}
/*所有的div*/
.chare1{white-space:nowrap; padding-top: 0.5rem;}

.el-input__inner{
	height: 55px;
}


.el-form-item__content{
	white-space: nowrap;
	font-size: 20px;
}
.el-form-item {
    margin-bottom: 0px;
}
/*按钮*/
.button{ padding: 1.2rem 0rem 0rem 10.9rem;}
 .el-button {
    font-size: 18px;
    padding: 10px 16px;
  }
/*开关*/
.login_hang{padding-top: 1.5rem; }

.el-form{	width: 12rem;white-space:nowrap;}
.el-input{width: 150%;padding-top: 0.5rem;}

/*下拉箭头*/
.el-input__icon {height: 134%;width: 50%;}
/*省份选择框*/
.el-select-dropdown .el-popper{
	padding-left: ;
}
/*//选择地址*/
.chare2{width:10;font-size: 20px;}
.el-form-item__label{ padding: 30px 0px 0 0;font-size: 20px;}
.el-input .el-input--suffix{padding-left: 5rem;}

/*目录*/
.el-breadcrumb {margin: 0rem 0rem rem 0rem;font-size: 24px;line-height: 2;}

@import url("../../assets/css/UserRedact.css");
	.el-form-item__content {font-size: 20px;}
  ul li span{font-size: 16px}
  .el-breadcrumb span{font-size: 14px}
</style>
