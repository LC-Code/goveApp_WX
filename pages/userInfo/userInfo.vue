<template>
	<view class="content">
		<view class="form-fileds">
			<van-cell-group>
				<van-field label="姓名" :value="user.userNname" input-align="right" placeholder="请输入姓名"
					:border="is_border" @input="function(e){user.userNname=e.detail}" required />
				<van-field label="性别" v-model="user.userSex" placeholder="请选择性别>" readonly input-align="right"
					:border="is_border" @click-input="sexShow=!sexShow" required />
				<van-field label="证件号" :value="user.idCode" input-align="right" placeholder="请输入姓名" :border="is_border"
					@input="function(e){user.idCode=e.detail}" required />
				<van-field label="学历" v-model="user.userEduction" placeholder="请选择学历>" readonly input-align="right"
					:border="is_border" @click-input="eduShow=!eduShow" required />
				<van-field label="出生日期" :value="user.userBirthday" :placeholder="timeError?'请输入日期':'请选择日期>'"
					:readonly="timeError ? false:true" input-align="right" :border="is_border"
					@click-input="timeError ? datShow=false : datShow=!datShow" @input="input" required />
				<van-field label="职业" :value="user.profession" placeholder="请输入您的职业" input-align="right"
					:border="is_border" @input="function(e){user.profession= e.detail }" required />
				<van-field label="行业" :value="user.industry" placeholder="请输入您的行业" input-align="right"
					:border="is_border" @input="function(e){user.industry= e.detail }" required />
				<van-field label="联系电话" :value="user.telNumber" input-align="right" placeholder="请输入联系电话"
					:border="is_border" @input="function(e){user.telNumber= e.detail }" required type="number" />
			</van-cell-group>
			<view class="form-button">
				<button type="primary" @click="submit">提交</button>
				<!-- <icon class="icon-class" :type="isSuccess ? 'success_no_circle': ''" size="80"></icon> -->
				<van-toast v-show="isSuccess" id="van-toast" />
			</view>
		</view>
		<!--  -->
		<view class="vanActionSheet">
			<van-action-sheet title="性 别" :show="sexShow" :actions="actions" @select="sexSelect"
				@click-overlay="sexShow=!sexShow" @cancel="sexShow=!sexShow" cancel-text="取消">
			</van-action-sheet>
			<van-action-sheet title="学 历" :show="eduShow" :actions="eduActions" @select="eduSelect"
				@click-overlay="eduShow=!eduShow" @cancel="eduShow=!eduShow" cancel-text="取消" />
			<van-action-sheet title="出生日期" :show="datShow" @click-overlay="datShow=!datShow" @cancel="datShow=!datShow">
				<van-datetime-picker type="date" :value="user.birthday == ''? currentDate:user.birthday"
					:min-date="miniDate" :max-date="currentDate" :formatter="formatter" @confirm="confirm"
					@change="confirm" @input="confirm" @cancel="datShow=!datShow" />
			</van-action-sheet>
			<van-dialog id="van-dialog" />
		</view>
	</view>
