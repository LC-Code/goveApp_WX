
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/userpage/userpage","pages/home/home","pages/userInfo/userInfo","pages/consultpage/consultpage","pages/criticizepage/criticizepage","pages/yuyue/yuyue","pages/jianyi/jianyi","pages/zixun/zixun","pages/over/over","pages/noover/noover"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#d92d31","permission":{"scope.userLocation":{"desc":"为了获取跟优质的服务，我们将获取你的位置信息"}},"backgroundColor":"#F8F8F8"},"tabBar":{"list":[{"pagePath":"pages/home/home"},{"pagePath":"pages/userpage/userpage"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"goverAPP","compilerVersion":"3.1.12","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"navigationBarTitleText":""}},{"path":"/pages/userpage/userpage","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"个人中心","enablePullDownRefresh":false}},{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"政务服务平台","enablePullDownRefresh":false}},{"path":"/pages/userInfo/userInfo","meta":{},"window":{"navigationBarTitleText":"个人信息","enablePullDownRefresh":false}},{"path":"/pages/consultpage/consultpage","meta":{},"window":{"navigationBarTitleText":"咨询记录","enablePullDownRefresh":false}},{"path":"/pages/criticizepage/criticizepage","meta":{},"window":{"navigationBarTitleText":"我的批评","enablePullDownRefresh":false}},{"path":"/pages/yuyue/yuyue","meta":{},"window":{"navigationBarTitleText":"预约中心","enablePullDownRefresh":false}},{"path":"/pages/jianyi/jianyi","meta":{},"window":{"navigationBarTitleText":"投诉、建议","enablePullDownRefresh":false}},{"path":"/pages/zixun/zixun","meta":{},"window":{"navigationBarTitleText":"业务咨询","enablePullDownRefresh":false}},{"path":"/pages/over/over","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/noover/noover","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
