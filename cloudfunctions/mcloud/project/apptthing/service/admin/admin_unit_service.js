/**
 * Notes: 单元后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2024-07-23 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const UnitModel = require('../../model/unit_model.js');

class AdminCateService extends BaseProjectAdminService {

	async sortUnit(id, sort) {
		sort = Number(sort);
		let data = {};
		data.UNIT_ORDER = sort;
		await UnitModel.edit(id, data);
	}

	async statusUnit(id, status) {
		let data = {
			UNIT_STATUS: status
		}
		await UnitModel.edit(id, data);

	}

	async getAdminUnitList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'UNIT_ORDER': 'asc',
			'UNIT_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				UNIT_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型
					where.and.UNIT_STATUS = Number(sortVal);
					break;
			}
		}

		return await UnitModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async delUnit(id) {
		return await UnitModel.del(id);
	}

	async insertUnit({
		title,
		order,
		forms
	}) {
		//是否重复
		let where = {
			UNIT_TITLE: title,
		}
		let cnt = await UnitModel.count(where);
		if (cnt)
			this.AppError('该名称已经存在');


		let data = {};
		data.UNIT_TITLE = title;
		data.UNIT_ORDER = order;

		data.UNIT_OBJ = dataUtil.dbForms2Obj(forms);
		data.UNIT_FORMS = forms;

		let id = await UnitModel.insert(data);

		return {
			id
		};

	}

	async getUnitDetail(id) {
		let fields = '*';

		let unit = await UnitModel.getOne(id, fields);
		if (!unit) return null;

		return unit;
	}

	async editUnit({
		id,
		title,
		order,
		forms }) {

		//是否重复
		let where = {
			UNIT_TITLE: title,
			_id: ['<>', id]
		}
		let cnt = await UnitModel.count(where);
		if (cnt)
			this.AppError('该名称已经存在');

		let data = {};
		data.UNIT_TITLE = title;
		data.UNIT_ORDER = order;
		data.UNIT_OBJ = dataUtil.dbForms2Obj(forms);
		data.UNIT_FORMS = forms;

		const MeetModel = require('../../model/meet_model.js');
		MeetModel.edit({ MEET_UNIT_ID: id }, { 'MEET_UNIT_NAME': title });

		const NewsModel = require('../../model/news_model.js');
		NewsModel.edit({ NEWS_UNIT_ID: id }, { 'NEWS_UNIT_NAME': title });

		const DayModel = require('../../model/day_model.js');
		DayModel.edit({ DAY_UNIT_ID: id }, { 'DAY_UNIT_NAME': title });

		const JoinModel = require('../../model/join_model.js');
		JoinModel.edit({ JOIN_UNIT_ID: id }, { 'JOIN_UNIT_NAME': title });

		const AdminModel = require('../../model//admin_model.js');
		AdminModel.edit({ ADMIN_UNIT_ID: id }, { 'ADMIN_UNIT_NAME': title });


		return await UnitModel.edit(id, data);
	}

	async updateUnitForms({
		id,
		hasImageForms
	}) {
		await UnitModel.editForms(id, 'UNIT_FORMS', 'UNIT_OBJ', hasImageForms);

	}


}

module.exports = AdminCateService;