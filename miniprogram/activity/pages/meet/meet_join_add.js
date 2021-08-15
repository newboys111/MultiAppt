const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiValidate = require('../../helper/ccmini_validate.js');
const MeetBiz = require('../../biz/meet_biz.js');
const CCMINI_SETTING = require('../../helper/ccmini_setting.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const ccminiBizHelper = require('../../helper/ccmini_biz_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);
		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!ccminiPageHelper.getId(this, options)) return;

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

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

	model: function (e) {
		ccminiPageHelper.model(this, e);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {

		let data = this.data;

		let rules = {
			name: 'formName|required|string|min:2|max:50|name=姓名',
			contact: 'formContact|required|string|min:6|max:50|name=联系电话',
		}

		// 数据校验 
		data = ccminiValidate.check(data, rules, this);
		if (!data) return;

		data.meetId = this.data.id;

		try {
			// 先创建，再上传 
			await ccminiCloudHelper.callCloudSumbit('meet/join_insert', data).then(res => {
				ccminiPageHelper.showSuccToast('报名成功', 2000);

				let parent = ccminiPageHelper.getPrevPage();
				parent.data.meet.isOwnerJoin = true;
				parent.data.meet.MEET_JOIN_CNT++;
				parent.setData({
					meet: parent.data.meet
				});

				ccminiPageHelper.goto('', 'back');
			});

		} catch (err) {
			console.log(err);
		}

	},


})