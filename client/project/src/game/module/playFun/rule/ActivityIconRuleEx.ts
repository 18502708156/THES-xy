class FuliIconRuleEx extends FuliIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.FULI))
			return false

		return super.checkShowIcon()
	}
}

class KaiFuIconRuleEx extends KaiFuIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.KAIFU))
			return false

		return super.checkShowIcon()
	}
}

class DailyChargeIconRuleEx extends DailyChargeIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.DAILYCHARGE))
			return false

		return super.checkShowIcon()
	}
}

class FightPetFBIconRuleEx extends FightPetFBIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.FIGHTPETFB))
			return false

		return super.checkShowIcon()
	}
}

class SevenDayIconRuleEx extends SevenDayIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.SEVENDAY))
			return false

		return super.checkShowIcon()
	}
}

class ShootUpIconRuleEx extends ShootUpIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.SHOOTUP))
			return false

		return super.checkShowIcon()
	}
}

class TreasureIconRuleEx extends TreasureIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.TREASURE))
			return false

		return super.checkShowIcon()
	}
}

class RebateIconRuleEx extends RebateIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.REBATE))
			return false

		return super.checkShowIcon()
	}
}

class GodPetAwardIconRuleEx extends GodPetAwardIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.GODPETAWARD))
			return false

		return super.checkShowIcon()
	}
}

class GodPetLotteryIconRuleEx extends GodPetLotteryIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.GODPETLOTTERY))
			return false

		return super.checkShowIcon()
	}
}

class GodLotteryIconRuleEx extends GodLotteryIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.GODLOTTERY))
			return false

		return super.checkShowIcon()
	}
}

class GrowUpIconRuleEx extends GrowUpIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.GROWUP))
			return false

		return super.checkShowIcon()
	}
}

class InvestmentIconRuleEx extends InvestmentIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.INVESTMENT))
			return false

		return super.checkShowIcon()
	}
}

class JingCaiIconRuleEx extends JingCaiIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.JINGCAI))
			return false

		return super.checkShowIcon()
	}
}

class XuannvBefallIconRuleEx extends XuannvBefallIconRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.XUANNVBEFALL))
			return false

		return super.checkShowIcon()
	}
}

class DiscountRuleEx extends DiscountRule {
	checkShowIcon() {
		if (!TopActivityConst.IsShow(TopActivityType.DISCOUNT))
			return false

		return super.checkShowIcon()
	}
}

class TopActivityConst {
	public static IsShow(id) {
		let config = GameGlobal.Config.GButtonConfig[id]
		if (!config)
			return false

		return (config.show || 0) == 1
	}
}


enum TopActivityType {
	FULI 			= 1, 	//福利大厅
	KAIFU 			= 2, 	//开服活动
	DAILYCHARGE 	= 3, 	//每日首充
	FIGHTPETFB		= 4, 	//挑战宠物副本
	SEVENDAY 		= 5, 	//七天尊享
	SHOOTUP 		= 6, 	//直升一阶
	TREASURE 		= 7, 	//寻宝
	REBATE 			= 8, 	//充值返利
	GODPETAWARD 	= 9, 	//神兽降临
	GODPETLOTTERY 	= 10, 	//降服神兽
	GODLOTTERY 		= 11, 	//天神降临
	GROWUP 			= 12, 	//成长基金
	INVESTMENT 		= 13, 	//投资计划
	JINGCAI 		= 14, 	//精彩活动
	XUANNVBEFALL	= 15,	//玄女下凡
	DISCOUNT		= 16,	//首充
}