//修正没有console对象时，手动添加无意义的console的对象及方法
(function(){
    if(typeof window.console == 'undefined'){
        var console = {};
        console.log = function(){};
        console.error = function(){};
        console.warn = function(){};
        console.info = function(){};
    }
})();
//初始化web根目录,公共资源目录,已经加载的js,css
var App = function(rootPath){
    if(typeof rootPath != 'undefined'){
        this.root = rootPath;
    }else{
        //确保App.js是第一个引入
        var first = document.getElementsByTagName('script')[0].src;
        if(first.indexOf('http') > -1){
            this.root = '/'+first.split('/')[3]+'/';
        }else{
            this.root = '/'+first.split('/')[0]+'/';
        }
    }
    //css数组
    this.loadedCss = [];
    //js数组
    this.loadedJs = [];
    //TP后台数据，用于html页面初始化
    this.tp = {};
    //url数组
    this.urls = [];
    this.public = this.root+'Public/';
    this.registerLoadedJs();
    this.registerLoadedCss();
}
//首字母大写
App.prototype.upString = function(string){
    var tempString = string.split('');
    tempString[0] = tempString[0].toUpperCase();
    return tempString.join('');
}
//登记已经引入的js
App.prototype.registerLoadedJs = function(){
    this.loadedJs = [];
    var srcs = document.getElementsByTagName('script');
    for (var i = 0; i < srcs.length; i++) {
        if((typeof srcs[i].src != 'undefined') && (srcs[i].src != '')){
            this.registerjs(srcs[i].src);
        }
    }
    return this;
}
//登记已经引入的css
App.prototype.registerLoadedCss = function(){
    this.loadedCss = [];
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
        if((typeof links[i].href != 'undefined') && (links[i].href != '')){
            this.registercss(links[i].href);
        }
    }
    return this;
}
/**
 * 错误提醒机制--有console 优先使用console 否则使用 alert
 * @param  string string 错误信息
 * @return void
 */
App.prototype.error = function(string){
    if(typeof window.console != 'undefined'){
        console.log(string);
    }else{
        alert(string);
    }
}
/**
 * 获取tp的url
 * @param  string tpstring tpUrl标准写法
 * @param  string layer      层级  无传值为Home
 * @return string
 */
App.prototype.url = function(tpstring,layer){
    layer = (typeof layer != 'undefined') ? layer : 'Home';
    var url = this.root+'index.php/'+layer+'/'+this.upString(tpstring)+'/';
    !this.inArray(url,this.urls) ? this.urls.push(url) : '';
    return url;
}
/**
 * 初始化一些需要的Url
 * @param  array obj [{function:'',url:''}]
 * @return viod
 */
App.prototype.initUrl = function(obj){
    for (var i = 0; i < obj.length; i++) {
        this[obj[i].function+'Url'] = this.url(obj[i].url);
    }
    return this;
}
/**
 * 序列化表单  基于jquery
 * @param  string selecter 表单
 * @return object        json
 */
App.prototype.serializeJson = function(selecter){
    if(typeof $ == 'undefined'){
        var str = '该方法是基于jquery，引入jquery后使用';
        this.error(str);
        return false;
    }
    var formArr = $(selecter).serializeArray();
    var jsonObj = {};
    for (var i = 0; i < formArr.length; i++) {
        jsonObj[formArr[i].name] = formArr[i].value;
    }
    return jsonObj;
}
/**
 * 下载单张图片  //需要后端支持
 * @param  string param  后端接受参数名
 * @param  string imageUrl 图片地址（支持本地，远程地址）
 * @return false/viod
 */
App.prototype.downImage = function(param,imageUrl){
    if(typeof this.downImageUrl == 'undefined'){
        var str = '请使用 app.initUrl([["downImage",TPstring]]) 初始化TP后端地址后使用';
        this.error(str);
        return false;
    }
    window.location.href = this.downImageUrl+'?'+param+'='+imageUrl;
}
/**
 * 外部直接引入的js需要进行登记
 * @param  array/string srcArr 登记数组或者字符串
 * @return void
 */
App.prototype.registerjs = function(srcArr){
    if(typeof srcArr == 'object'){
        this.loadedJs = this.loadedJs.concat(srcArr);
    }else{
        this.loadedJs.push(srcArr);
    }
    return this;
}
/**
 * 外部直接引入的css需要进行登记
 * @param  array/string hrefArr 登记数组或者字符串
 * @return void
 */
App.prototype.registercss = function(hrefArr){
    if(typeof hrefArr == 'object'){
        this.loadedCss = this.loadedCss.concat(hrefArr);
    }else{
        this.loadedCss.push(hrefArr);
    }
    return this;
}
/**
 * 动态加载js，可以防止因为一个js文件加载缓慢导致整个html停顿
 * 但是无法确保加载文件的先后顺序，所以需要确保动态加载的资源之间没有相互依赖
 * @param  string src js文件地址
 * @return void
 */
App.prototype.loadjs = function(src){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
    this.loadedJs.push(src);
    return this;
}
/**
 * 获取使用过的js
 * @return array
 */
App.prototype.getJsArr = function(){
    return this.loadedJs;
}
/**
 * 监听键盘事件 兼容各个浏览器
 * @param  string   key      按键
 * @param  Function callback 回调事件
 * @return
 */
App.prototype.listenKey = function(key,callback){
    document.onkeydown = function(e){
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if(code == key){
            callback();
        }
    }
}
/**
 * 是否在数组中
 * @param  string $search 比较的字符串
 * @param  array $arr   比较的数组
 * @return boolean
 */
App.prototype.inArray = function(search,arr){
    for (var i = 0; i < arr.length; i++) {
        if(arr[i] == search) return true;
    }
    return false;
}
