const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiBizHelper = require('../../helper/ccmini_biz_helper.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isEdit: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		let meet = {};
		meet.MEET_JOIN_CNT = 0;
		this.setData({
			meet
		});

		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!ccminiPageHelper.getId(this, options)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			hint: false
		};
		let meet = await ccminiCloudHelper.callCloudData('meet/view', params, opt);
		if (!meet) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			meet,
			isEdit: (meet.MEET_USER_ID === PassportBiz.getUserId()),
		});


	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	url: function (e) {
		ccminiPageHelper.url(e, this);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		ccminiPageHelper.showTopBtn(e, this);

	},

	/**
	 * 编辑 
	 */
	myEditListener: function (e) {
		ccminiPageHelper.goto('meet_edit?id=' + this.data.id, 'redirect');
	},

	/**
	 * 删除 
	 */
	myDelListener: async function (e) {
		if (!await PassportBiz.loginMustRegWin(this)) return;

		let id = this.data.id;
		let callback = async function () {
			await ccminiCloudHelper.callCloudSumbit('meet/del', {
				id
			}).then(res => {
				ccminiPageHelper.delPrevPageListNode(id);
				ccminiPageHelper.showSuccToast('删除成功', 1500, function () {
					ccminiPageHelper.goto('/pages/meet/meet_index');
				})
			}).catch(err => {});
		}

		ccminiPageHelper.showConfirm('您确认删除？删除后不可恢复', callback);
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: this.data.meet.MEET_TITLE,
			path: '/pages/meet/meet_detail?id=' + this.data.id,
		}
	},

	bindCancelJoinTap: async function (e) {
		try {
			let params = {
				meetId: this.data.id
			}
			await ccminiCloudHelper.callCloudSumbit('meet/join_cancel', params).then(res => {
				let meet = this.data.meet;
				meet.isOwnerJoin = false;
				meet.MEET_JOIN_CNT--;
				this.setData({
					meet
				});
				ccminiPageHelper.showSuccToast('取消成功', 2000);
			});

		} catch (err) {
			console.log(err);
		}
	}

})