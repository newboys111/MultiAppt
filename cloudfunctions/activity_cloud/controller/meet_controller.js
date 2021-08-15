// +----------------------------------------------------------------------
// | CCMiniCloud [ Cloud Framework ]
// +----------------------------------------------------------------------
// | Copyright (c) 2021 www.code942.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 明章科技
// +----------------------------------------------------------------------

/**
 * Notes: 活动模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseCCMiniController = require('./base_ccmini_controller.js');
const MeetModel = require('../model/meet_model.js');
const MeetService = require('../service/meet_service.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');
const ccminiContentCheck = require('../framework/validate/ccmini_content_check.js');

class MeetController extends BaseCCMiniController {

	async getJoinList() {

		// 数据校验
		let rules = {
			meetId: 'required|id',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = await service.getJoinList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {

			list[k].JOIN_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].JOIN_ADD_TIME, 'Y-M-D');

		}
		result.list = list;

		return result;

	}

	async getMeetList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			type: 'string|name=分类条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = await service.getMeetList(input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {



			// 状态标识
			if (list[k].MEET_STATUS == MeetModel.STATUS.COMM &&
				list[k].MEET_EXPIRE_TIME >= ccminiTimeUtil.time())
				list[k].status = 1; // 报名中
			else if (list[k].MEET_STATUS == MeetModel.STATUS.COMM &&
				list[k].MEET_DAY >= ccminiTimeUtil.time())
				list[k].status = 2; // 进行中
			else if (list[k].MEET_STATUS == MeetModel.STATUS.OVER)
				list[k].status = 7; // 已总结

			list[k].MEET_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].MEET_ADD_TIME, 'Y-M-D');

			let expireTime = ccminiTimeUtil.timestamp2Time(list[k].MEET_EXPIRE_TIME, 'Y-M-D');
			list[k].MEET_EXPIRE_TIME = expireTime + ' ' + ccminiTimeUtil.week(expireTime);

			let day = ccminiTimeUtil.timestamp2Time(list[k].MEET_DAY, 'Y-M-D');
			list[k].MEET_DAY = day + ' ' + ccminiTimeUtil.week(day);

			// 默认图片
			if (list[k].MEET_PIC && list[k].MEET_PIC.length > 0)
				list[k].MEET_PIC = list[k].MEET_PIC[0]['url'];
			else
				list[k].MEET_PIC = '';

			// 地区
			let area = '';
			if (list[k].MEET_REGION_CITY != '全部') {
				area = list[k].MEET_REGION_CITY;
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			} else {
				area = list[k].MEET_REGION_PROVINCE;
				area += (list[k].MEET_REGION_CITY != '全部') ? ' ' + list[k].MEET_REGION_CITY : '';
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			}
			list[k].MEET_REGION = area;

		}
		result.list = list;

		return result;

	}

	async getMyMeetList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = await service.getMyMeetList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].MEET_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].MEET_ADD_TIME);
			list[k].MEET_EXPIRE_TIME = ccminiTimeUtil.timestamp2Time(list[k].MEET_EXPIRE_TIME);
			list[k].MEET_DAY = ccminiTimeUtil.timestamp2Time(list[k].MEET_DAY, 'Y-M-D');

			// 地区
			let area = '';
			if (list[k].MEET_REGION_CITY != '全部') {
				area = list[k].MEET_REGION_CITY;
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			} else {
				area = list[k].MEET_REGION_PROVINCE;
				area += (list[k].MEET_REGION_CITY != '全部') ? ' ' + list[k].MEET_REGION_CITY : '';
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			}
			list[k].MEET_REGION = area;

		}
		result.list = list;

		return result;
	}

	async insertMeet() {
		// 数据校验
		let rules = {
			title: 'required|string|min:5|max:50|name=活动标题',
			type: 'required|string|min:2|max:10|name=活动分类',
			expireTime: 'required|date|name=报名截止期',
			region: 'required|array|len:3|name=活动区域',

			personMax: 'required|int|name=人数上限',
			day: 'required|date|name=活动日期',
			fee: 'required|string|min:2|max:50|name=费用说明',
			contact: 'required|string|min:2|max:50|name=联系方式',

			content: 'required|string|min:10|max:50000|name=详细介绍'

		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		await ccminiContentCheck.checkTextMultiClient(input);

		let service = new MeetService();
		let result = await service.insertMeet(this._userId, input);



		return result;

	}

	async getMyMeetJoinList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = await service.getMyMeetJoinList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].JOIN_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].JOIN_ADD_TIME);
			list[k].MEET_DETAIL.MEET_DAY = ccminiTimeUtil.timestamp2Time(list[k].MEET_DETAIL.MEET_DAY, 'Y-M-D');
		}
		result.list = list;

		return result;
	}

	async getMyMeetDetail() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		return await service.getMyMeetDetail(this._userId, input.id);

	}

	async editMeet() {
		// 数据校验
		let rules = {
			id: 'required|id',
			title: 'required|string|min:5|max:50|name=活动标题',
			type: 'required|string|min:2|max:10|name=活动分类',
			status: 'required|int|in:1,7|name=状态',
			expireTime: 'required|date|name=报名截止期',
			region: 'required|array|len:3|name=活动区域',

			personMax: 'required|int|name=人数上限',
			day: 'required|date|name=活动日期',
			fee: 'required|string|min:2|max:50|name=费用说明',
			contact: 'required|string|min:2|max:50|name=联系方式',

			content: 'required|string|min:10|max:50000|name=详细介绍',

			desc: 'required|string|min:10|max:200|name=简介',

		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		await ccminiContentCheck.checkTextMultiClient(input);

		let service = new MeetService();
		let result = await service.editMeet(this._userId, input);



		return result;
	}

	async delMeet() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = service.delMeet(this._userId, input.id);



		return result;
	}

	async viewMeet() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let meet = await service.viewMeet(this._userId, input.id);

		if (meet) {
			// 显示转换 
			meet.MEET_ADD_TIME = ccminiTimeUtil.timestamp2Time(meet.MEET_ADD_TIME, 'Y-M-D');

			let expireTime = ccminiTimeUtil.timestamp2Time(meet.MEET_EXPIRE_TIME, 'Y-M-D');
			meet.MEET_EXPIRE_TIME = expireTime + ' ' + ccminiTimeUtil.week(expireTime);

			let day = ccminiTimeUtil.timestamp2Time(meet.MEET_DAY, 'Y-M-D');
			meet.MEET_DAY = day + ' ' + ccminiTimeUtil.week(day);

			let area = meet.MEET_REGION_PROVINCE;
			area += (meet.MEET_REGION_CITY != '全部') ? ' ' + meet.MEET_REGION_CITY : '';
			area += (meet.MEET_REGION_COUNTY != '全部') ? ' ' + meet.MEET_REGION_COUNTY : '';
			meet.MEET_REGION = area;
		}

		return meet;
	}

	async updateMeetPic() {
		// 数据校验
		let rules = {
			meetId: 'required|id',
			imgList: 'array'
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		return await service.updateMeetPic(input);
	}

	async cancelJoin() {
		// 数据校验
		let rules = {
			meetId: 'required|id',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = service.cancelJoin(this._userId, input.meetId);



		return result;
	}

	/**
	 * 报名
	 */
	async insertJoin() {
		// 数据校验
		let rules = {
			meetId: 'required|id',
			name: 'required|string|min:2|max:50|name=姓名',
			contact: 'required|string|min:6|max:50|name=联系电话',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		await ccminiContentCheck.checkTextMultiClient(input);


		let service = new MeetService();
		let result = service.insertJoin(this._userId, input);



		return result;
	}

}

module.exports = MeetController;