const InfoBiz = require('../../../biz/meet_biz.js');
const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: { 
		modalName: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		
		//设置搜索菜单
		this.setData(this._getSearchMenu());
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

	bindShowDetailTap: async function (e) {
		this.setData({
			detail: ''
		});
		let id = e.currentTarget.dataset.id;
		if (!id) return;

		let params = {
			id
		}

		let info = await ccminiCloudHelper.callCloudData('admin/meet_detail', params);
		if (!info) {
			ccminiPageHelper.showNoneToast('记录不存在或者已删除')
			return;
		}

		this.setData({
			detail: info
		})
	}, 

	bindSortTap: async function (e) {
		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id || !sort) return;

		let params = {
			id,
			sort
		}

		let that = this;
		try {
			await ccminiCloudHelper.callCloudSumbit('admin/meet_sort', params).then(res => {
				ccminiPageHelper.modifyListNode(id, that.data.dataList.list, 'MEET_ORDER', sort);
				that.setData({
					dataList: that.data.dataList
				});
			});
		} catch (e) {
			console.log(e);
		}
	},

	bindDelTap: async function (e) {

		let id = e.currentTarget.dataset.id;
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
				await ccminiCloudHelper.callCloudSumbit('admin/meet_del', params, opts).then(res => {
					ccminiPageHelper.delListNode(id, that.data.dataList.list, '_id');
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

	bindHideDetailModalTap: function () {
		this.setData({
			detail: ''
		});
	},

	bindStatusTap: async function (e) {
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		if (!id || !status) return;
		status = Number(status);

		let params = {
			id,
			status
		}

		let that = this;
		try {
			await ccminiCloudHelper.callCloudSumbit('admin/meet_status', params).then(res => {
				ccminiPageHelper.modifyListNode(id, that.data.dataList.list, 'MEET_STATUS', status,'_id');
				that.setData({
					dataList: that.data.dataList
				});
				ccminiPageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: function () { 

		// 分类
		let sortItem2 = [{
			label: '分类',
			type: '',
			value: 0
		}];
		for (let k in InfoBiz.TYPE_OPTIONS){
			sortItem2.push(
				{
					label: InfoBiz.TYPE_OPTIONS[k],
					type: 'type',
					value: InfoBiz.TYPE_OPTIONS[k],
				}
			)
		}   

		let sortItems = [sortItem2];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			},
			{
				label: '最热',
				type: 'sort',
				value: 'view'
			},
			 
			{
				label: '正常',
				type: 'status',
				value: 1
			},
			{
				label: '停用',
				type: 'status',
				value: 8
			},
			{
				label: '全部',
				type: '',
				value: ''
			}
		]

		return {
			sortItems,
			sortMenus
		}

	}
 
})