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
 * Notes: 聚会模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-23 07:48:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js');
const ccminiDbUtil = require('../framework/database/ccmini_db_util.js');
const ccminiUtil = require('../framework/utils/ccmini_util.js');
const ccminiStrUtil = require('../framework/utils/ccmini_str_util.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');
const ccminiCloudUtil = require('../framework/cloud/ccmini_cloud_util.js');
const ccminiConfig = require('../comm/ccmini_config.js');
const MeetModel = require('../model/meet_model.js');
const UserModel = require('../model/user_model.js');
const JoinModel = require('../model/join_model.js');

class MeetService extends BaseCCMiniService {

	async updateMeetPic({
		meetId,
		imgList
	}) {

		let newList = await ccminiCloudUtil.getTempFileURL(imgList);

		let meet = await MeetModel.getOne(meetId, 'MEET_PIC');

		let picList = await ccminiCloudUtil.handlerCloudFiles(meet.MEET_PIC, newList);

		let data = {
			MEET_PIC: picList
		};
		await MeetModel.edit(meetId, data);

		let urls = ccminiStrUtil.getArrByKey(picList, 'url');

		return {
			urls
		};

	}

	async insertMeet(userId, {
		title,
		content,
		type,
		personMax,
		fee,
		day,
		contact,
		expireTime,
		region
	}) {


		// 重复性判断
		let where = {
			MEET_TITLE: title,
			MEET_USER_ID: userId,
		}
		if (await MeetModel.count(where))
			this.ccminiAppError('该活动标题已经存在');

		// 赋值 
		let data = {};
		data.MEET_TITLE = title;
		data.MEET_CONTENT = content;
		data.MEET_TYPE = type;
		data.MEET_DESC = ccminiStrUtil.fmtText(content, 100);

		data.MEET_PERSON_MAX = personMax;
		data.MEET_FEE = fee;
		data.MEET_DAY = ccminiTimeUtil.time2Timestamp(day + ' 23:59:59');
		data.MEET_CONTACT = contact;

		data.MEET_EXPIRE_TIME = ccminiTimeUtil.time2Timestamp(expireTime + ' 23:59:59');
		data.MEET_REGION_PROVINCE = region[0];
		data.MEET_REGION_CITY = region[1];
		data.MEET_REGION_COUNTY = region[2];

		data.MEET_USER_ID = userId;

		let id = await MeetModel.insert(data);

		this.statUserMeetCnt(userId);

		return {
			id
		};
	}

	async editMeet(userId, {
		id,
		status,
		title,
		content,
		desc,
		type,
		personMax,
		fee,
		day,
		contact,
		expireTime,
		region
	}) {

		// 重复性判断
		let where = {
			MEET_TITLE: title,
			MEET_USER_ID: userId,
			_id: ['<>', id]
		}
		if (await MeetModel.count(where))
			this.ccminiAppError('该活动标题已经存在');

		// 赋值 
		let data = {};
		data.MEET_TITLE = title;
		data.MEET_CONTENT = content;
		data.MEET_TYPE = type;
		data.MEET_STATUS = status;
		data.MEET_DESC = ccminiStrUtil.fmtText(desc, 100);

		data.MEET_PERSON_MAX = personMax;
		data.MEET_FEE = fee;
		data.MEET_DAY = ccminiTimeUtil.time2Timestamp(day + ' 23:59:59');
		data.MEET_CONTACT = contact;

		data.MEET_REGION_PROVINCE = region[0];
		data.MEET_REGION_CITY = region[1];
		data.MEET_REGION_COUNTY = region[2];

		data.MEET_EXPIRE_TIME = ccminiTimeUtil.time2Timestamp(expireTime + ' 23:59:59');

		await MeetModel.edit(id, data);
	}

	async delMeet(userId, id) {
		let where = {
			MEET_USER_ID: userId,
			_id: id
		}

		let meet = await MeetModel.getOne(where, 'MEET_PIC');
		if (!meet) return;

		await MeetModel.del(where);

		let cloudIds = ccminiStrUtil.getArrByKey(meet.MEET_PIC, 'cloudId');
		ccminiCloudUtil.deleteFiles(cloudIds);

		this.statUserMeetCnt(userId);

		let joinWhere = {
			JOIN_MEET_ID: id
		}
		JoinModel.del(joinWhere);

		return;
	}


