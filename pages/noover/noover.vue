<template>
	<view class="content">
		<!-- <list :dataList="consultInfoList" :haveData="haveData" :showLabel="true" /> -->

		<view :class="haveData ? noEntryClass:entryClass">
			<view v-if="consultInfoList.length>0">
				<van-collapse accordion :value="activeName" @change="onChange" is-link @open="open" @close="close">
					<van-collapse-item v-for="(item,index) in consultInfoList" :title="item.itemName" :label="item.createDate"
						:name="index" :key="index" is-link>
						<view class="item_class">
							<view class="item_content_class">
								<view>预约号：</view>
								<text>{{item.appCode}}</text>
							</view>
							<view class="item_content_class">
								<view>受理部门：</view>
								<text>{{item.partName}}</text>
							</view>
							<view class="item_content_class">
								<view>预约办事时间:</view>
								<text>{{item.appTime}}</text>
							</view>
							<view class="item_content_class">
								<view>受理情况:</view>
								<text>等待受理</text>
							</view>
						</view>
					</van-collapse-item>
				</van-collapse>
			</view>
			<view v-else>
				暂无数据
			</view>
		</view>
		<van-toast v-show="isSuccess" id="van-toast" />
	</view>
</template>

<script>
	import list from '../../components/listView.vue';
	import Toast from 'wxcomponents/@vant/weapp/toast/toast';
	export {
		setDateFormat
	}
	export default {
		components: {
			list
		},
		data() {
			return {
				isSuccess:true,
				activeName: 0,
				haveData: false,
				consultInfoList: [],
			}
		},
		methods: {
			onChange(e) {
				console.log(e.detail)
			},
			open(e) {
				console.log(e.detail)
				this.activeName = e.detail
			},
			close(e){
				this.activeName=[]
			}

		},
		onShow() {
			let that = this;
			that.isSuccess = true;
			let opendid = getApp().globalData.opendId
			console.log(opendid)
			uni.request({
				url: this.$baseURL + "appointment/find/" + opendid + "/" + 0 + ".json",
				success: (res) => {
					if (res.data.length > 0) {
						that.haveData = true;
						console.log(res)
						let tempList = res.data;
						let ListTemple = [];
						for (let i = 0; i < tempList.length; i++) {
							let item = {};
							item.createDate = setDateFormat(tempList[i][0]);
							item.itemName = tempList[i][1];
							item.appTime = setDateFormat(tempList[i][2]) + ":" + tempList[i][3];
							item.partName = tempList[i][6];
							item.appCode = tempList[i][7];
							ListTemple[i] = item;
						}
						that.consultInfoList = ListTemple;
					}
				},
				fail: (res) => {
					console.log(res)
				}
			});
		},
		onLoad() {
			let that = this;
			Toast.loading({
				message: '加载中...',
				forbidClick: true,
				loadingType: 'spinner',
			})
		}
	}

	const setDateFormat = function(date) {
		var d = new Date(date);
		let year = d.getFullYear();
		let month = d.getMonth() + 1;
		let day = d.getDate();
		let H = d.getHours() + 1;
		let m = d.getMinutes() + 1;
		let s = d.getSeconds() + 1;
		return year + "年" + month + "月" + day + '日 ' + H + ":" + m + ":" + s;
	}
</script>

<style>
	.noEntryClass {
		font-size: 30rpx;
		margin-top: 10rpx;
		box-shadow: 0rpx -1rpx 10rpx #a9a9a9;
	}

	.entryClass {
		text-align: center;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #a9a9a9;
	}
	.item_class {
		display: flex;
		flex-direction: column;
	}

	.item_content_class {
		display: flex;
		flex-direction: row;
		margin: 10rpx 10rpx;
	}
	.item_content_class text{
		margin-left: 20rpx;
	}
</style>
