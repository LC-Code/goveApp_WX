<template>
	<view class="content">
		<view class="main">
			<van-image
			  round
			  width="160rpx"
			  height="160rpx"
			  src="/static/Logo.jpg"
			/>
			<view class="message">
				<view class="titel">2021 计算机 毕业设计</view>
				<view class="name">政务预约</view>
			</view>
			<van-loading v-show="isShow" color="#1989fa" type="spinner" size="50px"/>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow:true
			}
		},
		onShow(){
			var time = setTimeout(()=>{
				this.isShow=!this.isShow;
				uni.switchTab({
					url:"/pages/home/home",
					success(res) {
						console.log(res)
					},
					fail: (res) => {
						console.log(res)
					}
				})
			},4000)
			
		},
		onLoad() {
			
		},
		methods: {

		}
	}
</script>

<style scoped>
	/* .content{
		width: 750rpx;
		height: 100%;
		
	} */
	.main{
		width: 100%;
		height: 100%;
		display: flex;
		text-align: center;
		padding:400rpx 0rpx ;
		flex-direction: column;
		background-color: #f10715;
		border: 7.3rpx solid #f10715;
	}
	.message{
		display: flex;
		margin-top: 20rpx;
		flex-direction: column;
		/* border: 4rpx solid #baa153; */
		font-size: 50rpx;	
	}
</style>
<style>
	page{
		height: 100%;
		background-color:#f10715 ;
	}
</style>
