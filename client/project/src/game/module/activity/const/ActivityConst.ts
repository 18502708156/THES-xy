class ActivityConst {
	static ActivityKaiFuJiJieRankType = [0,5,6,7,8,14,13,12,11,9,16,15,20]
	public static JiJieTypeName(type:ActivityKaiFuJiJieType): string
	{
		switch (type)
		{
			case ActivityKaiFuJiJieType.ride:return "坐骑"
			case ActivityKaiFuJiJieType.wing:return "翅膀"
			case ActivityKaiFuJiJieType.fairy:return "守护"
			case ActivityKaiFuJiJieType.weapon:return "神兵"
			case ActivityKaiFuJiJieType.pet_psychic:return "宠物兽魂"
			case ActivityKaiFuJiJieType.pet_soul:return "宠物通灵"
			case ActivityKaiFuJiJieType.xianlv_circle:return "仙侣仙位"
			case ActivityKaiFuJiJieType.xianlv_position:return "仙侣法阵"
			case ActivityKaiFuJiJieType.tiannv:return "玄女"
			case ActivityKaiFuJiJieType.tiannv_nimbus:return "玄女灵气"
			case ActivityKaiFuJiJieType.tiannv_flower:return "玄女花辇"
			case ActivityKaiFuJiJieType.lingtong:return "灵童"
			case 100:return "VIP"
		}
	}
	public static JiJieTypeName2(type:ActivityKaiFuJiJieType): string
	{
		switch (type)
		{
			case ActivityKaiFuJiJieType.ride:return "坐骑"
			case ActivityKaiFuJiJieType.wing:return "翅膀"
			case ActivityKaiFuJiJieType.fairy:return "守护"
			case ActivityKaiFuJiJieType.weapon:return "神兵"
			case ActivityKaiFuJiJieType.pet_psychic:return "兽魂"
			case ActivityKaiFuJiJieType.pet_soul:return "通灵"
			case ActivityKaiFuJiJieType.xianlv_circle:return "仙位"
			case ActivityKaiFuJiJieType.xianlv_position:return "法阵"
			case ActivityKaiFuJiJieType.tiannv:return "玄女"
			case ActivityKaiFuJiJieType.tiannv_nimbus:return "灵气"
			case ActivityKaiFuJiJieType.tiannv_flower:return "花辇"
			case ActivityKaiFuJiJieType.lingtong:return "灵童"
		}
	}
	public static GetQiTianActivityIds(day:number , index: number): number[]
	{
		return GameGlobal.Config.WeekEnjoyEverydayConfig[day][index].content
	}
	public static GetConfigByActityType(type:number): any
	{
		return GameGlobal.Config["ActivityType"+type+"Config"]
	}
	/**valuedata == {type=16,id=7,value=1}, */
	public static GetCfgObjByValue(valuedata): any
	{
		let config = this.GetConfigByActityType(valuedata.type);
		let obj = config[valuedata.id];
		if(obj instanceof Array)
		{
			return obj[valuedata.value - 1]
		} else {
			return obj[valuedata.value]
		}	
	}
	
}
// enum ActivityKaiFuType{
// 	 SCSB = 1  ,//首充双倍
// 	 SC = 2  ,//首充
// 	 CCJJ= 3  ,//成长基金
// 	 TZJH= 4  ,//投资计划
// 	 XFYL= 5  ,//消费有礼
// 	 KFHD= 6  ,//开服活动
// 	 KFMB= 7  ,//开服目标
// 	 QTZX= 8  ,//七天尊享
// 	 MRSC= 9  ,//每日首充
// 	 ZSYJ= 10  ,//直升一阶
// 	 RMBLB= 11  ,//人民币礼包
// 	 CJ= 12  ,//抽奖
// 	 KFPMH= 13  ,//跨服拍卖行
// }

