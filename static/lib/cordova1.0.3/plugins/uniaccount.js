cordova.define("UniaccountPlugin",function(require,exports,module){var exec=require('cordova/exec');module.exports={login:function(){exec(null,null,"UniaccountPlugin","login",[]);},loginEShop:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","loginEShop",[params]);},logout:function(){exec(null,null,"UniaccountPlugin","logout",[]);},jumpAction:function(params){exec(null,null,"UniaccountPlugin","jumpAction",[params]);},jumpUrl:function(params){exec(null,null,"UniaccountPlugin","jumpUrl",[params]);},activeMobile:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","activeMobile",[params]);},setMobilePwd:function(params){exec(null,null,"UniaccountPlugin","setMobilePwd",[params]);},cleanMobilePwd:function(){exec(null,null,"UniaccountPlugin","cleanMobilePwd",[]);},getMobilePwd:function(successCallback,errorCallback){exec(successCallback,errorCallback,"UniaccountPlugin","getMobilePwd",[]);},getIMEI:function(successCallback,errorCallback){exec(successCallback,errorCallback,"UniaccountPlugin","getIMEI",[]);},getMAC:function(successCallback,errorCallback){exec(successCallback,errorCallback,"UniaccountPlugin","getMAC",[]);},showBar:function(params){exec(null,null,"UniaccountPlugin","showBar",[params]);},getAppInfo:function(successCallback,errorCallback){exec(successCallback,errorCallback,"UniaccountPlugin","getAppInfo",[]);},downLoadRes:function(params){exec(null,null,"UniaccountPlugin","downLoadRes",[params]);},openNews:function(params){exec(null,null,"UniaccountPlugin","openNews",[params]);},ulbAccLogin:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","ulbAccLogin",[params]);},ulbAccLogout:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","ulbAccLogout",[params]);},jumpActivity:function(params){exec(null,null,"UniaccountPlugin","jumpActivity",[params]);},closeActivity:function(){exec(null,null,"UniaccountPlugin","closeActivity",[]);},exitApp:function(){exec(null,null,"UniaccountPlugin","firstLevelPageBack",[]);},cordovaInitFinish:function(){exec(null,null,"UniaccountPlugin","cordovaInitFinish",[]);},setTitleBar:function(params){exec(null,null,"UniaccountPlugin","setTitleBar",[params]);},ulbShare:function(title,iconPath,content,jumpUrl){var params={'title':title,'iconPath':iconPath,'content':content,'jumpUrl':jumpUrl};exec(null,null,"UniaccountPlugin","ulbShare",[params]);},getTradeAccountList:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","getTradeAccountList",[params]);},weiXinPay:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","weixinPay",[params]);},syncInfoNotice:function(successCallback,errorCallback,params){exec(successCallback,errorCallback,"UniaccountPlugin","syncInfoNotice",[params]);},setNavButton:function(param){exec(null,null,"UniaccountPlugin","setNavButton",[param]);}}});