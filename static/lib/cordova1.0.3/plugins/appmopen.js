cordova.define('AppMOpen',function(require,exports,module){var exec=require('cordova/exec');module.exports={getLocation:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','getLocation',[param]);},getCamera:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','getCamera',[param]);},startVideoWitness:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','startVideoWitness',[param]);},genPkcs10:function(callback,errCallback){exec(callback,errCallback,'AppMOpen','genPkcs10',[]);},encriptEcontsWithOpen:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','encriptEcontsWithOpen',[param]);},setLocal:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','setLocal',[param]);},getFromLocal:function(param,callback,errCallback){exec(callback,errCallback,'AppMOpen','getFromLocal',[param]);}};});