const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiValidate = require('../../helper/ccmini_validate.js');
const MeetBiz = require('../../biz/meet_biz.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const ccminiBizHelper = require('../../helper/ccmini_biz_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!ccminiPageHelper.getId(this, options)) return;

		this._loadDetail(this.data.id);
	},

	_loadDetail: async function (id) {
		if (!id) return;
		if (!this.data.isLoad) this.setData(MeetBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			hint: false
		};
		let meet = await ccminiCloudHelper.callCloudData('meet/my_detail', params, opt);
		if (!meet) {
			this.setData({
				isLoad: null
			})
			return;
		}

		let formTypeIndex = MeetBiz.TYPE_OPTIONS.indexOf(meet.MEET_TYPE);
		formTypeIndex = (formTypeIndex < 0) ? 0 : formTypeIndex;

		this.setData({
			isLoad: true,
			isEdit: PassportBiz.getUserId() == meet.MEET_USER_ID,

			imgList: meet.MEET_PIC,

			// 表单数据 
			formType: meet.MEET_TYPE,
			formTypeIndex,

			formTitle: meet.MEET_TITLE,
			formContent: meet.MEET_CONTENT,
			formExpireTime: meet.MEET_EXPIRE_TIME,

			formDay: meet.MEET_DAY,
			formFee: meet.MEET_FEE,
			formContact: meet.MEET_CONTACT,
			formPersonMax: meet.MEET_PERSON_MAX,

			formRegion: [meet.MEET_REGION_PROVINCE, meet.MEET_REGION_CITY, meet.MEET_REGION_COUNTY],

			formStatus: meet.MEET_STATUS
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

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail(this.data.id);
		wx.stopPullDownRefresh();
	},

	model: function (e) {
		ccminiPageHelper.model(this, e);
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {

		let data = this.data;
		data.formType = MeetBiz.TYPE_OPTIONS[data.formTypeIndex];


		// 数据清洗与校验  
		let rules = JSON.parse(JSON.stringify(MeetBiz.CHECK_FORM));
		Object.assign(rules, {
			status: 'formStatus|required|int|in:1,7|name=状态'
		});

		data = ccminiValidate.check(data, rules, this);
		if (!data) return;

		if (data.expireTime > data.day)
			return ccminiPageHelper.showModal('报名截止日期不能大于活动日期');

		data.desc = ccminiHelper.fmtText(data.content, 100);

		try {
			let meetId = this.data.id;
			data.id = meetId;

			// 先修改，再上传 
			await ccminiCloudHelper.callCloudSumbit('meet/edit', data);

			// 图片 提交处理
			wx.showLoading({
				title: '提交中...',
				mask: true
			});

			let imgList = this.data.imgList;
			await MeetBiz.updateMeetPic(meetId, imgList);

			let callback = function () {

				// 更新列表页面数据
				ccminiPageHelper.modifyPrevPageListNode(meetId, 'MEET_TITLE', data.title);
				ccminiPageHelper.modifyPrevPageListNode(meetId, 'MEET_DESC', data.desc);
				if (imgList)
					ccminiPageHelper.modifyPrevPageListNode(meetId, 'MEET_PIC', imgList[0]);
 
				ccminiPageHelper.goto("meet_detail?id=" + meetId , 'redirect');
			}
			ccminiPageHelper.showSuccToast('编辑成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},

	bindMyImgUploadListener: function (e) {
		this.setData({
			imgList: e.detail
		});
	},

	bindStatusChange: function (e) {
		let formStatus = (e.detail.value) ? 7 : 1;
		this.setData({
			formStatus
		});
	}

})