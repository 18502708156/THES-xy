class RankDataType {
	/** 战力排行 */
	public static TYPE_POWER: number = 0;
	/** 竞技场排行 */
	public static TYPE_ARENA: number = 1;
	/** pk排行 */
	public static TYPE_SKIRMISH: number = 2;
	/** 关卡排行 */
	public static TYPE_PASS: number = 3;
	/** 副本排行 */
	public static TYPE_COPY: number = 4;
	/** 等级排行 */
	public static TYPE_LEVEL: number = 5;
	/**披风排行 */
	public static TYPE_WING: number = 6;
	/** 职业排行（萧平章） */
	public static TYPE_JOB_ZS: number = 7;
	/** 职业排行（萧平旌） */
	public static TYPE_JOB_FS: number = 8;
	/** 职业排行（蒙浅雪） */
	public static TYPE_JOB_DS: number = 9;
	/** 神功排行 */
	public static TYPE_LILIAN: number = 10;
	/** 王者排行 */
	public static TYPE_LADDER: number = 11;
	/** 宝石排行 */
	public static TYPE_BAOSHI: number = 12;
	/** 威名排行 */
	public static TYPE_PRESTIGE: number = 20;
	/** 佣兵排行 */
	public static TYPE_HERO: number = 21;
	/** 侍女排行 */
	public static TYPE_SHINV: number = 22;
	/** 宠物排行 */
	public static TYPE_PET: number = 23;

	// 跨服boss个人排行
	public static TYPE_ACROSS_PERSON: number = 24;

	// 帮会boss个人排行
	public static TYPE_GANG_BOSS_PERSON: number = 25;
	

	/**钓鱼排行 */
	public static TYPE_FISH: number = 113;
	/** 排名 - short */
	public static DATA_POS = 'pos';
	/** ID - int */
	public static DATA_ID = 'id';
	/** 名字 - string */
	public static DATA_PLAYER = 'player';
	/** 等级 - short */
	public static DATA_LEVEL = 'level';
	/** 境界 - short */
	public static DATA_ZHUAN = 'zhuan';
	/** VIP等级 - short */
	public static DATA_VIP = 'vip';
	/** 月卡 - short */
	public static DATA_MONTH = 'month';
	/** 战斗力 - int */
	public static DATA_POWER = 'power';
	/** 数量 - int */
	public static DATA_COUNT = 'count';
	/** 经验 - int */
	public static DATA_EXP = 'exp';
	/** 职业 - char */
	public static DATA_JOB = 'job';
	/** 性别 - char */
	public static DATA_SEX = 'sex';
	/** 第2名背景标志 */
	public static DATA_BG2 = 'xphb_json.phb_7';
	/** 第3名背景标志 */
	public static DATA_BG3 = 'xphb_json.phb_8';

	/** 排行项目内容 */
	// public static ITEMS = []
	//数据对应的读取方式
	public static readFunc = {};



	public static TYPE_ZHANLING: number = 13;
	public static TYPE_LONGHUN: number = 14;
	public static TYPE_XIAOFEI: number = 16;

}
