const InfoBiz = require('../../../biz/meet_biz.js');
const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		_params: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) { 
		if (!AdminBiz.isAdmin(this)) return;

		if (!options || !options.id) {
			return;
		} 
		this.setData({
			id: options.id,
			_params: {
				meetId: options.id,
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
	onShow: async function () {},

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

	bindDelTap: async function (e) {

		let id = this.data.id;
		let jid = e.currentTarget.dataset.jid;
		let uid = e.currentTarget.dataset.uid;

		if (!id || !uid) return;

		let params = {
			id,
			uid
		}

		let that = this;
		let callback = async function () {
			try {
				let opts = {
					title: '删除中'
				}
				await ccminiCloudHelper.callCloudSumbit('admin/join_del', params, opts).then(res => {
					ccminiPageHelper.delListNode(jid, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					ccminiPageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		ccminiPageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},




})