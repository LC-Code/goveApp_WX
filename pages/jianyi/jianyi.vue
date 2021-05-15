<template>
	<view class="content">
		<view class="body">
			<view class="jianyi_content">
				<view class="depart">
					<van-icon name="points" />
					<view class="title">业务部门：</view>
					<text class="selectButton"
						@click="departShow=!departShow">{{d_name=="" ? '==请选择业务部门==' : d_name.value }}</text>
				</view>
				<view class="item">
					<van-icon name="points" />
					<view class="title">建议事项：</view>
					<text class="selectButton"
						@click="itemShow=!itemShow">{{item_name=="" ? '==请选择事项==' : item_name.value }}</text>
				</view>

			</view>
			<!-- 数据框 -->
			<view class="main">
				<view class="input_title">
					<text class="title_title">标题：</text>
					<van-field :value="title" placeholder="请输入标题" :border="false" required
						@input="function(e){title=e.detail}" />
				</view>
				<view class="input_context">
					<text class="title_title">内容：</text>
					<view class="textarea">
						<van-field type="textarea" :value="context" placeholder="请输入内容" :border="false" required
							:maxlength="500" show-word-limit :autosize="{ maxHeight: 100, minHeight: 50 }"
							@input="textInput" />
					</view>
				</view>
			</view>
			<button type="primary" class="button" @click="submit">提交</button>
		</view>

		<!-- 选择器 -->
		<view class="select">
			<van-popup :show="departShow" position="bottom" custom-style="height: 40%;"
				@click-overlay="departShow=!departShow">
				<van-picker :columns="departColumns" confirm-button-text="确定" cancel-button-text="取消" show-toolbar
					@cancel="departShow=!departShow" @confirm="departSelect" />
			</van-popup>
			<van-popup :show="itemShow" position="bottom" custom-style="height: 40%;"
				@click-overlay="itemShow=!itemShow">
				<van-picker :columns="itemColumns" bind:change="onChange" confirm-button-text="确定"
					cancel-button-text="取消" show-toolbar @cancel="itemShow=!itemShow"
					@confirm="function(e){this.item_name = e.detail;this.itemShow=!this.itemShow}" />
			</van-popup>
		</view>
		<!-- 轻提示 -->
		<view>
			<van-toast v-show="isSuccess" id="van-toast" />
			<van-dialog id="van-dialog" />
		</view>

	</view>
</template>

<script>
	import MyRequest from '../../utils/requestUtils.js';
	import Toast from 'wxcomponents/@vant/weapp/toast/toast';
	import Dialog from '../../wxcomponents/@vant/weapp/dialog/dialog';
	export default {
		data() {
			return {
				departShow: false,
				itemShow: false,
				departColumns: [],
				itemColumns: [],
				appItem: {},
				depart: {},
				isSuccess: false,
				title: "",
				context: "",
				d_name: "",
				item_name: ""
			}
		},
		methods: {
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
			},
			textInput(e) {
				this.context = e.detail;
				console.log(e.detail)
			},
			
			submit(){
				let that = this;
				//封装建议数据
				let suggest = {};
				suggest.itemCode = that.appItem[that.item_name.index][0];
				console.log(suggest.itemCode)
				suggest.itemName = that.item_name.value;
				suggest.title = that.title;
				suggest.context = that.context;
				suggest.partName = that.d_name.value;
				suggest.userCode = getApp().globalData.opendId;
				console.log(suggest)
				uni.request({
					url:that.$baseURL + "suggest/save.do",
					method:"POST",
					data:suggest,
					header:{
						"Content-Type": "application/json"
					},
					success: (res) => {
						if(res.data.hasOwnProperty("sugComCode")){
							Toast.success("提交成功");
							that.isSuccess =true;
							setTimeout(()=>{
								uni.redirectTo({
									url:'../home/home',
									success(res) {
										console.log(res)
									},
									fail(res) {
										console.log(res)
										uni.navigateBack({
											delta:1
										})
									}
								})
							},2000)
						}else{
							Toast.fail("提交失败!")
							that.isSuccess =true;
						}
					},
					fail:(res)=>{
						console.log(res)
						Toast.fail("提交失败！未登录")
						that.isSuccess =true;
					}
				})
			}
		},

		onShow() {
			let that = this;
			Toast.loading({
				message: '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			});
			that.user = getApp().globalData.user

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
		}
	}
</script>

<style scoped>
	.body {
		padding-top: 30rpx;
		margin: 300rpx 30rpx;
		/* box-shadow:0 0 10rpx #808080; */
		border-radius: 20%;
		text-align: center;
		background-color: #F8F8F8;
	}

	.jianyi_content {
		margin: 20rpx 40rpx;
		/* border: 3rpx solid #000000; */
	}

	.jianyi_content text {
		color: #646566;

	}

	.depart,
	.item {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 30rpx;
		font-size: 35rpx;
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

	.main {
		font-size: 35rpx;
		margin: 20rpx 40rpx;
		/* border: 3rpx solid #07C160; */
	}

	.input_title,
	.input_context {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		margin-top: 20rpx;
	}

	.title_title {}

	.textarea {
		width: 80%;
		/* border: 3rpx solid #323233; */
	}

	.button {
		margin: 40rpx 100rpx;
	}
</style>
<style>
	page {
		background-color: #FFFFFF;
	}
</style>
