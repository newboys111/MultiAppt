/**
 * Notes: 活动模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2021-08-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../helper/ccmini_helper.js');
const CCMINI_SETTING = require('../helper/ccmini_setting.js');

class MeetBiz extends BaseCCMiniBiz {


	/**
	 * 表单初始化相关数据
	 */
	static initFormData(id = '') {

		return {
			id,

			// 分类
			typeOptions: MeetBiz.TYPE_OPTIONS,

			// 有效期 
			expireStart: ccminiHelper.time('Y-M-D'),

			// 图片数据
			imgMax: CCMINI_SETTING.MEET_MAX_PIC,
			imgList: [],


			// 表单数据 
			formPersonMax: 50,
			formFee: '',
			formDay: '请选择',
			formContact: '',

			formTypeIndex: 0,
			formTitle: '',
			formContent: '',
			formExpireTime: '请选择',
			formRegion: CCMINI_SETTING.MEET_DEFAULT_REGION
		}

	}

	/** 
	 * 图片上传
	 * @param {string} meetId 
	 * @param {Array} imgList  图片数组
	 */
	static async updateMeetPic(meetId, imgList) {

		imgList = await ccminiCloudHelper.transTempPics(imgList, CCMINI_SETTING.MEET_PIC_DIR, meetId);

		let params = {
			meetId: meetId,
			imgList: imgList
		}

		try {
			let res = await ccminiCloudHelper.callCloudSumbit('meet/update_pic', params);
			return res.data.urls;
		} catch (e) {}
	}

	/**
	 * 搜索菜单设置
	 */
	static getSearchMenu() {

		let sortItem1 = [{
			label: '综合排序',
			type: '',
			value: 0
		}];

		// 分类
		let sortItem2 = [{
			label: '所有分类',
			type: '',
			value: 0
		}];
		for (let k in MeetBiz.TYPE_OPTIONS) {
			sortItem2.push({
				label: MeetBiz.TYPE_OPTIONS[k],
				type: 'type',
				value: MeetBiz.TYPE_OPTIONS[k],
			})
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
}
/**
 * 分类
 */
MeetBiz.TYPE_OPTIONS = "文体娱乐,户外活动,闲聊小聚,创业碰撞,公益活动,旅游度假,其他".split(',');

//表单校验
MeetBiz.CHECK_FORM = {
	title: 'formTitle|required|string|min:5|max:50|name=活动标题',
	type: 'formType|required|string|min:2|max:10|name=活动分类',

	day: 'formDay|required|date|name=活动日期',
	fee: 'formFee|required|string|min:2|max:50|name=费用说明',
	contact: 'formContact|required|string|min:2|max:50|name=联系方式',
	expireTime: 'formExpireTime|required|date|name=报名截止期',
	personMax: 'formPersonMax|required|int|name=人数上限',
	region: 'formRegion|required|array|len:3|name=活动区域',

	content: 'formContent|required|string|min:10|max:50000|name=详细描述'
};

module.exports = MeetBiz;