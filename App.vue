<script>
	import MyRequest from 'utils/requestUtils.js';
	export default {
		globalData: {
			UserInfo: {},
			opendId: "",
			login:false,
			user:{}
		},
		onLaunch: function() {
			uni.checkSession({
				success(res) {
					console.log(res)
				},
				fail: (res) => {

				}
			});
			uni.openSetting({
				success: (res) => {
					console.log(res)
				},
				fail:(res)=>{
					console.log(res)
				}
			})
		/* 	uni.login({
				timeout: 6000,
				success(res) {
					console.log(res)
					if (res.code) {
						MyRequest.getServiceOpendId("App","http://192.168.1.100:8080/",res.code);
						/* uni.request({
							url: 'http://192.168.1.100:8080/login/' + res.code +
								".json",
							success: (request) => {
								console.log("登录请求返回的数据为：")
								console.log(request);
								if (request.data.opendid == null) {
									console.log("登录请求获取opendid失败")
								} else {
									uni.setStorage({
										key: "user_openid",
										data: request.data.opendid,
										success() {
											console.log("本地缓存opendid成功")
										}
									})
									getApp().globalData.opendId = request.data.opendid

								}

							},
							fail: (res) => {
								console.log("获取opendid失败".res.data.errmsg)
								console.log(res)
							}
						}) 
					} else {
						console.log("登录失败" + res.errMsg)
					}
				}
			}) */
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("wxcomponents/@vant/weapp/common/index.wxss");

	.content {
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
		display: flex;
		flex-direction: column;
	}
</style>
