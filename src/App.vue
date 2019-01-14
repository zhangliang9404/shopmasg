<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
	import router from './router'
export default {
  name: 'app',
  data () {
  	return {
  	}
  },
  mounted(){
  	//this.aaa()
  },
  methods:{
	aaa(){
		  var token = sessionStorage.getItem('token')
					if(this.$route.path=="/"&&!token){
					 this.$router.push({
						path: '/login'
					 }); 
				return;
		  }
		  if (!token&&this.$route.path!="/public") {
				this.$message.error('未授权，请登陆授权后继续');
				this.$router.push({
					path: '/login'
				});
			return;
		  }
	}
	
  }
}
</script>
<style>
  .el-table th>.cell {text-align: center;}
  .el-table .cell {text-align: center;}
  .el-select-dropdown__list {text-align: center}
  /*用户-商户列表-商户列表-top*/
  ul li {padding:0;margin:0;list-style:none;}
  .header {overflow: hidden;margin-bottom: 20px;width: 100%;font-size:12px;line-height: 20px;}
  .el-breadcrumb {display: inline-block;}
  .header .el-button {float: right;margin-top: 20px;}
  .header .title {width: 94%;border-bottom: 1px solid #ccc;float: left;line-height: 30px;}
</style>
