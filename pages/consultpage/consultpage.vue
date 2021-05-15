<template>
	<view class="content">
		<!-- <list :dataList="consultInfoList" :haveData="haveData" :showLabel="true" /> -->

		<view :class="haveData ? noEntryClass:entryClass">
			<view v-if="consultInfoList.length>0">
				<van-cell-group>
					<van-cell size="large" v-for="(item,index) in consultInfoList" :key="index" :title="item.title"
						:label="item.data" :value="item.content" clickable>
					</van-cell>
				</van-cell-group>
			</view>
			<view v-else>
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import list from '../../components/listView.vue';
	export{
		setDateFormat,
		setContentToLow
	}
	export default {
		components: {
			list
		},
		data() {
			return {
				haveData: false,
				consultInfoList: [],
			}
		},
		methods: {

		},
		onShow() {
			let that = this;
			let opendid = getApp().globalData.opendId
			console.log(opendid)
			uni.request({
				url: this.$baseURL + "consult/find/simple/" + opendid + ".json",
				success: (res) => {
					if (res.data.length > 0) {
						console.log(res)
						let tempList = res.data;
						let ListTemple=[] ;
						for (let i = 0; i < tempList.length; i++) {
							let item = {};
							item.title = tempList[i][0];
							item.content = setContentToLow(tempList[i][1]);
							item.data = setDateFormat(tempList[i][2]);
							// console.log(item)
							ListTemple[i] = item;
						}
						that.consultInfoList = ListTemple;
					}
				},
				fail:(res)=>{
					console.log(res)
				}
			});
			that.haveData = true;
		},
		onLoad() {
		}
	}
	
	const setDateFormat = function(date){
		var d = new Date(date);
		let year = d.getFullYear();
		let month = d.getMonth()+1;
		let day = d.getDate();
		let H = d.getHours()+1;
		let m = d.getMinutes()+1;
		let s =d.getSeconds()+1;
		return year + "年" + month +"月" +day+'日 '+ H + ":" + m + ":" +s;
	}
	
	const setContentToLow = function(str){
		if(str.length>20){
			var sub = str.substring(0,20)
			return sub + "···";
		}else{
			return str
		}
		
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
</style>
