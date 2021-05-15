<template>
	<view class="content">

		<view class="top_info">
			<view class="top">
				<image src="../../static/topRes.jpg" mode="widthFix"></image>
				<view class="top_text">
					<text class="title">政务服务平台</text>
					<text class="welcome">欢迎您 ！</text>
					<text class="address">新城区龙翔大道</text>
				</view>
			</view>
			<view class="getNumber">
				<van-cell-group title="我要办事" border="false">
				</van-cell-group>

				<view class="zixun">
					<van-cell title="我要咨询" islink :border="false" is-link @click="toOtherPage('../zixun/zixun')" />
				</view>
				<view class="yuyue">
					<van-cell title="我要预约" islink :border="false" is-link @click="toOtherPage('../yuyue/yuyue')" />
				</view>
				<view class="jyts">
					<van-cell title="建议投诉" islink :border="false" is-link @click="toOtherPage('../jianyi/jianyi')" />
				</view>
			</view>
			<view>
				<van-tabbar :active="active" @change="onChange">
					<van-tabbar-item icon="home-o">标签</van-tabbar-item>
					<van-tabbar-item icon="friends-o">标签</van-tabbar-item>
				</van-tabbar>
			</view>
		</view>
		<van-dialog id="van-dialog" />

		<van-action-sheet 
			:show="Setting" 
			cancel-text="取消" 
			@cancel="function(){Setting = false}"
			@click-overlay="function(){Setting = false}"
			title="为了更好的体验请授权小程序获得用户信息权限">
			<view>
				<button class="button" type="primary" open-type="getUserInfo" @click="showSetting">同意授权</button>
			</view>
		</van-action-sheet>
	</view>
</template>

<script>
	const amapFile = require("../../utils/amap-wx.js");
	import Dialog from '../../wxcomponents/@vant/weapp/dialog/dialog';
	import MyRequest from '../../utils/requestUtils.js';
	const beforeClose = (action) => new Promise((resolve) => {
		setTimeout(() => {
			if (action === 'confirm') {
				console.log("点击确定")
				uni.switchTab({
					url: '../userpage/userpage',
					success: (res) => {
						console.log(res)
					},
					fail: (res) => {
						console.log(res)
					}
				})
				resolve(true);
			} else {
				// 拦截取消操作
				resolve(true);
			}
		}, 500);
	});
	export {
		/* beforeClose */
	}

	export default {
		data() {
			return {
				active: 0,
				pageUrl: "home",
				userInfo: {},
				user: {},
				hasUserInfo: false,
				canIUseGetUserProfile: false,
				Setting: false
			}
		},

		onLoad() {
			var opendid = uni.getStorageSync("opendid")
			console.log(opendid)
			if(opendid != ""){
				getApp().globalData.opendId = opendid
				var userInfo = uni.getStorageSync("userInfo")
				console.log(userInfo)
				if(userInfo.hasOwnProperty("nickName")){
					getApp().globalData.UserInfo = userInfo
				}
				var user = uni.getStorageSync("user");
				console.log(user)
				if(user.hasOwnProperty("userCode")){
					getApp().globalData.user = user;
				}
				getApp().globalData.login = true;
			}else{
				this.Setting = true;
			}
			uni.hideTabBar({
				animation: true,
				success: (res) => {
					console.log("hide TabBar success")
				}
			})
		},

		methods: {
			
			showSetting() {
				var that = this;
				this.Setting = false;
				uni.getUserProfile({
					desc: "获取用户信息完善资料",
					success: (res) => {
						getApp().globalData.UserInfo = res.userInfo
						uni.setStorageSync("userInfo", res.userInfo);
						this.userInfo = res.userInfo;
						this.hasUserInfo = true;
						uni.login({
							timeout: 4000,
							success: (res) => {
								if (res.code) {
									getApp().globalData.login = true;
									MyRequest.getServiceOpendId(that, "首页",
										"http://192.168.1.100:8080/",
										res.code);
									// MyRequest.getServiceUser("首页", that.$baseURL, getApp().globalData.opendId, that)
								} else {
									console.log("首页---登录失败");
								}
							}
						})
					}
				});
				// MyRequest.getServiceUser("首页", that.$baseURL, getApp().globalData.opendId, that);
			},
			onChange(even) {
				if (even.detail) {
					uni.switchTab({
						url: "../userpage/userpage",
						success() {

						},
						fail: (res) => {
							console.log(res)
						}
					})
				}
			},

			toOtherPage(pagePath) {
				if (getApp().globalData.login) {
					uni.navigateTo({
						url: pagePath,
						success: (res) => {
							console.log(res)
						},
						fail: (res) => {
							console.log(res)
						}
					});
				} else {
					Dialog.alert({
						message: "你尚未登录，请先登录",
						closeOnClickOverlay: true,
						showCancelButton: true,
						beforeClose
					})
				}
			}
		}
	}
</script>

<style>
	.top {
		position: relative;
		margin: 3rpx 10rpx;
	}

	.top image {
		width: 100%;
		border-radius: 5%;
	}

	.top_text {
		width: 100%;
		height: 100%;
		font-size: 60rpx;
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		align-items: center;
		box-sizing: border-box;
	}

	.welcome {
		font-size: 40rpx;
		margin-top: 20rpx;
	}

	.address {
		margin-top: 10rpx;
		font-size: 30rpx;
	}

	.getNumber {
		/* border: 3rpx solid #07C160; */
		margin: 0rpx 20rpx;
		background: rgba(255, 255, 255, 0);
	}

	.zixun .van-cell,
	.yuyue .van-cell,
	.jyts .van-cell {
		font-size: 40rpx;
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
		margin: 40rpx 3rpx;
		box-shadow: 0 0 10rpx #1989FA;
		border-radius: 7%;
	}
	.button{
		margin: 0 20rpx;
	}
</style>