/** 开服运营活动 种类*/
enum ActivityKaiFuFuncType{
	ACT_1_Upgrade = 1  ,//冲级奖励
	ACT_2_PackageDiscount = 2  ,//特价限购
	ACT_3_RechargeContinue = 3  ,//连续充值
	ACT_4_Reach = 4    ,//达标排行
	ACT_5_WeekLogin = 5  ,//开服登录  送十万元宝
	ACT_6_RechargeWheel = 6    ,//充值转盘
	ACT_7_RechargeTotal = 7,//累计充值
	ACT_8_Invest = 8  ,//投资计划
	ACT_9_Loop = 9    ,//循环限购
	ACT_10_MergeWing = 10,//羽翼暴击
	ACT_11_MergeBag = 11  ,//合服礼包
	ACT_12_MergeRecharge = 12  ,//合服累计充值
	ACT_13_umulativeRecharge = 13,//累充活动
	ACT_14_ResetDouble = 14,//充值重置
	ACT_15_ActivitySingleRecharge = 15  ,//单笔充值
	ACT_16_DayLogin = 16  ,//开服每日登陆
	ACT_17_ArenaTarget = 17  ,//每日竞技目标
	ACT_18_CashGift = 18  ,//每日充值
	ACT_19_PowerTarget = 19  ,//人民币礼包
	ACT_20_RechargeGroupon = 20  ,//战力目标
	ACT_21_OutdrawDiscountShop = 21,//首充团购
	ACT_22_OrangePetTarget = 22  ,//橙宠目标
	ACT_23_AdvanceLevel = 23 ,//--直升一阶
	ACT_24_GrowFund = 24 ,//--成长基金
	ACT_25_Consumption = 25 ,//--消费有礼
	ACT_26_DisCountShop = 26  ,// 折扣商店
	
	// ACT_2001_Upgrade = 2001  ,//冲级奖励
	// ACT_2002_PackageDiscount = 2002  ,//特价限购
	// ACT_2003_RechargeContinue = 2003  ,//连续充值
	// ACT_2004_Reach = 2004    ,//达标排行
	// ACT_2005_WeekLogin = 2005  ,//开服登录  送十万元宝
	// ACT_2006_RechargeWheel = 2006    ,//充值转盘
	// ACT_2007_RechargeTotal = 2007,//累计充值
	// ACT_2008_Invest = 2008  ,//投资计划
	// ACT_2009_Loop = 2009    ,//循环限购
	// ACT_2010_MergeWing = 2010,//羽翼暴击
	// ACT_2011_MergeBag = 2011  ,//合服礼包
	// ACT_2012_MergeRecharge = 2012  ,//合服累计充值
	// ACT_2013_umulativeRecharge = 2013,//累充活动
	// ACT_2014_ResetDouble = 2014,//充值重置
	// ACT_2015_ActivitySingleRecharge = 2015  ,//单笔充值
	// ACT_2016_DayLogin = 2016  ,//开服每日登陆
	// ACT_2017_ArenaTarget = 2017  ,//每日竞技目标
	// ACT_2018_CashGift = 2018  ,//每日充值
	// ACT_2019_PowerTarget = 2019  ,//人民币礼包
	// ACT_2020_RechargeGroupon = 2020  ,//战力目标
	// ACT_2021_OutdrawDiscountShop = 2021,//首充团购
	// ACT_2022_OrangePetTarget = 2022  ,//橙宠目标
	// ACT_2023_AdvanceLevel = 2023 ,//--直升一阶
	// ACT_2024_GrowFund = 2024 ,//--成长基金
	// ACT_2025_Consumption = 2025 ,//--消费有礼
	// ACT_2026_DisCountShop = 2026  ,// 折扣商店



	ACT_99990_JiJie = 99990, // 进阶
	ACT_99991_JiJieRank = 99991, // 进阶排行
	ACT_99992_JiJieShop = 99992, // 进阶商店
	ACT_99993_LeiJiReCharge = 99993, // 累计充值
}

/** 开服活动 ，折扣商店 限购类型*/
enum ActivityKaiFuShopLimitBuyType{
	long= 1,//永久限购
	noTimes = 2,//=不限次数
    day = 3,//=每日限购
}

enum ActivityKaiFuJiJieType{
	ride = 1,//坐骑 
	wing = 2 ,//翅膀
	fairy = 3 ,//守护
	weapon = 4,//神兵
	pet_psychic = 5 ,//宠物兽魂
	pet_soul = 6,//宠物通灵
	xianlv_circle = 7 ,//仙侣仙位
	xianlv_position = 8,//仙侣法阵
	tiannv = 9 ,//玄女
	tiannv_nimbus = 10 ,//玄女灵气
	tiannv_flower = 11,//玄女花辇
	lingtong = 12,//灵童
}

enum ActivityKaiFuTargetId
{
	team = 1,
	petCopy = 2,
	upLevel = 3,
	power = 4,
	show = 5,
	recharge = 6
}