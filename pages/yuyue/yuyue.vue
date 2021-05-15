<template>
	<view class="content">
		<view class="main_content">
			<view class="top">
				<image src="../../static/topRes.jpg" mode="widthFix"></image>
			</view>
			<view class="intoUserInfo">
				<view>
					<van-field 
					:value="user.userNname" 
					placeholder="请输入姓名" 
					left-icon="manager-o"
					 @input="function(e){user.userNname = e.detail}"
					 :readonly="user.hasOwnProperty('userNname') ? true : fase"
					/>
					<van-field 
					:value="user.idCode" 
					placeholder="请输入证件号" 
					left-icon="idcard"
					 @input="function(e){user.idCode = e.detail}"
					 :readonly="user.hasOwnProperty('idCode') ? true : false"
					 />
				</view>
			</view>

			<view class="yuyue_content">
				<view class="depart">
					<van-icon name="points" />
					<view class="title">业务部门：</view>
					<text class="selectButton"
						@click="departShow=!departShow">{{d_name=="" ? '==请选择业务部门==' : d_name.value }}</text>
					<!-- <van-field :value="value" placeholder="请选择业务类型" :border="false" /> -->
				</view>
				<view class="item">
					<van-icon name="points" />
					<view class="title">预约事项：</view>
					<text class="selectButton"
						@click="itemShow=!itemShow">{{item_name=="" ? '==预约事项==' : item_name.value }}</text>
					<!-- <van-field :value="value" placeholder="选择预约事项" :border="false" /> -->
				</view>
				<view class="time">
					<van-icon name="points" />
					<view class="title">办理时间：</view>
					<text class="selectButton"
						@click="timeShow=!timeShow">{{time_info =="" ? '选择办理时间' : time_info}}</text>
					<!-- <van-field :value="value" placeholder="选择办理时间" :border="false" /> -->
				</view>
			</view>
			<button class="submit_button" type="primary" @click="submit">提交预约</button>
		</view>
		<view class="compents">
			<van-popup :show="departShow" position="bottom" custom-style="height: 40%;"
				@click-overlay="departShow=!departShow">
				<van-picker :columns="departColumns" :default-index="0" confirm-button-text="确定" cancel-button-text="取消" show-toolbar
					@cancel="departShow=!departShow" @confirm="departSelect" />
			</van-popup>
			<van-popup :show="itemShow" :default-index="0" position="bottom" custom-style="height: 40%;"
				@click-overlay="itemShow=!itemShow">
				<van-picker :columns="itemColumns" bind:change="onChange" confirm-button-text="确定"
					cancel-button-text="取消" show-toolbar @cancel="itemShow=!itemShow"
					@confirm="function(e){this.item_name = e.detail;this.itemShow=!this.itemShow}" />
			</van-popup>
			<van-popup :show="timeShow" position="bottom" custom-style="height: 40%;"
				@click-overlay="timeShow=!timeShow">
				<van-picker :columns="timeColumns" bind:change="onChange" confirm-button-text="确定"
					cancel-button-text="取消" show-toolbar @cancel="timeShow=!timeShow" @confirm="timeSelect" />
			</van-popup>
			<view>
				<van-notify id="van-notify" />
				<van-toast v-show="isSuccess" id="van-toast" />
				<van-dialog id="van-dialog" />
			</view>
		</view>
	</view>
</template>

