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
 * Notes: 用户模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:00:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js');
const ccminiUtil = require('../framework/utils/ccmini_util.js'); 

const UserModel = require('../model/user_model.js'); 

// 用户信息返回字段
const FILEDS_USER_BASE = 'USER_ADD_TIME,USER_VIEW_CNT,USER_EDU,USER_INFO_CNT,USER_ALBUM_CNT,USER_MEET_CNT,USER_MEET_JOIN_CNT,USER_NAME,USER_BIRTH,USER_SEX,USER_PIC,USER_STATUS,USER_CITY,USER_COMPANY,USER_TRADE,USER_COMPANY_DUTY,USER_LOGIN_TIME,USER_MINI_OPENID';

const FILEDS_USER_DETAIL = 'USER_DESC,USER_RESOURCE,USER_MOBILE,USER_QQ,USER_WECHAT,USER_EMAIL';

class UserService extends BaseCCMiniService {

	async viewUser(meId, {
		userId, 
		fields = FILEDS_USER_BASE + ',' + FILEDS_USER_DETAIL
	}) {

		let where = {
			USER_MINI_OPENID: userId
		};
		UserModel.inc(where, 'USER_VIEW_CNT', 1);


		return await this.getUser({
			userId, 
			fields
		});


	}

	async getUser({
		userId, 
		fields = FILEDS_USER_BASE + ',' + FILEDS_USER_DETAIL
	}) {
		 
		let where = {
			USER_MINI_OPENID: userId,
			USER_STATUS: UserModel.STATUS.COMM
		}
		let user = await UserModel.getOne(where, fields);
		if (!user) return null;

		return user;
	}

	async getMyDetail(userId,
		fields = 'USER_SEX,USER_ALBUM_CNT,USER_MEET_CNT,USER_INFO_CNT,USER_VIEW_CNT,USER_NAME,USER_PIC,USER_STATUS,USER_ID'
	) { 
		return await this.getUserMyBase(userId, fields);
	}

	async getUserList(userId, {
		search,
		sortType,
		sortVal,
		orderBy,
		whereEx,
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_LOGIN_TIME: 'desc'
		};
		let fields = FILEDS_USER_BASE;


		let where = {};
		where.and = {
			USER_STATUS: UserModel.STATUS.COMM,
		};

		if (ccminiUtil.isDefined(search) && search) {
			where.or = [{
					USER_NAME: ['like', search]
				}, 
				{
					USER_COMPANY: ['like', search]
				},
				{
					USER_TRADE: ['like', search]
				},
			];

		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {

			 
				case 'sort':
					// 排序
					if (sortVal == 'new') { //最新
						orderBy = {
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'last') { //最近
						orderBy = {
							'USER_LOGIN_TIME': 'desc',
							'USER_ADD_TIME': 'desc'
						};
					} 

					break;
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal);


		return result;
	}

 
}

module.exports = UserService;