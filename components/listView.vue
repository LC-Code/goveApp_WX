<template>
	<view class="content">
		<view :class="haveData ? noEntryClass:entryClass">

			<view v-if="dataList.length>0">
				<van-cell-group>
					<van-cell size="large" v-for="(item,index) in dataList" :key="index" :title="item.title"
						:label="item.data" :value="showLabel? item.content:''" clickable>
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
	export default {
		name: "list",
		props: {

			dataList: {
				type: Array,
				default: [{
					title: "nihao",
					content: "kkkkkk",
					data: "2002-55-5"
				}]
			},
			haveData: {
				type: Boolean,
				default: false
			},
			showLabel:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				entryClass: "entryClass",
				noEntryClass: "noEntryClass"
			};
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
