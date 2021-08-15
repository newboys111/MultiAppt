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
 * Notes: 活动实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-23 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseCCMiniModel = require('./base_ccmini_model.js');

class MeetModel extends BaseCCMiniModel {

}

// 集合名
MeetModel.CL = "meet";

MeetModel.CCMINI_DB_STRUCTURE = {
	MEET_ID: 'string|true',
	MEET_USER_ID: 'string|true',

	MEET_TITLE: 'string|true|comment=标题',
	MEET_CONTENT: 'string|true|comment=',
	MEET_DESC: 'string|false|comment=', 
	MEET_STATUS: 'int|true|default=1|comment=',
	MEET_TYPE: 'string|true|default=其他|comment=',
	MEET_ORDER: 'int|true|default=9999',

	MEET_VIEW_CNT: 'int|true|default=0|comment=', 
	MEET_JOIN_CNT: 'int|true|default=0|comment=', 

	MEET_PERSON_MAX: 'int|true|default=20|comment=',
	MEET_FEE: 'string|true|comment=',
	MEET_DAY: 'int|true|comment=',
	MEET_CONTACT: 'string|true|comment=',

	MEET_EXPIRE_TIME: 'int|true|default=0|comment=',

	MEET_REGION_PROVINCE: 'string|false|comment=',
	MEET_REGION_CITY: 'string|false|comment=',
	MEET_REGION_COUNTY: 'string|false|comment=',

	MEET_PIC: 'array|false|default=[]|comment=',

	MEET_ADD_TIME: 'int|true',
	MEET_EDIT_TIME: 'int|true',
	MEET_ADD_IP: 'string|false',
	MEET_EDIT_IP: 'string|false',
};

// 字段前缀
MeetModel.CCMINI_FIELD_PREFIX = "MEET_";

MeetModel.STATUS = { 
	UNUSE: 0,
	COMM: 1,
	OVER: 7,
	PEDDING: 8,
	DEL: 9
};

MeetModel.STATUS_DESC = { 
	UNUSE: '待审核',
	COMM: '正常',
	OVER: '结束',
	PEDDING: '停用',
	DEL: '删除'
};


module.exports = MeetModel;