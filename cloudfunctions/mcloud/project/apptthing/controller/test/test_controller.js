/**
 * Notes: 测试模块控制器
 * Date: 2021-03-15 19:20:00 
 */

const BaseController = require('../../controller/base_project_controller.js');
const fakerLib = require('../../../../framework/lib/faker_lib.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');

const MeetModel = require('../../model/meet_model.js');
const NewsModel = require('../../model/news_model.js');
const UnitModel = require('../../model/unit_model.js');
const DayModel = require('../../model/day_model.js');
const JoinModel = require('../../model/join_model.js');
const UserModel = require('../../model/user_model.js');

class TestController extends BaseController {



	async test() {
		console.log('TEST>>>>>>>');
		global.PID = 'apptthing';

		//		await this.mockeNews()
		//await this.mockMeet();
		//await this.mockUser()
		await this.mockJoin()
		//let cnt = await DayModel.del({ DAY_MEET_ID: ['<>', '8df0e92f67026f090e22de5809743840'] })
		//console.log(cnt)
		//this.mockDay()
	}

	async mockUser() {
		console.log('mockUser >>>>>>> Begin....');

		console.log('>>>>delete');
		let delCnt = await UserModel.del({});
		console.log('>>>>delete=' + delCnt);

		for (let k = 1; k <= 50; k++) {
			console.log('>>>>insert >' + k);

			let user = {};
			user.USER_MINI_OPENID = global.PID + '_' + k;
			user.USER_NAME = fakerLib.getName();
			user.USER_MOBILE = fakerLib.getMobile(); 
			user.USER_OBJ = { sex: fakerLib.getRdArr(['男', '女']) };
			await UserModel.insert(user);

		}

		console.log('mockUse <<<< END');
	}

	async mockJoin() {
		console.log('mockJoin >>>>>>> Begin....');


		console.log('>>>>delete');
		let delCnt = await JoinModel.del({});
		console.log('>>>>delete=' + delCnt);

		const MeetService = require('../../service/meet_service.js');
		let meetService = new MeetService();

		let list = await MeetModel.getAll({});
		for (let k in list) {
			let meetId = list[k]._id;
			let meet = list[k];

			console.log(meetId + '-' + list[k].MEET_TITLE);

			// 取出最近有时间安排的一天
			let dayModel = await DayModel.getOne({ DAY_MEET_ID: meetId }, '*', { 'day': 'asc' });
			if (!dayModel) continue;
			let day = dayModel.day;
			let mark = dayModel.times[0].mark;


			let join = {};
			join.JOIN_MEET_ID = meetId;
			join.JOIN_STATUS = 1;


			for (let k = 1; k <= fakerLib.getIntBetween(3, 10); k++) {
				console.log('>>>>insert >' + k);
				join.JOIN_USER_ID = fakerLib.getUuid();

				join.JOIN_UNIT_ID = meet.MEET_UNIT_ID;
				join.JOIN_UNIT_NAME = meet.MEET_UNIT_NAME;

				join.JOIN_ADD_TIME = fakerLib.getAddTimestamp();
				join.JOIN_CODE = fakerLib.getStr(10);
				join.JOIN_MEET_CATE_ID = meet.MEET_CATE_ID;
				join.JOIN_MEET_CATE_NAME = meet.MEET_CATE_NAME;
				join.JOIN_MEET_TITLE = meet.MEET_TITLE;
				join.JOIN_MEET_DAY = day;
				join.JOIN_MEET_TIME_START = '09:00';
				join.JOIN_MEET_TIME_END = '11:59';
				join.JOIN_MEET_TIME_MARK = mark;
				join.JOIN_START_TIME = timeUtil.time2Timestamp(day + ' 09:00:00');

				join.JOIN_FORMS = [
					{ mark: 'name', title: '姓名', type: 'text', val: fakerLib.getName() },
					{ mark: 'phone', title: '电话', type: 'mobile', val: fakerLib.getMobile() },
				];

				console.log(join)
				await JoinModel.insert(join);
			}

			await meetService.statJoinCnt(meetId, mark);

		}

		console.log('mockJoin >>>>>>> END《《《《');
	}

