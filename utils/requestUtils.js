import Dialog from '../wxcomponents/@vant/weapp/dialog/dialog.js';
export default {
	getRequest(uri) {
		uni.request({
			url: uri,
			method: "GET",
			success(res) {
				if (res.statusCode != 200 || res.statusCode != "200") {
					console.log(res.data)
					return res.data
				} else {
					return res.errMsg;
				}
			}
		})
	},
	//获取本地用户信息缓存
	getLocalUser(context, opendid) {
		uni.request({
			url: context.$baseURL + "find/user/" + opendid + ".do",
			success: (res) => {
				console.log(res)
				if (res.statusCode == 200) {
					let user = res.data
					if (user != null || user != '') {
						uni.setStorage({
							key: "user",
							data: user,
							success: () => {
								console.log("本地缓存User成功")
							},
							fail() {
								console.log("本地缓存User失败")
							}
						})
						context.user = user
					}
				} else {
					console.log("服务器错误")
				}

			},
			//网络请求错误
			fail: (res) => {
				console.log(res)
			}
		})
	},
	//获取服务端depart
	getServiceDepart(that) {
		var response = {};
		uni.request({
			url: that.$baseURL + "/depart/findAll.json",
			success: (res) => {
				let depart = res.data;
				response.depart = depart;
				console.log(depart)
				let departArray = [];
				for (let i = 0; i < depart.length; i++) {
					departArray[i] = depart[i].name
				}
				response.departArray = departArray;
				console.log(response.departArray)
			},
			fail: (res) => {
				console.log(res)
			}
		});
		//返回部门名称集合
		return response;
	},
	/* context 全局变量 
	 depart 部门变量
	e 时间*/
	getServiceItem(context, depart, e) {
		let itemList = [];
		uni.request({
			url: context.$baseURL + "item/getAll/" + depart[e.detail.index].code + ".json",
			success: (res) => {
				console.log("获取服务器中的item")
				console.log(res)
				if (res.statusCode == 200) {
					let item = res.data;
					let itemName = [];
					let itemCode = [];
					for (let i = 0; i < item.length; i++) {
						itemName[i] = (item[i])[1];
						itemCode[i] = (item[i])[0];
					}
					itemList[0] = itemName;
					itemList[1] = itemCode;
				}
			}
		})
		//返回预约事项集合
		return itemList;
	},
	//数据提交
	postRequest(context, URL, data) {
		let response = {};
		uni.request({
			url: context.$baseURL + URL,
			method: "POST",
			data: data,
			header: {
				"Content-Type": "application/json"
			},
			success: (res) => {
				console.log(res);
				response.data = res.data;
			},
			fail: (res) => {
				response.msg = res.errmsg;
			}
		})
		return response;
	},
	//获取本地缓存
	getLocalStorage(pageName, keyParam) {
		let result = null;
		uni.getStorageSync({
			key: keyParam,
			success: (res) => {
				if (res.data.hasOwnProperty("code")) {
					console.log(pageName + "---获取本地 " + keyParam + " 缓存成功");
					result = res.data;
				}
			},
			fail: (res) => {
				console.log(pageName + "---获取本地 " + keyParam + " 缓存失败，，没有该缓存")
				console.log(res)
			}
		});
		return result;
	},
	//添加缓存
	setLocalStorage(pageName, keyParam, value) {
		console.log("将要缓存的数据" + value)
		uni.setStorage({
			key: keyParam,
			data: value,
			success: () => {
				console.log(pageName + "---添加本地 " + keyParam + "缓存成功 ");
			},
			fail: (res) => {
				console.log(pageName + "---添加本地 " + keyParam + "缓存失败 ");
				console.log(res)
			}
		})
	},
	//获取服务器User
	getServiceUser(pageName, baseUrl, opendid) {
		var that = this;
		uni.request({
			url: baseUrl + "/user/find/" + opendid + ".json",
			success: (res) => {
				if (res.data.hasOwnProperty("userCode")) {
					console.log(pageName + "---获取服务器端User数据成功")
					getApp().globalData.user = res.data;
					console.log(res.data)
					// that.setLocalStorage(pageName, "user", res.data)
					try {
						uni.setStorageSync("user", res.data);
						console.log(pageName + "---添加本地 user 缓存成功 ");
					} catch (e) {
						//TODO handle the exception
						console.log(pageName + "---添加本地 user 缓存失败 ");
					}
				} else {
					//服务其中没有该用户的注册 先注册保存opendid
					let user = res.data;
					user.userCode = opendid
					uni.request({
						url:baseUrl+"user/save.do",
						method:"POST",
						header:{
							"Content-Type":"application/json"
						},
						data:user,
						success: (res) => {
							console.log(res)
						},
						fail: (res) => {
							console.log(res)
						}
					})
					console.log(pageName + "---服务端User数据获取失败,错误信息如下");
					console.log(res.data);
				}
			},
			fail: (res) => {
				Dialog.alert({
					message:"拉取服务器数据失败"+res.errMsg
				})
				console.log("服务器失败错误，错误信息如下");
				console.log(res)
			}
		});
	},
	//获取Opendid
	getServiceOpendId(content,pageName,baseUrl, code) {
		var that = this;
		uni.request({
			url: baseUrl + 'login/' + code + '.json',
			success: (res) => {
				if (res.data.hasOwnProperty("opendid")) {
					if (res.data.opendid != null) {
						getApp().globalData.opendId = res.data.opendid;
						that.getServiceUser(pageName,baseUrl,res.data.opendid)
						console.log("service成功获取service opendid: " + res.data.opendid);
						// that.setLocalStorage("", "opendid", res.data.opendid);
						try{
							uni.setStorageSync("opendid",res.data.opendid);
							
							console.log(pageName + "---添加本地 opendid 缓存成功 ");
						}catch(e){
							//TODO handle the exception
							console.log(pageName + "---添加本地 opendid 缓存失败 ");
						}
					} else {
						console.log("service opendid 获取失败");
					}
				} else {
					console.log("service opendid 获取失败,");
				}
				console.log(res);
			},
			fail: (res) => {
				console.log("service opendid 获取失败,错误信息如下");
				console.log(res);
			}
		})
	}
}