	async cancelJoin(userId, meetId) {
		let where = {
			JOIN_USER_ID: userId,
			JOIN_MEET_ID: meetId
		}
		await JoinModel.del(where);

		this.statJoinCnt(meetId);
		this.statUserJoinCnt(userId);

	}


	async statJoinCnt(meetId) {
		let where = {
			JOIN_MEET_ID: meetId,
		}
		let cnt = await JoinModel.count(where);

		let data = {
			MEET_JOIN_CNT: cnt
		}
		await MeetModel.edit(meetId, data);
	}

	async insertJoin(userId, {
		meetId,
		name,
		contact
	}) {
		let meet = await MeetModel.getOne(meetId, 'MEET_STATUS,MEET_EXPIRE_TIME');

		if (meet.MEET_STATUS == MeetModel.STATUS.OVER)
			this.ccminiAppError('活动已结束');

		if (meet.MEET_EXPIRE_TIME < ccminiTimeUtil.time())
			this.ccminiAppError('报名已结束');

		if (meet.MEET_STATUS != MeetModel.STATUS.COMM)
			this.ccminiAppError('此活动无法报名');

		let where = {
			JOIN_USER_ID: userId,
			JOIN_MEET_ID: meetId
		}
		let cnt = await JoinModel.count(where);
		if (cnt)
			this.ccminiAppError('已报名，若需更改信息，请先取消再报名');

		let data = {
			JOIN_USER_ID: userId,
			JOIN_MEET_ID: meetId,
			JOIN_NAME: name,
			JOIN_CONTACT: contact
		}
		await JoinModel.insert(data);

		this.statJoinCnt(meetId);
		this.statUserJoinCnt(userId);
	}

	async viewMeet(userId, id) {

		let fields = '*';
		let where = {
			_id: id,
			MEET_STATUS: MeetModel.STATUS.COMM
		}

		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return null;

		meet.USER_DETAIL = await this.getUserOne(meet.MEET_USER_ID);

		meet.isOver = (meet.MEET_STATUS == MeetModel.STATUS.OVER || meet.MEET_DAY < ccminiTimeUtil.time()) ? 1 : 0;

		let whereJoinCnt = {
			JOIN_USER_ID: userId,
			JOIN_MEET_ID: id,
		}
		meet.isOwnerJoin = await JoinModel.count(whereJoinCnt);

		let oderByJoin = {
			JOIN_ADD_TIME: 'desc'
		}
		meet.joinList = await this.getJoinList({
			meetId: id,
			orderBy: oderByJoin, // 排序 
			page: 1,
			size: 4,
			isTotal: false,
			oldTotal: 0
		});
		meet.joinList = meet.joinList;

		MeetModel.inc(id, 'MEET_VIEW_CNT', 1);

		return meet;
	}


	async getMyMeetDetail(userId, id) {
		let fields = '*';

		let where = {
			MEET_USER_ID: userId,
			_id: id
		}
		let meet = await MeetModel.getOne(where, fields);
		if (!meet) return null;

		if (meet) {
			meet.MEET_EXPIRE_TIME = ccminiTimeUtil.timestamp2Time(meet.MEET_EXPIRE_TIME, 'Y-M-D');
			meet.MEET_DAY = ccminiTimeUtil.timestamp2Time(meet.MEET_DAY, 'Y-M-D');
		}

		let urls = ccminiStrUtil.getArrByKey(meet.MEET_PIC, 'url');
		meet.MEET_PIC = urls;

		return meet;
	}

