import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import GLData from './data.js'
import * as utils from '../common/utils.js'
import config from '../common/config.js'
let md5 = require('md5');
let loading;
function handleError(error) {
	//toast.toastDanger(error.message || 'request error');
	Promise.reject(error)
}

// 添加一个请求拦截器
axios.interceptors.request.use(function(config) {
	// Do something before request is sent
  //打开加载动画
  if(config.url==="https://api.zhisoufangdichan.com/api/v1/messagesocket/hmsgcount"||config.url==="https://api.zhisoufangdichan.com/api/v1/messagesocket/msglist"){
  }else{
    loading = Vue.prototype.$loading({
      lock: true,
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.8)",
      target: document.querySelector('.loadingtext')//设置加载动画区域
    });
  }
  return config;
  var result = {};
  if(config.data){
    result = config.data;
  }
  return result;
}, function(error) {
	// Do something with request error
	console.log('req fail');
	return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function(response) {
	// Do something with response data
  loading.close();//关闭加载动画
	var result = {};
	if(response.data){
		result = response.data;
	}
  if(utils.getCookie('token')){
    if(parseInt(utils.getCookie("token_time"))< utils.currentTimes()){
      utils.setCookie("token", '');
      utils.setCookie("token_time", '');
      this.$router.push({
        path:'/login'
      })
    }else{
      utils.setCookie("token_time", utils.currentTimes()+ 30*24*60*60*1000);
    }
  }else{
    utils.setCookie("token", '');
    utils.setCookie("token_time", '');
    // window.location.href = " http://localhost:8889/login"
    window.location.href = "https://manage.zhisoufangdichan.com/login"

  }
	return result;
}, function(error) {
	// Do something with response error
	return Promise.reject(error);
});


export const getjson = (uri) => {return axios.get(uri);};

function getParam(data){
	if(JSON.stringify(data) == '{}'){
		return '';
	}else{
		var url = "";
		for(var key in data){
			url += '&'+key+"="+data[key];
		}
		url = url.replace('&','?');
		return url;
	}
}
export function getRe(uri, data, host) {
	let r_url = (host) ? (host+uri) : uri;
	// handleUserMac(data);
	r_url += getParam(data);
	return axios.get(r_url);
}

export function get(uri, data, host) {
	let r_url = (host) ? (host+uri) : uri;
	// handleUserMac(data);
	return axios.get(r_url, {
		params: data
	});
}

export function post(uri, data, host) {
	if (!data) data = {};
	handleUserMac(data);
	var dataStr = '';
	for(var i in data) {
		if(dataStr) {
			dataStr += '&';
		}
		dataStr += i + '=' + data[i];
	}

	let r_url = (host) ? (host+uri) : uri;

	return axios({
		method: 'post',
		url: r_url,
		data: dataStr,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
			'token':utils.getCookie("__user_token__")
		}
	});
}

export function postFile(file,uri, data, host) {
	if (!data) data = {};
	if(GLData.getToken()) data.__user_token__ = GLData.getToken();
	var dataStr = '';
	for(var i in data) {
		if(dataStr) {
			dataStr += '&';
		}
		dataStr += i + '=' + data[i];
	}

	let r_url = (host) ? (host + uri + '?'+ dataStr) : uri;

	var formData = new FormData();

	formData.append('file', file.raw);
	formData.append('quality',50);
	formData.append('format','format');

	return axios({
		method: 'POST',
		url: r_url,
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
			'token':GLData.getToken()
		}
	});
}

function crossRequest(host,uri,method,data){
	if (!data) data = {};

	let r_url = (host) ? (host+uri) : uri;

	return axios({
		method: method,
		url: r_url,
		data: data,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'token':sessionStorage.getItem('token')
		}
	});
}

export function exportData(uri, data, host) {
	if (!data) data = {};
	data.token = GLData.getToken();

	let r_url = (host) ? (host+uri) : uri;
	return axios.get(r_url, {
		params: data
	});
}

export function postJson(uri, data, host) {
	return crossRequest(host,uri,"post",data);
}

export function putJson(uri, data, host) {
	return crossRequest(host,uri,"put",data);
}

export function delJson(uri, data, host) {
	return crossRequest(host,uri,"delete",data);
}

export function multiRequest(funcAry){

}

export function postForm(file,uri, data, host) {
	//console.log(file);
	if (!data) data = {};

	let r_url = (host) ? (host+uri) : uri;

	/*if (!data) data = {};
	var dataStr = '';
	for(var i in data) {
		if(dataStr) {
			dataStr += '&';
		}
		dataStr += i + '=' + data[i];
	}
	var r_url = uri;
	if(host) r_url = host + uri + '?'+ dataStr;*/

	var formData = new FormData();
	formData.append('file', file.raw);
	return axios({
		method: 'POST',
		url: r_url,
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
			'token':GLData.getToken()
		}
	});
}

export function uplodPic(file,uri, data, host) {
	if (!data) data = {};
	let r_url = (host) ? (host+uri) : uri;
	var formData = new FormData();
	formData.append('md5name',data.md5name);
	formData.append('file_name', file);
	return axios({
		method: 'POST',
		url: r_url,
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
			'token':GLData.getToken()
		}
	});
}export function uplodPicvideo(file,uri, data, host) {
	if (!data) data = {};
	let r_url = (host) ? (host+uri) : uri;
	var formData = new FormData();
	formData.append('md5name',data.md5name);
	formData.append('video', file);
	return axios({
		method: 'POST',
		url: r_url,
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
			'token':GLData.getToken()
		}
	});
}
