import * as utils from "@/common/utils.js";

let glData = { userid: "", openid: "", __user_token__: "", username: ""};
////userid: '172054', macaddress: 'F0-62-0D-0F-CE-D6',  1217208 F0-62-0D-10-0F-40

export default {
    init: function([userid="",token="",openid=""]){
        glData.userid = userid;
        glData.userid = openid;
        glData.__user_token__ = token;
    },

	setGlData: function(userid){
		glData.userid = userid;
	},

	getGlData: function() {
        if (glData.macaddress == "") {
            let data = {
                userid: utils.getCookie("userid"),
                __user_token__: utils.getCookie("__user_token__")
            }
            return data;
        }

		return glData;
	},

    setToken: function(token){
        glData.__user_token__ = token;
    },

    getToken: function(){
        let token = glData.__user_token__;
        if(token == ""){
            token = utils.getCookie("__user_token__");
        }
        return token;
    },

    multiSetValue: function(langParam){
        for(let key in langParam){
            glData[key] = langParam[key];
        }
    }

}