	async mockeNews() {
		console.log('mockeNews >>>>>>> Begin....');

		let news = await NewsModel.getOne({ NEWS_UNIT_NAME: '西郊服务大厅' });
		if (!news) return;

		let list = await UnitModel.getAll({ UNIT_TITLE: ['<>', '西郊服务大厅'] });

		for (let k = 0; k < list.length; k++) {
			news.NEWS_UNIT_ID = list[k]._id;
			news.NEWS_UNIT_NAME = list[k].UNIT_TITLE;

			delete news.NEWS_ID;
			delete news._id;
			delete news.NEWS_ADD_TIME;
			delete news.NEWS_EDIT_TIME;
			delete news.NEWS_ADD_IP;
			delete news.NEWS_EDIT_IP;

			console.log(news);
			await NewsModel.insert(news);

		}

	}

	async mockDay() {
		console.log('mockDay >>>>>>> Begin....');
		let dayList = await DayModel.getAll({ DAY_MEET_ID: '8df0e92f67026f090e22de5809743840' });
		console.log(dayList.length)

		let total = 0;
		//console.log(dayList)

		let meetList = await MeetModel.getAll({ _id: ['<>', '8df0e92f67026f090e22de5809743840'] });
		meetList = await MeetModel.getAll({ _id: ['=', '25e993b767026f070e2f9e75355a8b66'] });
		console.log(meetList)
		for (let k = 0; k < dayList.length; k++) {
			console.log(k)
			let day = dayList[k];

			let dayBig = [];
			let data = []
			for (let j = 0; j < meetList.length; j++) {


				data.DAY_UNIT_ID = meetList[j].MEET_UNIT_ID;
				data.DAY_UNIT_NAME = meetList[j].MEET_UNIT_NAME;
				data.DAY_MEET_ID = meetList[j]._id;
				data.day = day.day;
				data.dayDesc = day.dayDesc;
				data.times = day.times;



				dayBig.push(data);
				total++;
				//	
				console.log(total, dayBig.length)
			}
			//console.log(dayBig)
			await DayModel.insertBatch(dayBig);

		}
	}

	async mockMeet() {
		console.log('mockMeet >>>>>>> Begin....');

		let meetList = await MeetModel.getAll({ MEET_UNIT_NAME: ['=', '科技园服务大厅'] });


		let list = await UnitModel.getAll({ UNIT_TITLE: '河东区办事大厅' });



		for (let k = 0; k < list.length; k++) {

			for (let j = 0; j < meetList.length; j++) {
				let meet = meetList[j];
				meet.MEET_UNIT_ID = list[k]._id;
				meet.MEET_UNIT_NAME = list[k].UNIT_TITLE;

				delete meet.MEET_ID;
				delete meet._id;
				delete meet.MEET_ADD_TIME;
				delete meet.MEET_EDIT_TIME;
				delete meet.MEET_ADD_IP;
				delete meet.MEET_EDIT_IP;

				console.log(meet);
				let meetId = await MeetModel.insert(meet);

				let dayList = await DayModel.getAll({ DAY_MEET_ID: meet._id });
				for (let n = 0; n < dayList.length; n++) {
					let day = dayList[n];

					day.DAY_UNIT_ID = list[k]._id;
					day.DAY_UNIT_NAME = list[k].UNIT_TITLE;
					day.DAY_MEET_ID = meetId;

					delete day.DAY_ID;
					delete day._id;
					delete day.DAY_ADD_TIME;
					delete day.DAY_EDIT_TIME;
					delete day.DAY_ADD_IP;
					delete day.DAY_EDIT_IP;

					console.log(day);
					DayModel.insert(day);
				}
			}


		}

	}

}

module.exports = TestController;