</template>
<script>
	//时间变量个格式化

	import Dialog from 'wxcomponents/@vant/weapp/dialog/dialog';
	import Toast from 'wxcomponents/@vant/weapp/toast/toast';
	import MyRequest from '../../utils/requestUtils.js';
	//数据判空

	const infoHaveEntry = function(info) {
		const TAG = "不能为空";
		var message = null;
		if (info.userNname == "" || info.userNname == null) {
			return message = "姓名" + TAG;

		}
		if (info.userSex == "" || info.userSex == null) {
			return message = "性别" + TAG;
		}
		if (info.userEduction == "" || info.userEduction == null) {
			return message = "学历" + TAG;
		}
		if (info.userBirthday == "" || info.userBirthday == null) {
			return message = "出生日期" + TAG;
		}
		if (info.industry == "" || info.industry == null) {
			return message = "行业" + TAG;
		}
		if (info.profession == "" || info.profession == null) {
			return message = "职业" + TAG;
		}
		if (info.telNumber == "" || info.telNumber == null) {
			return message = "联系方式" + TAG;
		}
		if (info.idCode == '' || info.idCode == null) {
			return message = "证件号" + TAG;
		}
		return message;
	}

	const farmatDate = function(dateToFarmat) {
		Date.prototype.format = function(fmt) {
			var o = {
				"M+": this.getMonth() + 1, //月份
				"d+": this.getDate(), //日
				"h+": this.getHours(), //小时
				"m+": this.getMinutes(), //分
				"s+": this.getSeconds(), //秒
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度
				"S": this.getMilliseconds() //毫秒
			};

			//  获取年份 
			// ①
			if (/(y+)/i.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}

			for (var k in o) {
				// ②
				if (new RegExp("(" + k + ")", "i").test(fmt)) {
					fmt = fmt.replace(
						RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
							.length)));
				}
			}
			return fmt;
		}
		var dateFormat = new Date(dateToFarmat).format("yyyy-MM-dd");
		return dateFormat;
	}

	//声明自定义的函数
	export {
		farmatDate,
		infoHaveEntry
	}
	export default {
		data() {
			return {
				isSuccess: false,
				user: {
					userCode: "",
					userNname: "",
					sex: "",
					idCode: "",
					userEduction: "",
					userBirthday: "",
					profession: "",
					industry: "",
					telNumber: ""
				},
				app: function() {
					return getApp().globalData
				},
				timeError: false,
				//timeIsNan: " ",
				username: "",
				miniDate: 1,
				currentDate: 1,
				sexShow: false,
				eduShow: false,
				datShow: false,

				eduActions: [{
						name: "博士"
					},
					{
						name: "硕士"
					},
					{
						name: "本科"
					},
					{
						name: "大专"
					},
					{
						name: "高中"
					},
					{
						name: "初中"
					},
					{
						name: "中专"
					},
					{
						name: "小学"
					},
					{
						name: "其他"
					}
				],
				actions: [{
						name: "男"
					},
					{
						name: "女"
					}
				],

				is_border: true
			}
		},
		onShow() {
			var that = this;
			//获取本地缓存User 如果失败获取本地缓存的opendid之后获取服务器数据
			this.user = getApp().globalData.user;
		},
		onReady() {},
		onLoad() {
			this.currentDate = new Date().getTime();
			this.miniDate = new Date(1990, 1, 1).getTime();
			console.log(this.currentDate)
			console.log(this.miniDate)
			uni.$on("update", (res) => {
				console.log(res)
				// console.log(data.signature)
			})
		},
		methods: {
			sexSelect(e) {
				console.log(e.detail)
				this.user.userSex = e.detail.name
				this.sexShow = !this.sexShow
			},
			eduSelect(e) {
				console.log(e.detail)
				this.user.userEduction = e.detail.name
				this.eduShow = !this.eduShow
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				}
				if (type === 'month') {
					return `${value}月`;
				}
				if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},
			confirm(e) {
				console.log(e)

				var type = e.type
				if (type === 'confirm') {
					//console.log(e.detail + "  " + isNaN(e.detail))

					if (!isNaN(e.detail)) {
						this.user.userBirthday = farmatDate(e.detail);
						this.datShow = !this.datShow;
					} else {
						this.datShow = !this.datShow;
						Dialog.alert({
							message: '时间选择器出错，请以yyyy-MM-dd的格式手动输入',
						}).then(() => {
							this.timeError = true
						})

					}
				}
			},
			input(e) {
				//console.log("inout log : ")
				console.log(e)
				if (this.timeError) {
					this.user.userBirthday = e.detail;
				}
			},
			submit() {
				//数据校验
				let opendid = getApp().globalData.opendId
				var haveMeg = infoHaveEntry(this.user);
				if (haveMeg == null) {
					this.user.userCode = opendid
					console.log(this.user.userCode)
					getApp().globalData.user = this.user;
					uni.request({
						url: this.$baseURL + 'user/save.do',
						method: "POST",
						data: this.user,
						header: {
							"Content-Type": "application/json"
						},
						success: (res) => {
							console.log(res)
							if (res.data.hasOwnProperty("userCode")) {
								console.log("用户中心---保存User成功")
								Toast.success('提交成功');
								this.isSuccess = true;
								setTimeout(()=>{
									uni.redirectTo({
										url:'../userpage/userpage',
										success: (res) => {
											console.log(res)
										},
										fail: (res) => {
											console.log(res)
										}
									})
								},2000)
							} else {
								console.log("用户中心---保存User失败")
								Toast.fail("提交失败")
								this.isSuccess = true;
							}
						},
						fail: (res) => {
							console.log(res)
						}
					})
				} else {
					Dialog.alert({
						message: haveMeg,
					}).then(() => {})
				}
			}
		}
	}
</script>

<style>
	.placeholder_style {
		justify-content: flex-end
	}

	.form-fileds {
		margin-top: 20rpx;
		margin: 40rpx;
		font-size: 40rpx;
	}

	.form-button {
		margin-top: 50rpx;
		margin-right: 230rpx;
		margin-left: 230rpx;
		flex-direction: column;
	}

	.icon-class {
		margin-top: 30rpx;
		box-shadow: 0 0 100rpx #4CD964;
		margin-left: 24rpx;
		border-radius: 100%;
		margin-top: 150rpx;
	}
</style>
