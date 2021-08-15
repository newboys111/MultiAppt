const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const ccminiValidate = require('../../helper/ccmini_validate.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		_params: {},
		isEdit:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);
		if (!ccminiPageHelper.getId(this, options)) return;
		if (!ccminiPageHelper.getId(this, options, 'ownerId')) return;

		this.setData({
			_params: {
				meetId: this.data.id
			} 
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		if (!await PassportBiz.loginMustRegWin(this)) return;

		this.setData({
			isEdit: this.data.ownerId == PassportBiz.getUserId()
		});

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

	myCommListListener: function (e) {
		ccminiPageHelper.commListListener(this, e)
	},

	url:function(e){
		ccminiPageHelper.url(e);
	}

})