	async getMeetList({
		search,
		type = '',
		sortType,
		sortVal,
		orderBy,
		whereEx,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MEET_ORDER': 'asc',
			'MEET_DAY': 'desc',
			'MEET_ADD_TIME': 'desc'
		};
		let fields = 'MEET_STATUS,MEET_TITLE,MEET_EXPIRE_TIME,MEET_REGION_PROVINCE,MEET_REGION_CITY,MEET_REGION_COUNTY,MEET_ADD_TIME,MEET_DESC,MEET_PIC,MEET_TYPE,MEET_VIEW_CNT,MEET_ORDER,MEET_JOIN_CNT,MEET_DAY,' + this.getJoinUserFields();

		let where = {};
		where.MEET_STATUS = ['in', MeetModel.STATUS.COMM + ',' + MeetModel.STATUS.OVER]; // 状态
		//where.MEET_EXPIRE_TIME = ['>', this._timestamp]; //超时时间

		if (type)
			where.MEET_TYPE = type; 

		if (ccminiUtil.isDefined(search) && search) {
			where.MEET_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {
				case 'type':
					where.MEET_TYPE = sortVal;
					break;
				case 'sort':
					if (sortVal == 'view') {
						orderBy = {
							'MEET_VIEW_CNT': 'desc',
							'MEET_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'MEET_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		if (whereEx && whereEx['userId'])
			where.MEET_USER_ID = String(whereEx['userId']);

		let joinParams = this.getJoinUserParams('MEET_USER_ID');
		return await ccminiDbUtil.getListJoin(MeetModel.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async getJoinList({
		meetId,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		let orderBy = {
			'JOIN_ADD_TIME': 'desc'
		};
		let fields = 'JOIN_MEET_ID,JOIN_USER_ID,JOIN_NAME,JOIN_CONTACT,JOIN_ADD_TIME,' + this.getJoinUserFields();

		let where = {
			JOIN_MEET_ID: meetId
		};

		let joinParams = this.getJoinUserParams('JOIN_USER_ID');
		return await ccminiDbUtil.getListJoin(JoinModel.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async statUserMeetCnt(userId) {
		let where = {
			MEET_USER_ID: userId
		}
		let cnt = await MeetModel.count(where);

		let whereUpdate = {
			USER_MINI_OPENID: userId
		};
		let data = {
			USER_MEET_CNT: cnt
		};
		await UserModel.edit(whereUpdate, data);

	}

	async statUserJoinCnt(userId) {
		let where = {
			JOIN_USER_ID: userId
		}
		let cnt = await JoinModel.count(where);

		let whereUpdate = {
			USER_MINI_OPENID: userId
		};
		let data = {
			USER_MEET_JOIN_CNT: cnt
		};
		await UserModel.edit(whereUpdate, data);

	}

	async getMyMeetJoinList(userId, {
		search, // 搜索条件 
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {

		orderBy = {
			'JOIN_ADD_TIME': 'desc'
		};
		let fields = 'JOIN_IS_CHECK_IN,JOIN_CHECK_IN_TIME,JOIN_MEET_ID,JOIN_USER_ID,JOIN_NAME,JOIN_CONTACT,JOIN_ADD_TIME, MEET_DETAIL.MEET_PIC,MEET_DETAIL.MEET_DESC,MEET_DETAIL.MEET_ADD_TIME,MEET_DETAIL.MEET_DAY,MEET_DETAIL.MEET_EXPIRE_TIME,MEET_DETAIL.MEET_REGION,MEET_DETAIL.MEET_JOIN_CNT,MEET_DETAIL.MEET_TYPE,MEET_DETAIL.MEET_ORDER,MEET_DETAIL.MEET_TITLE';

		let where = {
			JOIN_USER_ID: userId
		};

		let joinParams = {
			from: ccminiConfig.PROJECT_MARK + '_meet',
			localField: 'JOIN_MEET_ID',
			foreignField: '_id',
			as: 'MEET_DETAIL',
		};
		return await ccminiDbUtil.getListJoin(JoinModel.CL, joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);


	}

	async getMyMeetList(userId, {
		search,
		sortType,
		sortVal,
		orderBy,
		page,
		size,
		isTotal = true,
		oldTotal = 0
	}) {
		orderBy = orderBy || {
			'MEET_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		// where.MEET_STATUS = MeetModel.STATUS.COMM;
		if (ccminiUtil.isDefined(search) && search) {
			where.MEET_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {
				case 'type':
					where.MEET_TYPE = (sortVal);
					break;
				case 'city':
					where.MEET_REGION_CITY = String(sortVal);
					break;
				case 'sort':
					if (sortVal == 'view') {
						orderBy = {
							'MEET_VIEW_CNT': 'desc',
							'MEET_ADD_TIME': 'desc'
						};
					}
					break;
			}
		}

		where.MEET_USER_ID = userId;
		return await MeetModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
}

module.exports = MeetService;