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
 * Notes: Test控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-10 19:52:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
const ccminiMock = require('../framework/utils/ccmini_mock.js');
const UserModel = require('../model/user_model.js');
const JoinModel = require('../model/join_model.js');

class TestController {

	async test() {

		console.log('>>>>TEST begin....');

		await this.mockJoin();
		console.log('<<<<TEST END.')
	}

	async mockJoin() {

		for (let i = 0; i < 30; i++) {
			let where = { 
			}
			let fields = 'USER_MINI_OPENID'
			let user = await UserModel.rand(where,fields,1); 

			let data = {};

			data.JOIN_MEET_ID = '8937eaa9611937e704dd58c97fb5ce45';
			data.JOIN_USER_ID = user.USER_MINI_OPENID;
			data.JOIN_NAME = ccminiMock.getName();
			data.JOIN_CONTACT = ccminiMock.getMobile();
			data.JOIN_ADD_TIME = ccminiMock.getTimestamp(-ccminiMock.getIntBetween(0, 86400 * 30));

			console.log(data);
			JoinModel.insert(data);
		 
		}

	}

	async mockUser() {

		for (let i = 0; i < 100; i++) {
			let data = {};

			data.USER_PIC = ccminiMock.getAvatar();
			data.USER_PHONE_CHECKED = ccminiMock.getMobile();
			data.USER_MINI_OPENID = 'OPENID-' + ccminiMock.getStr(20); 

			let sex = ccminiMock.getIntBetween(1, 2)
			data.USER_SEX = sex;

			if (sex == 1)
				data.USER_NAME = ccminiMock.getMaleName();
			else
				data.USER_NAME = ccminiMock.getFemaleName();

			let birth = ccminiMock.getIntBetween(1980, 1998);
			data.USER_BIRTH = birth + '-01-01';
			data.USER_WECHAT = ccminiMock.getWord();
			data.USER_QQ = ccminiMock.getIntBetween(99999, 9999999);
			data.USER_EMAIL = ccminiMock.getEmail();

		  

			data.USER_EDU = ccminiMock.getEdu();

			data.USER_COMPANY = ccminiMock.getCompany();
			data.USER_COMPANY_DUTY = ccminiMock.getDuty();
			data.USER_TRADE = ccminiMock.getTrade();
			data.USER_CITY = ccminiMock.getCity();

			data.USER_DESC = ccminiMock.getWord();
			data.USER_RESOURCE = '提供' + ccminiMock.getTrade() + '方面的资源交流';

			data.USER_LOGIN_TIME = ccminiMock.getTimestamp(-ccminiMock.getIntBetween(0, 86400 * 30));
			console.log(data);
			UserModel.insert(data);
		}

	}

}

module.exports = TestController;