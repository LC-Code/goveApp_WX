<template>
	<view class="content">
		<list :dataList="dataFromService" :haveData="haveData" :showLabel="true" />
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
				dataFromService: []
			}
		},
		onShow() {
			let that = this;
			let opendid = getApp().globalData.opendId
			console.log(opendid)
			uni.request({
				url: this.$baseURL + "suggest/find/simple/" + opendid + ".json",
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
						that.dataFromService = ListTemple;
					}
				},
				fail:(res)=>{
					console.log(res)
				}
			});
			that.haveData = true;
			
		},
		onLoad() {
			
			/* uni.request({
				url: "http://123.57.176.18:8080/json_image/json/consult.json",
				method: "GET",
				success: (res) => {
					if (res.statusCode == 200 || res.statusCode == "200") {
						console.log(res)
						this.dataFromService = res.data;
						if (this.dataFromService.length > 0) {
							this.haveData = !this.haveData;
						}
					} else {}
				}
			})
			console.log(this.dataFromService) */
		},
		methods: {

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

</style>
