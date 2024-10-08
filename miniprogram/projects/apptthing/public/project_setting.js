module.exports = { //apptthing
	PROJECT_COLOR: '#4376e4',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#4376e4',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
	],

	NEWS_NAME: '通知公告',
	NEWS_CATE: [
		{ id: 1, title: '通知公告', style: 'leftpic' },
	],
	NEWS_FIELDS: [

	],

	MEET_NAME: '预约',
	MEET_CATE: [
		{ id: 1, title: '电信业务', style: 'leftbig1' },
		{ id: 2, title: '燃气业务', style: 'leftbig1' },
		{ id: 3, title: '居民用电', style: 'leftbig1' },
		{ id: 4, title: '社保业务', style: 'leftbig1' },
		{ id: 5, title: '水务', style: 'leftbig1' },
		{ id: 6, title: '企业事务', style: 'leftbig1' },
		{ id: 7, title: '入学申请', style: 'leftbig1' },
		{ id: 8, title: '房屋租售', style: 'leftbig1' },
		{ id: 9, title: '职业资格', style: 'leftbig1' },
		{ id: 10, title: '邮政业务', style: 'leftbig1' },
		{ id: 11, title: '驾驶行驶', style: 'leftbig1' },
	],
	MEET_CAN_NULL_TIME: false, // 是否允许有无时段的日期保存和展示
	MEET_FIELDS: [
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'content', title: '详情', type: 'content', must: true },
	],

	MEET_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, min: 2, max: 30, edit: false },
		{ mark: 'phone', type: 'text', len: 11, title: '手机号', must: true, edit: false },
	],

	// 时间默认设置
	MEET_NEW_NODE:
	{
		mark: 'mark-no', start: '09:00', end: '12:00', limit: 30, isLimit: true, status: 1,
		stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
	},
	MEET_NEW_NODE_DAY: [
		{
			mark: 'mark-am', start: '09:00', end: '12:00', limit: 30, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		},
		{
			mark: 'mark-pm', start: '14:00', end: '17:30', limit: 30, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		}
	],


}