<script>
	import Notify from '../../wxcomponents/@vant/weapp/notify/notify';
	import MyRequest from '../../utils/requestUtils.js';
	import Toast from 'wxcomponents/@vant/weapp/toast/toast';
	import Dialog from '../../wxcomponents/@vant/weapp/dialog/dialog';
	/* const MyRequest myRequest = new MyRequest(); */
	const yuyueTime = function() {
		var timeTemp = makeTime();
		var getTime = [];

		for (let i = 0; i < timeTemp.length; i++) {
			getTime[i] = timeTemp[i].day;
		}
		console.log(getTime)
		return getTime;
	}
	
	export {
		yuyueTime
		/* myRequest */
	}

	export default {
		data() {
			return {
				isSuccess: false,
				user: {},
				d_name: "",
				item_name: "",
				time_info: "",
				departColumns: [],
				itemColumns: [],
				ItemCode:[],
				timeColumns: [{
						values: [],
						className: 'column1',
					},
					{
						values: ["上午", "下午"],
						className: 'column2',
						defaultIndex: 0
					}
				],
				idCode:"",
				departShow: false,
				itemShow: false,
				timeShow: false,
				depart: {},
				appItem: {},
			}
		},
		methods: {
			submit(){
				let that = this;
				// let opendid = that.getStorageSync("opendid")
				//保存用户信息
				uni.request({
					url:that.$baseURL + 'user/save.do',
					method:"POST",
					header:{
						"Content-Type":"application/json"
					},
					data:that.user,
					success: (res) => {
						if(res.data.hasOwnProperty("userCode")){
							console.log(res.data)
						}else{
							console.log(res)
						}
					},
					fail: (res) => {
						console.log(res)
					}
				})
				//分装appointment数据
				//保存预约信息
				let appointment ={};
				appointment.itemCode = that.appItem[that.item_name.index][0]
				//预约时间处理
				let time_info = that.time_info.split(":");
				appointment.appTime = time_info[0];
				appointment.appTimeAm = time_info[1];
				appointment.userCode = that.user.userCode;
				console.log("预约---需要保存的数据:");
				console.log(appointment);
				
				//保存
				uni.request({
					url:that.$baseURL + "appointment/save.do",
					method:"POST",
					header:{"Content-Type":"application/json"},
					data:appointment,
					success: (res) => {
						if(res.data.hasOwnProperty("appCode")){
							Toast.success("提交成功");
							that.isSuccess =true;
							setTimeout(()=>{
								uni.redirectTo({
									url:'../home/home',
									success(res) {
										console.log(res)
									},
									fail(res) {
										uni.navigateBack({
											delta:1
										})
										console.log(res)
									}
								})
							},2000)
						}else{
							Toast.fail("提交失败!")
							that.isSuccess =true;
						}
					},
					fail: (res) => {
						console.log(res)
						Toast.fail("提交失败！")
						that.isSuccess =true;
						
					}
				})
			},
			departSelect(e) {
				let that = this;
				Toast.loading({
					message: '加载中...',
					forbidClick: true,
					loadingType: 'spinner',
				})
				that.isSuccess = true;
				this.d_name = e.detail
				this.departShow = !this.departShow
				
				uni.request({
					url: that.$baseURL + "item/find/" + that.depart[e.detail.index][0] + ".json",
					success: (res) => {
						console.log("获取服务器中的item")
						console.log(res)
						if (res.statusCode == 200) {
							let item = res.data;
							that.appItem = item;
							for (let i = 0; i < item.length; i++) {
								that.itemColumns[i] = item[i][1];
							}
						}
					},
					fail: (res) => {
						Dialog.alert({
							message:"拉取服务器数据失败"+res.errMsg
						})
					}
				})
				// var itemList = MyRequest.getServiceItem(this, this.depart, e)
			},
			timeSelect(e) {
				// console.log(e.detail);
				this.time_info = e.detail.value[0] + ":" + e.detail.value[1];
				this.timeShow = !this.timeShow;
			}
		},
		
		onShow() {
			let that = this;
			Toast.loading({
				message: '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			});
			let localUser = getApp().globalData.user;
			console.log(localUser)
			if(localUser.hasOwnProperty("userCode")){
				that.user = localUser
			}else{
				that.user.userCode = getApp().globalData.opendId
			}
			console.log(that.user)
			//请求部门数据
			uni.request({
				url: that.$baseURL + "/depart/findAll.json",
				success: (res) => {
					let depart = res.data;
					that.depart = depart;
					console.log(depart)
					for (let i = 0; i < depart.length; i++) {
						that.departColumns[i] = depart[i][1]
					}
				},
				fail: (res) => {
					Dialog.alert({
						message:"拉取服务器数据失败"+res.errMsg
					})
					console.log(res)
				}
			});
			//时间选择器数据处理
			this.timeColumns[0].values = yuyueTime();
			// console.log(this.timeColumns)
		}
	};

	const makeTime = function() {
		var date = new Date();
		var year = date.getFullYear();
		// console.log(full)
		let month = date.getMonth() + 1;
		var week = date.getDay();
		// console.log(week)
		//获取当月天数
		var dayCount = new Date(year, month, 0).getDate();
		// console.log(dayCount);
		let day = date.getDate();

		var weekArr = [{}];
		// 本周内今天的前几天的数量
		var leftNum = week - 1;
		// 本周内今天的后几天的数量
		var rightNum = dayCount - day;
		if (rightNum == 0) {
			rightNum = new Date(year, month + 1, 0).getDate();
		}
		// 本周内今天的后几天
		for (var i = 0; i < rightNum; i++) {
			// console.log(week)
			// console.log(week)
			var dateInfo = {
				week: "",
				day: ""
			};
			dateInfo.week = ((week + i) % 7) + 1;
			dateInfo.day = year + "-" + month + "-" + (day + i + 1);
			/* weekArr[i + 1].week = week + i + 1;
			weekArr[i + 1].day = year + "-" + month + "-" + (day + i + 1); */
			weekArr[i + 1] = dateInfo
		}
		// 今天
		weekArr[0].week = week;
		weekArr[0].day = year + "-" + month + "-" + day;
		// console.log(weekArr)
		return weekArr
	}
	
	
</script>
<style>
	.main_content {
		width: 100%;
		height: 100%;
		position: absolute;
		border: 2rpx solid #000000;
		background-color: #E8E8E8;

	}

	/* 顶部图标 */
	.top {
		/* border: 2rpx solid #07C160; */
	}

	.top image {
		width: 100%;
		height: 500rpx;
	}

	/* 个人信息输入框 */
	.intoUserInfo {
		width: 650rpx;
		height: 300rpx;
		position: absolute;
		top: 0;
		left: 0;
		/* 		display: flex;
		flex-direction: column; */
		text-align: content;
		margin: 170rpx 50rpx 0rpx 50rpx;
		background-color: #FFFFFF;
		align-items: center;
		box-sizing: border-box;
		/* border: 5rpx solid #007AFF; */

	}

	.van-cell {
		/* border: 3rpx solid #07C160; */
		text-align: center;
		margin-top: 49rpx;
	}

	.van-field__body {
		font-size: 30rpx;
	}

	.yuyue_content {
		margin-top: 100rpx;
		margin-left: 30rpx;
	}

	.yuyue_content text {
		color: #646566;
	}

	.depart,
	.item,
	.time {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 30rpx;
		font-size: 35rpx;
	}

	.input-class {
		background: rgba(255, 255, 255, 0);
	}

	.title {
		margin-left: 20rpx;
	}

	.selectButton {
		width: 350rpx;
		background: rgba(255, 255, 255, 0);
		box-shadow: none;
		text-align: center;
		font-size: 30rpx;
		/* border: 3rpx solid #07C160; */
	}

	.submit_button {
		width: 300rpx;
		margin-top: 300rpx;
	}
</style>
