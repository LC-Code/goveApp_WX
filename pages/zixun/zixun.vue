<template>
	<view class="content">
		<view class="body">
			<view class="jianyi_content">
				<view class="depart">
					<van-icon name="points" />
					<view class="title">咨询部门：</view>
					<text class="selectButton"
						@click="departShow=!departShow">{{d_name=="" ? '==请选择咨询部门==' : d_name.value }}</text>
				</view>
			</view>
			<!-- 数据框 -->
			<view class="main">
				<view class="input_title">
					<text class="title_title">咨询主题：</text>
					<van-field :value="title" placeholder="请输入标题" :border="false" required
						@input="function(e){title=e.detail}" />
				</view>
				<view class="input_context">
					<text class="title_title">咨询内容：</text>
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
	export{
		toHome
	}
	export default {
		data() {
			return {
				departShow: false,
				itemShow: false,
				departColumns: [],
				depart: {},
				isSuccess: false,
				title: "",
				context: "",
				d_name: ""
			}
		},
		methods: {
			departSelect(e) {
				/* let that = this; */
				this.d_name = e.detail
				this.departShow = !this.departShow
			},
			textInput(e) {
				this.context = e.detail;
				console.log(e.detail)
			},
			
			submit(){
				//分装咨询数据
				let consult = {};
				var that = this;
				consult.consultPart = this.d_name.value;
				consult.consultTheme = this.title;
				consult.consultContent = this.context;
				consult.userCode = getApp().globalData.opendId;
				uni.request({
					url:this.$baseURL + "consult/save.do",
					method:"POST",
					data:consult,
					header:{
						"Content-Type":"application/json"
					},
					success: (res) => {
						if(res.data.hasOwnProperty("consultCode")){
							Toast.success("提交成功");
							that.isSuccess =true;
							toHome()
						}else{
							Toast.success("提交失败");
							that.isSuccess =true;
						}
					},
					fail:(res)=>{
						console.log(res);
						Toast.success("提交失败");
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
			})
			that.isSuccess = true;
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
	
	const toHome = function(){
		setTimeout(()=>{
			uni.navigateBack({
				delta:1
			})
		},1000)
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
