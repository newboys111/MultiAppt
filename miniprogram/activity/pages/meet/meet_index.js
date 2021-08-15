const MeetBiz = require('../../biz/meet_biz.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const ccminiCacheHelper = require('../../helper/ccmini_cache_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		//设置搜索菜单
		this.setData(MeetBiz.getSearchMenu());
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		PassportBiz.loginSilence(this);
		this.setData({
			isLogin: true
		});

		let type = ccminiCacheHelper.get('MEET_TYPE');
		let oldTitle = this.data.title;
		if (type) {
			type = MeetBiz.TYPE_OPTIONS[type];
			console.log(type)
			this.setData({
				title: type,
				_params: {
					type
				}
			});
		} else {
			this.setData({
				title: '',
				_params: {
					type
				}
			});
		}
 
		if (oldTitle != this.data.title) {
			this.setData({
				isLogin: false
			});
			this.setData({
				isLogin: true
			});
		}


	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	url: async function (e) {
		ccminiPageHelper.url(e);
	},

	myCommListListener: function (e) {
		ccminiPageHelper.commListListener(this, e);
	},

})