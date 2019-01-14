export function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if(arr != null)
		return unescape(arr[2]);
	return null;
}

export function multiSetCookie(param) {
	for(let key in param) {
		console.log(key + "=" + param[key]);
		setCookie(key, param[key], 7);
	}
}

//setCookie("token","",1);
export function setCookie(name, value, days) {
	var date, expires;
	if(name) {
		if(days) {
			console.log(days)
			date = new Date();

			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			console.log(date)
			expires = "; expires=" + date.toGMTString();
			console.log(expires)
		} else {
			expires = '';
		}
		window.document.cookie = name + "=" + value + expires + "; path=/";
	}
}

export function filterJson(object) {
	// 主要用在查询时过滤空值参数
	for(var i in object) {
		var value = object[i];
		if(typeof value === 'object') {
			if(Array.isArray(value)) {
				if(value.length == 0) {
					delete object[i];
					continue;
				}
			}
			filterJson(value);
			if(_isEmpty(value)) {
				delete object[i];
			}
		} else if(value === '' || value === null || value === undefined) {
			delete object[i];
		}
	}
	return object;
}

function _isEmpty(object) {
	for(var name in object) {
		return false;
	}
	return true;
}

// 时间戳转化为时间
export function formatDates(timestamp) {
  let timestampa = timestamp *1000;
  let date = new Date(timestampa); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  D = parseInt(D) > 9 ? D : '0' + D;
  h = parseInt(h) > 9 ? h : '0' + h;
  m = parseInt(m) > 9 ? m : '0' + m;
  s = parseInt(s) > 9 ? s : '0' + s;
  return Y+M+D+h+m+s;
}


export function formatDate(date, fmt) {
	//格式化日期插件中的返回值
	if(date == undefined || date == '') return;
	date = typeof date == 'number' ? new Date(date) : date;
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj = {
		'y': date.getFullYear(),
		'M': date.getMonth() + 1,
		'd': date.getDate(),
		'H': date.getHours(),
		'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
		'm': date.getMinutes(),
		's': date.getSeconds(),
		'S': date.getMilliseconds()
	};
	for(var i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
			var val = obj[i] + '';
			for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
}

export function GMTToString(date, fmt) {
	//格式化日期插件中的返回值
	if(date == undefined || date == '') return;
	date = new Date(date);
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj = {
		'y': date.getFullYear(),
		'M': date.getMonth() + 1,
		'd': date.getDate(),
		'H': date.getHours(),
		'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
		'm': date.getMinutes(),
		's': date.getSeconds(),
		'S': date.getMilliseconds()
	};
	for(var i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
			var val = obj[i] + '';
			for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
}

export function clone(myObj) {
	if(typeof(myObj) != 'object') return myObj;
	if(myObj == null) return myObj;
	var myNewObj = new Object();
	for(var i in myObj)
		myNewObj[i] = clone(myObj[i]);
	return myNewObj;
}

export function diffnew(objget, objsubmit) {
	if(typeof(objsubmit) != 'object') return null;
	if(objsubmit == null) return null;
	if(objget == null) objget = new Object();

	var out = new Object();

	for(var key in objsubmit) {
		var a = typeof(objget[key]);
		if(a == undefined) {
			out[key] = objsubmit[key];
			continue;
		}

		if(objget[key] == objsubmit[key] || objsubmit[key] == null) continue;

		out[key] = objsubmit[key];
	}

	return out;
}

/**
 * 获取上周、本月、上月的开始日期、结束日期
 * @param {String} date 获取时间
 * lastWeekStart 上周开始 周一
 * lastWeekEnd 上周结束 周日
 * lastMonthStart 上月开始
 * lastMonthEnd 上月结束
 * monthStart 本月开始
 * monthEnd 本月结束
 */
export function getFormatDate(date) {
	//当天日期
	var nowDate = new Date();
	//今天是本周的第几天
	var nowDayOfWeek = nowDate.getDay();
	//当前日
	var nowDay = nowDate.getDate();
	//当前月
	var nowMonth = nowDate.getMonth();
	//当前年
	var nowYear = nowDate.getFullYear();

	nowYear += (nowYear < 2000) ? 1900 : 0; //
	//上月日期
	var lastMonthDate = new Date();
	lastMonthDate.setDate(1);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	var lastYear = lastMonthDate.getYear();
	var lastMonth = lastMonthDate.getMonth();

	//获得某月的天数
	function getMonthDays(myMonth) {
		var monthStartDate = new Date(nowYear, myMonth, 1);
		var monthEndDate = new Date(nowYear, myMonth + 1, 1);
		var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
		return days;
	}
	//获取本周开始时间
	if(date === 'weekStart') {
		var weekStartDate = new Date(nowYear, nowMonth, nowDay + 1 - (nowDayOfWeek?nowDayOfWeek:7));
		return formatDate(weekStartDate);
	}
	//获得本周结束时间
	if(date === 'weekEnd') {
		var weekStartDate = new Date(nowYear, nowMonth, nowDay + (7 - (nowDayOfWeek?nowDayOfWeek:7)));
		return formatDate(weekStartDate);
	}
	//获得上周的开始日期
	if(date === 'lastWeekStart') {
		var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6);
		return formatDate(weekStartDate);
	}

	//获得上周的结束日期
	if(date === 'lastWeekEnd') {
		var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek, 23, 59, 59);
		return formatDate(weekEndDate);
	}
	//获得上月开始时间
	if(date === 'lastMonthStart') {
		var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
		return formatDate(lastMonthStartDate);
	}
	//获得上月结束时间
	if(date === 'lastMonthEnd') {
		var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth), 23, 59, 59);
		return formatDate(lastMonthEndDate);
	}
	//获得本月的开始日期
	if(date === 'monthStart') {
		var monthStartDate = new Date(nowYear, nowMonth, 1);
		return formatDate(monthStartDate);
	}
	//获得本月的结束日期
	if(date === 'monthEnd') {
		var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth), 23, 59, 59);
		return formatDate(monthEndDate);
	}
}
export function currentTimes() {
  // 获取当前时间戳加一个小时
  Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  var time2 =Date.parse( new Date().Format("yyyy-MM-dd hh:mm:ss"));
  return time2
}
