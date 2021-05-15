<template>
	<view class="content">
		<!-- 登录box -->
		<view class="body">
			<view class="userinfo">
				<view class="ico">
					<van-image round width="145rpx" height="145rpx"
						:src="is_login ? userInfo.avatarUrl : default_ico" />
				</view>
				<view v-if="is_login" class="userinfo-name">
					<text class="userinfo-name">{{userInfo.nickName}}</text>
					<text @click="loginOut" style="color: #007AFF;">[退出]</text>
				</view>

				<text v-else class="userinfo-name" style="color: #007AFF;" @click="getUserProfile"
					open-type="getUserProfile">登录>></text>
			</view>
			<van-divider style="margin: 10rpx 90rpx;" />
			<view class="message">
				<view @click="toOherPage('../over/over')">
					<van-icon name="underway-o" color="blue" size="40rpx"  />
					<text>已完成</text>
				</view>
				<view style="border-left:1rpx solid #eaedf0; padding-left: 100rpx;" @click="toOherPage('../noover/noover')">
					<van-icon name="passed" color="blue" size="40rpx"  :info="info" />
					<text>未处理</text>
				</view>
			</view>
			<!-- <button v-show="is_log" open-type="getUserProfile"></button> -->
		</view>

		<!-- 相关信息 -->
		<view v-show="is_login">
			<van-cell-group>
				<van-cell size="large" icon="manager-o" is-link title="个人信息"
					@click="navigatetoUrl('../userInfo/userInfo')" />
				<van-cell size="large" icon="chat-o" is-link title="我的咨询"
					@click="navigatetoUrl('../consultpage/consultpage')" />
				<van-cell size="large" icon="records" is-link title="我的批评"
					@click="navigatetoUrl('../criticizepage/criticizepage')" />
				<van-cell size="large" icon="envelop-o" is-link title="问题反馈" @click="showErrorWithDialog" />
				<van-cell size="large" icon="bookmark-o" is-link title="立即分享" @click="showErrorWithDialog" />
			</van-cell-group>
		</view>

		<van-dialog id="van-dialog" />
		<view>
			<van-tabbar :active="active" @change="onChange">
			  <van-tabbar-item icon="home-o">标签</van-tabbar-item>
			  <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
			</van-tabbar>
		</view>
	</view>
</template>

<script>
	import Dialog from 'wxcomponents/@vant/weapp/dialog/dialog';
	import MyRequest from '../../utils/requestUtils.js';

	export default {
		data() {
			return {
				info:"",
				active:1,
				userInfo: {},
				default_ico: "https://b.yzcdn.cn/vant/icon-demo-1126.png",
				is_login: false
			}
		},
		onShow() {
			console.log(getApp().globalData)
			this.userInfo = getApp().globalData.UserInfo
			console.log(this.userInfo)
			this.is_login = getApp().globalData.login;
			let opendid = getApp().globalData.opendId
			console.log(opendid)
			uni.request({
				url:this.$baseURL +"appointment/find/"+opendid+"/"+1+".json",
				success: (res) => {
					console.log(res)
					if(res.data.length>0){
						this.info = res.data.length;
					}
				},
				fail: (res) => {
					Dialog.alert({
						message:"拉去服务器数据失败"+res.errMsg
					})
					console.log(res)
				}
			})
		},
		onLoad() {
			
		},
		methods: {
			loginOut() {
				this.is_login = false;
				this.userInfo = {};
				getApp().globalData.UserInfo = {};
				getApp().globalData.login = false;
			},
			navigatetoUrl(pagePath,data) {
				/* var lastIndex = pagePath.lastIndexOf("/");
				var subStr = pagePath.substr(lastIndex+1,pagePath.length-1)
				console.log(subStr) */
				uni.navigateTo({
					url: pagePath,
					success: (res) => {
						console.log(res)
					}
				})
			},
			getUserProfile() {
				var app = getApp()
				var content = this
				wx.getUserProfile({
					desc: "获取用户的姓名，头像",
					success(res) {
						content.userInfo = res.userInfo
						app.globalData.UserInfo = res.userInfo
						app.globalData.login = true
						console.log(app.globalData.UserInfo)
						content.is_login = true
						let opendid = uni.getStorageSync("opendid");
						MyRequest.getServiceUser("个人中心",content.$baseURL,opendid);
					},
					fail(res) {
						console.log(res);
					}
				})
			},
			showErrorWithDialog() {
				Dialog.alert({
					message: "该功能尚在开发过程中,给您带来的不边还请谅解"
				}).then()
			},
			onChange(event){
				if(event.detail == 0){
					uni.switchTab({
						url:"../home/home",
						success: () => {
							
						},
						fail: (res) => {
							console.log("跳转到首页失败")
						}
					})
				}
			},
			toOherPage(page){
				uni.navigateTo({
					url:page,
					success:(res)=>{
						console.log(res)
					},
					fail(res) {
						console.log(res)
					}
				})
			}
		},
		getUserInfo() {
			uni.getUserInfo({
				success: (res) => {
					console.log(res)
					/* userInfo=res.userInfo;
					console.log(userInfo); */
				},
				fail: (res) => {
					console.log(res);
				}

			})
		}
	}
</script>

<style>
	.body {
		display: flex;
		flex-direction: column;
		margin: 50rpx 90rpx;
		border-radius: 20rpx;
		box-shadow: 0rpx 0rpx 10rpx #333333;
		margin-bottom: 60rpx;

	}

	.message {
		display: flex;
		flex-direction: row;
		margin: 5rpx 90rpx;
		justify-content: space-between;
		font-size: 25rpx;
		margin-bottom: 20rpx;
	}

	.userinfo {
		text-align: center;
		margin-top: 10rpx;
	}

	.userinfo-name {
		margin-top: 10rpx;
	}

	.message view {
		display: flex;
		flex-direction: column;
	}
</style>
