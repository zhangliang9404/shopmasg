// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from 'axios'
import Vuex from 'vuex'
import VueAreaLinkage from 'vue-area-linkage'
import 'vue-area-linkage/dist/index.css'
import './assets/css/icon/iconfont.css'
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
Vue.use(VueAreaLinkage);
Vue.prototype.$echarts = echarts
/* eslint-disable no-new */
Vue.use(ElementUI);
//
// import '../static/ue/ueditor.config'
// import '../static/ue/ueditor.all.min'
// import '../static/ue/lang/zh-cn/zh-cn'
// import '../static/ue/third-party/codemirror/codemirror'
// import '../static/ue/third-party/codemirror/codemirror.css'
// import '../static/ue/third-party/zeroclipboard/ZeroClipboard'
//引入富文本编辑器插件
// import VueQuillEditor  from 'vue-quill-editor';
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';
// Vue.use(VueQuillEditor);

//import $ from "jquery"
//Vue.use($)

// import md5 from 'md5'
Vue.config.productionTip = false;

//每次路由跳转返回顶部
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        age: '18', //存储了一个公共状态age
        adminleftnavnum:"1", //管理后台左侧导航
        oldadminleftnavnum:"1"
    },
    mutations : {
        showAge(state, msg){
            state.age= msg;
        }
    }
});


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});


