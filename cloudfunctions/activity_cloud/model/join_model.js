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
 * Notes: 活动报名实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-23 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseCCMiniModel = require('./base_ccmini_model.js');

class JoinModel extends BaseCCMiniModel {

}

// 集合名
JoinModel.CL = "join";

JoinModel.CCMINI_DB_STRUCTURE = {
	JOIN_ID: 'string|true',
	JOIN_MEET_ID: 'string|true',
	JOIN_USER_ID: 'string|true',

	JOIN_NAME: 'string|true|comment=',
	JOIN_CONTACT: 'string|true|comment=',

	JOIN_ADD_TIME: 'int|true',
	JOIN_EDIT_TIME: 'int|true',
	JOIN_ADD_IP: 'string|false',
	JOIN_EDIT_IP: 'string|false',
};

// 字段前缀
JoinModel.CCMINI_FIELD_PREFIX = "JOIN_";

module.exports = JoinModel;